import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { getAllUsers, deleteUser, downloadStudentsFile } from "@/api/adminApis"; // Import download function
import { AddEditStudentModal } from "./add_student_modal";

export function StudentUsersTable() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // Store the selected student for editing
  const [isEditMode, setIsEditMode] = useState(false); // Track if we are in edit mode
  const [modalOpen, setModalOpen] = useState(false); // Track if modal is open

  // Fetch students of type 1 on component load
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers(4); // Call the API to get students
        setStudents(response.Data.Data); // Assuming response.Data.Data contains the list of users
      } catch (err: any) {
        setError(err.message || "Failed to fetch students");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle add student
  const handleAddStudent = () => {
    setSelectedStudent(null); // No student selected for add
    setIsEditMode(false); // Not in edit mode
    setModalOpen(true); // Open the modal
  };

  // Handle edit action
  const handleEdit = (student: any) => {
    setSelectedStudent(student); // Set the student data for editing
    setIsEditMode(true); // We are in edit mode
    setModalOpen(true); // Open the modal
  };

  // Handle delete action
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (confirmed) {
      try {
        await deleteUser(id);
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.Id !== id)
        );
      } catch (error) {
        console.error("Error deleting student", error);
      }
    }
  };

  // Handle download file action
  const handleDownload = async () => {
    try {
      const gradeId = "d1ebe318-0a70-44ac-b244-768bdb3b974e"; // Example GradeId
      const schoolId = "9a8c7dd1-f3fe-4de5-8d31-07e8bb64a3b7"; // Example SchoolId
      await downloadStudentsFile(gradeId, schoolId); // Trigger download
    } catch (error) {
      console.error("Error downloading student file", error);
    }
  };

  // Close modal handler and refresh students after add/edit
  const closeModalAndRefresh = async () => {
    setModalOpen(false);
    const response = await getAllUsers(1); // Refetch students after add/edit
    setStudents(response.Data.Data);
  };

  return (
    <div className="w-full">
      {/* Header with Table Name and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <Button onClick={handleAddStudent}>Add New Student</Button>
      </div>

      {/* Download Button */}
      <div className="mb-4">
        <Button onClick={handleDownload}>Download Student File</Button>
      </div>

      {isLoading && <p>Loading students...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Empty State */}
      {!isLoading && students.length === 0 && (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold">No Students Found</h2>
          <p className="text-gray-500">Get started by adding a new student.</p>
        </div>
      )}

      {/* Table */}
      {students.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-bold">Name</TableCell>
              <TableCell className="font-bold">Email</TableCell>
              <TableCell className="font-bold">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.Id}>
                <TableCell>{student.Name}</TableCell>
                <TableCell>{student.Email}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(student)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(student.Id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modal for adding/editing student */}
      {modalOpen && (
        <AddEditStudentModal
          isEdit={isEditMode}
          studentData={selectedStudent}
          open={modalOpen}
          setOpen={setModalOpen}
          onClose={closeModalAndRefresh}
        />
      )}
    </div>
  );
}
