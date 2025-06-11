"use client";

import { Vehicle } from "@/types/workflow";
import { WorkflowResultsProps } from "./WorkflowResults.types";

export const WorkflowResults = ({ result }: WorkflowResultsProps) => {
  const allVehicles = [...result.rawList1, ...result.rawList2];
  const uniqueVins = Array.from(new Set(allVehicles.map((v) => v.vin))).filter(
    Boolean
  );

  const getVehicleByVin = (vin: string, list: Vehicle[]) => {
    return list.find((v) => v.vin === vin);
  };

  const getMatchStatus = (index: number) => {
    return result.matchResult[index] || "UNKNOWN";
  };

  return (
    <div id="results" className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Workflow Results
        </h2>
        <p className="text-gray-600">{result.summary}</p>
        <div className="mt-2 text-sm text-gray-500">
          <span className="font-medium">Files compared:</span>{" "}
          {result.fileName1} vs {result.fileName2}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overall Match
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {result.fileName1}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {result.fileName2}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {uniqueVins.map((vin, index) => {
              const vehicle1 = getVehicleByVin(vin, result.rawList1);
              const vehicle2 = getVehicleByVin(vin, result.rawList2);
              const matchStatus = getMatchStatus(index);

              return (
                <tr key={vin} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      VIN: {vin}
                    </div>
                    <div className="text-sm text-gray-500">
                      {vehicle1?.description ||
                        vehicle2?.description ||
                        "No description"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        matchStatus === "MATCH"
                          ? "bg-green-100 text-green-800"
                          : matchStatus === "DIFFERENCE"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {matchStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {vehicle1 ? (
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium">Description:</span>{" "}
                          {vehicle1.description}
                        </div>
                        <div>
                          <span className="font-medium">Cost:</span>{" "}
                          {vehicle1.vehicleCost}
                        </div>
                        {vehicle1.vehiclePremium && (
                          <div>
                            <span className="font-medium">Premium:</span>{" "}
                            {vehicle1.vehiclePremium}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Collision:</span>{" "}
                          {vehicle1.collisionDeductible}
                        </div>
                        <div>
                          <span className="font-medium">Comprehensive:</span>{" "}
                          {vehicle1.comprehensiveDeductible}
                        </div>
                        <div>
                          <span className="font-medium">Garage Zip:</span>{" "}
                          {vehicle1.garageZip}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 italic">
                        Not found in this file
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {vehicle2 ? (
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium">Description:</span>{" "}
                          {vehicle2.description}
                        </div>
                        <div>
                          <span className="font-medium">Cost:</span>{" "}
                          {vehicle2.vehicleCost}
                        </div>
                        {vehicle2.vehiclePremium && (
                          <div>
                            <span className="font-medium">Premium:</span>{" "}
                            {vehicle2.vehiclePremium}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Collision:</span>{" "}
                          {vehicle2.collisionDeductible}
                        </div>
                        <div>
                          <span className="font-medium">Comprehensive:</span>{" "}
                          {vehicle2.comprehensiveDeductible}
                        </div>
                        <div>
                          <span className="font-medium">Garage Zip:</span>{" "}
                          {vehicle2.garageZip}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 italic">
                        Not found in this file
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {result.subFieldsMatchResult.some(
        (result) => Object.keys(result).length > 0
      ) && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Field-Level Match Details
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VIN
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Premium
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Collision
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comprehensive
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.subFieldsMatchResult.map((subResult, index) => {
                  if (Object.keys(subResult).length === 0) return null;

                  const vehicle =
                    result.rawList1[index] || result.rawList2[index];
                  if (!vehicle) return null;

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      {[
                        "vin",
                        "description",
                        "vehicleCost",
                        "vehiclePremium",
                        "collisionDeductible",
                        "comprehensiveDeductible",
                      ].map((field) => (
                        <td key={field} className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              subResult[field] === "MATCH"
                                ? "bg-green-100 text-green-800"
                                : subResult[field] === "NOT_FOUND"
                                ? "bg-yellow-100 text-yellow-800"
                                : subResult[field] === "DIFFERENCE"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {subResult[field] || "N/A"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
