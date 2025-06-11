"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import {
  CreateAccountForm,
  CreateAccountData,
} from "@/components/CreateAccountForm";
import { AccountCard } from "@/components/AccountCard";
import { AccountWithDocuments, AccountsListProps } from "./AccountsList.types";
import {
  createAccountAction,
  deleteAccountAction,
} from "@/app/api/actions/accounts.actions";
import { Document } from "@/types/database";

export const AccountsList = ({ initialAccounts }: AccountsListProps) => {
  const [accounts, setAccounts] =
    useState<AccountWithDocuments[]>(initialAccounts);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreateAccount = async (data: CreateAccountData) => {
    startTransition(async () => {
      try {
        const result = await createAccountAction({
          name: data.name,
          location: data.location || undefined,
          contact_email: data.contact_email || undefined,
          contact_phone: data.contact_phone || undefined,
          contact_address: data.contact_address || undefined,
        });

        if (result.success && result.data) {
          const accountWithDocuments: AccountWithDocuments = {
            id: result.data.id,
            user_id: result.data.user_id,
            name: result.data.name,
            location: result.data.location,
            contact_email: result.data.contact_email,
            contact_phone: result.data.contact_phone,
            contact_address: result.data.contact_address,
            created_at: result.data.created_at,
            updated_at: result.data.updated_at,
            documents: [],
          };

          setAccounts([accountWithDocuments, ...accounts]);
          setIsCreateModalOpen(false);
        } else {
          alert(`Failed to create account: ${result.error}`);
        }
      } catch (error) {
        console.error("Failed to create account:", error);
        alert("Failed to create account. Please try again.");
      }
    });
  };

  const handleDeleteAccount = async (accountId: string) => {
    startTransition(async () => {
      try {
        const result = await deleteAccountAction(accountId);

        if (result.success) {
          setAccounts(accounts.filter((account) => account.id !== accountId));
        } else {
          alert(`Failed to delete account: ${result.error}`);
        }
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("Failed to delete account. Please try again.");
      }
    });
  };

  const handleDocumentUpdate = (accountId: string, documents: Document[]) => {
    setAccounts(
      accounts.map((account) =>
        account.id === accountId ? { ...account, documents } : account
      )
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Accounts</h2>
        <Button onClick={() => setIsCreateModalOpen(true)} disabled={isPending}>
          Add Account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No accounts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first account to manage documents and
              information.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
              Create Your First Account
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onDelete={handleDeleteAccount}
              isDeleting={isPending}
              onDocumentUpdate={handleDocumentUpdate}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Account"
        size="lg"
      >
        <CreateAccountForm
          onSubmit={handleCreateAccount}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isPending}
        />
      </Modal>
    </div>
  );
};
