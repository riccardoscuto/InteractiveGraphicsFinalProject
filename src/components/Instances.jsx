import { useEffect, useRef } from "react"
import * as THREE from "three"
import Cube from "../models/Cube";
import { currentPoint } from "../functions/cellarAutomata3D"


export function Instances({ lato, temp = new THREE.Object3D(), Matrix, darkMode }) {
    const instancedMeshRef = useRef()
    useEffect(() => {
        // Set positions
        for (let i = 0; i < lato ** 3; i++) {
            // if(false){   
            if (currentPoint(Matrix, i, lato)) {
                temp.position.set(...getPosition(i, lato))
                temp.updateMatrix()
                temp.scale.set(1, 1, 1);
                instancedMeshRef.current.setMatrixAt(i, temp.matrix)
            }
        }
        // Update the instance
        //  instancedMeshRef.current.position.set([1,1,1]);

        instancedMeshRef.current.instanceMatrix.needsUpdate = true
    }, [lato, Matrix])
    return (
        <instancedMesh ref={instancedMeshRef} args={[null, null, lato ** 3]}>
            <boxGeometry />
              {darkMode ? <meshBasicMaterial color={"white"}/>: <meshPhongMaterial />}
        </instancedMesh>
    )
}


function getPosition(index, lato) {
    index = index + lato ** 3 * 1;
    return [index % lato * 1.5, Math.floor(index / (lato * lato)) * 1.5, Math.floor(index / lato) % lato * 1.5];

}