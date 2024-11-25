import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pencil, Trash } from "lucide-react";
import { getAllUsers, deleteUser } from "@/api/adminApis"; // Import download function
import { AddEditStudentModal } from "./add_student_modal";

export function StudentUsersTable() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // Store the selected student for editing
  const [isEditMode, setIsEditMode] = useState(false); // Track if we are in edit mode
  const [modalOpen, setModalOpen] = useState(false); // Track if modal is open

  // Search, sorting, and pagination state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<number>(1); // 1 for ascending, -1 for descending
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Fixed page size
  const [totalItems, setTotalItems] = useState(0); // Total number of items

  // Fetch students
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(
        4, // User type for students
        page,
        pageSize,
        searchKeyword,
        sortField,
        sortOrder
      );
      setStudents(response.Data.Data || []); // Assuming response.Data.Data contains the list of students
      setTotalItems(response.Data.Count || 0); // Use Count from the response for total items
    } catch (err: any) {
      setError(err.message || "Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, pageSize, searchKeyword, sortField, sortOrder]);

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

  // Handle sorting by column
  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(sortOrder === 1 ? -1 : 1); // Toggle sort order
  };

  // Pagination controls
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Close modal handler and refresh students after add/edit
  const closeModalAndRefresh = async () => {
    setModalOpen(false);
    fetchStudents(); // Refetch students after add/edit
  };

  return (
    <div className="w-full">
      {/* Header with Table Name, Search, and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search by name or email"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button onClick={handleAddStudent}>Add New Student</Button>
        </div>
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
              <TableCell
                className="font-bold cursor-pointer"
                onClick={() => handleSort("Name")}
              >
                Name {sortField === "Name" && (sortOrder === 1 ? "↑" : "↓")}
              </TableCell>

              <TableCell
                className="font-bold cursor-pointer"
                onClick={() => handleSort("StudentCode")}
              >
                StudentCode{" "}
                {sortField === "StudentCode" && (sortOrder === 1 ? "↑" : "↓")}
              </TableCell>
              <TableCell
                className="font-bold cursor-pointer"
                onClick={() => handleSort("GenderName")}
              >
                GenderName{" "}
                {sortField === "GenderName" && (sortOrder === 1 ? "↑" : "↓")}
              </TableCell>
              <TableCell
                className="font-bold cursor-pointer"
                onClick={() => handleSort("Email")}
              >
                Email {sortField === "Email" && (sortOrder === 1 ? "↑" : "↓")}
              </TableCell>
              <TableCell className="font-bold">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.Id}>
                <TableCell>{student.Name}</TableCell>
                <TableCell>{student.StudentCode}</TableCell>
                <TableCell>{student.GenderName}</TableCell>
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={handlePrevPage}
          disabled={page === 1}
          variant="secondary"
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={page >= totalPages}
          variant="secondary"
        >
          Next
        </Button>
      </div>

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
