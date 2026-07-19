import "dotenv/config"
// import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaClient } from "@prisma/client"
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
    tags: ['friends', 'solo', 'city', 'food', 'beaches', 'nightlife', 'culture', 'architecture', 'sightseeing'],
    isCountry: false
  },
  {
    name: 'Iceland',
    country: 'Iceland',
    description: 'A dramatic landscape of volcanoes, geysers, and the northern lights',
    budget: 'HIGH' as const,
    climate: 'Arctic',
    tags: ['friends', 'solo', 'pair', 'nature', 'hiking', 'adventure'],
    isCountry: true
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    description: 'A city where ancient temples meet futuristic technology and incredible food',
    budget: 'HIGH' as const,
    climate: 'Temperate',
    tags: ['solo', 'pair', 'friends', 'city', 'food', 'culture', 'museums', 'nightlife', 'shopping', 'sightseeing'],
    isCountry: false
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    description: 'A tropical paradise with lush rice terraces, temples, and stunning beaches',
    budget: 'LOW' as const,
    climate: 'Tropical',
    tags: ['family', 'solo', 'pair', 'beaches', 'nature', 'hiking', 'adventure', 'wellness', 'relaxation'],
    isCountry: false
  },
  {
    name: 'Prague',
    country: 'Czech Republic',
    description: 'A fairy-tale city with medieval architecture, rich history, and vibrant nightlife',
    budget: 'LOW' as const,
    climate: 'Continental',
    tags: ['friends', 'solo', 'pair', 'city', 'culture', 'museums', 'food', 'nightlife', 'architecture', 'romance', 'sightseeing'],
    isCountry: false
  },
  {
    name: 'New York',
    country: 'USA',
    description: 'The city that never sleeps — iconic skyline, world-class museums, and endless food',
    budget: 'HIGH' as const,
    climate: 'Temperate',
    tags: ['friends', 'pair', 'family', 'solo', 'city', 'nightlife', 'food', 'museums', 'culture', 'shopping', 'architecture', 'sightseeing'],
    isCountry: false
  },
  {
    name: 'Mykonos',
    country: 'Greece',
    description: 'A glamorous Greek island known for its stunning beaches, vibrant nightlife, and iconic whitewashed architecture',
    budget: 'HIGH' as const,
    climate: 'Mediterranean',
    tags: ['friends', 'pair', 'beaches', 'nightlife', 'food', 'culture', 'nature', 'architecture', 'relaxation', 'romance'],
    isCountry: false
  },
  {
    name: 'Paris',
    country: 'France',
    description: 'The city of love — iconic landmarks, world-class cuisine, art museums, and unmatched romantic atmosphere',
    budget: 'HIGH' as const,
    climate: 'Continental',
    tags: ['friends', 'pair', 'family', 'city', 'nightlife', 'food', 'museums', 'culture', 'architecture', 'romance', 'shopping', 'sightseeing'],
    isCountry: false
  },
  {
    name: 'Thailand',
    country: 'Thailand',
    description: 'A tropical paradise with golden temples, vibrant street food, and stunning island beaches',
    budget: 'LOW' as const,
    climate: 'Tropical',
    tags: ['family', 'solo', 'pair', 'beaches', 'food', 'culture', 'adventure', 'nature', 'shopping', 'sightseeing'],
    isCountry: true
  },
  {
    name: 'Lisbon',
    country: 'Portugal',
    description: 'A charming coastal capital with colorful tiles, hilltop viewpoints, and a buzzing food scene',
    budget: 'LOW' as const,
    climate: 'Mediterranean',
    tags: ['friends', 'pair', 'solo', 'nightlife', 'food', 'culture', 'architecture', 'city', 'sightseeing'],
    isCountry: false
  },
  {
    name: 'Marrakech',
    country: 'Morocco',
    description: 'A sensory explosion of souks, spices, riads, and stunning desert landscapes',
    budget: 'MEDIUM' as const,
    climate: 'Continental',
    tags: ['friends', 'solo', 'pair', 'culture', 'food', 'adventure', 'architecture', 'shopping', 'sightseeing'],
    isCountry: false
  },
  {
    name: 'Athens',
    country: 'Greece',
    description: 'The cradle of western civilization — ancient ruins, vibrant markets, and Mediterranean charm',
    budget: 'MEDIUM' as const,
    climate: 'Mediterranean',
    tags: ['friends', 'pair', 'culture', 'museums', 'food', 'architecture', 'city', 'sightseeing'],
    isCountry: false
  },
  {
    name: 'Switzerland',
    country: 'Switzerland',
    description: 'Pristine alpine landscapes, charming villages, and world-class skiing and hiking',
    budget: 'HIGH' as const,
    climate: 'Continental',
    tags: ['friends', 'family', 'pair', 'solo', 'hiking', 'nature', 'adventure', 'wellness'],
    isCountry: true
  },
  {
    name: 'Norway',
    country: 'Norway',
    description: 'Dramatic fjords, northern lights, and untouched wilderness at the edge of the world',
    budget: 'HIGH' as const,
    climate: 'Arctic',
    tags: ['friends', 'solo', 'pair', 'nature', 'hiking', 'adventure'],
    isCountry: true
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
            update: {
                isCountry: destination.isCountry  // ← přidej toto
            },
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