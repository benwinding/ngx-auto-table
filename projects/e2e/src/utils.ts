export async function setTimeoutAsync(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}