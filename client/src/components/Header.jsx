import { Button, Navbar, Avatar, Dropdown } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { useSidebar } from "../contexts/SidebarContext";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const { toggleSidebar } = useSidebar();
  const dispatch = useDispatch();

  return (
    <Navbar className="border-b-2 flex justify-between">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-lg font-semibold dark:text-white"
        >
          <span className="px-2 py-1 rounded-lg text-white bg-cyan-500">
            BudgetMate
          </span>
        </Link>
      </div>

      <div className="flex gap-2 md:order-2">
        <Button
          className="sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <>
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="user"
                  img={currentUser.profilePicture}
                  rounded
                  className="rounded-full border-2 border-cyan-500"
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to="/dashboard?tab=profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item>Sign out</Dropdown.Item>
            </Dropdown>
            <Button className="md:hidden" color="gray" onClick={toggleSidebar}>
              <HiMenu className="w-5 h-5" />
            </Button>
          </>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="cyanToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </Navbar>
  );
}

export default Header;
