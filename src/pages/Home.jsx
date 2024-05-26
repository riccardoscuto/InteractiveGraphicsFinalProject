import React, { useEffect, useState } from 'react';
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Loader from '../components/Loader';
import Cube from '../models/Cube';
import { currentPoint, generationMatrix, generationPosition, simulation } from '../functions/cellarAutomata2D';
import { useInterval } from '../hook/useInterval';


const lato = 9;
const rendered = generationMatrix(lato);
rendered[4][5]=true
rendered[4][6]=true
rendered[4][7]=true

const positions = generationPosition(lato);

const Home = () => {
    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => setDarkMode(!darkMode);
    const [Matrix, setMatrix] = useState(rendered);
    const [LastFrame, setLastFrame] = useState(Date.now())
    useInterval(() => {
        console.log("ciao")
        // if (Date.now()-LastFrame>1000) {
          //  if(false){
            let newMatrix = []
            for (let x = 0; x < lato; x++) {
                newMatrix[x] = [];
                for (let y = 0; y < lato; y++) {
                    newMatrix[x][y] = simulation(x, y, Matrix, lato);
                }
            }
            setMatrix(newMatrix);
            console.log(newMatrix)
         //   setLastFrame(Date.now());
     //   }
    }, 10000)






    const colors = [
        "red", "white", "blue", "yellow", "#324e2a",
        "#1b3644", "#3d0079", "#ffbf6e", "brown"
    ];
    return (
        <>
            <button onClick={toggleDarkMode} style={{ position: 'absolute', zIndex: 2 }}>
                {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <Canvas
                camera={{ position: [0, 0, 10], near: 0.1, far: 1000 }}
                style={{ width: "100vw", height: "100vh", zIndex: "1", background: darkMode ? "black" : "white" }}
            >
                <Suspense fallback={<Loader />}>
                    <directionalLight position={[1, 1, 1]} intensity={darkMode ? 0.5 : 2} />
                    <ambientLight intensity={darkMode ? 0.2 : 0.5} />
                    {darkMode ? null : <spotLight />}
                    {darkMode ? null : <pointLight />}
                    {darkMode ? null : <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />}
                    {positions.map((position, index) => (
                        <Cube key={index} position={position} color={colors[index]} darkMode={darkMode} isRendering={currentPoint(Matrix,index,lato)} />
                    ))}
                    <OrbitControls />
                    <EffectComposer>
                        <Bloom
                            luminanceThreshold={0}
                            luminanceSmoothing={0.5}
                            height={300}
                            intensity={darkMode ? 2 : 0}
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </>
    );
};

export default Home;