import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;

  toggleSidebar: () => void;

  activeTab: string;

  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const tabRoutes: { [key: string]: string } = {
  "/dashboard/users": "addAdmin",
  "/dashboard/school-admins": "schoolAdmin",
  "/dashboard/students": "studentUsers",
  "/dashboard/students/download": "studentUsersDownload",
  "/dashboard/add-file-student": "addFileStudent",
  "/dashboard/schools": "schools",
  "/dashboard/grades": "grades",
  "/dashboard/levels": "levels",
  "/dashboard/subjects": "subjects",
  "/dashboard/questions": "questions",
};

function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the active tab based on the current path
  const activeTab =
    tabRoutes[location.pathname as keyof typeof tabRoutes] || "addAdmin";

  const handleTabClick = (route: string) => {
    navigate(route);
  };

  return (
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
        onClick={() => handleTabClick("/dashboard/users")}
      >
        Platform Admins
      </button>

      <button
        className={`text-left p-2 rounded-lg ${
          activeTab === "schoolAdmin"
            ? "bg-gray-700 text-white"
            : "hover:bg-gray-800 text-gray-400"
        }`}
        onClick={() => handleTabClick("/dashboard/school-admins")}
      >
        School Admins
      </button>

      <button
        className={`text-left p-2 rounded-lg ${
          activeTab === "studentUsers"
            ? "bg-gray-700 text-white"
            : "hover:bg-gray-800 text-gray-400"
        }`}
        onClick={() => handleTabClick("/dashboard/students")}
      >
        Student Data
      </button>

      <button
        className={`text-left p-2 rounded-lg ${
          activeTab === "studentUsersDownload"
            ? "bg-gray-700 text-white"
            : "hover:bg-gray-800 text-gray-400"
        }`}
        onClick={() => handleTabClick("/dashboard/students/download")}
      >
        Download Student Data
      </button>

      <button
        className={`text-left p-2 rounded-lg ${
          activeTab === "addFileStudent"
            ? "bg-gray-700 text-white"
            : "hover:bg-gray-800 text-gray-400"
        }`}
        onClick={() => handleTabClick("/dashboard/add-file-student")}
      >
        Import Student Data
      </button>

      <button
        className={`text-left p-2 rounded-lg ${
          activeTab === "schools"
            ? "bg-gray-700 text-white"
            : "hover:bg-gray-800 text-gray-400"
        }`}
        onClick={() => handleTabClick("/dashboard/schools")}
      >
        Schools
      </button>

      <button
        className={`text-left p-2 rounded-lg ${
          activeTab === "grades"
            ? "bg-gray-700 text-white"
            : "hover:bg-gray-800 text-gray-400"
        }`}
        onClick={() => handleTabClick("/dashboard/grades")}
      >
        Grades
      </button>

      <button
        className={`text-left p-2 rounded-lg ${
          activeTab === "levels"
            ? "bg-gray-700 text-white"
            : "hover:bg-gray-800 text-gray-400"
        }`}
        onClick={() => handleTabClick("/dashboard/levels")}
      >
        Levels
      </button>

      <button
        className={`text-left p-2 rounded-lg ${
          activeTab === "subjects"
            ? "bg-gray-700 text-white"
            : "hover:bg-gray-800 text-gray-400"
        }`}
        onClick={() => handleTabClick("/dashboard/subjects")}
      >
        Subjects
      </button>
      <button
        className={`text-left p-2 rounded-lg ${
          activeTab === "questions"
            ? "bg-gray-700 text-white"
            : "hover:bg-gray-800 text-gray-400"
        }`}
        onClick={() => handleTabClick("/dashboard/questions")}
      >
        Add Modal Exam
      </button>

      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-black text-white p-2 rounded-full"
          onClick={toggleSidebar}
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

export default Sidebar;
