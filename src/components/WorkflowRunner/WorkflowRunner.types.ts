import { AccountWithDocuments } from "@/components/AccountsList/AccountsList.types";
import { WorkflowExecution } from "@/types/workflow";

export type WorkflowRunnerProps = {
  accounts: AccountWithDocuments[];
  onWorkflowComplete?: (execution: WorkflowExecution) => void;
};
