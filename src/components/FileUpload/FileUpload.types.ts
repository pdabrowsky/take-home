import { Document } from "@/types/database";

export type FileUploadProps = {
  accountId: string;
  onUploadSuccess: (document: Document) => void;
  onUploadError: (error: string) => void;
};
