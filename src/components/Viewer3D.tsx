import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Scene from './Scene'

interface Viewer3DProps {
  imageUrl: string | null
}

export default function Viewer3D({ imageUrl }: Viewer3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      className="w-full h-full"
      gl={{ preserveDrawingBuffer: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#475569']} />
      <Scene imageUrl={imageUrl} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
        touches={{ ONE: 2, TWO: 1 }}
      />
    </Canvas>
  )
}
