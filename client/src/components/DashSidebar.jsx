import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser, HiChartPie } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";
import { useEffect, useState } from "react";

function DashSidebar() {
  const { showSidebar, closeSidebar } = useSidebar();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <>
      <Sidebar
        className={`w-56 fixed md:static top-0 left-0 z-40 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Link to="/dashboard?tab=dashHome" onClick={closeSidebar}>
              <Sidebar.Item
                className="mb-1"
                active={tab === "dashHome"}
                icon={HiChartPie}
                labelColor="dark"
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
            <Link to="/dashboard?tab=profile" onClick={closeSidebar}>
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label={currentUser.username}
                labelColor="dark"
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>
            <hr />
            <Sidebar.Item icon={HiArrowSmRight} onClick={closeSidebar}>
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
}

export default DashSidebar;
