import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import PieChart from "./PieChart";

function DashHome() {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="flex flex-col custom:flex-row justify-center gap-4">
        <DoughnutChart />
        <PieChart />
      </div>
      <div className="w-full flex justify-center">
        <BarChart />
      </div>
    </div>
  );
}

export default DashHome;
