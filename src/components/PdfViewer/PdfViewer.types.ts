import { Document } from "@/types/database";

export type PdfViewerProps = {
  document: Document;
  onClose: () => void;
};
