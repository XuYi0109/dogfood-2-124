import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import PhoneModel from './models/PhoneModel'
import CupModel from './models/CupModel'
import FurnitureModel from './models/FurnitureModel'

type ProductType = 'phone' | 'cup' | 'furniture'

interface ProductViewerProps {
  type: ProductType
}

function ProductViewer({ type }: ProductViewerProps) {
  const renderModel = () => {
    switch (type) {
      case 'phone':
        return <PhoneModel />
      case 'cup':
        return <CupModel />
      case 'furniture':
        return <FurnitureModel />
      default:
        return <PhoneModel />
    }
  }

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {renderModel()}
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  )
}

export default ProductViewer
