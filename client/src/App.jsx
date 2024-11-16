import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import AddContact from "./pages/AddContact";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { SidebarProvider } from "./contexts/SidebarContext";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ToastContainer position="top-center" autoClose={2000} />
      <SidebarProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-contact" element={<AddContact />} />
            <Route path="/contact/:contactSlug" element={<Contact />} />
          </Route>
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
