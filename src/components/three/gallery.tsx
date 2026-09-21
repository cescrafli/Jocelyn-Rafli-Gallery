import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Euler, Mesh, RepeatWrapping, sRGBEncoding } from "three";
import Config from "config";
import { useGLTF, useTexture } from "@react-three/drei";

const rotation = new Euler(0, 1.57, 0, "XYZ");
const filePath = "/vrgallerygltf/galleryedit.gltf";

interface GalleryProps {
  setFloor: Dispatch<SetStateAction<Mesh | undefined>>;
}

const Gallery = ({ setFloor }: GalleryProps): JSX.Element => {
  const { nodes, scene } = useGLTF(filePath) as any;
  const wallpaper = useTexture("/textures/floral_wallpaper.jpg");

  useEffect(() => {
    setFloor(nodes.Cube001_floormat_0);
    
    // Terapkan wallpaper bunga ke dinding
    if (wallpaper && nodes.Cube003_whitematwalls_0) {
      wallpaper.wrapS = RepeatWrapping;
      wallpaper.wrapT = RepeatWrapping;
      wallpaper.repeat.set(30, 8); // Atur perulangan pola bunga
      wallpaper.encoding = sRGBEncoding;
      
      const wallMat = nodes.Cube003_whitematwalls_0.material;
      wallMat.map = wallpaper;
      wallMat.color.set("#ffb3ba"); // Warna dasar pastel pink
      wallMat.needsUpdate = true;
    }

    // Hapus furniture dengan menghapusnya dari scene graph
    const nodesToRemove: any[] = [];
    scene.traverse((child: any) => {
      if (child.name) {
        // Nama node di Three.js terkadang menghilangkan titik, jadi kita bersihkan dulu
        const nodeName = child.name.replace(/\./g, ""); 
        
        if (
          nodeName.includes("Plane006") || 
          nodeName.includes("Plane008") || 
          nodeName.includes("Plane009") || 
          nodeName.includes("Cube009") ||  
          nodeName.includes("Cube011") ||  
          nodeName.includes("Cube012") ||  
          nodeName.includes("Cube014") ||  
          nodeName.includes("Cube015") ||  
          nodeName.includes("Cube016") ||  
          nodeName.includes("Cube017") ||  
          nodeName.includes("Cube007") || 
          nodeName.includes("paintings") ||
          nodeName.includes("plasticmat") ||
          nodeName.includes("whitemat_0") ||
          nodeName.includes("ceilingmat")
        ) {
          nodesToRemove.push(child);
        }
      }
    });

    nodesToRemove.forEach(node => {
      if (node.parent) {
        node.parent.remove(node);
      } else {
        node.visible = false;
        if (node.scale) node.scale.set(0,0,0);
        if (node.position) node.position.set(0,-1000,0);
      }
    });
  }, [wallpaper, scene, nodes]);

  return (
    <primitive
      object={scene}
      position={[0, 0, 0]}
      rotation={rotation}
      scale={Config.gallery.scale}
    />
  );
};

useGLTF.preload(filePath);

export default Gallery;
