"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { FileUpload } from "@/components/FileUpload";
import { DocumentsList } from "@/components/DocumentsList";
import { AccountCardProps } from "./AccountCard.types";
import { deleteDocumentAction } from "@/app/api/actions/documents.actions";
import { Document } from "@/types/database";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const AccountCard = ({
  account,
  onDelete,
  isDeleting,
  onDocumentUpdate,
}: AccountCardProps) => {
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [localDocuments, setLocalDocuments] = useState<Document[]>(
    account.documents
  );
  const [isDeletingDocument, setIsDeletingDocument] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = () => {
    onDelete(account.id);
  };

  const handleUploadSuccess = (newDocument: Document) => {
    const updatedDocuments = [...localDocuments, newDocument];
    setLocalDocuments(updatedDocuments);
    onDocumentUpdate?.(account.id, updatedDocuments);
    setUploadError(null);
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
  };

  const handleDeleteDocument = async (documentId: string) => {
    setIsDeletingDocument(true);
    setDeleteError(null);
    try {
      const result = await deleteDocumentAction(documentId);
      if (result.success) {
        const updatedDocuments = localDocuments.filter(
          (doc) => doc.id !== documentId
        );
        setLocalDocuments(updatedDocuments);
        onDocumentUpdate?.(account.id, updatedDocuments);
      } else {
        setDeleteError(result.error || "Failed to delete document");
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
      setDeleteError("Failed to delete document. Please try again.");
    } finally {
      setIsDeletingDocument(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {account.name}
        </h3>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-800 hover:bg-red-50 disabled:text-red-400 flex-shrink-0 ml-2"
        >
          Delete
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <span className="text-sm font-medium text-gray-500 block">
            Location:
          </span>
          <p className="text-gray-900 text-sm">
            {account.location || "Not specified"}
          </p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-500 block">
            Email:
          </span>
          <p className="text-gray-900 text-sm break-words">
            {account.contact_email || "Not specified"}
          </p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-500 block">
            Phone:
          </span>
          <p className="text-gray-900 text-sm">
            {account.contact_phone || "Not specified"}
          </p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-500 block">
            Address:
          </span>
          <p className="text-gray-900 text-sm">
            {account.contact_address || "Not specified"}
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-900">Documents</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {localDocuments.length}
            </span>
            <Button
              onClick={() => setIsDocumentsModalOpen(true)}
              size="sm"
              variant="secondary"
            >
              Manage
            </Button>
          </div>
        </div>

        {localDocuments.length > 0 ? (
          <div className="space-y-1">
            {localDocuments.slice(0, 3).map((doc) => (
              <div
                key={doc.id}
                className="text-sm text-gray-600 truncate flex items-center cursor-pointer hover:text-blue-600"
                onClick={() => setIsDocumentsModalOpen(true)}
              >
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2 flex-shrink-0"></span>
                {doc.name}
              </div>
            ))}
            {localDocuments.length > 3 && (
              <div
                className="text-sm text-gray-500 pl-3 cursor-pointer hover:text-blue-600"
                onClick={() => setIsDocumentsModalOpen(true)}
              >
                +{localDocuments.length - 3} more...
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No documents yet</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-400">
          Created: {formatDate(account.created_at)}
        </p>
      </div>

      <Modal
        isOpen={isDocumentsModalOpen}
        onClose={() => {
          setIsDocumentsModalOpen(false);
          setUploadError(null);
          setDeleteError(null);
        }}
        title={`Documents for ${account.name}`}
        size="xl"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium mb-3">Upload New Document</h4>
            <FileUpload
              accountId={account.id}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
            {uploadError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 whitespace-pre-line">
                  {uploadError}
                </p>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-lg font-medium mb-3">Existing Documents</h4>
            <DocumentsList
              documents={localDocuments}
              onDeleteDocument={handleDeleteDocument}
              isDeleting={isDeletingDocument}
            />
            {deleteError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{deleteError}</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
