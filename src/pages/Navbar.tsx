import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { token, logout } = useAuth();

  if (!token) return null;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/dashboard" className="hover:text-gray-300">
            Manage Apps
          </Link>
          <Link to="/users" className="hover:text-gray-300">
            User Management
          </Link>
        </div>
        <Button onClick={logout} variant="outline" className="text-black">
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
