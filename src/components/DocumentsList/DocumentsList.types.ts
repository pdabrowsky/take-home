import { Document } from "@/types/database";

export type DocumentsListProps = {
  documents: Document[];
  onDeleteDocument?: (documentId: string) => void;
  isDeleting?: boolean;
};
