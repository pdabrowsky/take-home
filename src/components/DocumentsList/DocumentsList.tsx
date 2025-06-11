"use client";

import { useState } from "react";
import { Document } from "@/types/database";
import { PdfViewer } from "@/components/PdfViewer";
import { DocumentsListProps } from "./DocumentsList.types";

export const DocumentsList = ({
  documents,
  onDeleteDocument,
  isDeleting,
}: DocumentsListProps) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size";
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p>No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {documents.map((document) => (
          <div
            key={document.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div
              className="flex-1 cursor-pointer"
              onClick={() => setSelectedDocument(document)}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 mr-3 text-red-500">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    {document.name}
                  </p>
                  {document.description && (
                    <p className="text-sm text-gray-600">
                      {document.description}
                    </p>
                  )}
                  <div className="flex text-xs text-gray-500 mt-1 space-x-4">
                    <span>{formatFileSize(document.file_size)}</span>
                    <span>Uploaded: {formatDate(document.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {onDeleteDocument && (
              <button
                onClick={() => onDeleteDocument(document.id)}
                disabled={isDeleting}
                className="ml-3 p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                title="Delete document"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedDocument && (
        <PdfViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </>
  );
};
