import React from "react";
import { useGLTF, Center, Html } from "@react-three/drei";
import { Euler } from "three";

interface WhiteboardProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const Whiteboard = ({ position, rotation = [0, 0, 0], scale = 1 }: WhiteboardProps): JSX.Element => {
  const { scene } = useGLTF("/whiteboard/scene.gltf");
  
  return (
    <group position={position} rotation={new Euler(...rotation)}>
      <group scale={scale}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>
      
      {/* Menggunakan HTML DOM agar Emoji dan Format terlihat sempurna di 3D */}
      <Html
        transform
        position={[0.02, -0.05, 0]} // Diturunkan sedikit lagi
        rotation={[0, Math.PI / 2, 0]} // Putar 90 derajat agar sejajar
        scale={0.1} // SKALA BESAR
      >
        <div style={{
          width: '800px',
          fontFamily: 'sans-serif',
          fontSize: '60px',
          fontWeight: 'bold',
          color: '#222',
          textAlign: 'center',
          lineHeight: '1.5',
          pointerEvents: 'none'
        }}>
          Non, aku mau semua ruangan ini isi foto dan cerita<br/>
          kamu dan aku kedepannya. Aku minta maaf kalau aku<br/>
          masih blm bisa memberikan yg terbaik ke kamu selama ini, aku tau waktu kita sekarang semakin<br/>
          terpangkas karena jarak tapi aku selalu berdoa yang terbaik agar kamu bisa terus bahagia dan juga<br/>
          dijauhkan dari bahaya kedepannya. ❤️<br/><br/>
          #COWOALAY
        </div>
      </Html>
    </group>
  );
};

export default Whiteboard;
