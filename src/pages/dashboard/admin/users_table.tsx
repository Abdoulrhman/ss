import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react"; // Icons for edit and delete
import { AddAdminModal } from "./add_admin_modal";

// Mock Data for Users (Replace with your data)
const usersData = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
  },
  // Add more users as needed
];

export function UsersTable() {
  const [users, setUsers] = useState(usersData);

  // Handle edit action (You can implement the actual edit logic)
  const handleEdit = (id: number) => {
    console.log("Edit user with id:", id);
    // Open an edit form/modal here if needed
  };

  // Handle delete action
  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="w-full">
      {/* Header with Table Name and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <AddAdminModal /> {/* The modal button for adding a new admin */}
      </div>

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
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(user.id)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
