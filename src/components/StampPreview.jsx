import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import { Download } from 'lucide-react';
import { processImage, traceBitmap } from '../utils/imageProcessing';
import { generateStampGeometry } from '../utils/geometryGenerator';

const Scene = ({ imageSrc, onExportReady }) => {
    const [geometries, setGeometries] = useState(null);
    const groupRef = useRef();

    useEffect(() => {
        const generate = async () => {
            try {
                const img = await new Promise((resolve, reject) => {
                    const i = new Image();
                    i.onload = () => resolve(i);
                    i.onerror = reject;
                    i.src = imageSrc;
                });

                const processedCanvas = processImage(img);
                const svgData = await traceBitmap(processedCanvas);
                const { stampGeometry, baseGeometry } = generateStampGeometry(svgData);

                setGeometries({ stampGeometry, baseGeometry });
            } catch (err) {
                console.error("Error generating stamp:", err);
            }
        };

        generate();
    }, [imageSrc]);

    useEffect(() => {
        if (geometries && groupRef.current) {
            onExportReady(groupRef.current);
        }
    }, [geometries, onExportReady]);

    if (!geometries) return null;

    return (
        <group ref={groupRef}>
            <mesh geometry={geometries.stampGeometry}>
                <meshStandardMaterial color="#0a84ff" roughness={0.5} />
            </mesh>
            <mesh geometry={geometries.baseGeometry}>
                <meshStandardMaterial color="#333" roughness={0.8} />
            </mesh>
        </group>
    );
};

const StampPreview = ({ imageSrc, onBack }) => {
    const [sceneRef, setSceneRef] = useState(null);

    const handleExport = () => {
        if (!sceneRef) return;

        const exporter = new STLExporter();
        const result = exporter.parse(sceneRef, { binary: true });
        const blob = new Blob([result], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'stamp.stl';
        link.click();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative' }}>
                <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                    <Stage environment="city" intensity={0.6}>
                        <Scene imageSrc={imageSrc} onExportReady={setSceneRef} />
                    </Stage>
                    <OrbitControls makeDefault />
                </Canvas>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button className="btn-primary" style={{ backgroundColor: '#38383a' }} onClick={onBack}>
                    Back
                </button>
                <button className="btn-primary" onClick={handleExport} disabled={!sceneRef}>
                    <Download size={20} />
                    Download STL
                </button>
            </div>
        </div>
    );
};

export default StampPreview;
