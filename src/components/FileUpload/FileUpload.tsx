"use client";

import { useState, useRef, useTransition } from "react";
import { uploadDocumentAction } from "@/app/api/actions/documents.actions";
import { FileUploadProps } from "./FileUpload.types";

export const FileUpload = ({
  accountId,
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length === 0) {
      onUploadError("Please upload only PDF files");
      return;
    }

    pdfFiles.forEach((file) => uploadFile(file));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length === 0) {
      onUploadError("Please upload only PDF files");
      return;
    }

    pdfFiles.forEach((file) => uploadFile(file));
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
        accept=".pdf"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col items-center">
        <div className="w-12 h-12 mb-4 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {isPending ? (
          <p className="text-gray-600">Uploading...</p>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-sm text-gray-500">PDF files only</p>
          </>
        )}
      </div>
    </div>
  );
};
