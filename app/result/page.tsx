"use client";
import Link from "next/link";

export default function Result() {
  
  
  const data = typeof window !== "undefined" 
    ? JSON.parse(localStorage.getItem("result") || "{}")
    : {};
  
  
  const destination = data.destination;
  const image = `/images/${destination.name?.toLowerCase()}.jpg`;
  const tagsArray = data.destination.tags;

  return (
    <div
      className="w-full max-w-2xl aspect-[1/1.414] bg-[#fafafa] flex flex-col items-center justify-start
             border-[6px] border-yellow-400 rounded-2xl p-10 mx-auto my-auto mt-4 mb-4 shadow-2xl"
    >
      <div className="relative w-full flex flex-col items-center">
        <img
          src={image}
          alt=""
          className="w-full h-auto rounded object-cover"
        />

        {/* 
                  Štítek s nadpisem:
                  - absolute a translate-y-1/2 ho hodí přesně napůl přes spodní hranu obrázku
                  - border-4 uvnitř vytváří ten dvojitý efekt (rámeček v rámečku)
                */}
        <div className="absolute bottom-0 translate-y-1/2 w-[85%] bg-yellow-400 p-2 rounded-full shadow-md">
          <div className="border-2 border-yellow-300 rounded-full shadow-xl py-3 px-6 flex items-center justify-center">
            <h1 className="text-black text-2xl text-center font-semibold">
              {destination.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center gap-1 text-gray-600 font-medium tracking-wide">
        <p className=" text-xs text-gray-400"> {destination.description}</p>
        <p className=" text-xs text-gray-400">
          {" "}
          Enjoy lovely {destination.climate.toLowerCase()} climate your whole
          stay
        </p>

        <p className=" text-xs text-gray-400">
          {tagsArray.map((tag: { name: string }) => (
            <span
              key={tag.name}
              className=" text-black px-3 py-1 rounded-full "
            >
              {tag.name}
            </span>
          ))}
        </p>
      </div>

      <div className="mt-auto">
        <Link
          href="/questionnaire"
          className="bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
        >
          Plan Again
        </Link>
      </div>
    </div>
  );
}
