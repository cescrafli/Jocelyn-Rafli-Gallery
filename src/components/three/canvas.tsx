import React, { Dispatch, SetStateAction, useState, Suspense } from "react";
import { Loader as CanvasLoader, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Gallery from "./gallery";
import Painting from "./painting";
import Controls from "./controls";
import GalaxySky from "./galaxy_sky";
import Whiteboard from "./whiteboard";
import { Mesh } from "three";

interface PaintingConfig {
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

const generatePaintings = (names: string[]): PaintingConfig[] => {
  const configs: PaintingConfig[] = [];
  let index = 0;

  const yRows = [0.60, 1.40, 2.20, 3.00];

  // Wall 1: Back Wall (Z = -5.50)
  for (const y of yRows) {
    for (let col = 0; col < 16; col++) {
      if (index >= names.length) return configs;
      const x = -16.00 + col * 1.45;
      configs.push({ name: names[index], position: [x, y, -5.50], rotation: [0, 0, 0], scale: 0.52 });
      index++;
    }
  }

  // Wall 2: Front Left Wall (Z = 5.80)
  for (const y of yRows) {
    for (let col = 0; col < 5; col++) {
      if (index >= names.length) return configs;
      const x = -11.50 + col * 1.45;
      configs.push({ name: names[index], position: [x, y, 5.80], rotation: [0, 3.14, 0], scale: 0.52 });
      index++;
    }
  }

  // Wall 3: Front Right Wall (Z = 5.80)
  for (const y of yRows) {
    for (let col = 0; col < 7; col++) {
      if (index >= names.length) return configs;
      const x = 2.85 + col * 1.45;
      configs.push({ name: names[index], position: [x, y, 5.80], rotation: [0, 3.14, 0], scale: 0.52 });
      index++;
    }
  }

  // Fallback Wall (if there are more than 112 paintings)
  for (const y of yRows) {
    for (let col = 0; col < 30; col++) {
      if (index >= names.length) return configs;
      const x = -20.0 + col * 1.45;
      configs.push({ name: names[index], position: [x, y, -10.0], rotation: [0, 0, 0], scale: 0.52 });
      index++;
    }
  }

  return configs;
};

interface AppCanvasProps {
  paintings?: string[];
}

const AppCanvas = ({ paintings = [] }: AppCanvasProps): JSX.Element => {
  const [floor, setFloor] = useState<Mesh>();
  
  const paintingConfigs = generatePaintings(paintings);

  return (
    <>
      <Canvas style={{ height: "100vh", width: "100vw" }}>
        <ambientLight intensity={0.9} />
        <Suspense fallback={null}>
          {paintingConfigs.map((painting, index) => (
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

export default AppCanvas;
