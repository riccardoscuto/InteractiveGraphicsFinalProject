import React, { useEffect, useState } from 'react';
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Loader from '../components/Loader';
import Cube from '../models/Cube';
import * as secondDimension from '../functions/cellarAutomata2D';
import { useInterval } from '../hook/useInterval';
import { currentPoint, generationMatrix, generationPosition, runSimulation, runSimulationCustom, generationRandomMatrix } from '../functions/cellarAutomata3D';
import Rules from "../config/rules.json";

const lato = 20;
const rendered = generationMatrix(lato);

const Home = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [cellShadingMode, setCellShadingMode] = useState(false);
    const [wireframeMode, setWireframeMode] = useState(false);
    const [matrixType, setMatrixType] = useState("fixed"); 
    const [Lato, setLato] = useState(4);
    const [Positions, setPositions] = useState(generationPosition(Lato));
    const [Matrix, setMatrix] = useState(generationMatrix(Lato));
    const [Running, setRunning] = useState(false);
    const [Birth, setBirth] = useState(3);
    const [Underpopulated, setUnderpopulated] = useState(2);
    const [Stable, setStable] = useState(2);
    const [Overpopulated, setOverpopulated] = useState(3);  
    const [sliderValue, setSliderValue] = useState(50); 
    const [colorMode, setColorMode] = useState("random"); 
    const [cubeColors, setCubeColors] = useState()

    const speed = 2000 - (sliderValue * 19);
    useInterval(() => {
        if (Running) {
            console.log("ciao");
            const newMatrix = runSimulationCustom(Lato, Matrix, Underpopulated, Stable, Birth, Overpopulated);
            setMatrix(newMatrix);
        }
    }, speed);

    useEffect(() => {
        const newPosition = generationPosition(Lato);
        const newMatrix = matrixType === "fixed" ? generateFixedMatrix(Lato) : generationRandomMatrix(Lato);
        translateM(Matrix, newMatrix);
        setMatrix(newMatrix);
        setPositions(newPosition);
    }, [Lato, matrixType]);

    const translateM = (old, newM) => {
        const l = old.length < newM.length ? old.length : newM.length;
        for (let x = 0; x < l; x++) {
            for (let y = 0; y < l; y++) {
                for (let z = 0; z < l; z++) {
                    newM[x][y][z] = old[x][y][z];
                }
            }
        }
    }

    const handleChange = (e) => {
        console.log(e.target.value);
        const { birth, lato, overpopulated, spawn, stable, underpopulated } = Rules[e.target.value];
        setLato(lato);
        setUnderpopulated(Number(underpopulated));
        setStable(Number(stable));
        setBirth(Number(birth));
        setOverpopulated(Number(overpopulated));
        let newMatrix = generateFixedMatrix(lato);
        for (let [x, y, z] of spawn) {
            newMatrix[x][y][z] = true;
        }
        setMatrix(newMatrix);
    }

    const generateFixedMatrix = (lato) => {
        const newMatrix = [];
        for (let x = 0; x < lato; x++) {
            newMatrix[x] = [];
            for (let y = 0; y < lato; y++) {
                newMatrix[x][y] = [];
                for (let z = 0; z < lato; z++) {
                    newMatrix[x][y][z] = false;
                }
            }
        }
        return newMatrix;
    }
    const generateRandomColor = () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        return randomColor;
    };
    
    const getColor = (index) => {
        if (colorMode === "random" && (!wireframeMode || (cubeColors && cubeColors.length > 0))) {
            return generateRandomColor();
        } else if (wireframeMode && cubeColors && cubeColors.length > 0) {
            return cubeColors[index];
        } else {
            return "white";
        }
    };
    
    const colors = [
        "red", "white", "blue", "yellow", "#324e2a",
        "#1b3644", "#3d0079", "#ffbf6e", "brown", "cyan",
    ];
    useEffect(() => {
        if (wireframeMode) {
            setCubeColors(colors.map(() => generateRandomColor()));
        }
    }, [wireframeMode]);
    
    if (Lato && Matrix.length > 0)
        return (
            <>
               <div style={{ position: 'absolute', zIndex: 2, top: 20, left: 20 }}>
    <div style={{ marginBottom: 10 }}>
        <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={() => setCellShadingMode(!cellShadingMode)}>
            {cellShadingMode ? "Disable Cell Shading" : "Enable Cell Shading"}
        </button>
        <button onClick={() => setWireframeMode(!wireframeMode)}>
            {wireframeMode ? "Disable Wireframe" : "Enable Wireframe"}
        </button>
        <button onClick={() => { setRunning(!Running) }}>
            {Running ? "Pause" : "Start"}
        </button>
    </div>
    <div style={{ marginBottom: 10 }}>
        <label>
            Matrix Type:
            <select value={matrixType} onChange={(e) => setMatrixType(e.target.value)}>
                <option value="fixed">Fixed</option>
                <option value="random">Random</option>
            </select>
        </label>
        <label>
            Lato: {Lato}
            <input
                type="range"
                min="1"
                max="30"
                value={Lato}
                onChange={(e) => setLato(Number(e.target.value))}
            />
        </label>
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
            Overpopulated: {Overpopulated}
            <input
                type="range"
                min="0"
                max="10"
                value={Overpopulated}
                onChange={(e) => setOverpopulated(Number(e.target.value))}
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
        <label>
            Speed: {speed} ms
            <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
            />
        </label>
        <label>
            Color Mode:
            <select value={colorMode} onChange={(e) => setColorMode(e.target.value)}>
                <option value="random">Random</option>
                <option value="none">White</option>
            </select>
        </label>
    </div>
    <div>
        Select Rule:
        <select defaultValue={undefined} onChange={handleChange}>
            <option value={[]} key={-1}></option>
            {Rules.map((element, index) => {
                return <option value={index} key={index} >{element.text}</option>
            })}
        </select>
    </div>
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
                        {Positions.length > 0 && Lato && Matrix.length > 0 && Positions.flat(1).map((position, index) => (
                            <Cube key={index} position={position} color={getColor(index)} darkMode={darkMode} isRendering={currentPoint(Matrix, index, Lato)} cellShadingMode={cellShadingMode}
                                wireframeMode={wireframeMode} />
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
