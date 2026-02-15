import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement depuis le fichier .env
dotenv.config({ path: join(__dirname, '.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Créer un utilisateur admin par défaut
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrateur',
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user created:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Créer des produits exemple
  const products = [
    {
      name: 'Smartphone Premium',
      description: 'Smartphone haut de gamme avec écran OLED 6.7", 256GB de stockage, triple caméra 108MP',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
      stock: 50
    },
    {
      name: 'Écouteurs Sans Fil',
      description: 'Écouteurs Bluetooth avec réduction de bruit active, autonomie 30h, qualité audio Hi-Fi',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      stock: 100
    },
    {
      name: 'Montre Connectée',
      description: 'Montre intelligente avec GPS, suivi de santé, écran AMOLED, étanche IP68',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      stock: 75
    },
    {
      name: 'Tablette Pro',
      description: 'Tablette 12.9" avec processeur M2, 512GB, stylet inclus, parfaite pour créateurs',
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      stock: 30
    },
    {
      name: 'Casque Gaming',
      description: 'Casque audio gaming 7.1 surround, micro détachable, RGB, confortable pour longues sessions',
      price: 179.99,
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
      stock: 60
    },
    {
      name: 'Clavier Mécanique',
      description: 'Clavier mécanique RGB, switches Cherry MX, rétroéclairage personnalisable, format compact',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
      stock: 80
    }
  ];

  // Supprimer les produits existants
  await prisma.product.deleteMany({});

  // Créer les nouveaux produits
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

