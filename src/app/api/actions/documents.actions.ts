"use server";

import { auth } from "@/lib/auth";
import { createDocumentSchema, updateDocumentSchema } from "@/lib/validations";
import {
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentById,
} from "../services/documents.services";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function createDocumentAction(documentData: {
  account_id: string;
  name: string;
  description?: string;
  file_path?: string;
  file_size?: number;
  file_type?: string;
}) {
  try {
    const {
      data: { user },
      error,
    } = await auth.getServerUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const result = createDocumentSchema.safeParse(documentData);
    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => err.message)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessages}`);
    }

    const newDocument = await createDocument(user.id, {
      account_id: result.data.account_id,
      name: result.data.name,
      description: result.data.description || null,
      file_path: result.data.file_path || null,
      file_size: result.data.file_size || null,
      file_type: result.data.file_type || null,
    });

    revalidatePath("/dashboard");
    return { success: true, data: newDocument };
  } catch (error) {
    console.error("Error creating document:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create document";

    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("access denied")
    ) {
      return { success: false, error: "Account not found" };
    }

    return { success: false, error: errorMessage };
  }
}

export async function updateDocumentAction(
  documentId: string,
  updates: {
    name?: string;
    description?: string;
    file_path?: string;
    file_size?: number;
    file_type?: string;
  }
) {
  try {
    const {
      data: { user },
      error,
    } = await auth.getServerUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const result = updateDocumentSchema.safeParse(updates);
    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => err.message)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessages}`);
    }

    const updatedDocument = await updateDocument(user.id, documentId, {
      ...(result.data.name && { name: result.data.name }),
      ...(result.data.description !== undefined && {
        description: result.data.description,
      }),
      ...(result.data.file_path !== undefined && {
        file_path: result.data.file_path,
      }),
      ...(result.data.file_size !== undefined && {
        file_size: result.data.file_size,
      }),
      ...(result.data.file_type !== undefined && {
        file_type: result.data.file_type,
      }),
    });

    revalidatePath("/dashboard");
    return { success: true, data: updatedDocument };
  } catch (error) {
    console.error("Error updating document:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update document";

    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("access denied")
    ) {
      return { success: false, error: "Document not found" };
    }

    return { success: false, error: errorMessage };
  }
}

export async function deleteDocumentAction(documentId: string) {
  try {
    const {
      data: { user },
      error,
    } = await auth.getServerUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const documentData = await getDocumentById(user.id, documentId);

    if (documentData.file_path) {
      const supabase = await createClient();

      const urlParts = documentData.file_path.split("/");
      const fileName = urlParts.slice(-3).join("/");

      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([fileName]);

      if (storageError) {
        console.warn(
          "Failed to delete file from storage:",
          storageError.message
        );
      }
    }

    await deleteDocument(user.id, documentId);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete document";

    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("access denied")
    ) {
      return { success: false, error: "Document not found" };
    }

    return { success: false, error: errorMessage };
  }
}

export async function getDocumentAction(documentId: string) {
  try {
    const {
      data: { user },
      error,
    } = await auth.getServerUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const document = await getDocumentById(user.id, documentId);
    return { success: true, data: document };
  } catch (error) {
    console.error("Error fetching document:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch document";

    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("access denied")
    ) {
      return { success: false, error: "Document not found" };
    }

    return { success: false, error: errorMessage };
  }
}

export async function uploadDocumentAction(formData: FormData) {
  try {
    const {
      data: { user },
      error,
    } = await auth.getServerUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    const accountId = formData.get("account_id") as string;
    const description = formData.get("description") as string;

    if (!file || !accountId) {
      throw new Error("File and account ID are required");
    }

    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are allowed");
    }

    const supabase = await createClient();

    const fileName = `${user.id}/${accountId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    const newDocument = await createDocument(user.id, {
      account_id: accountId,
      name: file.name,
      description: description || null,
      file_path: urlData.publicUrl,
      file_size: file.size,
      file_type: file.type,
    });

    revalidatePath("/dashboard");
    return { success: true, data: newDocument };
  } catch (error) {
    console.error("Error uploading document:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload document";
    return { success: false, error: errorMessage };
  }
}
