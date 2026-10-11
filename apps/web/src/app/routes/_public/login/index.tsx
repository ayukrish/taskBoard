import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { LoginPage } from '../../../../features/auth/LoginPage';

export const Route = createFileRoute('/_public/login/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(undefined),
  }),
  component: LoginRoute,
});

function LoginRoute() {
  const { redirect } = Route.useSearch();
  return <LoginPage redirect={redirect} />;
}
