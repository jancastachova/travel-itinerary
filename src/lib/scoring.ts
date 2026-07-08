//loops through every destionation and gives it a score based on how well it matches the user's answers

type UserAnswers = {
    budget: 'LOW' | 'MEDIUM' | 'HIGH'
    preferredTags: string[]
    climate?: string
}

type DestinationWithTags = {
    id: string
    name: string
    country: string
    description: string
    budget: 'LOW' | 'MEDIUM' | 'HIGH'
    climate: string
    tags: { name: string }[]
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

function calculateScore(userAnswers: UserAnswers, destination: DestinationWithTags): number{
    let score = 0

    for(const preferredTag of userAnswers.preferredTags){
        const hasTag = destination.tags.some(tag=>tag.name === preferredTag) //.some function =>at least one destination
        if (hasTag) score += 2
    }

    if(destination.climate === userAnswers.climate){
        score+=3
    }

    if(destination.budget === userAnswers.budget){
        score+=3
    }else if( (destination.budget === 'HIGH' && userAnswers.budget === 'LOW') || (destination.budget === 'LOW' && userAnswers.budget === 'HIGH') ) {
        score=-1
    } 
    return score;
}