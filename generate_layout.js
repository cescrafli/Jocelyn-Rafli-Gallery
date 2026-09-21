const fs = require('fs');

const files = fs.readdirSync('static/paintings').filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

let paintings = [];
let fileIndex = 0;

// Scale 1.2
const scale = 0.52;
const rowHeights = [0.6, 1.4, 2.2, 3.0]; // 4 rows, lower max height (Y=3.0) to prevent clipping above wall

// We will collect all precise slots here
const slots = [];

// 1. Back wall (Z = -5.5, rot = 0). X from -16 to 5.75 (16 columns)
for (let row of rowHeights) {
  for (let x = -16; x <= 6.0; x += 1.45) {
    slots.push({ pos: [x, row, -5.5], rot: [0, 0, 0] });
  }
}

// 2. Front wall Left (Z = 5.8, rot = Y 180). X from -11.5 to -5.5 (5 columns)
for (let row of rowHeights) {
  for (let x = -11.5; x <= -5.0; x += 1.45) {
    slots.push({ pos: [x, row, 5.8], rot: [0, 3.14, 0] });
  }
}

// Map files to slots
for (let i = 0; i < files.length && i < slots.length; i++) {
  const slot = slots[i];
  const rotStr = `[${slot.rot.join(', ')}]`;
  const posStr = `[${slot.pos[0].toFixed(2)}, ${slot.pos[1].toFixed(2)}, ${slot.pos[2].toFixed(2)}]`;
  paintings.push(`{ name: "${files[i]}", position: ${posStr}, rotation: ${rotStr}, scale: ${scale} }`);
  fileIndex++;
}

const content = `import React, { Dispatch, SetStateAction, useState, Suspense } from "react";
import { Loader as CanvasLoader, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Gallery from "./gallery";
import Painting from "./painting";
import Controls from "./controls";
import { Mesh } from "three";

const PAINTINGS: { name: string; position: [number, number, number]; rotation?: [number, number, number]; scale?: number }[] = [
  ${paintings.join(',\n  ')}
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
`;

fs.writeFileSync('src/components/three/canvas.tsx', content);
console.log('Done generating canvas.tsx with ' + fileIndex + ' paintings');
