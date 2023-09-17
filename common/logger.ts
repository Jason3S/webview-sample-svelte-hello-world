export enum LogLevel {
  none,
  error,
  warn,
  info,
  debug,
}

let logLevel = LogLevel.error;

export const log = makeLogger(console.log, LogLevel.info);
export const error = makeLogger(console.error, LogLevel.error);
export const warn = makeLogger(console.warn, LogLevel.warn);
export const info = makeLogger(console.info, LogLevel.info);
export const debug = makeLogger(console.debug, LogLevel.debug);

export function setLogLevel(level: LogLevel) {
  logLevel = level;
}

export function getLogLevel(): LogLevel {
  return logLevel;
}

function makeLogger(logFn: (...p: any[]) => void, level: LogLevel) {
  return function (...params: any[]) {
    if (logLevel < level) return;
    logFn(...params);
  };
}
