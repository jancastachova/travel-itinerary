import React from 'react';

interface DestinationHeaderInter {
  image: string;
  destination: {
    name?: string;
    description?: string;
    climate?: string;
  };
}

export default function DestinationHeader({ destination, image }: DestinationHeaderInter) {
  const ColoredLine = ({ color }: { color: string }) => (
    <hr style={{ color, backgroundColor: color, height: 1.5, width: 500 }} />
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full flex flex-col items-center">
        {image && (
          <img
            src={image}
            alt=""
            className="w-full h-80 rounded object-cover"
          />
        )}

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
          <div className="mt-4">
            <ColoredLine color="#facc15" />
          </div>
        )}
      </div>
    </div>
  );
}