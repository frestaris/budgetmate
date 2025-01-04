import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBaseUrl } from "../utils/baseUrl";

const DashStats = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [contacts, setContacts] = useState([]);
  const [userBudgets, setUserBudgets] = useState([]);
  const [totalFrequency, setTotalFrequency] = useState("annually");

  const { theme } = useSelector((state) => state.theme);

  const formattedAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
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

    if (currentUser?._id) {
      fetchBudgets();
    }
  }, [currentUser._id]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch(
          `${getBaseUrl()}/api/contact/getcontacts?userId=${currentUser._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok && data.contacts) {
          setContacts(data.contacts);
        }
      } catch (error) {
        console.log("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, [currentUser._id]);

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

  const totalAmount = getTotalByFrequency(totalFrequency);

  return (
    <div className="my-5 w-full">
      <div className="flex flex-col sm:flex-row gap-4 px-4">
        <div
          className={`${
            theme === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-white text-gray-900"
          } shadow-md rounded-lg p-6 border border-gray-200 min-h-[150px] flex flex-col justify-between w-full lg:basis-1/2`}
        >
          {" "}
          <h2 className="text-xl font-semibold mb-2">
            Total Earnings annually
          </h2>
          <p
            className={`text-2xl font-bold ${
              totalAmount >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            ${formattedAmount(totalAmount.toFixed(2))}
          </p>
        </div>

        <div
          className={`${
            theme === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-white text-gray-900"
          } shadow-md rounded-lg p-6 border border-gray-200 min-h-[150px] flex flex-col justify-between w-full lg:basis-1/2`}
        >
          {" "}
          <h2 className="text-xl font-semibold mb-2">Total Contacts</h2>
          <p className="text-2xl font-bold">{contacts.length}</p>
        </div>
      </div>
    </div>
  );
};

export default DashStats;
