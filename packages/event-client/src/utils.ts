export function stringifyPossibleError(possibleError: unknown): string {
  return possibleError instanceof Error
    ? (possibleError.stack ?? possibleError.message)
    : JSON.stringify(possibleError);
}
