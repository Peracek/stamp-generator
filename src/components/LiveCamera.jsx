import React, { useEffect, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';

const LiveCamera = ({ onCapture, onCancel }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [error, setError] = useState(null);
    const animationRef = useRef(null);

    useEffect(() => {
        let stream = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment', // Prefer back camera on mobile
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access camera. Please allow camera permissions.");
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const processFrame = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            // Set canvas size to match video
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }

            // Draw original frame
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const threshold = 128;

            // Process pixels (Grayscale + Threshold)
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                const val = gray < threshold ? 0 : 255;

                data[i] = val;
                data[i + 1] = val;
                data[i + 2] = val;
            }

            ctx.putImageData(imageData, 0, 0);
        }

        animationRef.current = requestAnimationFrame(processFrame);
    };

    useEffect(() => {
        // Start processing loop once video starts playing
        const video = videoRef.current;
        if (video) {
            video.addEventListener('play', () => {
                processFrame();
            });
        }
    }, []);

    const handleCapture = () => {
        if (canvasRef.current) {
            const dataUrl = canvasRef.current.toDataURL('image/png');
            onCapture(dataUrl);
        }
    };

    if (error) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
                <button className="btn-primary" onClick={onCancel}>Close Camera</button>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Hidden video element for source */}
            <video
                ref={videoRef}
                style={{ display: 'none' }}
                playsInline
                muted
            />

            {/* Canvas for processed output */}
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                }}
            />

            {/* Controls Overlay */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '0',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px'
            }}>
                <button
                    onClick={onCancel}
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}
                >
                    <X size={24} />
                </button>

                <button
                    onClick={handleCapture}
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        border: '4px solid rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        border: '2px solid black'
                    }} />
                </button>

                <div style={{ width: '50px' }}></div> {/* Spacer for balance */}
            </div>

            <div style={{
                position: 'absolute',
                top: '20px',
                left: '0',
                width: '100%',
                textAlign: 'center',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                pointerEvents: 'none'
            }}>
                <p>Live Preview (Processed)</p>
            </div>
        </div>
    );
};

export default LiveCamera;
