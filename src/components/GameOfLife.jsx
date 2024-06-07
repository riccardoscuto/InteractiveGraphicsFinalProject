import React, { useEffect, useState } from 'react';

import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Cube from '../models/Cube';
// import * as sd from '../functions/cellarAutomata2D';
import { useInterval } from '../hook/useInterval';
import { currentPoint, generationMatrix, generationPosition, runSimulation, generationRandomMatrix } from '../functions/cellarAutomata';
import { useFrame } from '@react-three/fiber';
import { Instances } from './Instances';
// import * as td  from "../functions/cellarAutomata3D"


export const GameOfLife = ({ darkMode, wireframeMode, cellShadingMode, speed, Running, Rule }) => {
    // const [Positions, setPositions] = useState(generationPosition(Rule.space, Rule.lato));
    const [Matrix, setMatrix] = useState(generationMatrix(Rule.space, Rule.lato));
    const [result, setResult] = useState(Matrix);
    const [worker, setWorker] = useState(null);
    let lastIndex = null;
    useEffect(() => {
        let newMatrix;
        // let newPositions = generationPosition(Rule.space, Rule.lato);
        // console.log("pso", newPositions)
        // setPositions(newPositions)
        if (Rule.matrixType == "fixed") {
            newMatrix = generationMatrix(Rule.space, Rule.lato);
            if (lastIndex == Rule.index) {
                translateM(Matrix, newMatrix);
            }
            if (Rule.space === "3D") {
                for (let [x, y, z] of Rule.spawn) {

                    newMatrix[x][y][z] = true;
                }
            }
            if (Rule.space === "2D") {
                for (let [x, y] of Rule.spawn) {

                    newMatrix[x][y] = true;
                }
            }
            lastIndex = Rule.index;
        } else {
            newMatrix = generationRandomMatrix(Rule.space, Rule.lato);
        }
        setMatrix(newMatrix);
    }, [Rule])
    useEffect(() => {
        // Create a new web worker
        const myWorker = new Worker('./worker.js');

        // Set up event listener for messages from the worker
        myWorker.onmessage = function (event) {
            console.log('Received result from worker:', event.data);
            const {result, x, y, z} = event.data;
            setResult( (aux)=>{
                aux[x] [y] [z] = result
                return [...aux]

            })
        };

        // Save the worker instance to state
        setWorker(myWorker);

        // Clean up the worker when the component unmounts
        return () => {
            myWorker.terminate();
        };
    }, []); // Run this effect only once when the component mounts

    let lastFrame = Date.now();
    useFrame(() => {
        if (Running && Date.now() - lastFrame > speed) {
            console.log("ciao");
            // const newMatrix = runSimulation(Rule.space, Rule.lato, Matrix, Rule);
            // setMatrix(newMatrix);
            // const { underpopulated, stable, birth, overpopulated, neigh } = customRule;
            let lato= Rule.lato;
            let newMatrix = []
            for (let x = 0; x < lato; x++) {
                newMatrix[x] = [];
                for (let y = 0; y < lato; y++) {
                    newMatrix[x][y] = [];
                    for (let z = 0; z < lato; z++) {
                        //   return simulationCustomRule();
                          worker.postMessage({x, y, z, Matrix, lato, Rule});
                        // newMatrix[x][y][z] = simulationCustomRule(x, y, z, Matrix, lato, customRule);
                    }
                }
            }





            lastFrame = Date.now();
        }
    });

    // useEffect(() => {
    //     const newPosition = generationPosition(Space, Lato);
    //     const newMatrix = matrixType === "fixed" ? generationMatrix(Space, Lato) : generationRandomMatrix(Space, Lato);
    //     translateM(Matrix, newMatrix);
    //     setMatrix(newMatrix);
    //     setPositions(newPosition);
    // }, [Lato, matrixType]);

    const translateM = (old, newM) => {
        const l = old.length < newM.length ? old.length : newM.length;
        if (Rule.space === "3D") {

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
    const generateRandomColor = () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        return randomColor;
    };

    const getColor = (index) => {
        if (Rule.colorMode === "random" && (!wireframeMode || (cubeColors && cubeColors.length > 0))) {
            return generateRandomColor();
        } else if (darkMode && wireframeMode && cubeColors && cubeColors.length > 0) {
            return cubeColors[index];
        } else {
            return "red";
        }
    };

    return (
        <>
            {/* <directionalLight position={[1, 1, 1]} intensity={darkMode ? 0.5 : 2} /> */}
            {/* <ambientLight intensity={darkMode ? 0.2 : 0.5} /> */}
            {darkMode ? null : <spotLight />}
            {darkMode ? null : <pointLight />}
            {darkMode ? null : <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />}
            {/* {Positions.length > 0 && Rule.lato && Matrix.length > 0 && Rule.space == "3D"
                && Positions.flat(1).map((position, index) => (
                    <Cube key={index}
                        position={position}
                        color={getColor(index)}
                        darkMode={darkMode}
                        isRendering={currentPoint(Rule.space, Matrix, Rule.lato, index)}
                        cellShadingMode={cellShadingMode}
                        wireframeMode={wireframeMode} />
                ))}


            {Positions.length > 0 && Rule.lato && Matrix.length > 0 && Rule.space == "2D"
                && Positions.map((position, index) => (
                    <Cube key={index}
                        position={position}
                        color={getColor(index)}
                        darkMode={darkMode}
                        isRendering={currentPoint(Rule.space, Matrix, Rule.lato, index)}
                        cellShadingMode={cellShadingMode}
                        wireframeMode={wireframeMode} />
                ))} */}
            <Instances lato={Rule.lato} Matrix={Matrix} />
            <OrbitControls />
            <EffectComposer>
                <Bloom
                    luminanceThreshold={0}
                    luminanceSmoothing={0.5}
                    height={300}
                    intensity={darkMode ? 2 : 0}
                />
            </EffectComposer>
        </>
    )
}