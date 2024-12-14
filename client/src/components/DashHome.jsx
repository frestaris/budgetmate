import BarChart from "./BarChart";
import DashStats from "./DashStats";
import DoughnutChart from "./DoughnutChart";
import PieChart from "./PieChart";

function DashHome() {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <DashStats />
      <div className="flex flex-col custom:flex-row justify-center gap-4">
        <DoughnutChart className="w-full sm:w-48 md:w-64 lg:w-80" />
        <PieChart className="w-full sm:w-48 md:w-64 lg:w-80" />
      </div>
      <div className="w-full flex justify-center">
        <BarChart />
      </div>
    </div>
  );
}

export default DashHome;
