Project: StampForge - 3D Printable Stamp Generator
1. Executive Summary
A mobile-first web application that allows users to take a picture of a hand-drawn shape (black marker on white paper) and automatically generate a 3D printable STL model of a stamp. The app runs entirely in the browser (client-side).

2. Technology Stack
Core Framework:

React (Latest Stable) with TypeScript.

Vite (Build tool).

Tailwind CSS (Styling).

3D & Geometry:

Three.js: Core 3D engine.

React Three Fiber (R3F): React renderer for Three.js.

@react-three/drei: Helpers (OrbitControls, Stage, etc.).

three-bvh-csg: For Constructive Solid Geometry (Union/Subtract operations).

STLExporter: To download the final model.

Image & Vector Processing:

OpenCV.js (or custom Canvas API filters): For grayscale conversion and adaptive thresholding (cleaning up shadows).

Potrace (e.g., potrace-js or imagetracerjs): To convert cleaned bitmap data into SVG vectors.

SVGLoader (from Three.js): To parse SVG paths into 3D Geometry.

3. Architecture & Data Flow
The application follows a linear pipeline:

Input (Photo) -> Raster Processing -> Vectorization -> 3D Generation -> Export

Step 1: Input (Phase 1 & 2 Strategy)
Phase 1 (MVP): Use standard <input type="file" capture="environment" />. This triggers the native phone camera app.

Phase 2 (Future): In-app camera stream using navigator.mediaDevices.getUserMedia with a custom UI overlay.

Step 2: Image Processing (The "Eye")
Convert image to Grayscale.

Apply Binary Thresholding (or Adaptive Thresholding) to separate ink from paper.

Invert colors (Ink = White/Active, Paper = Black/Inactive) if necessary for the vectorizer.

Step 3: Vectorization (The "Brain")
Pass binary image data to Potrace.

Output: An SVG path string.

Constraint: Simplify paths to avoid overly high polygon counts which crash slicers.

Step 4: 3D Generation (The "Builder")
Extrusion: Convert SVG Path to ExtrudeGeometry (Depth: ~2mm).

Mirroring: CRITICAL. The stamp face must be mirrored on the X-axis so the resulting ink impression is correct.

Base/Handle: Generate a procedural Box or Cylinder geometry behind the extruded shape to act as the handle.

Union: Use three-bvh-csg to merge the Handle and the Stamp Face into a single watertight mesh.

4. Detailed Feature Requirements
4.1 User Interface (Mobile First)
Header: Simple branding.

Main Canvas Area: A large interactive 3D viewer showing the generated model.

Must support touch rotation (OrbitControls).

Background color should be neutral (e.g., slate-gray) to contrast with the 3D model.

Control Panel (Bottom Sheet or Overlay):

"Upload/Take Photo" button.

"Threshold" Slider: To manually adjust the black/white cutoff if the automatic detection fails.

"Smoothness" Slider: To adjust vector simplification.

"Download STL" button.

4.2 The 3D Model Specs
Filament Material Assumptions: TPU (Flexible) or PLA.

Dimensions:

Stamp Extrusion Height: 2mm.

Base Thickness: 3mm.

Base Width/Height: Automatically calculated based on the bounding box of the drawing + 5mm padding.

5. Implementation Plan (Step-by-Step)
Prompt the agent to build in this order:

Phase 1: The Core 3D Viewer & Upload
Initialize React + Vite + Tailwind.

Set up a basic R3F scene (Lights, Camera, OrbitControls).

Create an "Upload" button that accepts an image.

Display the raw 2D image on a plane in the 3D scene (just to verify input works).

Phase 2: Vectorization Pipeline
Implement a utility function that takes the image, draws it to a hidden HTML Canvas, and runs a basic threshold filter (make pixels either pure black or pure white).

Integrate potrace to convert that canvas data to an SVG path.

Use SVGLoader to turn that path into a set of Three.js Shapes.

Extrude the shapes and replace the 2D image plane with this new 3D mesh.

Phase 3: Refinement & Export
Add the Mirroring logic (scale.x = -1).

Add the Backing Plate/Handle (a simple box geometry behind the stamp).

Add the STLExporter function and link it to a "Download" button.