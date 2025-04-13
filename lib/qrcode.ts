import { QRCodeSVG } from 'qrcode.react';

// Generate a unique QR code ID
export const generateQRCodeId = (): string => {
  return `box_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Get the URL for a box based on its ID
export const getBoxUrl = (boxId: string): string => {
  // This will be the URL that the QR code will point to
  // When scanned, it will open the box details page
  return `${window.location.origin}/boxes/${boxId}`;
};
