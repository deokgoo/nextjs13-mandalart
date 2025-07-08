'use client'

import { MandalaGridProps } from '@/types/mandala'
import { useState, useEffect, useCallback } from 'react'

const MobileMandalaGrid = ({ data, onCenterChange, onGoalChange, onSubGoalChange }: MandalaGridProps) => {
  // 현재 위치를 3x3 좌표로 관리 [row, col]
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([1, 1]) // 중앙에서 시작
  const [showOuterBlocks, setShowOuterBlocks] = useState<boolean[]>(Array(8).fill(false))
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

  // 각 목표가 입력되면 해당하는 주변 블록만 표시
  useEffect(() => {
    const newShowOuterBlocks = data.goals.map(goal => goal.trim() !== '')
    setShowOuterBlocks(newShowOuterBlocks)
  }, [data.goals])

  // 3x3 그리드에서 블록 인덱스 계산
  const getBlockIndex = (row: number, col: number): number => {
    if (row === 1 && col === 1) return -1 // 중앙 블록
    
    // 주변 8개 블록의 인덱스 매핑
    const blockMap: { [key: string]: number } = {
      '0,0': 0, '0,1': 1, '0,2': 2,  // 위쪽 3개
      '1,0': 3,           '1,2': 4,  // 좌우 2개  
      '2,0': 5, '2,1': 6, '2,2': 7   // 아래쪽 3개
    }
    
    return blockMap[`${row},${col}`] ?? -1
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

  // 상하좌우 이동 함수들
  const moveUp = useCallback(() => {
    const [row, col] = currentPosition
    if (row > 0) {
      const newPosition: [number, number] = [row - 1, col]
      const blockIndex = getBlockIndex(newPosition[0], newPosition[1])
      
      // 중앙 블록이거나 활성화된 블록인 경우에만 이동
      if (blockIndex === -1 || showOuterBlocks[blockIndex]) {
        setCurrentPosition(newPosition)
      }
    }
  }, [currentPosition, showOuterBlocks])

  const moveDown = useCallback(() => {
    const [row, col] = currentPosition
    if (row < 2) {
      const newPosition: [number, number] = [row + 1, col]
      const blockIndex = getBlockIndex(newPosition[0], newPosition[1])
      
      if (blockIndex === -1 || showOuterBlocks[blockIndex]) {
        setCurrentPosition(newPosition)
      }
    }
  }, [currentPosition, showOuterBlocks])

  const moveLeft = useCallback(() => {
    const [row, col] = currentPosition
    if (col > 0) {
      const newPosition: [number, number] = [row, col - 1]
      const blockIndex = getBlockIndex(newPosition[0], newPosition[1])
      
      if (blockIndex === -1 || showOuterBlocks[blockIndex]) {
        setCurrentPosition(newPosition)
      }
    }
  }, [currentPosition, showOuterBlocks])

  const moveRight = useCallback(() => {
    const [row, col] = currentPosition
    if (col < 2) {
      const newPosition: [number, number] = [row, col + 1]
      const blockIndex = getBlockIndex(newPosition[0], newPosition[1])
      
      if (blockIndex === -1 || showOuterBlocks[blockIndex]) {
        setCurrentPosition(newPosition)
      }
    }
  }, [currentPosition, showOuterBlocks])

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          moveUp()
          break
        case 'ArrowDown':
          e.preventDefault()
          moveDown()
          break
        case 'ArrowLeft':
          e.preventDefault()
          moveLeft()
          break
        case 'ArrowRight':
          e.preventDefault()
          moveRight()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [moveUp, moveDown, moveLeft, moveRight])

  // 터치 스와이프 처리
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y
    const minSwipeDistance = 50

    // 가장 큰 변화량을 기준으로 방향 결정
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 좌우 스와이프
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          moveLeft() // 왼쪽 스와이프
        } else {
          moveRight() // 오른쪽 스와이프
        }
      }
    } else {
      // 상하 스와이프
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          moveUp() // 위쪽 스와이프
        } else {
          moveDown() // 아래쪽 스와이프
        }
      }
    }
  }

  // 현재 블록 렌더링
  const renderCurrentBlock = () => {
    const [row, col] = currentPosition
    
    if (row === 1 && col === 1) {
      // 중앙 블록 (3x3)
      return (
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-blue-600">중앙 블록</h2>
            <p className="text-sm text-gray-600">핵심 목표와 8개 주요 목표</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }, (_, r) =>
              Array.from({ length: 3 }, (_, c) => {
                if (r === 1 && c === 1) {
                  // 중심 (핵심 목표)
                  return (
                    <div
                      key={`center-${r}-${c}`}
                      className="aspect-square border-4 border-blue-500 bg-blue-50 rounded-lg flex items-center justify-center shadow-md"
                    >
                      <input
                        type="text"
                        value={data.center}
                        onChange={(e) => onCenterChange(e.target.value)}
                        placeholder="핵심 목표"
                        className="w-full h-full text-center text-xs font-bold bg-transparent border-none outline-none"
                        style={{ color: data.colors.text }}
                      />
                    </div>
                  )
                }
                
                // 8개 주요 목표
                const goalIndex = getGoalIndex(r, c)
                if (goalIndex !== -1) {
                  return (
                    <div
                      key={`goal-${r}-${c}`}
                      className="aspect-square border-2 border-blue-300 bg-blue-100 rounded-lg flex items-center justify-center shadow-sm"
                    >
                      <input
                        type="text"
                        value={data.goals[goalIndex]}
                        onChange={(e) => onGoalChange(goalIndex, e.target.value)}
                        placeholder={`목표${goalIndex + 1}`}
                        className="w-full h-full text-center text-xs bg-transparent border-none outline-none"
                        style={{ color: data.colors.text }}
                      />
                    </div>
                  )
                }
                
                return <div key={`empty-${r}-${c}`} className="aspect-square" />
              })
            )}
          </div>
        </div>
      )
    } else {
      // 주변 블록
      const blockIndex = getBlockIndex(row, col)
      if (blockIndex === -1 || !showOuterBlocks[blockIndex]) {
        return (
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-gray-400 py-16">
              <p className="text-lg">📝</p>
              <p className="text-sm mt-2">중앙 블록에서 목표를</p>
              <p className="text-sm">입력하면 이 블록이 활성화됩니다</p>
            </div>
          </div>
        )
      }
      
      return (
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-green-600">목표 {blockIndex + 1}</h2>
            <div className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full inline-block">
              {data.goals[blockIndex] || `목표 ${blockIndex + 1}`}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }, (_, r) =>
              Array.from({ length: 3 }, (_, c) => {
                if (r === 1 && c === 1) {
                  // 중심 (주요 목표와 동기화)
                  return (
                    <div
                      key={`sub-center-${r}-${c}`}
                      className="aspect-square border-4 border-green-500 bg-green-50 rounded-lg flex items-center justify-center shadow-md"
                    >
                      <input
                        type="text"
                        value={data.goals[blockIndex]}
                        onChange={(e) => onGoalChange(blockIndex, e.target.value)}
                        placeholder={`목표${blockIndex + 1}`}
                        className="w-full h-full text-center text-xs font-bold bg-transparent border-none outline-none"
                        style={{ color: data.colors.text }}
                      />
                    </div>
                  )
                }
                
                // 8개 세부 목표
                const subGoalIndex = getGoalIndex(r, c)
                if (subGoalIndex !== -1) {
                  return (
                    <div
                      key={`sub-${r}-${c}`}
                      className="aspect-square border border-gray-300 bg-white rounded-lg flex items-center justify-center shadow-sm"
                    >
                      <input
                        type="text"
                        value={data.subGoals[blockIndex]?.[subGoalIndex] || ''}
                        onChange={(e) => onSubGoalChange(blockIndex, subGoalIndex, e.target.value)}
                        placeholder={`세부${subGoalIndex + 1}`}
                        className="w-full h-full text-center text-xs bg-transparent border-none outline-none"
                        style={{ color: data.colors.text }}
                      />
                    </div>
                  )
                }
                
                return <div key={`empty-${r}-${c}`} className="aspect-square" />
              })
            )}
          </div>
        </div>
      )
    }
  }

  // 3x3 미니맵 생성
  const renderMiniMap = () => {
    return (
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 3 }, (_, col) => {
            const isCurrent = currentPosition[0] === row && currentPosition[1] === col
            const isCenter = row === 1 && col === 1
            const blockIndex = getBlockIndex(row, col)
            const isActive = isCenter || (blockIndex !== -1 && showOuterBlocks[blockIndex])
            
            return (
              <div
                key={`minimap-${row}-${col}`}
                className={`w-6 h-6 rounded border-2 cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-500'
                    : isActive
                    ? isCenter
                      ? 'border-blue-300 bg-blue-100'
                      : 'border-green-300 bg-green-100'
                    : 'border-gray-300 bg-gray-100 opacity-50'
                }`}
                onClick={() => {
                  if (isActive) {
                    setCurrentPosition([row, col])
                  }
                }}
              />
            )
          })
        )}
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* 현재 블록 */}
      <div 
        className="transition-all duration-300 ease-in-out mb-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {renderCurrentBlock()}
      </div>

      {/* 현재 위치 미니맵 */}
      <div className="flex justify-center items-center mb-4">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-2">현재 위치</p>
          {renderMiniMap()}
        </div>
      </div>

      {/* 방향키 컨트롤 */}
      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-3 gap-1">
          <div></div>
          <button
            onClick={moveUp}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            ↑
          </button>
          <div></div>
          <button
            onClick={moveLeft}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            ←
          </button>
          <div className="p-2 bg-gray-200 rounded text-center text-xs font-medium">
            방향키
          </div>
          <button
            onClick={moveRight}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            →
          </button>
          <div></div>
          <button
            onClick={moveDown}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            ↓
          </button>
          <div></div>
        </div>
      </div>

      {/* 하단 안내 */}
      <div className="text-center text-gray-500">
        <p className="text-xs">
          {currentPosition[0] === 1 && currentPosition[1] === 1
            ? '중앙 블록 - 핵심 목표를 설정하세요' 
            : `목표 블록 - 세부 목표를 설정하세요`
          }
        </p>
        <p className="text-xs mt-1">방향키, 상하좌우 스와이프, 또는 미니맵을 사용하세요</p>
      </div>
    </div>
  )
}

export default MobileMandalaGrid 