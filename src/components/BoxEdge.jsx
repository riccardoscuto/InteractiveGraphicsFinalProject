import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
//ganzo
const BoxEdge = ({ size,  offset }) => {
    const meshRef = useRef();
    const [lineSegments, setLineSegments] = useState(null);

    // useEffect(() => {
    //     if (size) {
    //         const geo = new THREE.BoxGeometry(size, size, size);
    //         const edges = new THREE.EdgesGeometry(geo);
    //         const material = new THREE.LineBasicMaterial({ color: "red", transparent: true, opacity: 0.2 });
    //         const segments = new THREE.LineSegments(edges, material);
    //         setLineSegments(segments);

    //         // If you want to access the mesh object for manipulations or additions
    //         meshRef.current.add(segments);
    //     }
    // }, [size]);

    return (
        <mesh position={[offset[0]+size / 1.8, offset[1]+size / 2, offset[2]+size /2+ 2.5]}>
            <lineSegments>
                <edgesGeometry   attach={"geometry"} args={[new THREE.BoxGeometry(size * 1.35, size * 1.35, size * 1.35)]}/>
                {/* <boxGeometry attach={"geometry"} args={[size * 1.35, size * 1.35, size * 1.35]} /> */}
                <lineBasicMaterial color={"#708889"}  transparent={true} opacity={0.2} />
            </lineSegments>


        </mesh>
    );
};

export default BoxEdge;
