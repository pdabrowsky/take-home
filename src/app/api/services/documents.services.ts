import { createClient } from "@/utils/supabase/server";
import { Document, DocumentInsert } from "@/types/database";

export const createDocument = async (
  userId: string,
  documentData: Omit<DocumentInsert, "id">
): Promise<Document> => {
  const supabase = await createClient();

  // First verify the account belongs to the user
  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select("id")
    .eq("id", documentData.account_id)
    .eq("user_id", userId)
    .single();

  if (accountError || !account) {
    throw new Error("Account not found or access denied");
  }

  const { data, error } = await supabase
    .from("documents")
    .insert(documentData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create document: ${error.message}`);
  }

  return data as Document;
};

export const updateDocument = async (
  userId: string,
  documentId: string,
  updates: Partial<DocumentInsert>
): Promise<Document> => {
  const supabase = await createClient();

  // First verify the document belongs to a user's account
  const { data: document, error: fetchError } = await supabase
    .from("documents")
    .select(
      `
      id,
      accounts!inner (
        user_id
      )
    `
    )
    .eq("id", documentId)
    .single();

  if (
    fetchError ||
    !document ||
    (document as any).accounts.user_id !== userId
  ) {
    throw new Error("Document not found or access denied");
  }

  const { data, error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", documentId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update document: ${error.message}`);
  }

  return data as Document;
};

export const deleteDocument = async (
  userId: string,
  documentId: string
): Promise<void> => {
  const supabase = await createClient();

  // First verify the document belongs to a user's account
  const { data: document, error: fetchError } = await supabase
    .from("documents")
    .select(
      `
      id,
      accounts!inner (
        user_id
      )
    `
    )
    .eq("id", documentId)
    .single();

  if (
    fetchError ||
    !document ||
    (document as any).accounts.user_id !== userId
  ) {
    throw new Error("Document not found or access denied");
  }

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (error) {
    throw new Error(`Failed to delete document: ${error.message}`);
  }
};

export const getDocumentsByAccountId = async (
  userId: string,
  accountId: string
): Promise<Document[]> => {
  const supabase = await createClient();

  // First verify the account belongs to the user
  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select("id")
    .eq("id", accountId)
    .eq("user_id", userId)
    .single();

  if (accountError || !account) {
    throw new Error("Account not found or access denied");
  }

  const { data: documents, error } = await supabase
    .from("documents")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }

  return documents as Document[];
};

export const getDocumentById = async (
  userId: string,
  documentId: string
): Promise<Document> => {
  const supabase = await createClient();

  const { data: document, error } = await supabase
    .from("documents")
    .select(
      `
      *,
      accounts!inner (
        user_id
      )
    `
    )
    .eq("id", documentId)
    .single();

  if (error || !document || (document as any).accounts.user_id !== userId) {
    throw new Error("Document not found or access denied");
  }

  return document as Document;
};
