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
import { LogOut, ArrowLeft, ArrowRight } from "lucide-react";
import { UsersTable } from "./admin/users_table";
import { AddFileStudentForm } from "@/components/add-file-student";
import { SchoolAdminUsersTable } from "./school-admin/school_admin_table";
import { StudentUsersTable } from "./student/students_table";
import { SchoolTable } from "./schools/school_table";
import { useNavigate } from "react-router-dom";
import { GradesTable } from "./grades/grade_table";
import { LevelsTable } from "./levels/level_table";
import { SubjectsTable } from "./subjects/subject_table";

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
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 h-screen bg-black p-4 flex flex-col gap-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 ease-in-out`}
      >
        <button className="text-white text-right mb-4" onClick={toggleSidebar}>
          <ArrowLeft className="h-6 w-6" />
        </button>

        <h1 className="text-white font-bold text-lg">SSP</h1>

        <button
          className={`text-left p-2 rounded-lg ${
            activeTab === "addAdmin"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-800 text-gray-400"
          }`}
          onClick={() => setActiveTab("addAdmin")}
        >
          Admin Users
        </button>

        <button
          className={`text-left p-2 rounded-lg ${
            activeTab === "schoolAdmin"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-800 text-gray-400"
          }`}
          onClick={() => setActiveTab("schoolAdmin")}
        >
          School Admins
        </button>

        <button
          className={`text-left p-2 rounded-lg ${
            activeTab === "studentUsers"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-800 text-gray-400"
          }`}
          onClick={() => setActiveTab("studentUsers")}
        >
          Student
        </button>

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
            activeTab === "schools"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-800 text-gray-400"
          }`}
          onClick={() => setActiveTab("schools")}
        >
          Schools
        </button>

        <button
          className={`text-left p-2 rounded-lg ${
            activeTab === "grades"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-800 text-gray-400"
          }`}
          onClick={() => setActiveTab("grades")}
        >
          Grades
        </button>
        <button
  className={`text-left p-2 rounded-lg ${
    activeTab === "levels"
      ? "bg-gray-700 text-white"
      : "hover:bg-gray-800 text-gray-400"
  }`}
  onClick={() => setActiveTab("levels")}
>
  Levels
</button>
<button
  className={`text-left p-2 rounded-lg ${
    activeTab === "subjects"
      ? "bg-gray-700 text-white"
      : "hover:bg-gray-800 text-gray-400"
  }`}
  onClick={() => setActiveTab("subjects")}
>
  Subjects
</button>
      </div>

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
  const [activeTab, setActiveTab] = useState("addAdmin"); // Set Users as the default tab
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar open by default
  const [modalOpen, setModalOpen] = useState(false); // Control modal open/close state

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const route = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false); // Close sidebar on small screens
      } else {
        setIsSidebarOpen(true); // Open sidebar on larger screens
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    console.log("Logout clicked");
    route("/");
    localStorage.removeItem("token");
  };

  return (
    <>
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
                    ? "Users"
                    : activeTab === "schoolAdmin"
                    ? "School Admins"
                    : activeTab === "studentUsers"
                    ? "Student"
                    : activeTab === "schools"
                    ? "Schools"
                    : activeTab === "grades"
                    ? "Grades"
                    : "Other Dashboard Tab"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/username.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
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
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div
          className={`flex flex-1 flex-col gap-4 p-4 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          {activeTab === "addFileStudent" ? (
            <>
              <h1 className="text-2xl font-bold mb-4">Add File Student</h1>
              <AddFileStudentForm />
            </>
          ) : activeTab === "addAdmin" ? (
            <>
              <UsersTable modalOpen={modalOpen} setModalOpen={setModalOpen} />
            </>
          ) : activeTab === "schoolAdmin" ? (
            <>
              <SchoolAdminUsersTable
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
              />
            </>
          ) : activeTab === "studentUsers" ? (
            <>
              <StudentUsersTable
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
              />
            </>
          ) : activeTab === "schools" ? (
            <>
              <SchoolTable modalOpen={modalOpen} setModalOpen={setModalOpen} />
            </>
          ) : activeTab === "grades" ? (
            <>
              <GradesTable modalOpen={modalOpen} setModalOpen={setModalOpen} />
            </>
          ) : activeTab === "levels" ? (
            <>
              <LevelsTable modalOpen={modalOpen} setModalOpen={setModalOpen} />
            </>
          ) : activeTab === "subjects" ? (
            <>
               <SubjectsTable modalOpen={modalOpen} setModalOpen={setModalOpen} />
            </>
          ) : (
            <h1>Other Dashboard Tab</h1>
          )
            }
        </div>
      </div>
    </>
  );
}
