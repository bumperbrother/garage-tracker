import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Button from './Button';

interface QRCodeScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScan,
  onError,
  onClose,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-code-scanner';

  useEffect(() => {
    // Initialize scanner
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(scannerContainerId);
    }

    return () => {
      // Clean up scanner on component unmount
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .catch((err) => console.error('Error stopping scanner:', err));
      }
    };
  }, []);

  const startScanning = async () => {
    if (!scannerRef.current) return;

    setError(null);
    setIsScanning(true);

    try {
      await scannerRef.current.start(
        { facingMode: 'environment' }, // Use the back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // On successful scan
          handleScan(decodedText);
        },
        (errorMessage) => {
          // On error (this is called for each non-successful scan, so we don't want to show it to the user)
          console.log(errorMessage);
        }
      );
    } catch (err) {
      setIsScanning(false);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to start scanner: ${errorMessage}`);
      if (onError) onError(errorMessage);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error stopping scanner:', errorMessage);
      }
    }
  };

  const handleScan = async (decodedText: string) => {
    // Stop scanning after a successful scan
    await stopScanning();
    
    // Call the onScan callback with the decoded text
    onScan(decodedText);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        id={scannerContainerId}
        className="w-full max-w-sm h-64 bg-gray-100 rounded-lg overflow-hidden mb-4"
      ></div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex space-x-4">
        {!isScanning ? (
          <Button onClick={startScanning}>Start Scanning</Button>
        ) : (
          <Button variant="secondary" onClick={stopScanning}>
            Stop Scanning
          </Button>
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

export default QRCodeScanner;
