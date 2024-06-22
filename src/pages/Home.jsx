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
import { EffectComposer, Glitch, Pixelation } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import Menu from '../components/Menu';

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
  const [slideAnim, setSlideAnim] = useState(50);
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
        <Menu Running={Running} changeRule={changeRule} darkMode={darkMode} wireframeMode={wireframeMode} Rules={Rules} Rule={Rule} Grid={Grid} handleChange={handleChange}
          speed={speed} sliderValue={sliderValue} setSliderValue={setSliderValue} setDarkMode={setDarkMode} setWireframeMode={setWireframeMode} setGrid={setGrid} setRunning={setRunning} />
        <Box position="absolute" top="15" left="5" zIndex={10}>
          <ColorPicker colors={palette} color={Color} setColor={setColor} />

        </Box>
        <Box w="35%" top={1000}  left={600} align = "center" justify =" center" alignItems={"center"} position={"absolute"} zIndex={10}>

          <Slider
            min={1}
            max={100}
            value={slideAnim}
            onChange={(value) => { setSlideAnim(value); setRunning(false) }}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Canvas
          dpr={dpr}
          camera={{ position: [35, 10, 10], near: 0.1, far: 1000 }}
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
              slideAnim={slideAnim}
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
          </Suspense>
        </Canvas>
      </ChakraProvider>
    );
};

export default Home;
