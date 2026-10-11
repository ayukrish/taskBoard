import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  Link,
  Outlet,
  type ErrorComponentProps,
} from '@tanstack/react-router';

export interface RouterContext {
  queryClient: QueryClient;
  // M1: auth state is added here so `beforeLoad` guards can read it
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: RootError,
});

function RootLayout() {
  return (
    <>
      <Outlet />
      {/* M0: <Toaster /> goes here */}
    </>
  );
}

function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page may have moved, or you may not have access to it.</p>
      <Link to="/">Go home</Link>
    </main>
  );
}

function RootError({ error, reset }: ErrorComponentProps) {
  return (
    <main role="alert">
      <h1>Something went wrong</h1>
      <p>{error instanceof Error ? error.message : 'Unexpected error'}</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
