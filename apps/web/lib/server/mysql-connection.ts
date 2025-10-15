import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

/**
 * Get MySQL connection pool (singleton pattern)
 * Creates a connection pool that can be reused across requests
 */
export function getMySQLPool() {
    console.log("BANCO DE DADOS", process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, process.env.MYSQL_DATABASE, process.env.MYSQL_PORT);
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER,
      password: '0$HyIIdXA$Q',
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }

  return pool;
}

/**
 * Execute a query using the connection pool
 */
export async function executeQuery<T = any>(
  query: string,
  params?: any[]
): Promise<T> {
  const pool = getMySQLPool();
  const [rows] = await pool.execute(query, params);
  return rows as T;
}

/**
 * Close the connection pool (useful for cleanup)
 */
export async function closeMySQLPool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

