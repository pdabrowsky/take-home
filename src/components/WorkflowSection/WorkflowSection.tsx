"use client";

import { useState } from "react";
import { WorkflowRunner } from "@/components/WorkflowRunner";
import { WorkflowResults } from "@/components/WorkflowResults";
import { WorkflowExecution } from "@/types/workflow";
import { WorkflowSectionProps } from "./WorkflowSection.types";

export const WorkflowSection = ({ accounts }: WorkflowSectionProps) => {
  const [completedExecution, setCompletedExecution] =
    useState<WorkflowExecution | null>(null);

  return (
    <div className="space-y-8">
      <WorkflowRunner
        accounts={accounts}
        onWorkflowComplete={setCompletedExecution}
      />

      {completedExecution?.result && (
        <WorkflowResults result={completedExecution.result} />
      )}
    </div>
  );
};
