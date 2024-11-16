import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUserProfile, changePassword } from "@/api/adminApis";
import { Upload } from "lucide-react"; // Importing the Upload icon

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<{
    Phone: string;
    Email: string;
    UserName: string;
    Image: string | null;
  }>({
    Phone: "",
    Email: "",
    UserName: "",
    Image: null,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setProfile({
        Phone: parsedUser.Phone,
        Email: parsedUser.Email,
        UserName: parsedUser.UserName,
        Image: parsedUser.Image || null,
      });
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setProfile((prev) => ({ ...prev, Image: fileURL }));
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await updateUserProfile({
        Phone: profile.Phone,
        Email: profile.Email,
        UserName: profile.UserName,
        Image: imageFile || null,
      });

      const updatedProfile = { ...profile };
      localStorage.setItem("user", JSON.stringify(updatedProfile));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await changePassword({
        CurrentPassword: currentPassword,
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword,
      });

      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        {/* Tabs */}
        <div className="flex mb-6">
          <button
            className={`px-4 py-2 ${
              activeTab === "profile" ? "bg-gray-300 font-bold" : "bg-gray-100"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "changePassword"
                ? "bg-gray-300 font-bold"
                : "bg-gray-100"
            }`}
            onClick={() => setActiveTab("changePassword")}
          >
            Change Password
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" ? (
          <div>
            <div className="flex items-center mb-6">
              <div className="relative">
                {profile.Image ? (
                  <img
                    src={profile.Image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input value={profile.Phone} disabled />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={profile.Email} disabled />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                value={profile.UserName}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    UserName: e.target.value,
                  }))
                }
              />
            </div>

            <Button onClick={handleProfileUpdate} className="w-full">
              Save Changes
            </Button>
          </div>
        ) : (
          // Change Password Tab
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button onClick={handleChangePassword} className="w-full">
              Change Password
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
