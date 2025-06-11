"use client";

import { PdfViewerProps } from "./PdfViewer.types";
import { Icon } from "@/components/Icon";

export const PdfViewer = ({ document, onClose }: PdfViewerProps) => {
  if (!document.file_path) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Error</h3>
          <p className="text-gray-600 mb-4">
            No file path available for this document.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full h-full max-w-6xl max-h-[90vh] m-4 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">{document.name}</h3>
            {document.description && (
              <p className="text-sm text-gray-600">{document.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <Icon name="x-mark" size={24} />
          </button>
        </div>

        <div className="flex-1 p-4">
          <iframe
            src={`${document.file_path}#view=FitH`}
            className="w-full h-full border border-gray-300 rounded"
            title={`PDF Viewer - ${document.name}`}
          />
        </div>

        <div className="p-4 border-t bg-gray-50 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>
              Size:{" "}
              {document.file_size
                ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB`
                : "Unknown"}
            </span>
            <span>Type: {document.file_type || "PDF"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
