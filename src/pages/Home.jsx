import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import Loader from '../components/Loader'

import Cube from '../models/Cube'
import { MeshStandardMaterial } from "three"
const Home = () => {
    const positions = [
        [0, -2.1, 0], [0, 2.1, 0], [0, 0, 0],
        [-2.1, 0, 0], [2.1, 0, 0], [2.1, 2.1, 0],[-2.1,-2.1,0],[-2.1,2.1,0], [2.1,-2.1,0]
    ];
    const colors =[
        "red", "white" , "blue", "yellow", "green", "grey", "black", "pink", "brown"
    ];
    
    return (

        <Canvas
            camera={{
                near: 0.1, far: 1000
            }} style={{ width: "100vw", height: "100vh", zIndex: "1" }}>
            <Suspense fallback={<Loader />}>
                <directionalLight position={[1, 1, 1]} intensity={2} />
                <ambientLight intensity={0.5} />
                <spotLight />
                <pointLight />
                <hemisphereLight skycolor="#b1e1ff" groundColor="#000000" intensity={1} />
                {positions.map((position, index) => {
                    return (
                        <Cube key={index} position={position} color={colors[index]} />
                    )
                })}
            </Suspense>

        </Canvas>
    )
}

export default Home