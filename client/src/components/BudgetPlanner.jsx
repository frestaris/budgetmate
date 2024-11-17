import { useState } from "react";
import {
  FaHandHoldingUsd,
  FaHome,
  FaCar,
  FaStethoscope,
  FaFilm,
  FaRegTrashAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { MdLocalGroceryStore } from "react-icons/md";
import { Button, Select, TextInput } from "flowbite-react";

function BudgetPlanner() {
  const [openPanels, setOpenPanels] = useState([]);

  const categories = [
    { name: "Income", icon: <FaHandHoldingUsd className="w-6 h-6" /> },
    { name: "Home", icon: <FaHome className="w-6 h-6" /> },
    { name: "Car", icon: <FaCar className="w-6 h-6" /> },
    {
      name: "Insurance",
      icon: <AiFillSafetyCertificate className="w-6 h-6" />,
    },
    { name: "Medical", icon: <FaStethoscope className="w-6 h-6" /> },
    { name: "Groceries", icon: <MdLocalGroceryStore className="w-6 h-6" /> },
    { name: "Entertainment", icon: <FaFilm className="w-6 h-6" /> },
  ];

  const togglePanel = (panelIndex) => {
    setOpenPanels((prev) => {
      if (prev.includes(panelIndex)) {
        return prev.filter((index) => index !== panelIndex);
      } else {
        return [...prev, panelIndex];
      }
    });
  };

  return (
    <div className="w-full p-4 space-y-5">
      <form className="space-y-4 mb-3">
        <div className="flex flex-col sm:flex-row w-full gap-2">
          <TextInput placeholder="Description..." required className="w-full" />
          <TextInput
            placeholder="Amount..."
            required
            type="number"
            className="w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Select id="category" className="w-full">
            <option value="" disabled selected>
              Select Category
            </option>
            {categories.map((category, index) => (
              <option key={index} value={category.name.toLowerCase()}>
                {category.name}
              </option>
            ))}
          </Select>

          <Select id="frequency" className="w-full">
            <option value="" disabled selected>
              Select Frequency
            </option>
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </Select>
        </div>

        <Button gradientDuoTone="cyanToBlue" className="w-full">
          Add Budget Item
        </Button>
      </form>
      <hr />
      <div className="space-y-2">
        {categories.map((category, index) => (
          <div key={index}>
            <button
              className="w-full flex justify-between items-center p-4 rounded-md dark:bg-gray-700 bg-gray-50"
              onClick={() => togglePanel(index)}
            >
              <div className="flex items-center gap-2">
                {category.icon}
                <span>{category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>0.00$</span>
                {openPanels.includes(index) ? (
                  <FaChevronUp className="w-4 h-4" />
                ) : (
                  <FaChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {openPanels.includes(index) && (
              <div className="p-4">
                <ul>
                  <li className="flex justify-between">
                    <div>
                      <p>item 1</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p>0.00$</p>
                      <p>(frequency)</p>
                      <FaRegTrashAlt color="red" className="cursor-pointer" />
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetPlanner;
