import { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getBaseUrl } from "../utils/baseUrl";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`${getBaseUrl()}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        toast.success("User registered!");
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 text-cyan-700 rounded-lg">
              BudgetMate
            </span>
          </Link>
          <p className="text-md mt-5">
            BudgetMate helps you manage your finances and stay organized, with
            tools for budget planning, expense tracking, and an agenda to keep
            your contacts and important details at hand.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@email.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="greenToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Sign Up"}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>{" "}
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
