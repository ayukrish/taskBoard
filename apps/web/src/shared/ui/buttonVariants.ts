import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-md border font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'border-transparent bg-primary text-primary-foreground hover:brightness-110',
        secondary: 'border-input bg-card text-foreground hover:bg-muted',
        ghost: 'border-transparent bg-transparent hover:bg-muted',
        danger:
          'border-transparent bg-destructive text-destructive-foreground hover:brightness-110',
      },
      size: {
        sm: 'h-7 px-2.5 text-xs',
        md: 'h-9 px-3.5 text-sm',
        lg: 'h-11 px-5 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);
