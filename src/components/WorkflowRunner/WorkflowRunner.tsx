"use client";

import { useState } from "react";
import { WorkflowExecution } from "@/types/workflow";
import { runWorkflowAction } from "@/app/api/actions/workflow.actions";
import { Button } from "@/components/Button";
import { WorkflowRunnerProps } from "./WorkflowRunner.types";

export const WorkflowRunner = ({
  accounts,
  onWorkflowComplete,
}: WorkflowRunnerProps) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);

  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

  const handleDocumentToggle = (documentId: string) => {
    setSelectedDocumentIds((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  };

  const runWorkflow = async () => {
    if (!selectedAccountId || selectedDocumentIds.length === 0) return;

    setIsRunning(true);

    const newExecution: WorkflowExecution = {
      id: `workflow-${Date.now()}`,
      accountId: selectedAccountId,
      documentIds: selectedDocumentIds,
      status: "running",
      createdAt: new Date().toISOString(),
    };

    setExecution(newExecution);

    try {
      const result = await runWorkflowAction(
        selectedAccountId,
        selectedDocumentIds
      );

      if (result.success && result.data) {
        const completedExecution: WorkflowExecution = result.data;
        setExecution(completedExecution);
        onWorkflowComplete?.(completedExecution);
      } else {
        const failedExecution: WorkflowExecution = {
          ...newExecution,
          status: "failed",
          completedAt: new Date().toISOString(),
        };
        setExecution(failedExecution);
      }
    } catch (error) {
      console.error("Workflow execution failed:", error);
      const failedExecution: WorkflowExecution = {
        ...newExecution,
        status: "failed",
        completedAt: new Date().toISOString(),
      };
      setExecution(failedExecution);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Workflow Runner
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Account
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => {
                setSelectedAccountId(e.target.value);
                setSelectedDocumentIds([]);
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose an account...</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {selectedAccount && selectedAccount.documents.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Documents ({selectedDocumentIds.length} selected)
              </label>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2">
                {selectedAccount.documents.map((doc) => (
                  <label
                    key={doc.id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDocumentIds.includes(doc.id)}
                      onChange={() => handleDocumentToggle(doc.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{doc.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={runWorkflow}
            disabled={
              !selectedAccountId ||
              selectedDocumentIds.length === 0 ||
              isRunning
            }
            loading={isRunning}
            fullWidth
            size="lg"
          >
            Run Workflow
          </Button>
        </div>
      </div>

      {execution && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Execution Status
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                execution.status === "running"
                  ? "bg-yellow-100 text-yellow-800"
                  : execution.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {execution.status.toUpperCase()}
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            <p>
              <strong>Execution ID:</strong> {execution.id}
            </p>
            <p>
              <strong>Started:</strong>{" "}
              {new Date(execution.createdAt).toLocaleString()}
            </p>
            {execution.completedAt && (
              <p>
                <strong>Completed:</strong>{" "}
                {new Date(execution.completedAt).toLocaleString()}
              </p>
            )}
          </div>

          {execution.status === "completed" && execution.result && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800 font-medium">
                ✅ Workflow completed successfully!
              </p>
              <p className="text-green-700 text-sm mt-1">
                {execution.result.summary}
              </p>
              <a
                href="#results"
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer transition-colors"
              >
                View Results →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
