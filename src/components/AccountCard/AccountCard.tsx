import { Button } from "@/components/Button";
import { AccountCardProps } from "./AccountCard.types";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

export const AccountCard = ({
  account,
  onDelete,
  isDeleting,
}: AccountCardProps) => {
  const handleDelete = () => {
    onDelete(account.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {account.name}
        </h3>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-800 hover:bg-red-50 disabled:text-red-400 flex-shrink-0 ml-2"
        >
          Delete
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <span className="text-sm font-medium text-gray-500 block">
            Location:
          </span>
          <p className="text-gray-900 text-sm">
            {account.location || "Not specified"}
          </p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-500 block">
            Email:
          </span>
          <p className="text-gray-900 text-sm break-words">
            {account.contact_email || "Not specified"}
          </p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-500 block">
            Phone:
          </span>
          <p className="text-gray-900 text-sm">
            {account.contact_phone || "Not specified"}
          </p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-500 block">
            Address:
          </span>
          <p className="text-gray-900 text-sm">
            {account.contact_address || "Not specified"}
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-900">Documents</h4>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {account.documents.length}
          </span>
        </div>

        {account.documents.length > 0 ? (
          <div className="space-y-1">
            {account.documents.slice(0, 3).map((doc) => (
              <div
                key={doc.id}
                className="text-sm text-gray-600 truncate flex items-center"
              >
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2 flex-shrink-0"></span>
                {doc.name}
              </div>
            ))}
            {account.documents.length > 3 && (
              <div className="text-sm text-gray-500 pl-3">
                +{account.documents.length - 3} more...
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No documents yet</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-400">
          Created: {formatDate(account.created_at)}
        </p>
      </div>
    </div>
  );
};
