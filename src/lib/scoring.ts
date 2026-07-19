//loops through every destionation and gives it a score based on how well it matches the user's answers

type UserAnswers = {
    budget: 'LOW' | 'MEDIUM' | 'HIGH'
    preferredTags: string[]
    climate?: string
    isCountry: boolean
}

type DestinationWithTags = {
    id: string
    name: string
    country: string
    description: string
    budget: 'LOW' | 'MEDIUM' | 'HIGH'
    climate: string
    tags: { name: string }[]
    isCountry: boolean
}

export function scoreDestinations(
    userAnswers: UserAnswers,
    destinations: DestinationWithTags[]
): DestinationWithTags {
    let highest = calculateScore(userAnswers, destinations[0])
    let currentHighest = destinations[0]
    for(const destination of destinations){
        
        const scoreForDestination = calculateScore(userAnswers, destination); 

        if(scoreForDestination>highest){
            highest = scoreForDestination;
            currentHighest = destination;
        }
        
    }

    return currentHighest;
}

function calculateScore(userAnswers: UserAnswers, destination: DestinationWithTags): number {
    let score = 0

    const peopleTag = ['solo', 'pair', 'friends', 'family']
    const typesTag = ['relaxation', 'sightseeing', 'adventure']

    for (const preferredTag of userAnswers.preferredTags) {
        const hasTag = destination.tags.some(tag => tag.name === preferredTag)
        
        if (hasTag) {
            if (peopleTag.includes(preferredTag)) {
                score += 5 
            } else if (typesTag.includes(preferredTag)) {
                score += 4 
            } else {
                score += 2 
            }
        }
    }

    if (destination.climate === userAnswers.climate) {
        score += 3
    } else if (userAnswers.climate) {
        const incompatible: Record<string, string[]> = {
            'Arctic': ['Tropical', 'Mediterranean'],
            'Tropical': ['Arctic', 'Continental'],
            'Mediterranean': ['Arctic'],
            'Continental': ['Tropical'],
        }
        if (incompatible[destination.climate]?.includes(userAnswers.climate)) {
            return -100 
        }
    }

    if (destination.budget === userAnswers.budget) {
        score += 5 
    } else {
        if ((destination.budget === 'HIGH' && userAnswers.budget === 'LOW') || 
            (destination.budget === 'LOW' && userAnswers.budget === 'HIGH')) {
            return -100
        }
        score -= 2 
    }

    if (destination.isCountry !== userAnswers.isCountry) {
        return -100
    }

    // if(destination.isCountry)

    return score;
}