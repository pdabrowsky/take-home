export type Vehicle = {
  vin: string;
  garageZip: string;
  description: string;
  vehicleCost: string;
  vehiclePremium?: string;
  collisionDeductible: string;
  comprehensiveDeductible: string;
};

export type WorkflowResult = {
  summary: string;
  fileName1: string;
  fileName2: string;
  matchResult: string[];
  subFieldsMatchResult: Record<string, any>[];
  rawList1: Vehicle[];
  rawList2: Vehicle[];
};

export type WorkflowExecution = {
  id: string;
  accountId: string;
  documentIds: string[];
  status: "running" | "completed" | "failed";
  result?: WorkflowResult;
  createdAt: string;
  completedAt?: string;
};
