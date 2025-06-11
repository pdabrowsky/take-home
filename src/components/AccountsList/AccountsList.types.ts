import { Account, Document } from "@/types/database";

export type AccountWithDocuments = Account & { documents: Document[] };

export type AccountsListProps = {
  initialAccounts: AccountWithDocuments[];
};
