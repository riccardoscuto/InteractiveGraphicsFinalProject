import React, { useEffect, useState } from 'react';
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Loader from '../components/Loader';
import Cube from '../models/Cube';
import * as secondDimension from '../functions/cellarAutomata2D';
import { useInterval } from '../hook/useInterval';
import { currentPoint, generationMatrix, generationPosition, runSimulation, runSimulationCustom } from '../functions/cellarAutomata3D';


const lato = 20;
const rendered = generationMatrix(lato);
// rendered[1][1][1] = true
// rendered[1][2][1] = true
// rendered[1][3][1] = true
// rendered[1][2][2] = true
// rendered[1][2][0] = true
// rendered[3][5][4] = true
// rendered[3][6][3] = true
// rendered[4][3][4] = true

// // rendered[3][7] = true
// // rendered[1][6] = true
// // rendered[2][6] = true
// // rendered[3][6] = true


// const positions = generationPosition(lato);

const Home = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [cellShadingMode, setCellShadingMode] = useState(false);
    const [wireframeMode, setWireframeMode] = useState(false);
    const toggleDarkMode = () => setDarkMode(!darkMode);
    const toggleCellShadingMode = () => setCellShadingMode(!cellShadingMode);
    const toggleWireframeMode = () => setWireframeMode(!wireframeMode);
    const [Lato, setLato] = useState(4);
    const [Positions, setPositions] = useState(generationPosition(Lato));
    const [Matrix, setMatrix] = useState(generationMatrix(Lato));
    const [Running, setRunning] = useState(false);
    const [Birth, setBirth] = useState(3);
    const [Underpopulated, setUnderpopulated] = useState(2);
    const [Stable, setStable] = useState(2);
    const [Overpulated, setOverpulated] = useState(3);
    useInterval(() => {
        if (Running) {
            console.log("ciao")
            const newMatrix = runSimulationCustom(Lato, Matrix, Underpopulated, Stable, Birth, Overpulated);
            setMatrix(newMatrix)
            // console.log(newMatrix)
        }

    }, 100)
    useEffect(() => {

        const newPosition = generationPosition(Lato)
        const newMatrix = []
        for (let x = 0; x < Lato; x++) {
            newMatrix[x] = []
            for (let y = 0; y < Lato; y++) {
                newMatrix[x][y] = []
                for (let z = 0; z < Lato; z++) {
                    newMatrix[x][y][z] = Math.floor(Math.random() * 10) % 6 == 0;
                }
            }
        }
        console.log("SONO BONACINI", newMatrix)
        setMatrix(newMatrix)
        console.log("SONO POSIZIONEAT" ,newPosition)
        setPositions(newPosition)



    }, [Lato])


    const handleChange = (e) => {
        console.log(e.target.value)
        const [u, s, b, o] = e.target.value.split(",");
        setUnderpopulated(Number(u));
        setStable(Number(s));
        setBirth(Number(b));
        setOverpulated(Number(o));
    }



    const colors = [
        "red", "white", "blue", "yellow", "#324e2a",
        "#1b3644", "#3d0079", "#ffbf6e", "brown", "cyan"
    ];
    if (Lato && Matrix.length > 0)
        return (
            <> <div style={{ position: 'absolute', zIndex: 2 }}>
                    <button onClick={toggleDarkMode}>
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                    <button onClick={toggleCellShadingMode}>
                        {cellShadingMode ? "Disable Cell Shading" : "Enable Cell Shading"}
                    </button>
                    <button onClick={toggleWireframeMode}>
                        {wireframeMode ? "Disable Wireframe" : "Enable Wireframe"}
                    </button>
                    <button onClick={() => { setRunning(!Running) }}>
                        {Running ? "Pause" : "Start"}
                    </button>
                    <button onClick={() => { setLato(Lato + 1) }}>
                        Lato: {Lato}
                    </button>
                    <label>
                        Underpopulate: {Underpopulated}
                        <input 
                            type="range" 
                            min="0" 
                            max="10" 
                            value={Underpopulated} 
                            onChange={(e) => setUnderpopulated(Number(e.target.value))} 
                        />
                    </label>
                    <label>
                        Overpopulated: {Overpulated}
                        <input 
                            type="range" 
                            min="0" 
                            max="10" 
                            value={Overpulated} 
                            onChange={(e) => setOverpulated(Number(e.target.value))} 
                        />
                    </label>
                    <label>
                        Stable: {Stable}
                        <input 
                            type="range" 
                            min="0" 
                            max="10" 
                            value={Stable} 
                            onChange={(e) => setStable(Number(e.target.value))} 
                        />
                    </label>
                    <label>
                        Birth: {Birth}
                        <input 
                            type="range" 
                            min="0" 
                            max="10" 
                            value={Birth} 
                            onChange={(e) => setBirth(Number(e.target.value))} 
                        />
                    </label>
                    <select defaultValue={undefined} onChange={handleChange}>
                        <option value={[]}></option>
                        <option value={[2, 4, 2, 4]}>Rule 1: u2/o4/s2/b4</option>
                        <option value={[1, 1, 1, 1]}>Rule 2: u1/o1/s1/b1</option>
                        <option value={[4, 5, 4, 4]}>Rule 3: u4/o5/s4/b4</option>
                    </select>
                </div>
                <Canvas
                    camera={{ position: [35, 10, 10], near: 0.1, far: 1000 }}
                    style={{ width: "100vw", height: "100vh", zIndex: "1", background: darkMode ? "black" : "white" }}
                >
                    <Suspense fallback={<Loader />}>
                        <directionalLight position={[1, 1, 1]} intensity={darkMode ? 0.5 : 2} />
                        <ambientLight intensity={darkMode ? 0.2 : 0.5} />
                        {darkMode ? null : <spotLight />}
                        {darkMode ? null : <pointLight />}
                        {darkMode ? null : <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />}
                        {Positions.length>0 && Lato && Matrix.length>0 && Positions.flat(1).map((position, index) => (
                            <Cube key={index} position={position} color={colors[index]} darkMode={darkMode} isRendering={currentPoint(Matrix, index, Lato)}                                 cellShadingMode={cellShadingMode} 
                            wireframeMode={wireframeMode} />
                        ))}
                        {/* isRendering={!secondDimension.currentPoint(Matrix, index, lato)} */}
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