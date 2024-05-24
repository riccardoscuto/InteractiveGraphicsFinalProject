import { useLoader } from '@react-three/fiber';
import React from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import cubeScene from '../assets/3d/cube.obj';

const Cube = (props) => {
 
    const originalCube = useLoader(OBJLoader, cubeScene);
    return (
        <>
            <mesh position={props.position}  >
                <meshStandardMaterial color={props.color}/>
                <boxGeometry args={[2,2,2]}/>
            </mesh>
        </>
    );
};

export default Cube;
