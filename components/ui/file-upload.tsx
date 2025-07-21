import React, { useCallback, useState, useRef } from "react";
import clsx from "clsx";

// File Upload Component
type FileUploadProps = React.HTMLAttributes<HTMLDivElement> & {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  disabled?: boolean;
  onFileSelect?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  children?: React.ReactNode;
  variant?: "dropzone" | "button" | "minimal";
  showPreview?: boolean;
};

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({
    className,
    accept = "*/*",
    multiple = false,
    maxSize = 10, // 10MB default
    maxFiles = 5,
    disabled = false,
    onFileSelect,
    onFileRemove,
    children,
    variant = "dropzone",
    showPreview = true,
    ...props
  }, ref) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
      if (file.size > maxSize * 1024 * 1024) {
        return `File "${file.name}" is too large. Maximum size is ${maxSize}MB.`;
      }
      return null;
    };

    const handleFiles = useCallback((files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      // Check file count limit
      if (selectedFiles.length + fileArray.length > maxFiles) {
        newErrors.push(`Maximum ${maxFiles} files allowed.`);
        setErrors(newErrors);
        return;
      }

      // Validate each file
      fileArray.forEach(file => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      if (validFiles.length > 0) {
        const updatedFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
        setSelectedFiles(updatedFiles);
        onFileSelect?.(updatedFiles);
      }

      setErrors(newErrors);
    }, [selectedFiles, maxFiles, maxSize, multiple, onFileSelect]);

    const handleDrag = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (disabled) return;
      
      const files = e.dataTransfer.files;
      handleFiles(files);
    }, [disabled, handleFiles]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const files = e.target.files;
      handleFiles(files);
    }, [handleFiles]);

    const removeFile = useCallback((index: number) => {
      const updatedFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(updatedFiles);
      onFileRemove?.(index);
      onFileSelect?.(updatedFiles);
    }, [selectedFiles, onFileRemove, onFileSelect]);

    const openFileDialog = () => {
      inputRef.current?.click();
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (file: File): string => {
      const type = file.type;
      if (type.startsWith('image/')) return '🖼️';
      if (type.startsWith('video/')) return '🎥';
      if (type.startsWith('audio/')) return '🎵';
      if (type === 'application/pdf') return '📄';
      if (type.includes('document') || type.includes('word')) return '📝';
      if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
      if (type.includes('presentation') || type.includes('powerpoint')) return '📈';
      if (type.includes('zip') || type.includes('rar')) return '🗜️';
      return '📁';
    };

    if (variant === "button") {
      return (
        <div ref={ref} className={className} {...props}>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            className="hidden"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={openFileDialog}
            disabled={disabled}
            className={clsx(
              "inline-flex items-center justify-center gap-2",
              "px-4 py-2 text-sm font-medium rounded-[var(--radius)]",
              "bg-[var(--color-primary)] text-white border border-[var(--color-primary)]",
              "hover:bg-[var(--color-primary)]/90 hover:border-[var(--color-primary)]/90",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2",
              "disabled:opacity-50 disabled:pointer-events-none",
              "cursor-pointer"
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {children || "Upload Files"}
          </button>
          {showPreview && selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-[var(--color-secondary)]/30 rounded-[var(--radius)] border border-[var(--color-border)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getFileIcon(file)}</span>
                    <div>
                      <div className="text-sm font-medium">{file.name}</div>
                      <div className="text-xs text-[var(--color-muted-foreground)]">{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-[var(--color-destructive)]/10 rounded text-[var(--color-destructive)]"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.length > 0 && (
            <div className="mt-2 space-y-1">
              {errors.map((error, index) => (
                <p key={index} className="text-xs text-[var(--color-destructive)]">{error}</p>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (variant === "minimal") {
      return (
        <div ref={ref} className={className} {...props}>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            className="hidden"
            disabled={disabled}
          />
          <div
            onClick={openFileDialog}
            className={clsx(
              "inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 cursor-pointer",
              disabled && "opacity-50 pointer-events-none"
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            {children || "Attach files"}
          </div>
          {showPreview && selectedFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedFiles.map((file, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-secondary)]/50 rounded text-xs"
                >
                  {file.name}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-[var(--color-muted-foreground)] hover:text-[var(--color-destructive)]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Default dropzone variant
    return (
      <div ref={ref} className={className} {...props}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div
          className={clsx(
            "relative border-2 border-dashed rounded-[var(--radius)] p-6",
            "transition-colors duration-200 cursor-pointer overflow-hidden",
            dragActive
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
              : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50",
            disabled && "opacity-50 pointer-events-none"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center text-center">
            <svg
              className={clsx(
                "mx-auto h-12 w-12 mb-4",
                dragActive ? "text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)]"
              )}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="space-y-2">
              <div className="text-lg font-medium">
                {children || (dragActive ? "Drop files here" : "Upload files")}
              </div>
              <div className="text-sm text-[var(--color-muted-foreground)]">
                Drag and drop files here, or click to select files
              </div>
              <div className="text-xs text-[var(--color-muted-foreground)]">
                Maximum {maxSize}MB per file • Up to {maxFiles} files
              </div>
            </div>
          </div>
        </div>

        {showPreview && selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Selected Files ({selectedFiles.length})</h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getFileIcon(file)}</span>
                    <div>
                      <div className="text-sm font-medium">{file.name}</div>
                      <div className="text-xs text-[var(--color-muted-foreground)]">
                        {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-2 hover:bg-[var(--color-destructive)]/10 rounded-[var(--radius)] text-[var(--color-destructive)] transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 rounded-[var(--radius)]">
            <div className="space-y-1">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-[var(--color-destructive)]">{error}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export default FileUpload;