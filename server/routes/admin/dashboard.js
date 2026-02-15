import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Toutes les routes nécessitent les droits admin
router.use(requireAdmin);

// GET /api/admin/dashboard - Statistiques du dashboard
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Chiffre d'affaires
    const revenueToday = await getRevenue(today, now);
    const revenueThisWeek = await getRevenue(thisWeek, now);
    const revenueThisMonth = await getRevenue(thisMonth, now);

    // Commandes
    const ordersToday = await prisma.order.count({
      where: { createdAt: { gte: today } }
    });

    const ordersPending = await prisma.order.count({
      where: { status: 'PENDING' }
    });

    // Produits
    const totalProducts = await prisma.product.count();
    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 10 } },
      select: {
        id: true,
        name: true,
        stock: true
      }
    });

    // Produits les plus vendus
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            image: true,
            price: true
          }
        });
        return {
          ...product,
          totalSold: item._sum.quantity
        };
      })
    );

    res.json({
      revenue: {
        today: revenueToday,
        thisWeek: revenueThisWeek,
        thisMonth: revenueThisMonth
      },
      orders: {
        today: ordersToday,
        pending: ordersPending
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts
      },
      topProducts: topProductsWithDetails
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

async function getRevenue(startDate, endDate) {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: 'PAID'
    },
    select: { total: true }
  });

  return orders.reduce((sum, order) => sum + order.total, 0);
}

export default router;

