// CondomX configuration — loads and validates environment variables

interface Config {
  port: number;
  redisUrl: string;
  dbPath: string;
  nodeEnv: 'development' | 'production' | 'test';
}

function loadConfig(): Config {
  const nodeEnv = process.env['NODE_ENV'] ?? 'development';
  if (nodeEnv !== 'development' && nodeEnv !== 'production' && nodeEnv !== 'test') {
    throw new Error(`Invalid NODE_ENV: ${nodeEnv}. Must be development, production, or test.`);
  }

  const portStr = process.env['PORT'] ?? '3200';
  const port = parseInt(portStr, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${portStr}. Must be a number between 1 and 65535.`);
  }

  const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
  const dbPath = process.env['DB_PATH'] ?? 'data/condomx.db';

  return { port, redisUrl, dbPath, nodeEnv };
}

export const config: Config = loadConfig();
