import { createClient } from "@/utils/supabase/server";
import { Account, Document, AccountInsert } from "@/types/database";

type AccountWithDocuments = Account & { documents: Document[] };

export const getAccountsWithDocuments = async (
  userId: string
): Promise<AccountWithDocuments[]> => {
  const supabase = await createClient();

  const { data: accounts, error: accountsError } = await supabase
    .from("accounts")
    .select(
      `
      *,
      documents (*)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (accountsError) {
    throw new Error(`Failed to fetch accounts: ${accountsError.message}`);
  }

  return accounts as AccountWithDocuments[];
};

export const createAccount = async (
  userId: string,
  accountData: Omit<AccountInsert, "user_id">
): Promise<Account> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("accounts")
    .insert({ ...accountData, user_id: userId })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create account: ${error.message}`);
  }

  return data as Account;
};

export const updateAccount = async (
  userId: string,
  accountId: string,
  updates: Partial<AccountInsert>
): Promise<Account> => {
  const supabase = await createClient();

  // First verify the account belongs to the user
  const { data: existingAccount, error: fetchError } = await supabase
    .from("accounts")
    .select("id")
    .eq("id", accountId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !existingAccount) {
    throw new Error("Account not found or access denied");
  }

  const { data, error } = await supabase
    .from("accounts")
    .update(updates)
    .eq("id", accountId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update account: ${error.message}`);
  }

  return data as Account;
};

export const deleteAccount = async (
  userId: string,
  accountId: string
): Promise<void> => {
  const supabase = await createClient();

  // First verify the account belongs to the user
  const { data: existingAccount, error: fetchError } = await supabase
    .from("accounts")
    .select("id")
    .eq("id", accountId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !existingAccount) {
    throw new Error("Account not found or access denied");
  }

  const { error } = await supabase
    .from("accounts")
    .delete()
    .eq("id", accountId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete account: ${error.message}`);
  }
};

export const getAccountById = async (
  userId: string,
  accountId: string
): Promise<AccountWithDocuments> => {
  const supabase = await createClient();

  const { data: account, error } = await supabase
    .from("accounts")
    .select(
      `
      *,
      documents (*)
    `
    )
    .eq("id", accountId)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch account: ${error.message}`);
  }

  return account as AccountWithDocuments;
};
