import React, { useEffect, useState } from 'react';
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, PerformanceMonitor } from "@react-three/drei";
import Loader from '../components/Loader';
import Rules from "../config/rules.json";
import { Perf } from 'r3f-perf'
import { GameOfLife } from '../components/GameOfLife';
import {
  ChakraProvider,
  Box,
  Button,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  extendTheme,
  Stack,
  grid,
} from "@chakra-ui/react";
import ColorPicker from '../components/ColorPicker';
import { DotScreen, EffectComposer, Glitch, Pixelation } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';

const theme = extendTheme({
  styles: {
    global: {
      "option": {
        color: "black",
        backgroundColor: "white",
      },
    },
  },
});

const Home = () => {
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [dpr, setDpr] = useState(0.5)
  const [cubeColors, setCubeColors] = useState()
  const [darkMode, setDarkMode] = useState(false);
  const [cellShadingMode, setCellShadingMode] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [Running, setRunning] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const speed = 2000 - (sliderValue * 19);
  const [matrixType, setMatrixType] = useState("random");
  const [Space, setSpace] = useState("3D");
  const [Spawn, setSpawn] = useState([])
  const [Birth, setBirth] = useState(3);
  const [Underpopulated, setUnderpopulated] = useState(2);
  const [Stable, setStable] = useState(2);
  const [Overpopulated, setOverpopulated] = useState(3);
  const [Neigh, setNeigh] = useState("M");
  const [Lato, setLato] = useState(4);
  const [colorMode, setColorMode] = useState("red");
  const palette = [
    "#c55347",
    "#a62c37",
    "#819238",
    "#12354e",
    "#34454c"
  ]
  const [Color, setColor] = useState(palette[0]);
  const [Rule, setRule] = useState({
    lato: 4,
    matrixType: "random",
    space: "3D",
    birth: 3,
    underpopulated: 2,
    stable: 2,
    overpopulated: 3,
    neigh: "M",
    colorMode: "red",
    spawn: [],
  })
  const [Grid, setGrid] = useState(true
  )

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
      index: e.target.value
    })
  }
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <ChakraProvider theme={theme}>
        <Box
          style={{width:"30vw", maxHeight:"90vh", overflowY:"auto", color:"white"}}
          position='absolute'
          zIndex={2}
          top={12}
          right={10}
          p={4}
          bg="rgba(0, 0, 0, 0.4)"
          borderRadius="md"
          backdropFilter="blur(10px)"
        >
          <VStack spacing={4} align='start'>
            <HStack>
              <Button colorScheme={Running ? "orange" : "teal"} onClick={() => setRunning(!Running)}>
                {Running ? "Pause" : "Start"}
              </Button>
              <Button colorScheme={darkMode ? "orange" : "teal"} onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "Light Mode" : "Dark Mode"}
              </Button>
              <Button colorScheme={wireframeMode ? "orange" : "teal"} onClick={() => setWireframeMode(!wireframeMode)}>
                {wireframeMode ? " Wireframe" : " Wireframe"}
              </Button>
              <Button colorScheme={Grid ? "orange" : "teal"} onClick={() => setGrid(!Grid)}>
                {grid ? " Grid" : " Grid"}
              </Button>
              <Stack spacing={5} direction='row'>
              </Stack>
            </HStack>
            <FormControl>
              <FormLabel>Select Rule:</FormLabel>
              <Select defaultValue={undefined} onChange={handleChange}>
                <option value={[]} key={-1}></option>
                {Rules.map((element, index) => (
                  <option value={index} key={index}>{element.text}</option>
                ))}
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
              <FormLabel>Neighborhood :</FormLabel>
              <Select value={Rule.neigh} onChange={(e) => changeRule("neigh", e.target.value)}>
                <option value="M">Moore</option>
                <option value="VN">Von Neumann</option>
              </Select>
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
              <FormLabel>Size: {Rule.lato}</FormLabel>
              <Slider
                min={1}
                max={60}
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
              <FormLabel>Underpopulated: {Rule.underpopulated}</FormLabel>
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
          
          </VStack>
        </Box>
        <Box position="absolute" top="15" left="5" zIndex={10}>
          <ColorPicker colors={palette} color={Color} setColor={setColor} />
        </Box>
        <Canvas
          dpr={dpr}
          camera={{ position: [100, 80, 10], near: 0.1, far: 1000 }}
          style={{ width: "100vw", height: "100vh", zIndex: "1" }}
        >
          <color attach={"background"} args={[darkMode ? "black" : "#bce4e5"]} />
          <Perf position="bottom-left" />
          <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
          <Suspense fallback={<Loader />}>
            <GameOfLife
              Grid={Grid}
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
              Color={Color}
            />
            {/* <EffectComposer>
          <Pixelation granularity={5} />
        </EffectComposer> */}
        {/* <EffectComposer>
          <Glitch  delay={[1.5, 3.5]} // min and max glitch delay
    duration={[0.6, 1.0]} // min and max glitch duration
    strength={[0.3, 1.0]} // min and max glitch strength
    mode={GlitchMode.SPORADIC} // glitch mode
    active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
    ratio={0.85} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
    />
        </EffectComposer> */}
         {/* <EffectComposer>
          <DotScreen
            blendFunction={BlendFunction.NORMAL} // blend mode
            angle={Math.PI * 0.5} // angle of the dot pattern
            scale={1.0} // scale of the dot pattern
          />
        </EffectComposer> */}
        
          </Suspense>
        </Canvas>
      </ChakraProvider>
    );
};

export default Home;
