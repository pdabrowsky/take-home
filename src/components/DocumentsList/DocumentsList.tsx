"use client";

import { useState } from "react";
import { Document } from "@/types/database";
import { PdfViewer } from "@/components/PdfViewer";
import { DocumentsListProps } from "./DocumentsList.types";
import { Icon } from "@/components/Icon";

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
          <Icon name="document-text" size={64} className="text-gray-300" />
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
                  <Icon
                    name="pdf-document"
                    size={32}
                    className="text-red-500"
                  />
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
                <Icon name="trash" size={16} className="text-current" />
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
