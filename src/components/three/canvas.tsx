import React, { Dispatch, SetStateAction, useState, Suspense } from "react";
import { Loader as CanvasLoader, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Gallery from "./gallery";
import Painting from "./painting";
import Controls from "./controls";
import GalaxySky from "./galaxy_sky";
import Whiteboard from "./whiteboard";
import { Mesh } from "three";

const PAINTINGS: { name: string; position: [number, number, number]; rotation?: [number, number, number]; scale?: number }[] = [
  { name: "WhatsApp Image 2026-09-21 at 20.00.26.jpeg", position: [-16.00, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.27 (1).jpeg", position: [-14.55, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.27 (2).jpeg", position: [-13.10, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.27.jpeg", position: [-11.65, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.28 (1).jpeg", position: [-10.20, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.28 (2).jpeg", position: [-8.75, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.28.jpeg", position: [-7.30, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.29 (1).jpeg", position: [-5.85, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.29 (2).jpeg", position: [-4.40, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.29 (3).jpeg", position: [-2.95, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.29 (4).jpeg", position: [-1.50, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.29.jpeg", position: [-0.05, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.30 (1).jpeg", position: [1.40, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.30.jpeg", position: [2.85, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.31.jpeg", position: [4.30, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.32 (1).jpeg", position: [5.75, 0.60, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.32 (2).jpeg", position: [-16.00, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.32.jpeg", position: [-14.55, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.33.jpeg", position: [-13.10, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.34.jpeg", position: [-11.65, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.35.jpeg", position: [-10.20, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.36 (1).jpeg", position: [-8.75, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.36 (2).jpeg", position: [-7.30, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.36.jpeg", position: [-5.85, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.37 (1).jpeg", position: [-4.40, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.37 (2).jpeg", position: [-2.95, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.37.jpeg", position: [-1.50, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.38 (1).jpeg", position: [-0.05, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.38.jpeg", position: [1.40, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.40 (1).jpeg", position: [2.85, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.40.jpeg", position: [4.30, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.41.jpeg", position: [5.75, 1.40, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.42 (1).jpeg", position: [-16.00, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.42 (2).jpeg", position: [-14.55, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.42 (3).jpeg", position: [-13.10, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.42.jpeg", position: [-11.65, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.43 (1).jpeg", position: [-10.20, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.43 (2).jpeg", position: [-8.75, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.43 (3).jpeg", position: [-7.30, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.43.jpeg", position: [-5.85, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.44.jpeg", position: [-4.40, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.45 (1).jpeg", position: [-2.95, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.45.jpeg", position: [-1.50, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.46 (1).jpeg", position: [-0.05, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.46.jpeg", position: [1.40, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.47.jpeg", position: [2.85, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.48 (1).jpeg", position: [4.30, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.48 (2).jpeg", position: [5.75, 2.20, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.48.jpeg", position: [-16.00, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.49 (1).jpeg", position: [-14.55, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.49.jpeg", position: [-13.10, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.50 (1).jpeg", position: [-11.65, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.50 (2).jpeg", position: [-10.20, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.50.jpeg", position: [-8.75, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.51 (1).jpeg", position: [-7.30, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.51.jpeg", position: [-5.85, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.52 (1).jpeg", position: [-4.40, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.52 (2).jpeg", position: [-2.95, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.52 (3).jpeg", position: [-1.50, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.52.jpeg", position: [-0.05, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.53 (1).jpeg", position: [1.40, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.53 (2).jpeg", position: [2.85, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.53.jpeg", position: [4.30, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.54.jpeg", position: [5.75, 3.00, -5.50], rotation: [0, 0, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.55.jpeg", position: [-11.50, 0.60, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.56 (1).jpeg", position: [-10.05, 0.60, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.56.jpeg", position: [-8.60, 0.60, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.58 (1).jpeg", position: [-7.15, 0.60, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.58.jpeg", position: [-5.70, 0.60, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.59 (1).jpeg", position: [-11.50, 1.40, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.00.59.jpeg", position: [-10.05, 1.40, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.01.00.jpeg", position: [-8.60, 1.40, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.01.01 (1).jpeg", position: [-7.15, 1.40, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.01.01 (2).jpeg", position: [-5.70, 1.40, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.01.01.jpeg", position: [-11.50, 2.20, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.01.02 (1).jpeg", position: [-10.05, 2.20, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.01.02 (2).jpeg", position: [-8.60, 2.20, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.01.02.jpeg", position: [-7.15, 2.20, 5.80], rotation: [0, 3.14, 0], scale: 0.52 },
  { name: "WhatsApp Image 2026-09-21 at 20.01.03.jpeg", position: [-5.70, 2.20, 5.80], rotation: [0, 3.14, 0], scale: 0.52 }
];

const IndexPage = (): JSX.Element => {
  const [floor, setFloor] = useState<Mesh>();

  return (
    <>
      <Canvas style={{ height: "100vh", width: "100vw" }}>
        <ambientLight intensity={0.9} />
        <Suspense fallback={null}>
          {PAINTINGS.map((painting, index) => (
            <Painting 
              key={index} 
              name={painting.name} 
              position={painting.position} 
              rotation={painting.rotation} 
              scale={painting.scale}
            />
          ))}
          <GalaxySky />
          <Whiteboard position={[9.0, 1.8, 0]} rotation={[0, Math.PI, 0]} scale={0.035} />
          <Gallery setFloor={setFloor} />
          <Controls floor={floor} />
          <Preload all />
        </Suspense>
      </Canvas>
      <CanvasLoader />
    </>
  );
};

export default IndexPage;
