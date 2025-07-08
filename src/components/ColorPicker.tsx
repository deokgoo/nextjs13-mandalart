'use client'

import { ColorPickerProps } from '@/types/mandala'

const ColorPicker = ({ colors, onColorChange }: ColorPickerProps) => {
  const textColors = [
    '#000000', '#DC2626', '#2563EB', '#059669', '#7C3AED', '#EA580C'
  ]
  
  const backgroundColors = [
    '#FFFFFF', '#FEF3C7', '#DBEAFE', '#D1FAE5', '#E9D5FF', '#FED7AA'
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Title</h3>
        <input
          type="text"
          placeholder="Insert your dream"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Color</h3>
        <div className="flex gap-2 flex-wrap">
          {textColors.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange({ ...colors, text: color })}
              className={`w-8 h-8 rounded-md border-2 ${
                colors.text === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Background</h3>
        <div className="flex gap-2 flex-wrap">
          {backgroundColors.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange({ ...colors, background: color })}
              className={`w-8 h-8 rounded-md border-2 ${
                colors.background === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      
      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
        Apply
      </button>
    </div>
  )
}

export default ColorPicker 