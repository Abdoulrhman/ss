import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { getAllUsers, deleteUser } from "@/api/adminApis"; // API calls for school admins
import { AddEditSchoolAdminModal } from "./add_school_admin_modal";

interface SchoolAdminUsersTableProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export function SchoolAdminUsersTable({ modalOpen, setModalOpen }: SchoolAdminUsersTableProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null); // Store the selected user for editing
  const [isEditMode, setIsEditMode] = useState(false); // Track if we are in edit mode

  // Fetch school admins of type 3 on component load
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers(3); // Call the API to get school admins
        setUsers(response.Data.Data); // Assuming response.Data.Data contains the list of users
      } catch (err: any) {
        setError(err.message || "Failed to fetch school admins");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle add user
  const handleAddUser = () => {
    setSelectedUser(null); // No user selected for add
    setIsEditMode(false); // Not in edit mode
    setModalOpen(true); // Open the modal
  };

  // Handle edit action
  const handleEdit = (user: any) => {
    setSelectedUser(user); // Set the user data for editing
    setIsEditMode(true); // We are in edit mode
    setModalOpen(true); // Open the modal
  };

  // Handle delete action
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this school admin?"
    );
    if (confirmed) {
      try {
        await deleteUser(id);
        setUsers((prevUsers) => prevUsers.filter((user) => user.Id !== id));
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  // Close modal handler and refresh users after add/edit
  const closeModalAndRefresh = async () => {
    setModalOpen(false);
    const response = await getAllUsers(3); // Refetch users after add/edit
    setUsers(response.Data.Data);
  };

  return (
    <div className="w-full">
      {/* Header with Table Name and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">School Admins</h1>
        <Button onClick={handleAddUser}>Add New School Admin</Button>{" "}
        {/* Add button */}
      </div>

      {isLoading && <p>Loading school admins...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Empty State */}
      {!isLoading && users.length === 0 && (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold">No School Admins Found</h2>
          <p className="text-gray-500">Get started by adding a new school admin.</p>
        </div>
      )}

      {/* Table */}
      {users.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-bold">Name</TableCell>
              <TableCell className="font-bold">Email</TableCell>
              <TableCell className="font-bold">Phone</TableCell>
              <TableCell className="font-bold">Actions</TableCell>{" "}
              {/* Actions column */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.Id}>
                <TableCell>{user.Name}</TableCell>
                <TableCell>{user.Email}</TableCell>
                <TableCell>{user.Phone}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {/* Edit Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.Id)}
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

      {/* Modal for adding/editing user */}
      {modalOpen && (
        <AddEditSchoolAdminModal
          isEdit={isEditMode}
          adminData={selectedUser}
          open={modalOpen}
          setOpen={setModalOpen}
          onClose={closeModalAndRefresh}
        />
      )}
    </div>
  );
}
