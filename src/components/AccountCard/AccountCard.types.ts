import { AccountWithDocuments } from "@/components/AccountsList/AccountsList.types";

export type AccountCardProps = {
  account: AccountWithDocuments;
  onDelete: (accountId: string) => void;
  isDeleting: boolean;
};
