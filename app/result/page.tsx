"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import ItineraryTable, {AIDay} from "../components/ItineraryTable"; 

const Map = dynamicImport(() => import("../components/TripMap"), {
  ssr: false,
  loading: () => <p className="text-center py-10">Loading map...</p>,
});

//takes a input of days and separates it to smaller pieces, each part is a new site
const chunkDays = (arr: AIDay[], size: number) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export default function Result() {
  //data from local storage (questionnaire page, loads the json saved in API call)
  const data =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("result") || "{}")
      : {};
  //preparation of data
  const destination = data?.destination;
  const image = destination?.name
    ? `/images/${destination.name.toLowerCase()}.jpg`
    : "";
  const daysArray: AIDay[] = data?.aiDays || []; //fields returned by AI
  const daysOnFirstPage = daysArray.slice(0, 2); //first two days on the first page

  const remainingDays = daysArray.slice(2);
  const extraPages = chunkDays(remainingDays, 4); //starts from 3 page, 4 pages max on one site

  let activityCounter = 0;
  const acitivitiesWithinId = daysArray.flatMap((day) =>
    day.activities.map((activity) => ({
      ...activity,
      id: ++activityCounter,
      dayNumber: day.dayNumber,
    })),
  );

  const ColoredLine = ({ color }: { color: string }) => (
    <hr style={{ color, backgroundColor: color, height: 1.5, width: 500 }} />
  );

  return (
    <div className="w-full bg-gray-100 p-8 flex flex-row flex-wrap items-start print:block print:min-h-0 print:bg-white print:p-0 justify-center content-center gap-8 overflow-y-auto print:p-0">
      <div className="w-full max-w-2xl aspect-[1/1.414] print:aspect-auto print:p-6 bg-[#fafafa] flex flex-col items-center justify-start border-[3px] border-yellow-400 rounded-2xl p-10 shadow-2xl relative print-page print:w-[210mm] print:border-none print:shadow-none print:bg-white print:rounded-none">
        <div className="relative w-full flex flex-col items-center">
          {image && (
            <img
              src={image}
              alt=""
              className="w-400 h-80 rounded object-cover"
            />
          )}

          {/* 
             The name of the destination in the middle of the picture
            */}
          <div className="absolute bottom-0 translate-y-1/2 w-[85%] bg-[#fbd331]/85 hover:bg-yellow-400 text-amber-950 p-2 rounded-full shadow-md">
            <div className="border-2 border-yellow-300 rounded-full shadow-xl py-3 px-6 flex items-center justify-center">
              <h1 className="text-black text-3xl text-center">
                {destination?.name}
              </h1>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-1 text-gray-600 font-medium tracking-wide w-full">
          <p className="text-sm text-gray-400 text-center leading-relaxed">
            {destination?.description}
          </p>

          {destination?.climate && (
            <>
              <ColoredLine color="#facc15" />
            </>
          )}
        </div>

        <div className="w-full my-4 overflow-y-auto">
          <ItineraryTable days={daysOnFirstPage} />
        </div>

      </div>

          {/*DYNAMIC PAGES*/}
          {extraPages.map((pageDays, pageIndex) => (
      <div
        key={pageIndex}
        className="w-full max-w-2xl aspect-[1/1.414] print:aspect-auto print:p-6 bg-[#fafafa] flex flex-col items-center justify-start border-[3px] border-yellow-400 rounded-2xl p-10 shadow-2xl relative print-page print:w-[210mm] print:border-none print:shadow-none print:bg-white print:rounded-none"
      >
        <div className="w-full my-4">
          <ItineraryTable days={pageDays} />
        </div>
      </div>
    ))}

    {/* MAP PAGE */}
    <div className="w-full max-w-2xl aspect-[1/1.414] print:aspect-auto print:p-6 bg-[#fafafa] flex flex-col items-center justify-start border-[3px] border-yellow-400 rounded-2xl p-10 shadow-2xl relative print-page print:w-[210mm] print:border-none print:shadow-none print:bg-white print:rounded-none">
      <h2 className="text-2xl text-gray-700 mb-6">Your Trip Map</h2>

      <div className="w-full print:break-inside-avoid">
        <Map activities={acitivitiesWithinId} />
      </div>

      <div className="flex flex-row gap-5 justify-center mt-auto print:hidden">
        <Link
          href="/questionnaire"
          className="bg-yellow-400 text-black px-8 py-4 rounded-full hover:bg-yellow-300 transition shadow-md"
        >
          Plan Again
        </Link>
        <button
          onClick={() => window.print()}
          className="bg-yellow-400 text-black px-8 py-4 rounded-full hover:bg-yellow-300 transition shadow-md"
        >
          Download PDF
        </button>
      </div>
    </div>
    </div>
  );
}
