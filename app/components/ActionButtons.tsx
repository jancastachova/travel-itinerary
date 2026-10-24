import Link from "next/link";
export default function ActionButtons(){
    return(
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
    )
}


