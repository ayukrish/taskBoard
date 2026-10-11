import type { LoginInput } from './schemas';

const API_URL = import.meta.env.VITE_API_URL as string;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function login(
  input: LoginInput,
): Promise<{ accessToken: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new ApiError(
      res.status,
      res.status === 401
        ? 'Invalid email or password.'
        : 'Something went wrong. Please try again.',
    );
  }

  return res.json();
}
