import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Toutes les routes nécessitent les droits admin
router.use(requireAdmin);

// GET /api/admin/products - Récupérer tous les produits avec statistiques
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        _count: {
          select: {
            cartItems: true,
            orderItems: true,
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

// POST /api/admin/products - Créer un nouveau produit
router.post('/', async (req, res) => {
  try {
    const { name, description, price, image, stock, categoryId } = req.body;

    if (!name || !description || price === undefined || !image) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        stock: parseInt(stock) || 0,
        categoryId: categoryId || null
      },
      include: {
        category: true
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

// PUT /api/admin/products/:id - Mettre à jour un produit
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, image, stock, categoryId } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(image && { image }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(categoryId !== undefined && { categoryId: categoryId || null })
      },
      include: {
        category: true
      }
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
  }
});

// DELETE /api/admin/products/:id - Supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
});

export default router;

