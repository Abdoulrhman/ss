import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUserProfile, changePassword } from "@/api/adminApis";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<{
    Name: string;
    Phone: string;
    Email: string;
    Image: string | null;
    UserName: string;
  }>({
    Name: "",
    Phone: "",
    Email: "",
    Image: null,
    UserName: "",
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
        Name: parsedUser.Name,
        Phone: parsedUser.Phone,
        Email: parsedUser.Email,
        Image: parsedUser.Image || null,
        UserName: parsedUser.Name,
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
        UserName: profile.UserName,
        Image: imageFile || null,
      });

      const updatedProfile = { ...profile, Image: profile.Image };
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="flex mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "profile" ? "bg-gray-300 font-bold" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile Data
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

      {activeTab === "profile" ? (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input value={profile.Name} disabled />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input value={profile.Phone} disabled />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input value={profile.Email} disabled />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">UserName</label>
            <Input
              value={profile.UserName}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, UserName: e.target.value }))
              }
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Profile Image
            </label>
            {profile.Image ? (
              <img
                src={profile.Image}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-2"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-2" />
            )}
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <Button onClick={handleProfileUpdate}>Update Profile</Button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button onClick={handleChangePassword}>Change Password</Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
