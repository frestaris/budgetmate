import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";

function Contacts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userContacts, setUserContacts] = useState([]);
  const [originalContacts, setOriginalContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("column");

  const backgroundColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-indigo-500",
  ];

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch(
          `/api/contact/getcontacts?userId=${currentUser._id}`
        );
        const data = await res.json();
        if (res.ok && data.contacts) {
          setUserContacts(data.contacts);
          setOriginalContacts(data.contacts);
        }
      } catch (error) {
        console.log("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, [currentUser._id]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.length > 0) {
        const results = originalContacts.filter((contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setUserContacts(results);
      } else {
        setUserContacts(originalContacts);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, originalContacts]);

  const getRandomBackgroundColor = () => {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length);
    return backgroundColors[randomIndex];
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "grid" ? "column" : "grid"));
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          className="w-full sm:w-96 px-4 py-2 mr-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex items-center space-x-1">
          <div
            className="border-2 border-lg cursor-pointer px-4 py-2 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white  dark:hover:border-gray-500 "
            onClick={toggleViewMode}
          >
            {viewMode === "grid" ? (
              <CiGrid41 size={24} />
            ) : (
              <CiGrid2H size={24} />
            )}
          </div>

          <Link
            to="/add-contact"
            className=" rounded-full border-2 px-4 py-2 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 "
          >
            <span className="text-xl">+</span>
          </Link>
        </div>
      </div>

      {userContacts.length > 0 ? (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-2"
              : "flex flex-col"
          }`}
        >
          {userContacts.map((contact) => (
            <Link key={contact._id} to={`/contact/${contact.slug}`}>
              <div
                className={`${
                  viewMode === "grid" ? "flex md:flex-row flex-col" : "flex "
                } items-center justify-between p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 mb-2 hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <div className="flex items-center space-x-4">
                  {contact.profilePicture ? (
                    <img
                      src={contact.profilePicture}
                      alt={contact.name}
                      className="w-8 h-8 object-cover bg-gray-500 rounded-full"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 flex items-center justify-center text-white font-semibold rounded-full ${getRandomBackgroundColor()}`}
                    >
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="truncate w-[80px]">
                    {contact.name.charAt(0).toUpperCase() +
                      contact.name.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="truncate w-[100px] text-gray-700 dark:text-gray-300">
                    +{contact.phone}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>You have no contacts yet!</p>
      )}
    </div>
  );
}

export default Contacts;
