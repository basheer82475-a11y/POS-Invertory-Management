import Navbar from "./navbar";
import Sidebar from "./sidebar";

const Layout = ({ children, role }) => {
  return (
    <div className="flex flex-col h-screen">

      <Navbar role={role} />

      <div className="flex flex-1">

        <Sidebar role={role} />

        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Layout;