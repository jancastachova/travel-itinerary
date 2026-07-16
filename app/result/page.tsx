"use client";
import Link from "next/link";

export default function Result() {
  const data =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("result") || "{}")
      : {};
  const days =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("days") || "0")
      : 0;

  const destination = data?.destination;
  const image = destination?.name
    ? `/images/${destination.name.toLowerCase()}.jpg`
    : "";
  const tagsArray = data?.destination?.tags || [];
  const daysArray = Array.from({ length: days || 0 }, (_, i) => ({
    day: i + 1,
    activity: tagsArray[i % tagsArray.length]?.name,
  }));

  const ColoredLine = ({ color }: { color: string }) => (
    <hr style={{ color, backgroundColor: color, height: 1.5, width: 500 }} />
  );

  return (
    <div
      className="w-full max-w-2xl aspect-[1/1.414] bg-[#fafafa] flex flex-col items-center justify-start
             border-[3px] border-yellow-400 rounded-2xl p-10 mx-auto my-auto mt-4 mb-4 shadow-2xl"
    >
      <div className="relative w-full flex flex-col items-center">
        {image && (
          <img
            src={image}
            alt=""
            className="w-full h-auto rounded object-cover"
          />
        )}

        {/* 
             Štítek s nadpisem:
             - absolute a translate-y-1/2 ho hodí přesně napůl přes spodní hranu obrázku
             - border-4 uvnitř vytváří ten dvojitý efekt (rámeček v rámečku)
            */}
        <div className="absolute bottom-0 translate-y-1/2 w-[85%] bg-[#fbd331]/85 hover:bg-yellow-400 text-amber-950 p-2 rounded-full shadow-md">
          <div className="border-2 border-yellow-300 rounded-full shadow-xl py-3 px-6 flex items-center justify-center">
            <h1 className="text-black text-2xl text-center font-semibold">
              {destination?.name}
            </h1>
          </div>
        </div>
      </div>

      {/* mt-16 posune popisek těsně pod hranu spodního štítku */}
      <div className="mt-16 flex flex-col items-center gap-1 text-gray-600 font-medium tracking-wide w-full">
        <p className=" text-xs text-gray-400"> {destination?.description}</p>

        {destination?.climate && (
          <>
            <p className="text-xs text-gray-400">
              Enjoy lovely {destination.climate.toLowerCase()} climate your
              whole stay
            </p>
            <ColoredLine color="#facc15" />
          </>
        )}
      </div>

      <div className="w-full my-4 overflow-y-auto max-h-[300px]">
        <table className="w-full table-fixed border-separate border-spacing-y-2 border-spacing-x-3">
          <tbody>
            {daysArray.map((item) => (
              <tr key={item.day}>
                <td className="w-[20%] border border-yellow-300 bg-yellow-400 bg-white p-3 rounded-lg font-semibold text-gray-700 align-top text-sm">
                  Day {item.day}:
                </td>
                <td className="w-[80%] border border-yellow-300 p-3 rounded-lg text-gray-600 align-top text-sm break-words">
                  {item.activity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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