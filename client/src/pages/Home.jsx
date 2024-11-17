import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";

function Home() {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    const fetchRandomFact = async () => {
      try {
        const response = await fetch(
          "https://uselessfacts.jsph.pl/today.json?language=en"
        );
        const data = await response.json();
        setFact(data.text);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching the random fact:", error);
        setFact("Failed to load a random fact.");
      }
    };

    fetchRandomFact();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner className="size-24" />
      </div>
    );
  }
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

export default Home;
