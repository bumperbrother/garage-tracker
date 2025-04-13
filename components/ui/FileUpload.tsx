import React, { ChangeEvent, forwardRef, useState } from 'react';
import Button from './Button';

interface FileUploadProps {
  id?: string;
  label?: string;
  accept?: string;
  multiple?: boolean;
  error?: string;
  onChange?: (files: File[]) => void;
  maxSize?: number; // in MB
  className?: string;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ 
    id,
    label, 
    accept, 
    multiple = false, 
    error, 
    onChange, 
    maxSize = 5, // Default max size: 5MB
    className = '' 
  }, ref) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [sizeError, setSizeError] = useState<string | null>(null);
    // We'll use a simple state to track the input element
    const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      
      // Check file size
      const oversizedFiles = files.filter(file => file.size > maxSize * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles.map(file => file.name).join(', ');
        setSizeError(`File(s) too large: ${fileNames}. Maximum size is ${maxSize}MB.`);
        return;
      }
      
      setSizeError(null);
      setSelectedFiles(files);
      
      if (onChange) {
        onChange(files);
      }
    };

    const handleButtonClick = () => {
      if (inputElement) {
        inputElement.click();
      }
    };

    const clearFiles = () => {
      setSelectedFiles([]);
      setSizeError(null);
      if (inputElement) {
        inputElement.value = '';
      }
      if (onChange) {
        onChange([]);
      }
    };

    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label className="block text-gray-700 text-sm font-medium mb-1">
            {label}
          </label>
        )}
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
            >
              Choose File{multiple ? 's' : ''}
            </Button>
            
            {selectedFiles.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFiles}
              >
                Clear
              </Button>
            )}
          </div>
          
          <input
            id={id}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            // Use a callback ref pattern that works with both our state and the forwarded ref
            ref={(element) => {
              // Update our state
              setInputElement(element);
              
              // Handle the forwarded ref
              if (typeof ref === 'function') {
                ref(element);
              }
            }}
          />
          
          {selectedFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {multiple
                  ? `${selectedFiles.length} file(s) selected`
                  : selectedFiles[0].name}
              </p>
              {multiple && (
                <ul className="mt-1 text-xs text-gray-500 list-disc list-inside">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {(error || sizeError) && (
            <p className="mt-1 text-sm text-red-600">{error || sizeError}</p>
          )}
        </div>
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
