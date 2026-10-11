export function safeRedirect(to: string | undefined): string {
  return to && to.startsWith('/') && !to.startsWith('//') ? to : '/';
}
