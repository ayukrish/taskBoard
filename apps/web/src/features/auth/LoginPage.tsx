import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
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
    <main>
      <h1>Welcome back</h1>
      <p>Sign in to your workspace.</p>

      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        {mutation.isError && <p role="alert">{mutation.error.message}</p>}

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && <span id="email-error">{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <span id="password-error">{errors.password.message}</span>
          )}
        </div>

        <Link to="/reset">Forgot password?</Link>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </main>
  );
}
