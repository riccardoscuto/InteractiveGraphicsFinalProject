import React, { useEffect, useState } from 'react';

import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Cube from '../models/Cube';
import { currentPoint, generationMatrix, generationPosition, runSimulation, generationRandomMatrix } from '../functions/cellarAutomata';
import { useFrame } from '@react-three/fiber';
import { Instances } from './Instances';
import BoxEdge from './BoxEdge';
export const GameOfLife = ({ darkMode, wireframeMode, cellShadingMode, setSlideAnim, speed, Running, Rule, Grid, Color, slideAnim }) => {
    const [Positions, setPositions] = useState(generationPosition(Rule.space, Rule.lato));
    const [Matrix, setMatrix] = useState(generationMatrix(Rule.space, Rule.lato));
    const [Animation, setAnimation] = useState([]);
    // const [animIndex, setAnimIndex] = useState(0);
    let animation = [];
    let lastIndex = null;
    useEffect(() => {
        let newMatrix;
        let newPositions = generationPosition(Rule.space, Rule.lato);
        setPositions(newPositions)
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
        animation = [];
        setSlideAnim(1);
        animation[0] = newMatrix;
        setAnimation(animation);
        setMatrix(newMatrix);
    }, [Rule])
    useEffect(() => {
       
            if (Animation[slideAnim])
                setMatrix(Animation[slideAnim])
            console.log("slider", slideAnim)
            console.log("anima222", Animation[slideAnim])
        
    }, [slideAnim])

    let lastFrame = Date.now();
    useFrame(() => {
        if (Running && Date.now() - lastFrame > speed) {
            setSlideAnim(prex =>{
                const newMatrix = runSimulation(Rule.space, Rule.lato, Matrix, Rule);
                setMatrix(newMatrix);
                let animation = Animation;
                animation[prex] = newMatrix;
                lastFrame = Date.now();
                setAnimation([...animation])
                return ((prex +  1) % 100)
            })
        }
    });

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
    return (
        <>
            {<directionalLight position={[1, 1, 1]} intensity={darkMode ? 0.5 : 2} />}
            {<ambientLight intensity={darkMode ? 0.2 : 0.5} />}
            {Positions && Positions.length > 0 && Rule.lato && Rule.lato <= 20 && Matrix.length > 0 && Rule.space == "3D"
                && <>
                    {Grid && <BoxEdge offset={[-1.1, 0, -0.7]}
                        size={(Rule.lato * 1.8) + 0.25 * (Rule.lato + 1)}
                        position={[4, 4, 6.2]} />
                    }
                    {Positions.flat(1).map((position, index) => (
                        <Cube key={index}
                            position={position}
                            color={Color}
                            darkMode={darkMode}
                            isRendering={currentPoint(Rule.space, Matrix, Rule.lato, index)}
                            cellShadingMode={cellShadingMode}
                            wireframeMode={wireframeMode} />
                    ))}
                </>
            }
            {Positions && Positions.length > 0 && Rule.lato && Matrix.length > 0 && Rule.space == "2D"
                && Positions.map((position, index) => (
                    <Cube key={index}
                        position={position}
                        color={Color}
                        darkMode={darkMode}
                        isRendering={currentPoint(Rule.space, Matrix, Rule.lato, index)}
                        cellShadingMode={cellShadingMode}
                        wireframeMode={wireframeMode} />
                ))}
            {Rule.space == "3D" && Rule.lato > 20 &&
                <>
                    {Grid && <BoxEdge size={(Rule.lato * 1) + 0.25 * (Rule.lato + 1)}
                        offset={[0, Rule.lato * 1.5, -1]} />}
                    <Instances lato={Rule.lato} Matrix={Matrix} darkMode={darkMode} wireframeMode={wireframeMode} color={Color} />
                </>}
            <OrbitControls />
            <EffectComposer>
                <Bloom
                    luminanceThreshold={0}
                    luminanceSmoothing={0.5}
                    height={300}
                    intensity={darkMode ? 1 : 0}
                />
            </EffectComposer>

        </>
    )
}