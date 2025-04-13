import { Html5Qrcode } from 'html5-qrcode';

// Initialize the barcode scanner
export const initBarcodeScanner = async (elementId: string): Promise<Html5Qrcode> => {
  const scanner = new Html5Qrcode(elementId);
  return scanner;
};

// Start scanning for barcodes
export const startBarcodeScanning = async (
  scanner: Html5Qrcode,
  onScanSuccess: (decodedText: string) => void,
  onScanFailure: (error: string) => void
): Promise<void> => {
  try {
    await scanner.start(
      { facingMode: 'environment' }, // Use the back camera
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      onScanSuccess,
      onScanFailure
    );
  } catch (err) {
    console.error('Error starting barcode scanner:', err);
  }
};

// Stop scanning
export const stopBarcodeScanning = async (scanner: Html5Qrcode): Promise<void> => {
  try {
    if (scanner && scanner.isScanning) {
      await scanner.stop();
    }
  } catch (err) {
    console.error('Error stopping barcode scanner:', err);
  }
};
