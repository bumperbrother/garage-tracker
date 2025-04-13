import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Button from './Button';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  title?: string;
  description?: string;
  onPrint?: () => void;
  onDownload?: () => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  title,
  description,
  onPrint,
  onDownload,
}) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }

    // Default print functionality
    const printWindow = window.open('', '_blank');
    if (printWindow && qrCodeRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title || 'QR Code'}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                font-family: Arial, sans-serif;
              }
              .qr-container {
                text-align: center;
              }
              h2 {
                margin-bottom: 10px;
              }
              p {
                margin-bottom: 20px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              ${title ? `<h2>${title}</h2>` : ''}
              ${description ? `<p>${description}</p>` : ''}
              ${qrCodeRef.current.innerHTML}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.setTimeout(function() {
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }

    // Default download functionality
    const canvas = document.createElement('canvas');
    const svgElement = qrCodeRef.current?.querySelector('svg');
    
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');
          
          // Create download link
          const downloadLink = document.createElement('a');
          downloadLink.download = `${title || 'qrcode'}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        }
      };
      
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      
      <div ref={qrCodeRef} className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <QRCodeSVG value={value} size={size} />
      </div>
      
      <div className="flex space-x-3">
        <Button onClick={handlePrint} variant="outline" size="sm">
          Print
        </Button>
        <Button onClick={handleDownload} variant="primary" size="sm">
          Download
        </Button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
