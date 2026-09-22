import React, { useEffect, useRef } from "react";
import { graphql } from "gatsby";

import Canvas from "components/three/canvas";
import SEO from "components/main/seo/seo";
import "./index.scss";

interface IndexPageProps {
  data: {
    allFile: {
      nodes: {
        base: string;
      }[];
    };
  };
}

const IndexPage = ({ data }: IndexPageProps): JSX.Element => {
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

  const paintingNames = data.allFile.nodes.map((node) => node.base);

  return (
    <>
      <SEO title="Jocelyn & Rafli Gallery" />
      <audio ref={audioRef} src="/bgm.webm" loop />
      <div id="scene-container" style={{ height: "100vh", width: "100%" }}>
        <Canvas paintings={paintingNames} />
      </div>
    </>
  );
};

export const query = graphql`
  query {
    allFile(filter: { sourceInstanceName: { eq: "paintings" } }) {
      nodes {
        base
      }
    }
  }
`;

export default IndexPage;
