import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, ArrowLeft, ArrowRight } from "lucide-react"; // Added ArrowRight for open button
import { UsersTable } from "./admin/users_table";
import { AddFileStudentForm } from "@/components/add-file-student";

// Sidebar component
function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  toggleSidebar,
}: {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  return (
    <>
      {/* Sidebar container */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 h-screen bg-black p-4 flex flex-col gap-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Close button */}
        <button className="text-white text-right mb-4" onClick={toggleSidebar}>
          <ArrowLeft className="h-6 w-6" />
        </button>

        <h1 className="text-white font-bold text-lg">Sidebar</h1>

        <button
          className={`text-left p-2 rounded-lg ${
            activeTab === "addFileStudent"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-800 text-gray-400"
          }`}
          onClick={() => setActiveTab("addFileStudent")}
        >
          Add File Student
        </button>
        <button
          className={`text-left p-2 rounded-lg ${
            activeTab === "addAdmin"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-800 text-gray-400"
          }`}
          onClick={() => setActiveTab("addAdmin")}
        >
          Users
        </button>
      </div>

      {/* Open button - Stays on screen when sidebar is closed */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-black text-white p-2 rounded-full"
          onClick={toggleSidebar}
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      )}
    </>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("addFileStudent"); // State to track the active tab
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar open by default

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Close the sidebar by default on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false); // Close sidebar on small screens
      } else {
        setIsSidebarOpen(true); // Open sidebar on larger screens
      }
    };

    // Initial check
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <>
      {/* Apply ml-64 when sidebar is open */}
      <header
        className={`flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="flex items-center">
          <p>Logo</p>
          <Separator orientation="vertical" className="mr-2 ml-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Our Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {activeTab === "addFileStudent"
                    ? "Add File Student"
                    : activeTab === "addAdmin"
                    ? "Add Admin"
                    : "Other Dashboard Tab"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Avatar and Dropdown Menu on the right */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/username.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>{" "}
              {/* Fallback in case image fails */}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={10}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* Main content */}
        <div
          className={`flex flex-1 flex-col gap-4 p-4 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          {/* Conditional rendering based on active tab */}
          {activeTab === "addFileStudent" ? (
            <>
              <h1 className="text-2xl font-bold mb-4">Add File Student</h1>
              <AddFileStudentForm />
            </>
          ) : activeTab === "addAdmin" ? (
            <>
              <h1 className="text-2xl font-bold mb-4">Add Admin</h1>
              <UsersTable />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">Other Dashboard Tab</h1>
            </>
          )}
        </div>
      </div>
    </>
  );
}
