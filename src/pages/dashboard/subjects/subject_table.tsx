/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  searchSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "@/api/adminApis"; // Adjust as necessary
import { AddEditSubjectModal } from "./add_subject_modal";

export function SubjectsTable() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await searchSubjects();
      setSubjects(response.Data.Data);
    } catch (error: any) {
      setError("Failed to fetch subjects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubject = () => {
    setSelectedSubject(null);
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleEditSubject = (subject: any) => {
    setSelectedSubject(subject);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDeleteSubject = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );
    if (confirmed) {
      try {
        await deleteSubject(id);
        fetchSubjects(); // Refresh list after deletion
      } catch (error) {
        console.error("Error deleting subject", error);
        alert("Failed to delete the subject. Please try again.");
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditMode) {
        await updateSubject({ ...data, Id: selectedSubject.Id });
      } else {
        await addSubject(data);
      }
      fetchSubjects(); // Refresh subjects after add/edit
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <Button onClick={handleAddSubject}>Add New Subject</Button>
      </div>
      {isLoading && <p>Loading subjects...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-bold">Arabic Name</TableCell>
            <TableCell className="font-bold">English Name</TableCell>
            <TableCell className="font-bold">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.Id}>
              <TableCell>{subject.NameAr}</TableCell>
              <TableCell>{subject.NameEn}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditSubject(subject)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSubject(subject.Id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <AddEditSubjectModal
          isEdit={isEditMode}
          subjectData={selectedSubject}
          open={modalOpen}
          setOpen={setModalOpen}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
