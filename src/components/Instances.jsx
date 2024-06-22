import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { currentPoint } from "../functions/cellarAutomata3D"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { useLoader } from "@react-three/fiber"
import cubeScene from '../assets/3d/cube.obj';




export function Instances({ lato, temp = new THREE.Object3D(), Matrix, darkMode, wireframeMode, color }) {
    const instancedMeshRef = useRef()
    useEffect(() => {
        for (let i = 0; i < lato ** 3; i++) {
            if (currentPoint(Matrix, i, lato)) {
                temp.position.set(...getPosition(i, lato))
                temp.updateMatrix()
                temp.scale.set(1, 1, 1);
                instancedMeshRef.current.setMatrixAt(i, temp.matrix)
            }
        };
        instancedMeshRef.current.instanceMatrix.needsUpdate = true
    }, [lato, Matrix])
    const originalCube = useLoader(OBJLoader, cubeScene);

    // const geometry = new THREE.Geometry().fromBufferGeometry(originalCube.geometry);
    // geometry.computeFaceNormals()
    // geometry.mergeVertices();
    // geometry.computeVertexNormals();
    // const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry)
    const cube = useMemo(() => {
        const clonedCube = originalCube.clone();
        clonedCube.traverse((child) => {
            if (child.isMesh) {
                child.geometry.computeBoundingBox();
                child.geometry.computeBoundingSphere();
                
            }
        }
        );
        return clonedCube.children[0].geometry;
    }, [originalCube, color, darkMode, wireframeMode]);
    
    const material = new THREE.MeshToonMaterial( { color: color, wireframe:wireframeMode } );
    
console.log("cubando", cube)
        return (
            <instancedMesh ref={instancedMeshRef}  args={[cube, material, lato ** 3]} >
                
                {/* { <boxGeometry /> */}
                {/* <meshToonMaterial
                    wireframe={wireframeMode}
                    color={color}
                    emissive={darkMode ? color : color}
                    emissiveIntensity={darkMode ? 1.5 : 0}
                /> */}


            </instancedMesh>
        )
    }

function getPosition(index, lato) {
    index = index + lato ** 3 * 1;
    return [index % lato * 1.5, Math.floor(index / (lato * lato)) * 1.5, Math.floor(index / lato) % lato * 1.5];
}