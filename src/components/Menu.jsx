import React from 'react'
import {
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
    Stack,  
    grid,
  } from "@chakra-ui/react";

function Menu({Running, changeRule, darkMode, wireframeMode, Rules, Grid, handleChange, Rule, speed, sliderValue, setSliderValue, setRunning, setGrid, setWireframeMode, setDarkMode}) {
  return (
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
              <Button colorScheme={Rule.alwaysAlive ? "orange" : "teal"} onClick={() => changeRule("alwaysAlive",!Rule.alwaysAlive)}>
                {Rule.alwaysAlive ? "Always Alive" : "Always Alive"}
              </Button>
              <Stack spacing={5} direction='row'>
              </Stack>
            </HStack>
            <FormControl>
              <FormLabel>Select Rule:</FormLabel>
              <Select defaultValue={undefined} onChange={handleChange} onClick={()=>{setRunning(false)}}>
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
                max={90}
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
                max={Rule.neigh == "M" ? 26 :6}
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
                max={Rule.neigh == "M" ? 26 :6}
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
  )
}

export default Menu