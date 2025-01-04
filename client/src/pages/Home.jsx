import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";

function Home() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMotivationalQuote = async () => {
      try {
        const response = await fetch(
          "https://api.allorigins.win/raw?url=" +
            encodeURIComponent("https://zenquotes.io/api/today")
        );
        const data = await response.json();
        setQuote(data[0].q);
        setAuthor(data[0].a);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching the motivational quote:", error);
        setQuote("Failed to load a motivational quote.");
      }
    };

    fetchMotivationalQuote();
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
    <div
      className="flex items-center justify-center h-screen"
      style={{
        backgroundImage: `url(https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=600)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      <div className="text-center p-5 rounded-2xl shadow-2xl max-w-xl  mx-2  bg-white dark:bg-[rgb(16,23,42)] opacity-75">
        {/* Title Container */}
        <div className="mb-8">
          <p
            className="text-xl font-semibold dark:text-gray-200 text-gray-700 mt-4"
            style={{
              fontStyle: "italic",
              lineHeight: "1.5",
              maxWidth: "80%",
              margin: "auto",
              opacity: "0.7",
            }}
          >
            <span className="text-cyan-400">BudgetMate</span> is your personal
            finance companion that helps you keep track of your contacts and
            manage your finances efficiently.
          </p>
        </div>
        <hr />
        {/* Quote Container */}
        <div className="mt-8">
          <p
            className="text-2xl font-semibold dark:text-gray-200 text-gray-700 mb-4"
            style={{
              fontStyle: "italic",
              lineHeight: "1.5",
              maxWidth: "80%",
              margin: "auto",
              opacity: "0.9",
            }}
          >
            &ldquo;{quote}&rdquo;
          </p>
          <p
            className="text-xl font-semibold dark:text-gray-200 text-gray-700 mt-5"
            style={{
              fontStyle: "italic",
              opacity: "0.4",
            }}
          >
            — {author}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
