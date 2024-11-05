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
  searchSchools,
  addSchool,
  updateSchool,
  deleteSchool,
} from "@/api/adminApis";
import { AddEditSchoolModal } from "./add_school_modal";

export function SchoolTable() {
  const [schools, setSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const response = await searchSchools();
      setSchools(response.Data.Data);
    } catch (error) {
      console.error("Error fetching schools", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleAddSchool = () => {
    setSelectedSchool(null);
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleEditSchool = (school: any) => {
    setSelectedSchool(school);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDeleteSchool = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this school?"
    );
    if (confirmed) {
      try {
        await deleteSchool(id);
        setSchools((prevSchools) =>
          prevSchools.filter((school) => school.Id !== id)
        );
      } catch (error) {
        console.error("Error deleting school", error);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditMode) {
        await updateSchool({ ...data, Id: selectedSchool.Id });
      } else {
        await addSchool(data);
      }
      fetchSchools(); // Refresh the list after adding or updating
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Schools</h1>
        <Button onClick={handleAddSchool}>Add New School</Button>
      </div>

      {isLoading && <p>Loading schools...</p>}
      {!isLoading && schools.length === 0 && <p>No schools found.</p>}

      {schools.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-bold">Arabic Name</TableCell>
              <TableCell className="font-bold">English Name</TableCell>
              <TableCell className="font-bold">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school.Id}>
                <TableCell>{school.NameAr}</TableCell>
                <TableCell>{school.NameEn}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditSchool(school)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSchool(school.Id)}
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

      {/* Add/Edit School Modal */}
      {modalOpen && (
        <AddEditSchoolModal
          isEdit={isEditMode}
          schoolData={selectedSchool}
          open={modalOpen}
          setOpen={setModalOpen}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
