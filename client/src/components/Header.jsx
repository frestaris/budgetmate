import { Button, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
function Header() {
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 rounded-lg text-white bg-cyan-500">
          BudgetMate
        </span>
      </Link>

      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10  sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to="/sign-in">
          <Button gradientDuoTone="cyanToBlue" outline>
            Sign In
          </Button>
        </Link>
      </div>
    </Navbar>
  );
}
export default Header;
