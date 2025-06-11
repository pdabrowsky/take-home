"use client";

import { useState, useRef, useTransition } from "react";
import { uploadDocumentAction } from "@/app/api/actions/documents.actions";
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
            <p className="text-sm text-gray-500">PDF files only</p>
          </>
        )}
      </div>
    </div>
  );
};
