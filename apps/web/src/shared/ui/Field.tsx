import type { ReactNode } from 'react';

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

export function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </span>
      )}
    </div>
  );
}
