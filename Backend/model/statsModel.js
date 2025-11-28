const pool = require('../db/db');

/**
 * 1. Total de Ventas Histórico ($)
 */
const getTotalSales = async () => {
    const [rows] = await pool.execute('SELECT SUM(total) as total FROM orders');
    return rows[0].total || 0;
};

/**
 * 2. Inventario por Categoría (Cuenta productos)
 */
const getInventoryByCategory = async () => {
    const [rows] = await pool.execute(
        `SELECT categoria, SUM(stock) as total_stock 
         FROM productos 
         GROUP BY categoria`
    );
    return rows;
};

/**
 * 3. Ventas Mensuales (Agrupadas por Mes-Año)
 */
const getMonthlySales = async () => {
    // Esta consulta agrupa por "Año-Mes" (ej: 2025-11) y suma los totales
    const [rows] = await pool.execute(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') as mes, SUM(total) as total 
         FROM orders 
         GROUP BY mes 
         ORDER BY mes ASC 
         LIMIT 6` // Últimos 6 meses
    );
    return rows;
};

module.exports = { getTotalSales, getInventoryByCategory, getMonthlySales };