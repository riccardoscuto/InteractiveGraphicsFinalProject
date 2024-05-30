import React, { useEffect, useState } from 'react';
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Loader from '../components/Loader';
import Cube from '../models/Cube';
// import * as sd from '../functions/cellarAutomata2D';
import { useInterval } from '../hook/useInterval';
import { currentPoint, generationMatrix, generationPosition, runSimulation, generationRandomMatrix } from '../functions/cellarAutomata';
// import * as td  from "../functions/cellarAutomata3D"
import Rules from "../config/rules.json";
import { Perf } from 'r3f-perf'


// const lato = 20;
// const rendered = generationMatrix(lato);

const Home = () => {
    const [dpr, setDpr] = useState(0.5)
    const [darkMode, setDarkMode] = useState(false);
    const [cellShadingMode, setCellShadingMode] = useState(false);
    const [wireframeMode, setWireframeMode] = useState(false);
    const [matrixType, setMatrixType] = useState("fixed");
    const [Space, setSpace] = useState("3D");
    const [Lato, setLato] = useState(4);
    const [Positions, setPositions] = useState(generationPosition(Space, Lato));
    const [Matrix, setMatrix] = useState(generationMatrix(Space, Lato));
    const [Running, setRunning] = useState(false);
    const [Birth, setBirth] = useState(3);
    const [Underpopulated, setUnderpopulated] = useState(2);
    const [Stable, setStable] = useState(2);
    const [Overpopulated, setOverpopulated] = useState(3);
    const [sliderValue, setSliderValue] = useState(50);
    const [colorMode, setColorMode] = useState("random");
    const [cubeColors, setCubeColors] = useState()
    const [Neigh, setNeigh] = useState("M");
    const speed = 2000 - (sliderValue * 19);

    useInterval(() => {
        if (Running) {
            console.log("ciao");
            const newMatrix = runSimulation(Space, Lato, Matrix, {
                underpopulated: Underpopulated, stable: Stable, birth: Birth,
                overpopulated: Overpopulated, neigh: Neigh
            });
            setMatrix(newMatrix);
        }
    }, speed);

    useEffect(() => {
        const newPosition = generationPosition(Space, Lato);
        const newMatrix = matrixType === "fixed" ? generationMatrix(Space, Lato) : generationRandomMatrix(Space, Lato);
        translateM(Matrix, newMatrix);
        setMatrix(newMatrix);
        setPositions(newPosition);
    }, [Lato, matrixType]);

    const translateM = (old, newM) => {
        const l = old.length < newM.length ? old.length : newM.length;
        if (Space === "3D") {

            for (let x = 0; x < l; x++) {
                for (let y = 0; y < l; y++) {
                    for (let z = 0; z < l; z++) {
                        newM[x][y][z] = old[x][y][z];
                    }
                }
            }
        } else {
            for (let x = 0; x < l; x++) {
                for (let y = 0; y < l; y++) {
                    newM[x][y] = old[x][y];
                }
            }
        }
    }

    const handleChange = (e) => {
        // console.log(e.target.value);

        const { birth, lato, overpopulated, spawn, stable, underpopulated, neigh, space ,starting} = Rules[e.target.value];
        setLato(lato);
        setUnderpopulated(underpopulated);
        setStable(stable);
        setBirth(birth);
        setOverpopulated(overpopulated);
        setSpace(space);
        setNeigh(neigh);
        setMatrixType(starting);
        let newMatrix ;
        let newPositions = generationPosition(space, lato);
        console.log("pso", newPositions)
        setPositions(newPositions)
        if(starting =="fixed"){
            newMatrix = generationMatrix(space, lato);

            if (space === "3D") {
                for (let [x, y, z] of spawn) {
                    
                    newMatrix[x][y][z] = true;
                }
            }
            if (space === "2D") {
                for (let [x, y] of spawn) {
                    
                    newMatrix[x][y] = true;
                }
            }
        }else{
            newMatrix =generationRandomMatrix(space, lato);
        }
        setMatrix(newMatrix);
    }

    const generateRandomColor = () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        return randomColor;
    };

    const getColor = (index) => {
        if (colorMode === "random" && (!wireframeMode || (cubeColors && cubeColors.length > 0))) {
            return generateRandomColor();
        } else if (darkMode && wireframeMode && cubeColors && cubeColors.length > 0) {
            return cubeColors[index];
        } else {
            return "red";
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
                            Dimension:
                            <select value={Space} onChange={(e) => setSpace(e.target.value)}>
                                <option value="3D">3D</option>
                                <option value="2D">2D</option>
                            </select>

                        </label>
                        <label>
                            Neigh:
                            <select value={Neigh} onChange={(e) => setNeigh(e.target.value)}>
                                <option value="M">M</option>
                                <option value="VN">VN</option>
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
                
                 dpr={dpr}
                    camera={{ position: [35, 10, 10], near: 0.1, far: 1000 }}
                    style={{ width: "100vw", height: "100vh", zIndex: "1", background: darkMode ? "black" : "white" }}
                >      <Perf position="bottom-left" />

                    <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} ></PerformanceMonitor>
                    <Suspense fallback={<Loader />}>
                        {/* <directionalLight position={[1, 1, 1]} intensity={darkMode ? 0.5 : 2} /> */}
                        {/* <ambientLight intensity={darkMode ? 0.2 : 0.5} /> */}
                        {darkMode ? null : <spotLight />}
                        {darkMode ? null : <pointLight />}
                        {darkMode ? null : <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />}
                        {Positions.length > 0 && Lato && Matrix.length > 0 && Space == "3D" && Positions.flat(1).map((position, index) => (
                            <Cube key={index}
                                position={position}
                                color={getColor(index)}
                                darkMode={darkMode}
                                isRendering={currentPoint(Space, Matrix, Lato, index)}
                                cellShadingMode={cellShadingMode}
                                wireframeMode={wireframeMode} />
                        ))}


                        {Positions.length > 0 && Lato && Matrix.length > 0 && Space == "2D" && Positions.map((position, index) => (
                            <Cube key={index}
                                position={position}
                                color={getColor(index)}
                                darkMode={darkMode}
                                isRendering={currentPoint(Space, Matrix, Lato, index)}
                                cellShadingMode={cellShadingMode}
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
