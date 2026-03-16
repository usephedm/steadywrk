// CondomX structured logger — JSON to stdout, PM2 captures

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  [key: string]: unknown;
}

function emit(level: LogLevel, module: string, message: string, data?: Record<string, unknown>): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    module,
    message,
    ...data,
  };
  const line = JSON.stringify(entry);
  if (level === 'error') {
    process.stderr.write(line + '\n');
  } else {
    process.stdout.write(line + '\n');
  }
}

export function createLogger(module: string) {
  return {
    debug(message: string, data?: Record<string, unknown>) {
      emit('debug', module, message, data);
    },
    info(message: string, data?: Record<string, unknown>) {
      emit('info', module, message, data);
    },
    warn(message: string, data?: Record<string, unknown>) {
      emit('warn', module, message, data);
    },
    error(message: string, data?: Record<string, unknown>) {
      emit('error', module, message, data);
    },
  };
}

export type Logger = ReturnType<typeof createLogger>;
