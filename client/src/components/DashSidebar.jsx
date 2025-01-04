import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiUser,
  HiChartPie,
  HiCurrencyDollar,
} from "react-icons/hi";
import { RiContactsBook3Fill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";
import { useEffect, useState } from "react";
import { signoutSuccess } from "../redux/user/userSlice";
import { getBaseUrl } from "../utils/baseUrl";

function DashSidebar() {
  const { showSidebar, closeSidebar } = useSidebar();
  const [contacts, setContacts] = useState([]);
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
                className="mb-1"
                active={tab === "profile"}
                icon={HiUser}
                label={currentUser.username}
                labelColor="dark"
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>
            <Link to="/dashboard?tab=contacts" onClick={closeSidebar}>
              <Sidebar.Item
                className="mb-1"
                label={contacts.length}
                active={tab === "contacts"}
                icon={RiContactsBook3Fill}
                as="div"
              >
                Contacts
              </Sidebar.Item>
            </Link>
            <Link to="/dashboard?tab=budgetPlanner" onClick={closeSidebar}>
              <Sidebar.Item
                active={tab === "budgetPlanner"}
                icon={HiCurrencyDollar}
                as="div"
              >
                Budget Planner
              </Sidebar.Item>
            </Link>
            <hr />
            <Sidebar.Item
              className="cursor-pointer"
              icon={HiArrowSmRight}
              onClick={handleSignout}
            >
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
