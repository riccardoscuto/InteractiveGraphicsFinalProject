import React, { useEffect, useState } from 'react';
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Loader from '../components/Loader';
import Cube from '../models/Cube';
import { useInterval } from '../hook/useInterval';
import { currentPoint, generationMatrix, generationPosition, runSimulation, generationRandomMatrix } from '../functions/cellarAutomata';
import Rules from "../config/rules.json";
import { Perf } from 'r3f-perf'
import { GameOfLife } from '../components/GameOfLife';
import { Raytracer } from '@react-three/lgl';
import { Texture } from 'three';
import {
  ChakraProvider,
  Box,
  Button,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Text
} from "@chakra-ui/react";
import { withEmotionCache } from '@emotion/react';

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
        colorMode: "white",
        spawn: [],
    })

    const changeRule = (nameProp, valueProp) => {
        const aux = Rule;
        aux[nameProp] = valueProp;
        setRule({ ...aux })
    }

    const handleChange = (e) => {
        const { birth, lato, overpopulated, spawn, stable, underpopulated, neigh, space, starting } = Rules[e.target.value];
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

    const colors = ["white"];
    useEffect(() => {
        if (wireframeMode) {
            setCubeColors(colors.map(() => "grey"));
        }
    }, [wireframeMode]);

      const innerBoxStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxSize: 'full',
    color: 'white',
    textShadow: '0 0 20px black',
    fontWeight: 'bold',
    fontSize: '20px',
  }
    if (Lato > 0)
        return (
            <ChakraProvider>
                <Box
                    position='absolute'
                    zIndex={2}
                    top={12}
                    right={10}
                    p={4}
                    bg="rgba(0, 0, 0, 0.3)"
                    borderRadius="md"
                    backdropFilter="blur(10px)"
                >
                    <VStack spacing={4} align='start'>
                        <HStack>
                            <Button colorScheme={darkMode ? "red": "blue"} onClick={() => setDarkMode(!darkMode)}>
                                {darkMode ? "Light Mode" : "Dark Mode"}
                                
                            </Button>
                            <Button onClick={() => setCellShadingMode(!cellShadingMode)}>
                                {cellShadingMode ? " Cell Shading" : " Cell Shading"}
                                
                            </Button>
                            <Button colorScheme={wireframeMode ? "red": "blue"} onClick={() => setWireframeMode(!wireframeMode)}>
                                {wireframeMode ? " Wireframe" : " Wireframe"}
                            </Button>
                            <Button colorScheme={Running ? "red": "blue"}  onClick={() => setRunning(!Running)}>
                                {Running ? "Pause" : "Start"}
                            </Button>
                        </HStack>
                        <FormControl>
                            <FormLabel>Matrix Type:</FormLabel>
                            <Select value={Rule.matrixType} onChange={(e) => changeRule("matrixType", e.target.value)}>
                                <option value="fixed">Fixed</option>
                                <option value="random">Random</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Dimension:</FormLabel>
                            <Select value={Rule.space} onChange={(e) => changeRule("space", e.target.value)}>
                                <option value="3D">3D</option>
                                <option value="2D">2D</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Neigh:</FormLabel>
                            <Select value={Rule.neigh} onChange={(e) => changeRule("neigh", e.target.value)}>
                                <option value="M">M</option>
                                <option value="VN">VN</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Size: {Rule.lato}</FormLabel>
                            <Slider
                                min={1}
                                max={30}
                                value={Rule.lato}
                                onChange={(value) => changeRule("lato", value)}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Underpopulate: {Rule.underpopulated}</FormLabel>
                            <Slider
                                min={0}
                                max={10}
                                value={Rule.underpopulated}
                                onChange={(value) => changeRule("underpopulated", value)}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Overpopulated: {Rule.overpopulated}</FormLabel>
                            <Slider
                                min={0}
                                max={10}
                                value={Rule.overpopulated}
                                onChange={(value) => changeRule("overpopulated", value)}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Stable: {Rule.stable}</FormLabel>
                            <Slider
                                min={0}
                                max={10}
                                value={Rule.stable}
                                onChange={(value) => changeRule("stable", value)}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Birth: {Rule.birth}</FormLabel>
                            <Slider
                                min={0}
                                max={10}
                                value={Rule.birth}
                                onChange={(value) => changeRule("birth", value)}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Speed: {speed} ms</FormLabel>
                            <Slider
                                min={0}
                                max={100}
                                value={sliderValue}
                                onChange={(value) => setSliderValue(value)}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Color Mode:</FormLabel>
                            <Select value={Rule.colorMode} onChange={(e) => changeRule("colorMode", e.target.value)}>
                                <option value="random">Random</option>
                                <option value="none">White</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Select Rule:</FormLabel>
                            <Select defaultValue={undefined} onChange={handleChange}>
                                <option value={[]} key={-1}></option>
                                {Rules.map((element, index) => (
                                    <option value={index} key={index}>{element.text}</option>
                                ))}
                            </Select>
                        </FormControl>
                    </VStack>
                </Box>

                <Canvas
                    dpr={dpr}
                    camera={{ position: [35, 10, 10], near: 0.1, far: 1000 }}
                    style={{ width: "100vw", height: "100vh", zIndex: "1", background: darkMode ? "black" : "#bce4e5" }}
                >
                    <Perf position="bottom-left" />
                    <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
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
            </ChakraProvider>
        );
};

export default Home;
