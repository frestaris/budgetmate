import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import { getBaseUrl } from "../utils/baseUrl";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userBudgets, setUserBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

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
        categoryTotals[category] += Math.abs(budget.amount);
      }
    });

    if (Object.values(categoryTotals).every((total) => total === 0)) {
      console.log("No budget data available for categories.");
    }

    const data = {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#FF9F40",
            "#72ff56",
            "#FFB6C1",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#FF9F40",
            "#72ff56",
            "#FFB6C1",
          ],
        },
      ],
    };

    return data;
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 18,
          },
        },
      },
    },
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
    <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
      <Doughnut data={getChartData()} options={chartOptions} />
    </div>
  );
};

export default DoughnutChart;
