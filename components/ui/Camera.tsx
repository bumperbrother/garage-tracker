import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import Button from './Button';

interface CameraProps {
  onCapture: (imageSrc: string) => void;
  onClose?: () => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: isFrontCamera ? 'user' : 'environment',
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const confirmImage = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-sm overflow-hidden rounded-lg mb-4">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-auto"
          />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-auto"
          />
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {capturedImage ? (
          <>
            <Button onClick={retake} variant="secondary">
              Retake
            </Button>
            <Button onClick={confirmImage}>
              Use Photo
            </Button>
          </>
        ) : (
          <>
            <Button onClick={capture}>
              Take Photo
            </Button>
            <Button onClick={toggleCamera} variant="secondary">
              Flip Camera
            </Button>
          </>
        )}
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default Camera;
