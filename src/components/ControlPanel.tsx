import { useRef } from 'react'

interface ControlPanelProps {
  onImageUpload: (file: File) => void
}

export default function ControlPanel({ onImageUpload }: ControlPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-slate-800 border-t border-slate-700 p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={handleButtonClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors active:scale-95 transform"
        >
          📷 Upload / Take Photo
        </button>

        <p className="text-xs text-slate-400 text-center">
          Phase 1: Upload an image to see it displayed in 3D
        </p>
      </div>
    </div>
  )
}
