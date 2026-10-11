import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm placeholder:text-muted-foreground aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}
