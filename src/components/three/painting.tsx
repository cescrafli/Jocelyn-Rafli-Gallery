import { useTexture } from "@react-three/drei";
import React from "react";
import { MeshBasicMaterial, PlaneGeometry, sRGBEncoding } from "three";

// this seems like a generic interface (maybe move it to a generic folder?)
// todo: extract this
interface PaintingProps {
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

const Painting = ({ name = "", position, rotation = [0, 0, 0], scale = 1 }: PaintingProps): JSX.Element => {
  const texture = useTexture(`/paintings/${name}`);
  texture.encoding = sRGBEncoding;

  // Calculate dynamic width based on the image's original aspect ratio
  const imageWidth = texture.image?.width || 1;
  const imageHeight = texture.image?.height || 1.3;
  const aspect = imageWidth / imageHeight;

  const height = 1.3;
  const width = height * aspect;

  const geometry = new PlaneGeometry(width, height);
  const material = new MeshBasicMaterial({
    map: texture,
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0, 0.06]} args={[geometry, material]} />
      {/* Bingkai foto berwarna emas */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width + 0.15, height + 0.15, 0.1]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};
export default Painting;
