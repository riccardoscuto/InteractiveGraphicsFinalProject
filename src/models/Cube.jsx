import { useLoader } from '@react-three/fiber';
import React, { useMemo } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MeshStandardMaterial, MeshBasicMaterial, WireframeGeometry, LineSegments, LineBasicMaterial } from 'three';
import cubeScene from '../assets/3d/cube.obj';

const Cube = (props) => {
    const originalCube = useLoader(OBJLoader, cubeScene);
    const cube = useMemo(() => {
        const clonedCube = originalCube.clone();
        clonedCube.traverse((child) => {
            if (child.isMesh) {
                if (props.wireframeMode) {
                    const wireframeGeometry = new WireframeGeometry(child.geometry);
                    child.material = new MeshBasicMaterial({ color: props.color });
                    const wireframe = new LineSegments(wireframeGeometry, new MeshBasicMaterial({ color: '#000000' ,    wireframe: true
                }));
                    child.add(wireframe);
                } else {
                    child.material = props.darkMode
                        ? new MeshBasicMaterial({ color: props.color, emissive: props.color, emissiveIntensity: 1.5 }) 
                        : new MeshStandardMaterial({ color: props.color });
                }
            }
        });
        return clonedCube;
    }, [originalCube, props.color, props.darkMode, props.wireframeMode]);

    if (!props.isRendering) {
        return <></>;
    }

    return (
        <mesh position={props.position}> 
        {/* visibile={props.isRendering} */}
            <primitive object={cube} />
        </mesh>
    );
};

export default Cube;
