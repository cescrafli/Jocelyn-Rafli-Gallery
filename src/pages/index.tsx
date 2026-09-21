import React, { useEffect, useRef } from "react";

import Canvas from "components/three/canvas";
import SEO from "components/main/seo/seo";
import "./index.scss";

const IndexPage = (): JSX.Element => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play blocked by browser", e));
      }
    };
    
    // Autoplay requires user interaction in modern browsers
    window.addEventListener("click", playAudio, { once: true });
    
    return () => window.removeEventListener("click", playAudio);
  }, []);

  return (
    <>
      <SEO title="Jocelyn & Rafli Gallery" />
      <audio ref={audioRef} src="/bgm.webm" loop />
      <div id="scene-container" style={{ height: "100vh", width: "100%" }}>
        <Canvas />
      </div>
    </>
  );
};

export default IndexPage;
