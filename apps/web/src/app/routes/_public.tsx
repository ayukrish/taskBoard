import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AuthLayout } from '../../features/auth/AuthLayout';

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
