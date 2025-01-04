import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashHome from "../components/DashHome";
import Contacts from "../components/Contacts";
import BudgetPlanner from "../components/BudgetPlanner";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
      {tab === "profile" && <DashProfile />}
      {tab === "dashHome" && <DashHome />}
      {tab === "contacts" && <Contacts />}
      {tab === "budgetPlanner" && <BudgetPlanner />}
    </div>
  );
}

export default Dashboard;
