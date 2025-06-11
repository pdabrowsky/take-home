"use client";

import { useState, useRef, useTransition } from "react";
import { uploadDocumentAction } from "@/app/api/actions/documents.actions";
import { fileUploadSchema } from "@/lib/validations";
import { Icon } from "@/components/Icon";
import { FileUploadProps } from "./FileUpload.types";

export const FileUpload = ({
  accountId,
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const result = fileUploadSchema.safeParse({
      file,
      account_id: accountId,
    });

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => err.message)
        .join(", ");
      return errorMessages;
    }

    return null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);

    if (files.length === 0) {
      onUploadError("No files selected");
      return;
    }

    // Validate all files first
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    files.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        validationErrors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (validationErrors.length > 0) {
      onUploadError(validationErrors.join("\n"));
      return;
    }

    // Upload all valid files
    validFiles.forEach((file) => uploadFile(file));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      onUploadError("No files selected");
      return;
    }

    // Validate all files first
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    files.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        validationErrors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (validationErrors.length > 0) {
      onUploadError(validationErrors.join("\n"));
      return;
    }

    // Upload all valid files
    validFiles.forEach((file) => uploadFile(file));
  };

  const uploadFile = (file: File) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("account_id", accountId);

        const result = await uploadDocumentAction(formData);

        if (result.success && result.data) {
          onUploadSuccess(result.data);
        } else {
          onUploadError(result.error || "Failed to upload file");
        }
      } catch (error) {
        console.error("Upload error:", error);
        onUploadError("Failed to upload file. Please try again.");
      }
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }
        ${isPending ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col items-center">
        <div className="w-12 h-12 mb-4 text-gray-400">
          <Icon name="cloud-upload" size={48} className="text-gray-400" />
        </div>

        {isPending ? (
          <p className="text-gray-600">Uploading...</p>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-sm text-gray-500">PDF files only (max 10MB)</p>
          </>
        )}
      </div>
    </div>
  );
};
