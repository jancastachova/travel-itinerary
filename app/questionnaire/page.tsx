"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    days: 0,
    budget: "",
    preferredTags: [] as string[],
    climate: "",
  });
  const [days, setDays] = useState<number>(5);
  const activities = [
    "food",
    "beaches",
    "nighlife",
    "culture",
    "hiking",
    "adventure",
    "museums",
  ];

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  return (
    <div className="flex flex-row items-center justify-center min-h-screen">
      {currentStep === 0 && (
        <div className="w-full max-w-2xl border-[6px] border-yellow-400 p-10 px-16 rounded-2xl shadow-2xl flex flex-col justify-between bg-white">
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-6 text-left">
              How many days?
            </h1>

            <p className="text-xl font-semibold mb-2 text-left">{days} days</p>
            <input
              type="range"
              min={3}
              max={10}
              value={days}
              className="w-full mb-8 accent-yellow-400"
              onChange={(e) => setDays(Number(e.target.value))}
            />

            <button
              className="bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition block w-fit"
              onClick={() => {
                setAnswers({ ...answers, days: days });
                setCurrentStep(1);
              }}
            >
              Next
            </button>
          </div>

          <div className="w-full text-right mt-8">
            <button
              className="text-[14px] cursor-pointer bg-gray-200 text-black font-semibold px-5 py-2.5 rounded-full hover:bg-gray-300 transition"
              onClick={() => router.push("/")}
            >
              &lt; previous
            </button>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="w-full max-w-2xl border-[6px] border-yellow-400 p-10 px-16 rounded-2xl shadow-2xl flex flex-col justify-between bg-white">
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-4">What's your budget?</h1>

            <button
              className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
              onClick={() => {
                setAnswers({ ...answers, budget: "HIGH" });
                setCurrentStep(2);
              }}
            >
              High💰
            </button>
            <button
              className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
              onClick={() => {
                setAnswers({ ...answers, budget: "MEDIUM" });
                setCurrentStep(2);
              }}
            >
              Medium💵
            </button>
            <button
              className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
              onClick={() => {
                setAnswers({ ...answers, budget: "LOW" });
                setCurrentStep(2);
              }}
            >
              Low🪙
            </button>
          </div>

          <div className="w-full text-right mt-8">
            <button
              className="text-[14px] cursor-pointer bg-gray-200 text-black font-semibold px-5 py-2.5 rounded-full hover:bg-gray-300 transition"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              &lt; previous
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="w-full max-w-2xl border-[6px] border-yellow-400 p-10 px-16 rounded-2xl shadow-2xl flex flex-col justify-between bg-white">
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-4">
              Do you prefer city or nature?
            </h1>

            <button
              className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
              onClick={() => {
                setAnswers({ ...answers, preferredTags: ["city"] });
                setCurrentStep(3);
              }}
            >
              City🏙️
            </button>
            <button
              className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
              onClick={() => {
                setAnswers({ ...answers, preferredTags: ["nature"] });
                setCurrentStep(3);
              }}
            >
              Nature🏔️
            </button>
          </div>

          <div className="w-full text-right mt-8">
            <button
              className="text-[14px] cursor-pointer bg-gray-200 text-black font-semibold px-5 py-2.5 rounded-full hover:bg-gray-300 transition"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              &lt; previous
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="w-full max-w-2xl border-[6px] border-yellow-400 p-10 px-16 rounded-2xl shadow-2xl flex flex-col justify-between bg-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">What do you enjoy?</h1>

            <div className="flex flex-wrap gap-3 mb-6 w-full">
              {activities.map((a) => {
                const isChecked = answers.preferredTags.includes(a);

                return (
                  <label
                    key={a}
                    className={`w-fit cursor-pointer select-none font-semibold px-6 py-3 rounded-full transition text-sm uppercase tracking-wider border-4
                ${
                  isChecked
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      id={a}
                      value={a}
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAnswers({
                            ...answers,
                            preferredTags: [...answers.preferredTags, a],
                          });
                        } else {
                          setAnswers({
                            ...answers,
                            preferredTags: answers.preferredTags.filter(
                              (t) => t !== a,
                            ),
                          });
                        }
                      }}
                    />
                    {a}
                  </label>
                );
              })}

              <div className="w-full h-1 bg-yellow-300 my-6 rounded-full" />
              
              <button
                className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
                onClick={() => setCurrentStep(4)}
              >
                Next
              </button>
            </div>
          </div>

          <div className="w-full text-right mt-4">
              <button
              className="text-[14px] cursor-pointer bg-gray-200 text-black font-semibold px-5 py-2.5 rounded-full hover:bg-gray-300 transition"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              &lt; previous
            </button>
          </div>

          
        </div>
      )}

      {currentStep === 4 && (
        <div className="w-full max-w-2xl border-[6px] border-yellow-400 p-10 px-16 rounded-2xl shadow-2xl flex flex-col justify-between bg-white">
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-6 text-left">What climate?</h1>

            <div className="flex flex-wrap gap-3 w-full mb-8">
              <button
                className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition whitespace-nowrap"
                onClick={() => handleSubmit("Arctic")}
              >
                Arctic❄️
              </button>
              <button
                className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition whitespace-nowrap"
                onClick={() => handleSubmit("Tropical")}
              >
                Tropical🌴
              </button>

              <button
                className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition whitespace-nowrap"
                onClick={() => handleSubmit("Temperate")}
              >
                Temperate🌳
              </button>

              <button
                className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition whitespace-nowrap"
                onClick={() => handleSubmit("Mediterranean")}
              >
                Mediterranean☀️
              </button>
              <button
                className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition whitespace-nowrap"
                onClick={() => handleSubmit("Continental")}
              >
                Continental🍂
              </button>
            </div>
          </div>

          <div className="w-full text-right mt-4">
            <button
              className="text-[14px] cursor-pointer bg-gray-200 text-black font-semibold px-5 py-2.5 rounded-full hover:bg-gray-300 transition"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              &lt; previous
            </button>
          </div>
        </div>
      )}


      {/* {currentStep === 5 && (
        <div>
          <h1>Do you prefer relaxed or busy? / to be modified later</h1>
          
          <button className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition" onClick={() => {
            setAnswers({ ...answers, preferredTags:['city']})
            setCurrentStep(0)
          }}>Relaxed</button> 
          <button className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition" onClick={() => {
            setAnswers({ ...answers, preferredTags:['nature']})
            setCurrentStep(0)
          }}>Busy</button> 

          <button className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition" 
              onClick={()=> setCurrentStep(currentStep - 1)}>Prev</button>
          <h1>Step: {currentStep}</h1>
        </div>
      )} */}

      {/* <button className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition" 
              onClick={()=> setCurrentStep(currentStep - 1)}>Prev</button>
      <button className="ml-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
              onClick={()=> setCurrentStep(currentStep + 1)}>Next</button> */}
    </div>
  );

  async function handleSubmit(selectedClimate: string) {
    const finalObject = { ...answers, climate: selectedClimate };

    const response = await fetch("/api/generate-itinerary", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(finalObject),
    });
    const data = await response.json();

    localStorage.setItem("result", JSON.stringify(data));
    router.push("/result");
  }
}
