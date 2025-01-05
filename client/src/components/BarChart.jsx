import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import { getBaseUrl } from "../utils/baseUrl";

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const BarChart = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userBudgets, setUserBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${getBaseUrl()}/api/budgets/getbudgets?userId=${currentUser._id}`, // Add userId to the URL
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (res.ok && data.budgets) {
          setUserBudgets(data.budgets);
        }
      } catch (error) {
        console.log("Error fetching budgets:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchBudgets();
    }
  }, [currentUser._id]);

  const getChartData = () => {
    const categoryTotals = {
      Income: 0,
      Home: 0,
      Car: 0,
      Insurance: 0,
      Medical: 0,
      Groceries: 0,
      Entertainment: 0,
    };
    userBudgets.forEach((budget) => {
      const category = budget.category
        ? budget.category.charAt(0).toUpperCase() + budget.category.slice(1)
        : "";

      if (category && categoryTotals.hasOwnProperty(category)) {
        categoryTotals[category] += budget.amount;
      }
    });

    const colors = Object.values(categoryTotals).map((value) =>
      value >= 0 ? "#36A2EB" : "#FF6384"
    );

    const data = {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    };

    return data;
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    categoryPercentage: 1.0,
    barPercentage: 0.9,
  };

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
        <Spinner className="size-12" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[800px] h-[400px] flex justify-center items-center">
      <Bar data={getChartData()} options={chartOptions} />
    </div>
  );
};

export default BarChart;
