import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Plan your perfect trip in under a minute.</h1>
      <p className="text-lg text-gray-500 mb-8">Answer a few questions and get a personalized travel itinerary.</p>
      <Link href="/questionnaire" className="bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition">
        Start Planning
      </Link>
    </div>
  )
}