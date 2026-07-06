"use client"

export default function Result(){
    const data = JSON.parse(localStorage.getItem('result') ||'{}')
    const destination = data.destination

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1>{destination.name}</h1>
        </div>
    )

}


