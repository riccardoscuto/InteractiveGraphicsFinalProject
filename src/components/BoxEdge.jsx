import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
const BoxEdge = ({ size,  offset }) => {
    const meshRef = useRef();
    const [lineSegments, setLineSegments] = useState(null)
    return (
        <mesh position={[offset[0]+size / 1.8, offset[1]+size / 2, offset[2]+size /2+ 2.5]}>
            <lineSegments>
                <edgesGeometry   attach={"geometry"} args={[new THREE.BoxGeometry(size * 1.35, size * 1.35, size * 1.35)]}/>
                {/* <boxGeometry attach={"geometry"} args={[size * 1.35, size * 1.35, size * 1.35]} /> */}
                <lineBasicMaterial color={"#708889"}  transparent={true} opacity={1} />
            </lineSegments>
        </mesh>
    );
};

export default BoxEdge;
