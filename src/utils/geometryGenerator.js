import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

export const generateStampGeometry = (svgData, options = {}) => {
    const {
        scale = 0.1,
        depth = 2, // Depth of the stamp relief
        baseHeight = 2, // Thickness of the base
        padding = 5 // Padding around the shape for the base
    } = options;

    const loader = new SVGLoader();
    const svgResult = loader.parse(svgData);
    const paths = svgResult.paths;

    const shapes = [];

    paths.forEach((path) => {
        const pathShapes = SVGLoader.createShapes(path);
        shapes.push(...pathShapes);
    });

    if (shapes.length === 0) {
        throw new Error("No shapes found in the image.");
    }

    // Create Extrude Geometry for the stamp pattern
    const extrudeSettings = {
        steps: 1,
        depth: depth,
        bevelEnabled: false,
    };

    const stampGeometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);

    // Center the geometry
    stampGeometry.computeBoundingBox();
    const center = new THREE.Vector3();
    stampGeometry.boundingBox.getCenter(center);
    stampGeometry.translate(-center.x, -center.y, -center.z);

    // Flip Y because SVG coordinates are top-down, Three.js is bottom-up
    stampGeometry.scale(1, -1, 1);

    // Create Base Plate
    const bbox = stampGeometry.boundingBox;
    const width = bbox.max.x - bbox.min.x + padding * 2;
    const height = bbox.max.y - bbox.min.y + padding * 2;

    const baseGeometry = new THREE.BoxGeometry(width, height, baseHeight);
    // Position base behind the stamp
    // Stamp is centered at 0,0,0. It extends from 0 to depth in Z (or -depth/2 to depth/2 depending on implementation, but Extrude goes 0 to depth)
    // Actually ExtrudeGeometry goes from 0 to depth in Z.
    // We want the base to start at 0 and go to -baseHeight.
    baseGeometry.translate(0, 0, -baseHeight / 2);

    return { stampGeometry, baseGeometry };
};

export const mergeGeometries = (stampGeo, baseGeo) => {
    // For export, we might want to merge them.
    // But for rendering, keeping them separate allows for different materials.
    // For STL export, we need to merge.
    // We can use BufferGeometryUtils.mergeBufferGeometries if imported, 
    // or just export both meshes in the scene.
    return null; // Placeholder
}
