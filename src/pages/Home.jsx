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
import { GameOfLife } from '../components/GameOfLife';



// const lato = 20;
// const rendered = generationMatrix(lato);

const Home = () => {
    const [dpr, setDpr] = useState(0.5)
    const [cubeColors, setCubeColors] = useState()
    const [darkMode, setDarkMode] = useState(false);
    const [cellShadingMode, setCellShadingMode] = useState(false);
    const [wireframeMode, setWireframeMode] = useState(false);
    const [Running, setRunning] = useState(false);
    const [sliderValue, setSliderValue] = useState(50);
    const speed = 2000 - (sliderValue * 19);
    const [matrixType, setMatrixType] = useState("fixed");
    const [Space, setSpace] = useState("3D");
    const [Spawn, setSpawn] = useState([])
    const [Birth, setBirth] = useState(3);
    const [Underpopulated, setUnderpopulated] = useState(2);
    const [Stable, setStable] = useState(2);
    const [Overpopulated, setOverpopulated] = useState(3);
    const [Neigh, setNeigh] = useState("M");
    const [Lato, setLato] = useState(4);
    const [colorMode, setColorMode] = useState("random");
    const [Rule, setRule] = useState({
        lato: 4,
        matrixType: "fixed",
        space: "3D",
        birth: 3,
        underpopulated: 2,
        stable: 2,
        overpopulated: 3,
        neigh: "M",
        colorMode: "random",
        spawn: [],
    })

    const changeRule = (nameProp, valueProp) => {
        const aux = Rule;
        aux[nameProp] = valueProp;
        setRule({ ...aux })
    }


    const handleChange = (e) => {
        // console.log(e.target.value);

        const { birth, lato, overpopulated, spawn, stable, underpopulated, neigh, space, starting } = Rules[e.target.value];
        // setLato(lato);
        // setUnderpopulated(underpopulated);
        // setStable(stable);
        // setBirth(birth);
        // setOverpopulated(overpopulated);
        // setSpace(space);
        // setNeigh(neigh);
        // setMatrixType(starting);
        // setSpawn(spawn);
        setRule({
            birth,
            colorMode: Rule.colorMode,
            lato,
            matrixType: starting,
            neigh,
            overpopulated,
            space,
            spawn,
            stable,
            underpopulated, 
            index:e.target.value
        })
    }


    const colors = [
        "red", "white", "blue", "yellow", "#324e2a",
        "#1b3644", "#3d0079", "#ffbf6e", "brown", "cyan",
    ];
    useEffect(() => {
        if (wireframeMode) {
            setCubeColors(colors.map(() => generateRandomColor()));
        }
    }, [wireframeMode]);

    if (Lato > 0)
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
                            <select value={Rule.matrixType} onChange={(e) => changeRule("matrixType", e.target.value)}>
                                <option value="fixed">Fixed</option>
                                <option value="random">Random</option>
                            </select>

                        </label>
                        <label>
                            Dimension:
                            <select value={Rule.space} onChange={(e) => changeRule("space", e.target.value)}>
                                <option value="3D">3D</option>
                                <option value="2D">2D</option>
                            </select>

                        </label>
                        <label>
                            Neigh:
                            <select value={Rule.neigh} onChange={(e) => changeRule("neigh", e.target.value)}>
                                <option value="M">M</option>
                                <option value="VN">VN</option>
                            </select>

                        </label>
                        <label>
                            Lato: {Rule.lato}
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={Rule.lato}
                                onChange={(e) => changeRule("lato", Number(e.target.value))}
                            />
                        </label>
                        <label>
                            Underpopulate: {Rule.underpopulated}
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={Rule.underpopulated}
                                onChange={(e) => changeRule("underpopulated", Number(e.target.value))}
                            />
                        </label>
                        <label>
                            Overpopulated: {Rule.overpopulated}
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={Rule.overpopulated}
                                onChange={(e) => changeRule("overpopulated", Number(e.target.value))}
                            />
                        </label>
                        <label>
                            Stable: {Rule.stable}
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={Rule.stable}
                                onChange={(e) => changeRule("stable", Number(e.target.value))}
                            />
                        </label>
                        <label>
                            Birth: {Rule.birth}
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={Rule.birth}
                                onChange={(e) => changeRule("birth", Number(e.target.value))}
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
                            <select value={Rule.colorMode} onChange={(e) => changeRule("colorMode", e.target.value)}>
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
                        <GameOfLife
                        Rule={Rule}
                            Lato={Lato}
                            Space={Space}
                            cellShadingMode={cellShadingMode}
                            darkMode={darkMode}
                            wireframeMode={wireframeMode}
                            colorMode={colorMode}
                            Running={Running}
                            matrixType={matrixType}
                            Neigh={Neigh}
                            Underpopulated={Underpopulated}
                            Overpopulated={Overpopulated}
                            Stable={Stable}
                            Birth={Birth}
                            speed={speed}
                            Spawn={Spawn}
                        />

                    </Suspense>
                </Canvas>
            </>
        );
};

export default Home;