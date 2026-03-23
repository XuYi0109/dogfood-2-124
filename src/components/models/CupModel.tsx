import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

function CupModel() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.6, 0.5, 1.8, 32]} />
        <meshStandardMaterial color="#ecf0f1" metalness={0.1} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.1, 32]} />
        <meshStandardMaterial color="#bdc3c7" metalness={0.2} roughness={0.4} />
      </mesh>
      
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.45, 0.8, 32]} />
        <meshStandardMaterial 
          color="#3498db" 
          metalness={0.1} 
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      <mesh position={[0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.4, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#ecf0f1" metalness={0.1} roughness={0.3} />
      </mesh>
      
      <mesh position={[0.35, 0.5, 0.2]}>
        <boxGeometry args={[0.15, 0.3, 0.02]} />
        <meshStandardMaterial 
          color="#2ecc71" 
          emissive="#2ecc71" 
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

export default CupModel
