'use client'

import { MandalaGridProps } from '@/types/mandala'
import { useState, useEffect } from 'react'

const MandalaGrid = ({ data, onCenterChange, onGoalChange, onSubGoalChange }: MandalaGridProps) => {
  const [showOuterBlocks, setShowOuterBlocks] = useState<boolean[]>(Array(8).fill(false))
  
  // 각 목표가 입력되면 해당하는 주변 블록만 표시
  useEffect(() => {
    const newShowOuterBlocks = [...showOuterBlocks]
    let hasChanges = false
    
    data.goals.forEach((goal, index) => {
      const shouldShow = goal.trim() !== ''
      if (shouldShow && !newShowOuterBlocks[index]) {
        // 해당 블록을 보여주기 (약간의 지연)
        setTimeout(() => {
          setShowOuterBlocks(prev => {
            const updated = [...prev]
            updated[index] = true
            return updated
          })
        }, 200 + (index * 100)) // 순차적으로 나타나도록 지연 시간 조정
        hasChanges = true
      } else if (!shouldShow && newShowOuterBlocks[index]) {
        // 해당 블록을 숨기기
        newShowOuterBlocks[index] = false
        hasChanges = true
      }
    })
    
    if (hasChanges && !data.goals.some(goal => goal.trim() !== '')) {
      // 모든 목표가 비어있으면 모든 블록 숨기기
      setShowOuterBlocks(Array(8).fill(false))
    }
  }, [data.goals])
  // 9x9 그리드 위치 계산
  const getCellPosition = (row: number, col: number) => {
    const blockRow = Math.floor(row / 3)
    const blockCol = Math.floor(col / 3)
    const innerRow = row % 3
    const innerCol = col % 3
    
    return { blockRow, blockCol, innerRow, innerCol }
  }

  const renderCell = (row: number, col: number) => {
    const { blockRow, blockCol, innerRow, innerCol } = getCellPosition(row, col)
    const isCenterBlock = blockRow === 1 && blockCol === 1
    const isOuterBlock = !isCenterBlock
    
    // 중앙 블록 (1,1)
    if (isCenterBlock) {
      // 중앙 블록의 중심 (핵심 목표)
      if (innerRow === 1 && innerCol === 1) {
        return (
          <div
            key={`${row}-${col}`}
            className="mandala-cell center-main h-16 md:h-20 flex items-center justify-center border-4 border-blue-500 bg-blue-50 shadow-lg"
            style={{ color: data.colors.text }}
          >
            <input
              type="text"
              value={data.center}
              onChange={(e) => onCenterChange(e.target.value)}
              placeholder="핵심 목표"
              className="text-center font-bold text-sm md:text-base bg-transparent"
              style={{ color: data.colors.text }}
            />
          </div>
        )
      }
      
      // 중앙 블록의 8개 목표
      const goalIndex = getGoalIndex(innerRow, innerCol)
      if (goalIndex !== -1) {
        return (
          <div
            key={`${row}-${col}`}
            className="mandala-cell center-goal h-16 md:h-20 flex items-center justify-center border-2 border-blue-300 bg-blue-100 shadow-md"
            style={{ backgroundColor: data.colors.background, color: data.colors.text }}
          >
            <input
              type="text"
              value={data.goals[goalIndex]}
              onChange={(e) => onGoalChange(goalIndex, e.target.value)}
              placeholder={`목표 ${goalIndex + 1}`}
              className="text-center text-xs md:text-sm bg-transparent"
              style={{ color: data.colors.text }}
            />
          </div>
        )
      }
    }
    
    // 주변 8개 블록 - 조건부 렌더링과 애니메이션
    const blockIndex = getBlockIndex(blockRow, blockCol)
    if (blockIndex !== -1) {
      // 해당 블록이 표시되지 않을 때는 빈 칸
      if (!showOuterBlocks[blockIndex]) {
        return (
          <div 
            key={`${row}-${col}`} 
            className="mandala-cell h-16 md:h-20 bg-gray-100 opacity-30 transition-all duration-300" 
          />
        )
      }
      
      // 주변 블록의 중심 = 중앙 블록의 해당 목표와 동기화
      if (innerRow === 1 && innerCol === 1) {
        return (
          <div
            key={`${row}-${col}`}
            className={`mandala-cell outer-center h-16 md:h-20 flex items-center justify-center border-2 border-green-400 bg-green-50 shadow-md transform transition-all duration-500 ${
              showOuterBlocks[blockIndex] ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
            style={{ color: data.colors.text }}
          >
            <input
              type="text"
              value={data.goals[blockIndex]}
              onChange={(e) => onGoalChange(blockIndex, e.target.value)}
              placeholder={`목표 ${blockIndex + 1}`}
              className="text-center font-bold text-xs md:text-sm bg-transparent"
              style={{ color: data.colors.text }}
            />
          </div>
        )
      }
      
      // 주변 블록의 세부 목표들
      const subGoalIndex = getGoalIndex(innerRow, innerCol)
      if (subGoalIndex !== -1) {
        return (
          <div
            key={`${row}-${col}`}
            className={`mandala-cell outer-sub h-16 md:h-20 flex items-center justify-center border border-gray-300 bg-white shadow-sm transform transition-all duration-500 ${
              showOuterBlocks[blockIndex] ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
            style={{ backgroundColor: data.colors.background, color: data.colors.text }}
          >
            <input
              type="text"
              value={data.subGoals[blockIndex]?.[subGoalIndex] || ''}
              onChange={(e) => onSubGoalChange(blockIndex, subGoalIndex, e.target.value)}
              placeholder={`세부 ${subGoalIndex + 1}`}
              className="text-center text-xs bg-transparent"
              style={{ color: data.colors.text }}
            />
          </div>
        )
      }
    }
    
    return <div key={`${row}-${col}`} className="mandala-cell h-16 md:h-20" />
  }

  // 목표 인덱스 계산 (중심 제외한 8방향)
  const getGoalIndex = (row: number, col: number) => {
    if (row === 1 && col === 1) return -1 // 중심
    const positions = [
      [0, 0], [0, 1], [0, 2],  // 위쪽 3개
      [1, 0],         [1, 2],  // 좌우 2개
      [2, 0], [2, 1], [2, 2]   // 아래쪽 3개
    ]
    return positions.findIndex(([r, c]) => r === row && c === col)
  }

  // 블록 인덱스 계산 (중심 블록 제외한 8방향)
  const getBlockIndex = (blockRow: number, blockCol: number) => {
    if (blockRow === 1 && blockCol === 1) return -1 // 중심 블록
    const positions = [
      [0, 0], [0, 1], [0, 2],  // 위쪽 3개
      [1, 0],         [1, 2],  // 좌우 2개
      [2, 0], [2, 1], [2, 2]   // 아래쪽 3개
    ]
    return positions.findIndex(([r, c]) => r === blockRow && c === blockCol)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-gray-200 p-2 rounded-xl shadow-2xl">
        {/* 중앙 블록 강조 배경 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-1/3 h-1/3 bg-blue-100 rounded-lg border-2 border-blue-300 opacity-50"></div>
        </div>
        
        <div className="grid grid-cols-9 gap-1 relative z-10">
          {Array.from({ length: 9 }, (_, row) =>
            Array.from({ length: 9 }, (_, col) => renderCell(row, col))
          )}
        </div>
      </div>
      
      {/* 안내 메시지 */}
      {!showOuterBlocks.some(show => show) && (
        <div className="text-center mt-4 text-gray-600">
          <p className="text-sm">중앙 블록의 목표를 입력하면 해당하는 주변 블록이 나타납니다! ✨</p>
        </div>
      )}
    </div>
  )
}

export default MandalaGrid 