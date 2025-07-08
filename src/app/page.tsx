'use client'

import { useState, useEffect } from 'react'
import MandalaGrid from '@/components/MandalaGrid'
import MobileMandalaGrid from '@/components/MobileMandalaGrid'
import ColorPicker from '@/components/ColorPicker'
import { MandalaData } from '@/types/mandala'

export default function Home() {
  const [mandalaData, setMandalaData] = useState<MandalaData>({
    title: '',
    center: '',
    goals: Array(8).fill(''),
    subGoals: Array(8).fill(null).map(() => Array(8).fill('')),
    colors: {
      text: '#000000',
      background: '#ffffff'
    }
  })

  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 모바일 화면 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleTitleChange = (title: string) => {
    setMandalaData(prev => ({ ...prev, title }))
  }

  const handleCenterChange = (center: string) => {
    setMandalaData(prev => ({ ...prev, center }))
  }

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...mandalaData.goals]
    newGoals[index] = value
    setMandalaData(prev => ({ ...prev, goals: newGoals }))
  }

  const handleSubGoalChange = (goalIndex: number, subIndex: number, value: string) => {
    const newSubGoals = [...mandalaData.subGoals]
    newSubGoals[goalIndex][subIndex] = value
    setMandalaData(prev => ({ ...prev, subGoals: newSubGoals }))
  }

  const handleColorChange = (colors: { text: string; background: string }) => {
    setMandalaData(prev => ({ ...prev, colors }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <span className="text-3xl">🌙</span>
            Plan your dream
          </h1>
          <p className="text-gray-600">만다라트로 꿈을 계획하세요</p>
        </header>

        {isMobile ? (
          /* 모바일 레이아웃 */
          <div className="space-y-6">
            {/* 제목 입력 */}
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <input
                type="text"
                value={mandalaData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Insert your dream"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
            </div>

            {/* 모바일 만다라트 그리드 */}
            <MobileMandalaGrid
              data={mandalaData}
              onCenterChange={handleCenterChange}
              onGoalChange={handleGoalChange}
              onSubGoalChange={handleSubGoalChange}
            />

            {/* 색상 선택 */}
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <ColorPicker
                colors={mandalaData.colors}
                onColorChange={handleColorChange}
              />
            </div>
          </div>
        ) : (
          /* 데스크탑 레이아웃 */
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* 만다라트 그리드 */}
            <div className="flex-1">
              <MandalaGrid
                data={mandalaData}
                onCenterChange={handleCenterChange}
                onGoalChange={handleGoalChange}
                onSubGoalChange={handleSubGoalChange}
              />
            </div>

            {/* 사이드바 */}
            <div className="w-full lg:w-80 space-y-6">
              {/* 제목 입력 */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Title</h2>
                <input
                  type="text"
                  value={mandalaData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Insert your dream"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 색상 선택 */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <ColorPicker
                  colors={mandalaData.colors}
                  onColorChange={handleColorChange}
                />
              </div>

              {/* 컨트롤 버튼 */}
              <div className="flex gap-2 justify-center">
                <button className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  🔍
                </button>
                <button className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  🔍
                </button>
                <button className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  📷
                </button>
                <button className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  🖨️
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 