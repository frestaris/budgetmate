import { useEffect, useState } from "react";
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

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getBaseUrl } from "../utils/baseUrl";

function BudgetPlanner() {
  const { currentUser } = useSelector((state) => state.user);
  const [openPanels, setOpenPanels] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState("");
  const [userBudgets, setUserBudgets] = useState([]);
  const [totalFrequency, setTotalFrequency] = useState("annually");

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

  const formattedAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getTotalByCategory = (category) => {
    return userBudgets
      .filter((budget) => budget.category === category)
      .reduce((total, budget) => total + budget.amount, 0);
  };

  const convertAmountByFrequency = (
    amount,
    originalFrequency,
    targetFrequency
  ) => {
    const frequencyMapping = {
      weekly: {
        fortnightly: amount * 2,
        monthly: amount * 4,
        annually: amount * 52,
      },
      fortnightly: {
        weekly: amount / 2,
        monthly: (amount * 26) / 12,
        annually: amount * 26,
      },
      monthly: {
        weekly: amount / 4,
        fortnightly: (amount * 12) / 26,
        annually: amount * 12,
      },
      annually: {
        weekly: amount / 52,
        fortnightly: amount / 26,
        monthly: amount / 12,
      },
    };

    return frequencyMapping[originalFrequency]?.[targetFrequency] || amount;
  };

  const getTotalByFrequency = (frequency) => {
    const totalIncome = userBudgets
      .filter((budget) => budget.category === "income")
      .reduce((total, budget) => {
        const convertedAmount = convertAmountByFrequency(
          budget.amount,
          budget.frequency,
          frequency
        );
        return total + convertedAmount;
      }, 0);

    const totalExpenses = userBudgets
      .filter((budget) => budget.category !== "income")
      .reduce((total, budget) => {
        const convertedAmount = convertAmountByFrequency(
          budget.amount,
          budget.frequency,
          frequency
        );
        return total + Math.abs(convertedAmount);
      }, 0);

    return totalIncome - totalExpenses;
  };
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await fetch(`${getBaseUrl()}/api/budgets/getbudgets`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.budgets) {
          setUserBudgets(data.budgets);
        }
      } catch (error) {
        console.log("Error fetching budgets:", error);
      }
    };
    fetchBudgets();
  }, [currentUser._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !amount || !category || !frequency) {
      alert("Please fill all fields.");
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue)) {
      alert("Please enter a valid numeric amount.");
      return;
    }
    const adjustedAmount = category === "income" ? amountValue : -amountValue;

    const budgetData = {
      description,
      amount: adjustedAmount,
      category,
      frequency,
    };

    try {
      const response = await fetch(`${getBaseUrl()}/api/budgets/addbudget`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Budget item added successfully!");
        setUserBudgets((prevItems) => [
          ...prevItems,
          { ...budgetData, id: data.id },
        ]);
        setDescription("");
        setAmount("");
        setCategory("");
        setFrequency("");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting budget:", error);
      alert("Error submitting budget. Please try again.");
    }
  };

  const handleDelete = async (budgetId) => {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/budgets/deletebudget/${budgetId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Budget Deleted");
        setUserBudgets(data.budgets);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Error deleting budget. Please try again.");
    }
  };

  return (
    <div className="w-full p-4 space-y-5">
      <form className="space-y-4 mb-3" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row w-full gap-2">
          <TextInput
            placeholder="Description..."
            required
            className="w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextInput
            placeholder="Amount..."
            required
            type="number"
            className="w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Select
            id="category"
            className="w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((category, index) => (
              <option key={index} value={category.name.toLowerCase()}>
                {category.name}
              </option>
            ))}
          </Select>

          <Select
            id="frequency"
            className="w-full"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="" disabled>
              Select Frequency
            </option>
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </Select>
        </div>

        <Button gradientDuoTone="cyanToBlue" className="w-full" type="submit">
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
                <span>
                  {formattedAmount(
                    getTotalByCategory(category.name.toLowerCase())
                  )}{" "}
                  $
                </span>

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
                  {userBudgets
                    .filter(
                      (item) => item.category === category.name.toLowerCase()
                    )
                    .map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <div>
                          <p>{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p>
                            $ {formattedAmount(item.amount)} ({item.frequency})
                          </p>
                          <FaRegTrashAlt
                            color="red"
                            className="cursor-pointer"
                            onClick={() => handleDelete(item._id)}
                          />
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        <div className="w-full flex justify-between items-center p-4 rounded-md dark:bg-gray-700 bg-gray-50">
          <div className="flex items-center gap-2">
            <span>TOTAL</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                getTotalByFrequency(totalFrequency) > 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              <strong>
                $ {formattedAmount(getTotalByFrequency(totalFrequency))}
              </strong>
            </span>

            <Select
              id="totalFrequency"
              value={totalFrequency}
              onChange={(e) => setTotalFrequency(e.target.value)}
            >
              <option value="" disabled>
                Select Frequency
              </option>
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetPlanner;
