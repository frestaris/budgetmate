import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

function DashContacts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userContacts, setUserContacts] = useState([]);
  const [originalContacts, setOriginalContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Link
          to="/add-contact"
          className="border border-cyan-500 text-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-100 hover:border-cyan-700 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          Add Contact
        </Link>
      </div>
      {userContacts.length > 0 ? (
        <Table className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Picture</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell>Relationship</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {userContacts.map((contact) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={contact._id}
              >
                <Table.Cell>
                  {contact.profilePicture ? (
                    <img
                      src={contact.profilePicture}
                      alt={contact.name}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 flex items-center justify-center text-white font-semibold rounded-full ${getRandomBackgroundColor()}`}
                    >
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/contact/${contact.slug}`}
                    className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    {contact.name.charAt(0).toUpperCase() +
                      contact.name.slice(1).toLowerCase()}
                  </Link>
                </Table.Cell>

                <Table.Cell>{contact.email}</Table.Cell>
                <Table.Cell>{contact.phone}</Table.Cell>
                <Table.Cell>{contact.relationship}</Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-red-500 hover:underline cursor-pointer">
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    className="text-teal-500 hover:underline"
                    to={`/update-contact/${contact._id}`}
                  >
                    Edit
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p>You have no contacts yet!</p>
      )}
    </div>
  );
}

export default DashContacts;
