export type CreateAccountData = {
  name: string;
  location: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
};

export type CreateAccountFormProps = {
  onSubmit: (data: CreateAccountData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
};
