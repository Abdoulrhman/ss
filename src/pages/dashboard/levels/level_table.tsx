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
  searchLevels,
  addLevel,
  updateLevel,
  deleteLevel,
} from "@/api/adminApis"; // Adjust the path as necessary
import { AddEditLevelModal } from "./add_level_modal";
import { Alert } from "@/components/ui/alert"; // Adjust the import if you have a custom Alert component

export function LevelsTable() {
  const [levels, setLevels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    setIsLoading(true);
    try {
      const response = await searchLevels();
      setLevels(response.Data.Data); // Adjust according to actual data structure
    } catch (error: any) {
      setError("Failed to fetch levels. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLevel = () => {
    setSelectedLevel(null);
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleEditLevel = (level: any) => {
    setSelectedLevel(level);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDeleteLevel = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this level?"
    );
    if (confirmed) {
      try {
        await deleteLevel(id);
        setLevels((prevLevels) =>
          prevLevels.filter((level) => level.Id !== id)
        );
      } catch (error: any) {
        setError("Failed to delete the level. Please try again.");
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditMode) {
        await updateLevel({ ...data, Id: selectedLevel.Id });
      } else {
        await addLevel(data);
      }
      setModalOpen(false);
      fetchLevels(); // Refresh levels after add/edit
    } catch (error: any) {
      setError("Failed to save level. Please check your input and try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Levels</h1>
        <Button onClick={handleAddLevel}>Add New Level</Button>
      </div>

      {isLoading && <p>Loading levels...</p>}
      {error && <Alert>{error}</Alert>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-bold">Arabic Name</TableCell>
            <TableCell className="font-bold">English Name</TableCell>
            <TableCell className="font-bold">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {levels.map((level) => (
            <TableRow key={level.Id}>
              <TableCell>{level.NameAr}</TableCell>
              <TableCell>{level.NameEn}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditLevel(level)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteLevel(level.Id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {modalOpen && (
        <AddEditLevelModal
          isEdit={isEditMode}
          levelData={selectedLevel}
          open={modalOpen}
          setOpen={setModalOpen}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
