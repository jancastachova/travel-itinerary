"use client";
import { useState, useEffect } from "react";

export default function Home() {
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
        <div>
          <h1>How many days?</h1>

          <p>{days} days</p>
          <input
            type="range"
            min={3}
            max={10}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />

          
          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => {
              setAnswers({ ...answers, days: days });
              setCurrentStep(1);
            }}
          >
            Next
          </button>
          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            &lt;
          </button>

          <h1>Step: {currentStep}</h1>
        </div>
      )}

      {currentStep === 1 && (
        <div>
          <h1>What's your budget?</h1>

          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => {
              setAnswers({ ...answers, budget: "HIGH" });
              setCurrentStep(2);
            }}
          >
            High
          </button>
          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => {
              setAnswers({ ...answers, budget: "MEDIUM" });
              setCurrentStep(2);
            }}
          >
            Medium
          </button>
          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => {
              setAnswers({ ...answers, budget: "LOW" });
              setCurrentStep(2);
            }}
          >
            Low
          </button>

          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            &lt;
          </button>
          <h1>Step: {currentStep}</h1>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h1>Do you prefer city or nature?</h1>

          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => {
              setAnswers({ ...answers, preferredTags: ["city"] });
              setCurrentStep(3);
            }}
          >
            City
          </button>
          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => {
              setAnswers({ ...answers, preferredTags: ["nature"] });
              setCurrentStep(3);
            }}
          >
            Nature
          </button>

          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            &lt;
          </button>
          <h1>Step: {currentStep}</h1>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h1>What do you enjoy?</h1>
          {activities.map((a) => (
            <div key={a}>
              <input
                type="checkbox"
                id={a}
                value={a}
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
              <label htmlFor={a}>{a}</label>
            </div>
          ))}

          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => setCurrentStep(4)}
          >
            Next
          </button>

          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            &lt;
          </button>
          <h1>Step: {currentStep}</h1>
        </div>
      )}

      {currentStep === 4 && (
        <div>
          <h1>What climate?</h1>

          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => {
              setAnswers({ ...answers, climate: "Arctic" });
              setCurrentStep(5);
            }}
          >
            Arctic❄️{" "}
          </button>
          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => {
              setAnswers({ ...answers, climate: "Tropical" });
              setCurrentStep(5);
            }}
          >
            Tropical🌴
          </button>
          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => {
              setAnswers({ ...answers, climate: "Mediterranean" });
              setCurrentStep(5);
            }}
          >
            Mediterranean☀️
          </button>
          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => {
              setAnswers({ ...answers, climate: "Continental" });
              setCurrentStep(5);
            }}
          >
            Continental🍂{" "}
          </button>

          <button
            className="mr-4 bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            &lt;
          </button>
          <h1>Step: {currentStep}</h1>
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
}
