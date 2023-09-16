let debugMode = true;

export function log(...params: any[]): void {
  if (!debugMode) return;
  console.log(...params);
}

export function setDebugMode(mode: boolean) {
  debugMode = mode;
}
