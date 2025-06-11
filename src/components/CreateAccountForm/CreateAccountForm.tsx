import { useState } from "react";
import { Button } from "@/components/Button";
import { createAccountSchema } from "@/lib/validations";
import { CreateAccountFormProps } from "./CreateAccountForm.types";

const initialFormData = {
  name: "",
  location: "",
  contact_email: "",
  contact_phone: "",
  contact_address: "",
};

export const CreateAccountForm = ({
  onSubmit,
  onCancel,
  isLoading,
}: CreateAccountFormProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToValidate = {
      name: formData.name,
      location: formData.location || undefined,
      contact_email: formData.contact_email || undefined,
      contact_phone: formData.contact_phone || undefined,
      contact_address: formData.contact_address || undefined,
    };

    const result = createAccountSchema.safeParse(dataToValidate);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    await onSubmit(result.data);
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter account name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter location"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="text"
          name="contact_email"
          value={formData.contact_email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter email address"
        />
        {errors.contact_email && (
          <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="text"
          name="contact_phone"
          value={formData.contact_phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          name="contact_address"
          value={formData.contact_address}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          rows={3}
          placeholder="Enter address"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} loading={isLoading}>
          Create Account
        </Button>
      </div>
    </form>
  );
};
