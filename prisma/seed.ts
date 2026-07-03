import "dotenv/config"
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const destinations = [
  {
    name: 'Barcelona',
    country: 'Spain',
    description: 'A vibrant coastal city with stunning architecture, world-class food, and beautiful beaches',
    budget: 'MEDIUM' as const,
    climate: 'Mediterranean',
    tags: ['food', 'beaches', 'nightlife', 'culture'],
  },
  {
    name: 'Iceland',
    country: 'Iceland',
    description: 'A dramatic landscape of volcanoes, geysers, and the northern lights',
    budget: 'HIGH' as const,
    climate: 'Arctic',
    tags: ['nature', 'hiking', 'adventure'],
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    description: 'A city where ancient temples meet futuristic technology and incredible food',
    budget: 'HIGH' as const,
    climate: 'Temperate',
    tags: ['food', 'culture', 'museums', 'nightlife'],
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    description: 'A tropical paradise with lush rice terraces, temples, and stunning beaches',
    budget: 'LOW' as const,
    climate: 'Tropical',
    tags: ['beaches', 'nature', 'hiking', 'adventure'],
  },
  {
    name: 'Prague',
    country: 'Czech Republic',
    description: 'A fairy-tale city with medieval architecture, rich history, and vibrant nightlife',
    budget: 'LOW' as const,
    climate: 'Continental',
    tags: ['culture', 'museums', 'food', 'nightlife'],
  },
  {
    name: 'New York',
    country: 'USA',
    description: 'The city that never sleeps — iconic skyline, world-class museums, and endless food',
    budget: 'HIGH' as const,
    climate: 'Temperate',
    tags: ['nightlife', 'food', 'museums', 'culture'],
  },
]


async function main() {
  //Create all tags first
  const allTags = [...new Set(destinations.flatMap(d => d.tags))]
  
  await Promise.all(
    allTags.map(tag=>
        prisma.tag.upsert({
            where: { name: tag},
            update: {},
            create: { name: tag}
        })
    )
  )

  console.log(`Created ${allTags.length} tags`)

  //Create destinations with their tags
  for (const destination of destinations){
        await prisma.destination.upsert({
            where: { name: destination.name },
            update: {},
            create: {
            name: destination.name,
            country: destination.country,
            description: destination.description,
            budget: destination.budget,
            climate: destination.climate,
            tags: {
                connect: destination.tags.map(tag => ({name: tag}))
            }
            }
        })
    console.log(`Created destination: ${destination.name}`)
  }

  
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })