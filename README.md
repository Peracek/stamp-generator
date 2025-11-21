# StampForge - 3D Printable Stamp Generator

A mobile-first web application that converts hand-drawn shapes into 3D printable stamp models.

## Phase 1 - Complete ✓

Phase 1 delivers the foundation of the application with:

- React 19 + TypeScript + Vite
- Tailwind CSS for styling
- Three.js + React Three Fiber for 3D visualization
- Mobile-responsive interface with touch controls
- Image upload with camera capture support
- Interactive 3D viewer with OrbitControls

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm run dev
```

Open your browser to the URL shown (typically http://localhost:5173)

### Build

```bash
pnpm run build
```

### Preview Production Build

```bash
pnpm run preview
```

## Current Features (Phase 1)

- **Header**: Simple branding and title
- **3D Viewer**: Interactive canvas with touch-enabled orbit controls
  - Neutral slate-gray background for good contrast
  - Ambient and directional lighting
  - Default placeholder cube when no image loaded
- **Control Panel**: Bottom sheet with upload button
  - File input with mobile camera support (`capture="environment"`)
  - Accepts JPG/PNG images
  - Displays uploaded images on a 3D plane

## Usage

1. Click "Upload / Take Photo" button
2. On mobile: Choose to take a photo or select from gallery
3. On desktop: Select an image file
4. The image will appear on a plane in the 3D viewer
5. Use touch/mouse to rotate and zoom the view

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **3D Engine**: Three.js
- **3D React Bindings**: React Three Fiber
- **3D Helpers**: @react-three/drei (OrbitControls, useTexture)

## Next Steps (Phase 2)

- Image processing (grayscale, thresholding)
- Vectorization using canvas-based approach
- Convert SVG paths to 3D geometry
- Extrude shapes to create stamp face

## Next Steps (Phase 3)

- Mirror stamp face for correct impressions
- Add procedural base/handle
- STL export functionality
- Threshold and smoothness sliders

## Project Structure

```
src/
├── components/
│   ├── Header.tsx           # App header with branding
│   ├── Viewer3D.tsx         # 3D canvas wrapper
│   ├── Scene.tsx            # 3D scene with lighting and objects
│   └── ControlPanel.tsx     # Upload controls
├── App.tsx                  # Main app component
├── main.tsx                 # Entry point
└── index.css                # Global styles + Tailwind
```
