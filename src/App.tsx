import { useState } from 'react'
import Header from './components/Header'
import Viewer3D from './components/Viewer3D'
import ControlPanel from './components/ControlPanel'

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setImageUrl(url)
  }

  return (
    <div className="w-full h-screen flex flex-col bg-slate-900">
      <Header />
      <div className="flex-1 relative">
        <Viewer3D imageUrl={imageUrl} />
      </div>
      <ControlPanel onImageUpload={handleImageUpload} />
    </div>
  )
}

export default App
