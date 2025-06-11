import { ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: ReactNode;
  showCloseButton?: boolean;
};
