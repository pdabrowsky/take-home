import { IconProps } from "./Icon.types";

const icons = {
  "shield-check": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  ),
  login: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  ),
  "document-text": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  ),
  "pdf-document": (
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
  ),
  trash: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  ),
  "office-building": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  ),
  "cloud-upload": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  ),
  "x-mark": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  ),
};

export const Icon = ({ name, className, size, width, height }: IconProps) => {
  const iconPath = icons[name as keyof typeof icons];

  if (!iconPath) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const finalWidth = width || size || 24;
  const finalHeight = height || size || 24;

  const isPdfDocument = name === "pdf-document";

  return (
    <svg
      width={finalWidth}
      height={finalHeight}
      viewBox="0 0 24 24"
      fill={isPdfDocument ? "currentColor" : "none"}
      stroke={isPdfDocument ? "none" : "currentColor"}
      className={className}
    >
      {iconPath}
    </svg>
  );
};
