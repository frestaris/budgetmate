import DoughnutChart from "./DoughnutChart";
import PieChart from "./PieChart";

function DashHome() {
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col custom:flex-row">
        <DoughnutChart />
        <PieChart />
      </div>
    </div>
  );
}

export default DashHome;
