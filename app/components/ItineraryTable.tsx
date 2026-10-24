import React from 'react';

export interface AIActivity {
  time: string;
  description: string;
  lat: number;
  lng: number;
}

export interface AIDay {
  dayNumber: number;
  activities: AIActivity[];
}

export interface ItineraryTableProps{
    days: AIDay[];
}

export default function ItineraryTable({ days }: ItineraryTableProps) {
  return (
    <table className="w-full table-fixed border-separate border-spacing-y-2 border-spacing-x-3">
      <tbody>
        {days.map((item) => (
          <tr key={item.dayNumber} className="print:break-inside-avoid">
            <td className="w-[20%] border border-yellow-300 bg-yellow-400 p-3 rounded-lg text-gray-700 align-middle text-center text-xl">
              DAY <br /> {item.dayNumber}
            </td>

            <td className="w-[80%] border border-yellow-300 p-3 rounded-lg text-gray-600 align-top text-sm break-words bg-white">
              {/* vertical yellow line */}
              <div className="relative flex flex-col gap-3 pl-4 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-[2px] before:bg-yellow-200">
                {item.activities.map((a, index) => (
                  <div key={index} className="relative flex items-start gap-2">
                    {/* yellow dot */}
                    <span className="absolute -left-[15px] top-[6px] h-2 w-2 rounded-full border border-yellow-500 bg-yellow-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-800">
                        {a.time}
                      </span>
                      <span className="text-gray-400 mx-1.5">•</span>
                      <span className="text-xs">{a.description}</span>
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
}
