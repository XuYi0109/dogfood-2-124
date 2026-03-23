import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

function PhoneModel() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[1.5, 3, 0.1]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, 1.2, 0.06]}>
        <boxGeometry args={[1.3, 2.4, 0.02]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[0, -1.3, 0.06]}>
        <boxGeometry args={[0.3, 0.15, 0.02]} />
        <meshStandardMaterial color="#34495e" metalness={0.5} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 1.35, 0.06]}>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#34495e" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[0.55, 1.2, 0.06]}>
        <boxGeometry args={[0.02, 0.02, 0.01]} />
        <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

export default PhoneModel
