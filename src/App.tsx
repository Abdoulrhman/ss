// App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";

import { DashboardLayout } from "./pages/dashboard";
import { SubjectsTable } from "./pages/dashboard/subjects/subject_table";
import { StudentUsersTable } from "./pages/dashboard/student/students_table";
import { SchoolTable } from "./pages/dashboard/schools/school_table";
import { SchoolAdminUsersTable } from "./pages/dashboard/school-admin/school_admin_table";
import { AddFileStudentForm } from "./components/add-file-student";
import { UsersTable } from "./pages/dashboard/admin/users_table";
import { GradesTable } from "./pages/dashboard/grades/grade_table";
import { LevelsTable } from "./pages/dashboard/levels/level_table";
import ProfilePage from "./pages/dashboard/profile";
import { StudentFilePage } from "./pages/dashboard/student/download_students";
import AddModelExamPage from "./pages/dashboard/questions";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard/users" element={<UsersTable />} />
        <Route
          path="/dashboard/add-file-student"
          element={<AddFileStudentForm />}
        />
        <Route
          path="/dashboard/school-admins"
          element={<SchoolAdminUsersTable />}
        />
        <Route path="/dashboard/students" element={<StudentUsersTable />} />
        <Route
          path="/dashboard/students/download"
          element={<StudentFilePage />}
        />
        <Route path="/dashboard/schools" element={<SchoolTable />} />
        <Route path="/dashboard/grades" element={<GradesTable />} />
        <Route path="/dashboard/levels" element={<LevelsTable />} />
        <Route path="/dashboard/subjects" element={<SubjectsTable />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route path="/dashboard/questions" element={<AddModelExamPage />} />
      </Route>
    </Routes>
  );
};

export default App;
