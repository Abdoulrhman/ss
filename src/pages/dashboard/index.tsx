import { useState } from "react";
import { AddFileStudentForm } from "@/components/add-file-student";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";  // For logout icon


// Sidebar component
function Sidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <div className="w-64 h-screen bg-muted p-4 flex flex-col gap-4">
      <button
        className={`text-left p-2 rounded-lg ${activeTab === "addFileStudent" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
        onClick={() => setActiveTab("addFileStudent")}
      >
        Add File Student
      </button>
      <button
        className={`text-left p-2 rounded-lg ${activeTab === "otherTab" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
        onClick={() => setActiveTab("otherTab")}
      >
        Other Dashboard Tab
      </button>
      {/* Add more buttons for other sections here */}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("addFileStudent"); // State to track the active tab
  const handleLogout = () => {
    console.log("Logout clicked");
    // Add your logout logic here (e.g., clearing tokens, redirecting, etc.)
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
        <div className="flex items-center">
          {/* Logo */}
          {/* <img src="/path/to/logo.png" alt="Logo" className="h-8 w-8 mr-4" />  */}
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
                  {activeTab === "addFileStudent" ? "Add File Student" : "Other Dashboard Tab"}
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
              <AvatarFallback>U</AvatarFallback>  {/* Fallback in case image fails */}
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
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Conditional rendering of the AddFileStudentForm or other content */}
          {activeTab === "addFileStudent" ? (
            <>
              <h1 className="text-2xl font-bold mb-4">Add File Student</h1>  {/* Heading for Add File Student */}
              <AddFileStudentForm />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">Other Dashboard Tab</h1>  {/* Heading for Other Dashboard Tab */}
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                <h2 className="text-xl">Other Dashboard Tab Content</h2>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
