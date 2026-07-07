"use client"

export default function Result(){
    const data = JSON.parse(localStorage.getItem('result') || '{}')
    const destination = data.destination
    const image = `/images/${destination.name?.toLowerCase()}.jpg`

    return (
        /* Celá A4 karta s elegantním žlutým okrajem a stínem */
        <div className="w-full max-w-2xl aspect-[1/1.414] bg-[#fafafa] flex flex-col items-center justify-start
             border-[10px] border-yellow-400 rounded-2xl p-10 mx-auto my-auto mt-4 mb-4 shadow-2xl">
            
            {/* Obal pro obrázek, který ho drží zarovnaný */}
            <div className="relative w-full flex flex-col items-center">
                
                {/* Obrázek s jemným zaoblením nahoře */}
                <img src={image} alt="" className="w-full h-auto rounded object-cover" />
                
                {/* 
                  Štítek s nadpisem:
                  - absolute a translate-y-1/2 ho hodí přesně napůl přes spodní hranu obrázku
                  - border-4 uvnitř vytváří ten dvojitý efekt (rámeček v rámečku)
                */}
                <div className="absolute bottom-0 translate-y-1/2 w-[85%] bg-yellow-400 p-2 rounded-sm shadow-md">
                    <div className="border-2 border-[#fafafa] shadow-xl py-3 px-6 flex items-center justify-center">
                        <h1 className="text-black text-2xl font-black text-center">
                            {destination.name}
                        </h1>
                    </div>
                </div>

            </div>

            <div className="mt-20 flex flex-col items-center gap-1 text-gray-600 font-medium tracking-wide">
                <p className=" text-xs text-gray-400"> {destination.description}</p>
            </div>

        </div>
    )
}