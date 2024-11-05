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
  searchGrades,
  addGrade,
  updateGrade,
  deleteGrade,
} from "@/api/adminApis"; // Replace with actual path
import { AddEditGradeModal } from "./add_grade_modal";

export function GradesTable() {
  const [grades, setGrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchGrades = async () => {
    setIsLoading(true);
    try {
      const response = await searchGrades();
      setGrades(response.Data.Data); // Adjust according to actual data structure
    } catch (error) {
      setError("Failed to fetch grades");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleAddGrade = () => {
    setSelectedGrade(null);
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleEditGrade = (grade: any) => {
    setSelectedGrade(grade);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDeleteGrade = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this grade?"
    );
    if (confirmed) {
      try {
        await deleteGrade(id);
        setGrades((prevGrades) =>
          prevGrades.filter((grade) => grade.Id !== id)
        );
      } catch (error) {
        console.error("Error deleting grade", error);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditMode && selectedGrade) {
        await updateGrade({ ...data, Id: selectedGrade.Id });
      } else {
        await addGrade(data);
      }
      setModalOpen(false);
      fetchGrades(); // Refresh the list after adding or updating
    } catch (error: any) {
      setError(error.response?.data?.Message || "Error submitting form");
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Grades</h1>
        <Button onClick={handleAddGrade}>Add New Grade</Button>
      </div>

      {isLoading && <p>Loading grades...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && grades.length === 0 && <p>No grades found.</p>}

      {grades.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-bold">Arabic Name</TableCell>
              <TableCell className="font-bold">English Name</TableCell>
              <TableCell className="font-bold">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((grade) => (
              <TableRow key={grade.Id}>
                <TableCell>{grade.NameAr}</TableCell>
                <TableCell>{grade.NameEn}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditGrade(grade)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGrade(grade.Id)}
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

      {/* Add/Edit Grade Modal */}
      {modalOpen && (
        <AddEditGradeModal
          isEdit={isEditMode}
          gradeData={selectedGrade}
          open={modalOpen}
          setOpen={setModalOpen}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
