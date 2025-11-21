import { useTexture } from '@react-three/drei'
import { Suspense } from 'react'

interface SceneProps {
  imageUrl: string | null
}

function ImagePlane({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl)

  const image = texture.image as HTMLImageElement
  const aspectRatio = image.width / image.height
  const width = aspectRatio > 1 ? 3 : 3 * aspectRatio
  const height = aspectRatio > 1 ? 3 / aspectRatio : 3

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

export default function Scene({ imageUrl }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />

      {imageUrl && (
        <Suspense fallback={null}>
          <ImagePlane imageUrl={imageUrl} />
        </Suspense>
      )}

      {!imageUrl && (
        <mesh>
          <boxGeometry args={[2, 2, 0.5]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      )}
    </>
  )
}
