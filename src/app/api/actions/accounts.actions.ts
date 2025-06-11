"use server";

import { auth } from "@/lib/auth";
import { createAccountSchema, updateAccountSchema } from "@/lib/validations";
import {
  getAccountsWithDocuments,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../services/accounts.services";
import { revalidatePath } from "next/cache";

export async function getAccountsAction() {
  try {
    const {
      data: { user },
      error,
    } = await auth.getServerUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const accounts = await getAccountsWithDocuments(user.id);
    return { success: true, data: accounts };
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch accounts",
    };
  }
}

export async function createAccountAction(accountData: {
  name: string;
  location?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
}) {
  try {
    const {
      data: { user },
      error,
    } = await auth.getServerUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const result = createAccountSchema.safeParse(accountData);
    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => err.message)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessages}`);
    }

    const newAccount = await createAccount(user.id, {
      name: result.data.name,
      location: result.data.location || null,
      contact_email: result.data.contact_email || null,
      contact_phone: result.data.contact_phone || null,
      contact_address: result.data.contact_address || null,
    });

    revalidatePath("/dashboard");
    return { success: true, data: newAccount };
  } catch (error) {
    console.error("Error creating account:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create account",
    };
  }
}

export async function updateAccountAction(
  accountId: string,
  updates: {
    name?: string;
    location?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
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

    const result = updateAccountSchema.safeParse(updates);
    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => err.message)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessages}`);
    }

    const updatedAccount = await updateAccount(user.id, accountId, {
      ...(result.data.name && { name: result.data.name }),
      ...(result.data.location !== undefined && {
        location: result.data.location,
      }),
      ...(result.data.contact_email !== undefined && {
        contact_email: result.data.contact_email,
      }),
      ...(result.data.contact_phone !== undefined && {
        contact_phone: result.data.contact_phone,
      }),
      ...(result.data.contact_address !== undefined && {
        contact_address: result.data.contact_address,
      }),
    });

    revalidatePath("/dashboard");
    return { success: true, data: updatedAccount };
  } catch (error) {
    console.error("Error updating account:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update account";

    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("access denied")
    ) {
      return { success: false, error: "Account not found" };
    }

    return { success: false, error: errorMessage };
  }
}

export async function deleteAccountAction(accountId: string) {
  try {
    const {
      data: { user },
      error,
    } = await auth.getServerUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    await deleteAccount(user.id, accountId);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete account";

    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("access denied")
    ) {
      return { success: false, error: "Account not found" };
    }

    return { success: false, error: errorMessage };
  }
}
