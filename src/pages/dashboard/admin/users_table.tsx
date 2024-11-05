import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react"; // Icons for edit and delete
import { AddEditAdminModal } from "./add_admin_modal"; // Import AddEditAdminModal
import { getAllUsers, deleteUser } from "@/api/adminApis"; // API calls for getting and deleting users

export function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null); // Store selected user for editing
  const [isEditMode, setIsEditMode] = useState(false); // Track if we are in edit mode
  const [modalOpen, setModalOpen] = useState(false); // Track if modal is open

  // Fetch users of type 2 on component load
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers(2); // Call the API to get users of type 2
        setUsers(response.Data.Data); // Assuming response.Data.Data contains the list of users
      } catch (err: any) {
        setError(err.message || "Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle adding a user
  const handleAddUser = () => {
    setSelectedUser(null); // No user selected for add
    setIsEditMode(false); // Not in edit mode
    setModalOpen(true); // Open the modal
  };

  // Handle editing a user
  const handleEdit = (user: any) => {
    setSelectedUser(user); // Set the user data for editing
    setIsEditMode(true); // We are in edit mode
    setModalOpen(true); // Open the modal
  };

  // Handle delete action
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      try {
        await deleteUser(id); // Call API to delete user
        setUsers((prevUsers) => prevUsers.filter((user) => user.Id !== id)); // Remove from state
      } catch (err: any) {
        alert("Failed to delete user");
        console.error("Error deleting user:", err);
      }
    }
  };

  // Close modal handler and refresh users after add/edit
  const closeModalAndRefresh = async () => {
    setModalOpen(false);
    const response = await getAllUsers(2); // Refetch users after add/edit
    setUsers(response.Data.Data);
  };

  return (
    <div className="w-full">
      {/* Header with Table Name and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={handleAddUser}>Add New Admin</Button>{" "}
        {/* Add button */}
      </div>

      {isLoading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
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

      {/* Modal for adding/editing user */}
      {modalOpen && (
        <AddEditAdminModal
          isEdit={isEditMode}
          adminData={selectedUser}
          open={modalOpen}
          setOpen={setModalOpen}
          onClose={closeModalAndRefresh} // Refresh users on modal close
        />
      )}
    </div>
  );
}
