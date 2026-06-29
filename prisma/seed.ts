import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  const hashedPassword = await bcrypt.hash("admin123", 10)
  await prisma.user.upsert({
    where: { email: "admin@joia.com.br" },
    update: {},
    create: {
      name: "Mariana",
      email: "admin@joia.com.br",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  const categories = [
    { name: "Vestidos", slug: "vestidos", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", order: 1 },
    { name: "Blusas", slug: "blusas", image: "https://images.unsplash.com/photo-1434389677669-e08b4cda3ca5?w=400&q=80", order: 2 },
    { name: "Calças", slug: "calcas", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", order: 3 },
    { name: "Moda Praia", slug: "moda-praia", image: "https://images.unsplash.com/photo-1570976447647-2633b1f6c5a1?w=400&q=80", order: 4 },
    { name: "Conjuntos", slug: "conjuntos", image: "https://images.unsplash.com/photo-1551048632-24e444b48a3e?w=400&q=80", order: 5 },
    { name: "Acessórios", slug: "acessorios", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80", order: 6 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }

  const vestidos = await prisma.category.findUnique({ where: { slug: "vestidos" } })
  if (vestidos) {
    const subs = [
      { name: "Curtos", slug: "vestidos-curtos", parentId: vestidos.id },
      { name: "Midi & Longos", slug: "vestidos-midi-longos", parentId: vestidos.id },
      { name: "Estampados", slug: "vestidos-estampados", parentId: vestidos.id },
    ]
    for (const sub of subs) {
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: sub,
        create: sub,
      })
    }
  }

  const allCategories = await prisma.category.findMany({ where: { parentId: null } })
  const catMap = new Map(allCategories.map((c) => [c.slug, c.id]))

  const products = [
    {
      name: "Vestido Gola Longo", slug: "vestido-gola-longo",
      description: "Vestido elegante com gola longa e caimento perfeito. Tecido leve e fluido, ideal para ocasiões especiais.",
      price: 109.9, compareAt: 149.9, categoryId: catMap.get("vestidos")!, badge: "oferta", featured: true,
      images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80", "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=800&q=80"],
      variants: [
        { color: "Azul", colorHex: "#4A90D9", size: "Único (38-42)", stock: 10, price: 109.9 },
        { color: "Verde", colorHex: "#5B8C5A", size: "Único (38-42)", stock: 8, price: 109.9 },
        { color: "Rosa", colorHex: "#D4859F", size: "Único (38-42)", stock: 5, price: 109.9 },
        { color: "Marrom", colorHex: "#8B6914", size: "Único (38-42)", stock: 7, price: 109.9 },
      ],
    },
    {
      name: "Vestido Estampado Yla", slug: "vestido-estampado-yla",
      description: "Vestido estampado exclusivo com modelagem que valoriza a silhueta.",
      price: 129.9, compareAt: null, categoryId: catMap.get("vestidos")!, badge: "novidade", featured: true,
      images: ["https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=800&q=80", "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80"],
      variants: [
        { color: "Azul", colorHex: "#4A90D9", size: "Único (36-42)", stock: 6, price: 129.9 },
        { color: "Verde", colorHex: "#5B8C5A", size: "Único (36-42)", stock: 4, price: 129.9 },
        { color: "Lilás", colorHex: "#B8A0C8", size: "Único (36-42)", stock: 8, price: 129.9 },
        { color: "Rosa", colorHex: "#D4859F", size: "Único (36-42)", stock: 3, price: 129.9 },
      ],
    },
    {
      name: "Short Saia Jeans", slug: "short-saia-jeans",
      description: "Short saia jeans com design moderno. Combina o conforto do short com o charme da saia.",
      price: 89.9, compareAt: 119.9, categoryId: catMap.get("calcas")!, badge: "oferta", featured: true,
      images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80"],
      variants: [
        { size: "36", stock: 5, price: 89.9 }, { size: "38", stock: 8, price: 89.9 },
        { size: "40", stock: 6, price: 89.9 }, { size: "44", stock: 4, price: 89.9 },
      ],
    },
    {
      name: "Regata Brasil Canelada", slug: "regata-brasil-canelada",
      description: "Regata canelada com estampa exclusiva Brasil. Confortável e estilosa.",
      price: 49.9, compareAt: null, categoryId: catMap.get("blusas")!, badge: "destaque", featured: true,
      images: ["https://images.unsplash.com/photo-1434389677669-e08b4cda3ca5?w=800&q=80", "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80"],
      variants: [{ color: "Verde", colorHex: "#5B8C5A", size: "Único P/M", stock: 12, price: 49.9 }],
    },
    {
      name: "Cropped Brasileirinha", slug: "cropped-brasileirinha",
      description: "Cropped estiloso com a cara do Brasil.",
      price: 49.9, compareAt: null, categoryId: catMap.get("blusas")!, badge: "novidade", featured: false,
      images: ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80", "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80"],
      variants: [{ color: "Verde", colorHex: "#5B8C5A", size: "Único P/M", stock: 9, price: 49.9 }],
    },
    {
      name: "Bermuda Jeans Brilho", slug: "bermuda-jeans-brilho",
      description: "Bermuda jeans com detalhes de brilho.",
      price: 99.9, compareAt: 139.9, categoryId: catMap.get("calcas")!, badge: "oferta", featured: false,
      images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"],
      variants: [
        { size: "38", stock: 4, price: 99.9 }, { size: "42", stock: 7, price: 99.9 },
        { size: "44", stock: 5, price: 99.9 }, { size: "46", stock: 3, price: 99.9 },
      ],
    },
    {
      name: "Conjunto Verão Tropical", slug: "conjunto-verao-tropical",
      description: "Conjunto perfeito para o verão. Top cropped + saia com estampa tropical.",
      price: 149.9, compareAt: null, categoryId: catMap.get("conjuntos")!, badge: "novidade", featured: true,
      images: ["https://images.unsplash.com/photo-1551048632-24e444b48a3e?w=800&q=80", "https://images.unsplash.com/photo-1570976447647-2633b1f6c5a1?w=800&q=80"],
      variants: [
        { size: "P", stock: 5, price: 149.9 }, { size: "M", stock: 8, price: 149.9 }, { size: "G", stock: 6, price: 149.9 },
      ],
    },
    {
      name: "Biquíni Crochê Brasil", slug: "biquini-croche-brasil",
      description: "Biquíni artesanal em crochê com as cores do Brasil.",
      price: 89.9, compareAt: 119.9, categoryId: catMap.get("moda-praia")!, badge: "oferta", featured: false,
      images: ["https://images.unsplash.com/photo-1570976447647-2633b1f6c5a1?w=800&q=80", "https://images.unsplash.com/photo-1551048632-24e444b48a3e?w=800&q=80"],
      variants: [
        { size: "P", stock: 3, price: 89.9 }, { size: "M", stock: 6, price: 89.9 }, { size: "G", stock: 4, price: 89.9 },
      ],
    },
    {
      name: "Bolsa de Palha Artesanal", slug: "bolsa-palha-artesanal",
      description: "Bolsa artesanal em palha natural com detalhes em couro.",
      price: 79.9, compareAt: null, categoryId: catMap.get("acessorios")!, badge: "destaque", featured: false,
      images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"],
      variants: [{ color: "Natural", colorHex: "#D2B48C", size: "Único", stock: 7, price: 79.9 }],
    },
    {
      name: "Vestido Penélope", slug: "vestido-penelope",
      description: "Vestido romântico com detalhes em renda.",
      price: 99.9, compareAt: 139.9, categoryId: catMap.get("vestidos")!, badge: "oferta", featured: true,
      images: ["https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80", "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"],
      variants: [
        { color: "Verde", colorHex: "#5B8C5A", size: "Único (34-42)", stock: 6, price: 99.9 },
        { color: "Lilás", colorHex: "#B8A0C8", size: "Único (34-42)", stock: 4, price: 99.9 },
        { color: "Marrom", colorHex: "#8B6914", size: "Único (34-42)", stock: 5, price: 99.9 },
        { color: "Azul Royal", colorHex: "#4169E1", size: "Único (34-42)", stock: 7, price: 99.9 },
      ],
    },
  ]

  for (const product of products) {
    const { images, variants, ...data } = product
    const created = await prisma.product.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    })
    await prisma.productImage.deleteMany({ where: { productId: created.id } })
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: { url: images[i], position: i, productId: created.id },
      })
    }
    await prisma.productVariant.deleteMany({ where: { productId: created.id } })
    for (const v of variants) {
      await prisma.productVariant.create({ data: { ...v, productId: created.id } })
    }
  }

  console.log("✅ Seed complete!")
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
