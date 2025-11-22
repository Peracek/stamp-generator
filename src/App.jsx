import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import StampPreview from './components/StampPreview';
import LiveCamera from './components/LiveCamera';
import { loadImage, processImage } from './utils/imageProcessing';

function App() {
  const [image, setImage] = useState(null); // Original image
  const [processedImage, setProcessedImage] = useState(null); // B/W image
  const [step, setStep] = useState('upload'); // upload, camera, validate, preview

  const handleImageSelect = async (imageData) => {
    setImage(imageData);
    try {
      const img = await loadImage(imageData);
      const canvas = processImage(img);
      setProcessedImage(canvas.toDataURL('image/png'));
      setStep('validate');
    } catch (err) {
      console.error("Error processing image:", err);
    }
  };

  const handleCameraCapture = (imageData) => {
    // Image data from LiveCamera is already processed
    setProcessedImage(imageData);
    setStep('validate');
  };

  return (
    <div className="step-container">
      {step !== 'camera' && (
        <header style={{ textAlign: 'center', padding: '20px 0' }}>
          <h1>Stamp Gen</h1>
          <p>Turn drawings into 3D stamps</p>
        </header>
      )}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {step === 'upload' && (
          <>
            <ImageUploader onImageSelect={handleImageSelect} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p style={{ marginBottom: '10px' }}>or</p>
              <button
                className="btn-primary"
                onClick={() => setStep('camera')}
              >
                Open Live Camera
              </button>
            </div>
          </>
        )}

        {step === 'camera' && (
          <LiveCamera
            onCapture={handleCameraCapture}
            onCancel={() => setStep('upload')}
          />
        )}

        {step === 'validate' && processedImage && (
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '16px' }}>Check the Result</h3>
            <p style={{ marginBottom: '20px' }}>
              Make sure your shape is clearly visible in black and white.
            </p>
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '24px',
              backgroundColor: 'white' // White background to see the B/W contrast clearly
            }}>
              <img src={processedImage} alt="Processed" style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-primary"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                onClick={() => setStep('upload')}
              >
                Retake
              </button>
              <button
                className="btn-primary"
                onClick={() => setStep('preview')}
              >
                Looks Good
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <StampPreview
            imageSrc={processedImage}
            onBack={() => setStep('validate')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
