"use client";
import Link from "next/link";

interface AIActivity {
  time: string;
  description: string;
}

interface AIDay {
  dayNumber: number;
  activities: AIActivity[];
}

export default function Result() {
  const data =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("result") || "{}")
      : {};

  const destination = data?.destination;
  const image = destination?.name
    ? `/images/${destination.name.toLowerCase()}.jpg`
    : "";
  const tagsArray = data?.destination?.tags || [];
  const daysArray: AIDay[] = data?.aiDays || [];
  const daysOnFirstPage = daysArray.slice(0, 2);
  const daysOnSecondPage = daysArray.slice(2);

  const ColoredLine = ({ color }: { color: string }) => (
    <hr style={{ color, backgroundColor: color, height: 1.5, width: 500 }} />
  );

  const RenderDaysTable = ({ days }: { days: AIDay[] }) => (
    <table className="w-full table-fixed border-separate border-spacing-y-2 border-spacing-x-3">
      <tbody>
        {days.map((item) => (
          <tr key={item.dayNumber}>
            <td className="w-[20%] border border-yellow-300 bg-yellow-400 p-3 rounded-lg text-gray-700 align-middle text-center text-xl">
              DAY <br></br> {item.dayNumber}
            </td>

            <td className="w-[80%] border border-yellow-300 p-3 rounded-lg text-gray-600 align-top text-sm break-words bg-white">
              {/* vertical yellow line */}
              <div className="relative flex flex-col gap-3 pl-4 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-[2px] before:bg-yellow-200">
                {item.activities.map((a, index) => (
                  <div key={index} className="relative flex items-start gap-2">
                    {/*yellow dot*/}
                    <span className="absolute -left-[15px] top-[6px] h-2 w-2 rounded-full border border-yellow-500 bg-yellow-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-800">
                        {a.time}
                      </span>
                      <span className="text-gray-400 mx-1.5">•</span>
                      <span>{a.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="w-full min-h-screen bg-gray-100 py-8 flex flex-row items-center justify-center gap-8 overflow-y-auto">
      <div className="w-full max-w-2xl aspect-[1/1.414] bg-[#fafafa] flex flex-col items-center justify-start border-[3px] border-yellow-400 rounded-2xl p-10 shadow-2xl relative">
        <div className="relative w-full flex flex-col items-center">
          {image && (
            <img
              src={image}
              alt=""
              className="w-500 h-90 rounded object-cover"
            />
          )}

          {/* 
             Štítek s nadpisem:
             - absolute a translate-y-1/2 ho hodí přesně napůl přes spodní hranu obrázku
             - border-4 uvnitř vytváří ten dvojitý efekt (rámeček v rámečku)
            */}
          <div className="absolute bottom-0 translate-y-1/2 w-[85%] bg-[#fbd331]/85 hover:bg-yellow-400 text-amber-950 p-2 rounded-full shadow-md">
            <div className="border-2 border-yellow-300 rounded-full shadow-xl py-3 px-6 flex items-center justify-center">
              <h1 className="text-black text-3xl text-center">
                {destination?.name}
              </h1>
            </div>
          </div>
        </div>

        {/* mt-16 posune popisek těsně pod hranu spodního štítku */}
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
          <RenderDaysTable days={daysOnFirstPage}></RenderDaysTable>
        </div>

      </div>


      
      {/*SECOND PAGE*/}
      <div className="w-full max-w-2xl aspect-[1/1.414] bg-[#fafafa] flex flex-col items-center justify-start border-[3px] border-yellow-400 rounded-2xl p-10 shadow-2xl relative">
        <div className="w-full my-4 overflow-y-auto max-h-[800px]">
          <div className="w-full my-4 overflow-y-auto">
            <RenderDaysTable days={daysOnSecondPage}></RenderDaysTable>
          </div>
        </div>

          <div className="mt-auto print:hidden">
          <Link
            href="/questionnaire"
            className="bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
          >
            Plan Again
          </Link>
        </div>

      </div>
    </div>
  );
}
