export async function start() {
  const a = (await import('./provider.ts')).createAdapter();
  const b = (await import('./provider.ts'))['createOther']();
  return [a, b];
}
