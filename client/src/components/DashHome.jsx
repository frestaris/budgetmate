import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";

function DashHome() {
  const [fact, setFact] = useState("");

  useEffect(() => {
    const fetchRandomFact = async () => {
      try {
        const response = await fetch(
          "https://uselessfacts.jsph.pl/today.json?language=en"
        );
        const data = await response.json();
        setFact(data.text);
      } catch (error) {
        console.error("Error fetching the random fact:", error);
        setFact("Failed to load a random fact.");
      }
    };

    fetchRandomFact();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="text-center">
        <p className="text-5xl mb-12">Fact of the day</p>
        {fact ? (
          <p className="text-5xl font-semibold border-4 rounded-tl-xl rounded-tr-xl rounded-br-xl p-4 m-8">
            {fact}
          </p>
        ) : (
          <Spinner className="size-24" />
        )}
      </div>
    </div>
  );
}

export default DashHome;
