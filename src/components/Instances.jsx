import { useEffect, useRef } from "react"
import * as THREE from "three"
import Cube from "../models/Cube";
import { currentPoint } from "../functions/cellarAutomata3D"
function getPosition(index, lato) {
    return [index % lato * 1.5, Math.floor(index / lato) % lato * 1.5, Math.floor(index / (lato * lato)) * 1.5];

}
export function Instances({ lato, temp = new THREE.Object3D(), Matrix }) {
    const instancedMeshRef = useRef()
    useEffect(() => {
        // Set positions
        for (let i = 0; i < lato ** 3; i++) {
            if (currentPoint(Matrix, i, lato)) {
                temp.position.set(...getPosition(i, lato))
                temp.updateMatrix()
            instancedMeshRef.current.setMatrixAt(i, temp.matrix)
            }
        }
        // Update the instance
        instancedMeshRef.current.instanceMatrix.needsUpdate = true
    }, [lato, Matrix])
    return (
        <instancedMesh ref={instancedMeshRef} args={[null, null, lato ** 3]}>
            <boxGeometry />
            <meshPhongMaterial />
        </instancedMesh>
    )
}