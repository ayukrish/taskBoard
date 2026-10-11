import { Link } from '@tanstack/react-router';
import { buttonVariants } from '../shared/ui/buttonVariants';

const highlights = [
  {
    title: 'Boards that move',
    text: 'Drag cards across columns with instant, optimistic updates and WIP limits.',
  },
  {
    title: 'Live collaboration',
    text: 'See teammates’ changes as they happen, with presence on every board.',
  },
  {
    title: 'Built for teams',
    text: 'Workspaces with Owner, Admin, Member and Viewer roles enforced on the server.',
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="flex items-center gap-2 font-semibold">
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-md bg-primary font-bold text-primary-foreground"
          >
            T
          </span>
          Taskboard
        </span>
        <nav aria-label="Account" className="flex items-center gap-2">
          <Link
            to="/login"
            className={buttonVariants({ variant: 'ghost', size: 'md' })}
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className={buttonVariants({ variant: 'primary', size: 'md' })}
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-12 px-6 py-12">
        <section className="flex max-w-2xl flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Plan, track and ship together.
          </h1>
          <p className="text-lg text-muted-foreground">
            A fast, keyboard-friendly project board for teams that move a lot of
            tickets.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/signup"
              className={buttonVariants({ variant: 'primary', size: 'lg' })}
            >
              Get started
            </Link>
            <Link
              to="/login"
              className={buttonVariants({ variant: 'secondary', size: 'lg' })}
            >
              Sign in
            </Link>
          </div>
        </section>

        <section aria-label="Highlights" className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-1 rounded-lg border bg-card p-5 text-card-foreground"
            >
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
