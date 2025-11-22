import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera } from 'lucide-react';

const ImageUploader = ({ onImageSelect }) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = () => {
                onImageSelect(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        multiple: false
    });

    return (
        <div
            {...getRootProps()}
            className="card"
            style={{
                border: '2px dashed var(--color-border)',
                backgroundColor: isDragActive ? 'rgba(10, 132, 255, 0.1)' : 'var(--color-surface)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                textAlign: 'center',
                transition: 'all 0.2s ease'
            }}
        >
            <input {...getInputProps()} />
            <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '50%',
                marginBottom: '16px'
            }}>
                <Camera size={48} color="var(--color-primary)" />
            </div>
            <h3 style={{ color: 'white', marginBottom: '8px' }}>Take a photo or upload</h3>
            <p style={{ fontSize: '0.9rem' }}>
                Draw a shape with a black marker on white paper.
            </p>
        </div>
    );
};

export default ImageUploader;
