import { WorkflowResult } from "@/types/workflow";
import workflowData from "@/workflow/workflow-data.json";

export async function executeWorkflow(
  accountId: string,
  documentIds: string[]
): Promise<WorkflowResult> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return workflowData as WorkflowResult;
}

export async function validateWorkflowInputs(
  accountId: string,
  documentIds: string[]
): Promise<{ valid: boolean; error?: string }> {
  if (!accountId) {
    return { valid: false, error: "Account ID is required" };
  }

  if (!documentIds || documentIds.length === 0) {
    return { valid: false, error: "At least one document must be selected" };
  }

  return { valid: true };
}
