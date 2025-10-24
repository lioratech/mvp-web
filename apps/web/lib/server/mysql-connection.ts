import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

/**
 * Get MySQL connection pool (singleton pattern)
 * Creates a connection pool that can be reused across requests
 */
export function getMySQLPool() {
  if (!pool) {
    // Using hardcoded credentials
    const config = {
      host: 'srv1435.hstgr.io',
      port: 3306,
      user: 'u796544318_Abracadabra',
      password: '0$HyIIdXA$Q',
      database: 'u796544318_L_analytic',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    };

    console.log('[MySQL] Creating new connection pool with hardcoded credentials:', {
      host: config.host,
      user: config.user,
      database: config.database,
      port: config.port,
    });
    
    pool = mysql.createPool(config);
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

