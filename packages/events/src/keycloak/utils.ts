export function getResourceIdFromResourcePath(resourcePath: string): string {
  return resourcePath.split('/')[1];
}
