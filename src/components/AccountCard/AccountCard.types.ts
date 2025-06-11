import { AccountWithDocuments } from "@/components/AccountsList/AccountsList.types";
import { Document } from "@/types/database";

export type AccountCardProps = {
  account: AccountWithDocuments;
  onDelete: (accountId: string) => void;
  isDeleting: boolean;
  onDocumentUpdate?: (accountId: string, documents: Document[]) => void;
};
