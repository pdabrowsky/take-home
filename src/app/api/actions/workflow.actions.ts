"use server";

import { auth } from "@/lib/auth";
import {
  executeWorkflow,
  validateWorkflowInputs,
} from "../services/workflow.services";

export async function runWorkflowAction(
  accountId: string,
  documentIds: string[]
) {
  try {
    const {
      data: { user },
      error,
    } = await auth.getServerUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const validation = await validateWorkflowInputs(accountId, documentIds);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const result = await executeWorkflow(accountId, documentIds);

    return {
      success: true,
      data: {
        id: `workflow-${Date.now()}`,
        accountId,
        documentIds,
        status: "completed" as const,
        result,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error running workflow:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to run workflow",
    };
  }
}
