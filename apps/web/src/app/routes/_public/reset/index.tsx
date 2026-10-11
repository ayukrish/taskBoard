import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/reset/')({
  component: () => (
    <main>
      <h1>Reset your password</h1>
    </main>
  ),
});
