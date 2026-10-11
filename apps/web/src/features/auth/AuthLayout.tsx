import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

const miniColumns = [2, 3, 1];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <main className="grid place-items-center p-6">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span
              aria-hidden="true"
              className="grid size-7 place-items-center rounded-md bg-primary font-bold text-primary-foreground"
            >
              T
            </span>
            Taskboard
          </Link>
          {children}
        </div>
      </main>

      <aside
        aria-hidden="true"
        className="hidden place-items-center bg-primary p-8 text-primary-foreground md:grid"
      >
        <div className="w-full max-w-md">
          <h2 className="mb-6 text-xl font-semibold">
            Plan, track and ship together.
          </h2>
          <div className="grid grid-cols-3 gap-2.5">
            {miniColumns.map((cards, column) => (
              <div
                key={column}
                className="grid content-start gap-1.5 rounded-lg bg-primary-foreground/20 p-2"
              >
                {Array.from({ length: cards }, (_, card) => (
                  <i
                    key={card}
                    className="block h-7 rounded-sm bg-primary-foreground/40"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
