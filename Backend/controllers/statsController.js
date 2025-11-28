const statsModel = require('../model/statsModel');

exports.getDashboardStats = async (req, res) => {
    try {
        // Ejecutamos las 3 consultas al mismo tiempo para que sea rápido
        const [totalVentas, inventario, ventasMensuales] = await Promise.all([
            statsModel.getTotalSales(),
            statsModel.getInventoryByCategory(),
            statsModel.getMonthlySales()
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalVentas,
                inventario,
                ventasMensuales
            }
        });

    } catch (error) {
        console.error("Error stats:", error);
        res.status(500).json({ success: false, message: "Error al cargar estadísticas" });
    }
};