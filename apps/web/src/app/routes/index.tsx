import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => (
    <main>
      <h1>Taskboard</h1>
    </main>
  ),
});
