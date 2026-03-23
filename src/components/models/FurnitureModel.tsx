import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

function FurnitureModel() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[3, 0.6, 1.2]} />
        <meshStandardMaterial color="#8b4513" metalness={0.1} roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[2.8, 0.5, 1]} />
        <meshStandardMaterial color="#a0522d" metalness={0.1} roughness={0.7} />
      </mesh>
      
      <mesh position={[-1.3, 0.6, 0]}>
        <boxGeometry args={[0.4, 1.2, 1.2]} />
        <meshStandardMaterial color="#8b4513" metalness={0.1} roughness={0.8} />
      </mesh>
      
      <mesh position={[1.3, 0.6, 0]}>
        <boxGeometry args={[0.4, 1.2, 1.2]} />
        <meshStandardMaterial color="#8b4513" metalness={0.1} roughness={0.8} />
      </mesh>
      
      <mesh position={[-0.7, 0.65, 0.5]}>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color="#d2691e" metalness={0.05} roughness={0.9} />
      </mesh>
      
      <mesh position={[0.7, 0.65, 0.5]}>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color="#d2691e" metalness={0.05} roughness={0.9} />
      </mesh>
      
      <mesh position={[0, 0.95, 0.1]}>
        <boxGeometry args={[1.8, 0.3, 0.4]} />
        <meshStandardMaterial color="#d2691e" metalness={0.05} roughness={0.9} />
      </mesh>
      
      <mesh position={[-1.4, -0.1, 0.45]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[-1.4, -0.1, -0.45]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[1.4, -0.1, 0.45]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[1.4, -0.1, -0.45]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

export default FurnitureModel
