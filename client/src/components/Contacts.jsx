import React from "react";

function Contacts() {
  const contacts = [
    {
      name: "John Doe",
      description: "Web Developer at XYZ",
      image: "https://via.placeholder.com/40",
    },
    {
      name: "Jane Smith",
      description: "Graphic Designer at ABC",
      image: "https://via.placeholder.com/40",
    },
    {
      name: "Michael Brown",
      description: "Marketing Specialist at DEF",
      image: "https://via.placeholder.com/40",
    },
  ];

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Contacts</h2>
      <ul className="space-y-4">
        {contacts.map((contact, index) => (
          <li
            key={index}
            className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-100 transition"
          >
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={contact.image}
              alt={contact.name}
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                {contact.name}
              </h3>
              <p className="text-sm text-gray-500">{contact.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Contacts;
