import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { login } from './api';
import { safeRedirect } from './safeRedirect';
import { loginSchema, type LoginInput } from './schemas';

export function LoginPage({ redirect }: { redirect?: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => router.history.push(safeRedirect(redirect)),
  });

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your workspace.</p>
      </div>

      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        noValidate
        className="flex flex-col gap-4"
      >
        {mutation.isError && (
          <p
            role="alert"
            className="rounded-md bg-destructive/15 px-3 py-2 font-medium text-destructive"
          >
            {mutation.error.message}
          </p>
        )}

        <Field id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
        </Field>

        <Field id="password" label="Password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
        </Field>

        <Link to="/reset" className="text-primary hover:underline">
          Forgot password?
        </Link>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-muted-foreground">
        No account?{' '}
        <Link to="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}
