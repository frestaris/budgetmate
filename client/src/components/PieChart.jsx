import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import { getBaseUrl } from "../utils/baseUrl";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userContacts, setUserContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${getBaseUrl()}/api/contact/getcontacts?userId=${currentUser._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok && data.contacts) {
          setUserContacts(data.contacts);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, [currentUser._id]);

  const getChartData = () => {
    const relationshipTotals = {
      friend: 0,
      relative: 0,
      spouse: 0,
      colleague: 0,
      business: 0,
    };

    userContacts.forEach((contact) => {
      const relationship = contact.relationship
        ? contact.relationship.toLowerCase()
        : "";

      if (relationship && relationshipTotals.hasOwnProperty(relationship)) {
        relationshipTotals[relationship] += 1;
      }
    });

    if (Object.values(relationshipTotals).every((total) => total === 0)) {
      console.log("No contact data available for relationships.");
    }

    const data = {
      labels: Object.keys(relationshipTotals),
      datasets: [
        {
          data: Object.values(relationshipTotals),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#FF9F40",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#FF9F40",
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
        position: "left",
        labels: {
          font: {
            size: 20,
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
      <Pie data={getChartData()} options={chartOptions} />
    </div>
  );
};

export default PieChart;
