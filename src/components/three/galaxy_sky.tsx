import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Stars } from "@react-three/drei";
import { DoubleSide, Mesh, RepeatWrapping, Group, sRGBEncoding } from "three";

const GalaxySky = (): JSX.Element => {
  const texture = useTexture("/textures/ngc1333.jpg");
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.encoding = sRGBEncoding;
  
  const skyRef = useRef<Mesh>(null);
  const shootingStarRef = useRef<Group>(null);
  const shootingStar2Ref = useRef<Group>(null);
  
  useFrame((state, delta) => {
    // Animate the galaxy texture sangat lambat
    if (texture) {
      texture.offset.x += 0.00005; // Diperlambat 10x
      texture.offset.y += 0.00003; // Diperlambat 10x
    }
    
    // Animate shooting star 1
    if (shootingStarRef.current) {
      shootingStarRef.current.position.x -= 40 * delta;
      shootingStarRef.current.position.z -= 20 * delta;
      
      if (shootingStarRef.current.position.x < -40) {
         shootingStarRef.current.position.set(
            Math.random() * 20 + 20,
            4.2, // Tepat di bawah langit-langit galaksi
            Math.random() * 20 + 10
         );
      }
    }

    // Animate shooting star 2
    if (shootingStar2Ref.current) {
      shootingStar2Ref.current.position.x += 30 * delta;
      shootingStar2Ref.current.position.z -= 30 * delta;
      
      if (shootingStar2Ref.current.position.z < -40) {
         shootingStar2Ref.current.position.set(
            -(Math.random() * 20 + 10),
            4.3,
            Math.random() * 20 + 20
         );
      }
    }
  });

  return (
    <group>
      {/* Background Stars (kelap-kelip statis dan banyak) */}
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />

      {/* The Moving Galaxy Plane (Menggantikan plafon) */}
      <mesh ref={skyRef} position={[0, 4.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[150, 150]} />
        {/* Menggunakan meshBasicMaterial agar terang benderang seperti langit malam, tidak terpengaruh bayangan */}
        <meshBasicMaterial map={texture} side={DoubleSide} transparent opacity={0.9} color="#e0e0ff" />
      </mesh>
      
      {/* Shooting Star 1 */}
      <group ref={shootingStarRef} position={[20, 4.2, 20]} rotation={[0, -Math.atan2(-20, -40), 0]}>
         <mesh>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
         </mesh>
         <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.08, 3]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
         </mesh>
      </group>

      {/* Shooting Star 2 */}
      <group ref={shootingStar2Ref} position={[-20, 4.3, 20]} rotation={[0, -Math.atan2(-30, 30), 0]}>
         <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#aaddff" />
         </mesh>
         <mesh position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.06, 2]} />
            <meshBasicMaterial color="#aaddff" transparent opacity={0.6} />
         </mesh>
      </group>
    </group>
  );
};

export default GalaxySky;
