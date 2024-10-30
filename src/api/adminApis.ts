import apiInstance from "./axiosInstance";

// Login function
export const adminLogin = async (username: string, password: string) => {
  try {
    const response = await apiInstance.post("/Account/AdminLogin", {
      username,
      password,
    });

    // Assuming the token is returned in the response data under "token"
    const { token } = response.data.Data;
    // Store the token in localStorage
    if (token) {
      localStorage.setItem("token", "Bearer " + token);
    }

    return response.data; // Assuming the response contains user data or token
  } catch (error: any) {
    throw error.response ? error.response.data : new Error("Login failed");
  }
};

export const registerAccount = async (data: {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: number;
}) => {
  try {
    const response = await apiInstance.post("/Account/Register", {
      Name: data.name,
      Phone: data.phone,
      Email: data.email,
      BirthDate: data.birthDate,
      Gender: data.gender,
    });
    return response.data; // Return the successful response data
  } catch (error: any) {
    throw error.response?.data || new Error("Registration failed"); // Handle the error
  }
};
// Register new School Admin
export const registerSchoolAdmin = async (data: {
  SchoolId: string;
  Name: string;
  Phone: string;
  Email: string;
  Gender: number;
  Note: string;
}) => {
  try {
    const response = await apiInstance.post(
      "/Account/AdminSchoolRegister",
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Registration failed");
  }
};

// Get all school admins with type = 3
export const getAllSchoolAdmins = async () => {
  try {
    const response = await apiInstance.post("/api/Account/Search", {
      Type: 3,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to fetch school admins");
  }
};

export const addFileStudent = async (
  gradeId: string,
  schoolId: string,
  studentFile: File
) => {
  try {
    // Create a FormData object to hold the file and other parameters
    const formData = new FormData();
    formData.append("StudentFile", studentFile); // Add the file to the form data

    // Make the POST request with the form data and query parameters
    const response = await apiInstance.post(
      `/Account/AddFileStudent`,
      formData,
      {
        params: {
          GradeId: gradeId, // Query parameter GradeId
          SchoolId: schoolId, // Query parameter SchoolId
        },
        responseType: "blob", // Important: Set the response type to 'blob' for binary data
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type is set
        },
      }
    );

    // Create a blob from the response data
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    // Create a download link for the blob
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Get the filename from the response headers if available, or use a default name
    const filename =
      response.headers["content-disposition"]
        ?.split("filename=")[1]
        ?.replace(/['"]/g, "") || "download.xlsx";
    link.download = filename;

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link element
    link.remove();

    return response.data; // Return the response data (optional)
  } catch (error: any) {
    throw error.response?.data || new Error("File upload failed");
  }
};

export const downloadStudentsFile = async (
  gradeId: string,
  schoolId: string
) => {
  try {
    // Send the POST request to download the file with the specified GradeId and SchoolId
    const response = await apiInstance.post(
      `/Account/DownloadStudentsFile`,
      { GradeId: gradeId, SchoolId: schoolId }, // Request body containing GradeId and SchoolId
      {
        responseType: "blob", // Set the response type to 'blob' to handle binary data
      }
    );

    // Create a blob from the response data
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    // Create a download link for the blob
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Get the filename from the response headers if available, or use a default name
    const filename =
      response.headers["content-disposition"]
        ?.split("filename=")[1]
        ?.replace(/['"]/g, "") || "students_file.xlsx";
    link.download = filename;

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link element
    link.remove();

    return response.data; // Return the response data (optional)
  } catch (error: any) {
    console.error("Failed to download the file", error);
    throw error.response?.data || new Error("File download failed");
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await apiInstance.delete(`/Account/Delete`, {
      params: {
        UserId: userId,
      },
    });
    return response.data; // Assuming success data is returned here
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to delete user");
  }
};

export const getAllUsers = async (
  type: number,
  page = 1,
  size = 20,
  keyword = ""
) => {
  try {
    const response = await apiInstance.post("/Account/Search", {
      Type: type, // Pass the type (e.g., 2 as in your screenshot)
      page: page, // Optionally pass page number for pagination
      Size: size, // Optionally pass the size for pagination
      keyword: keyword, // Optionally pass a keyword for searching (email, name, etc.)
    });

    return response.data; // Return the successful response data containing the list of users
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to fetch users");
  }
};

export const registerStudent = async (data: {
  Name: string;
  Email: string;
  Phone: string;
  Religion: string;
  StateOfMind: string;
  GradeId: string;
  SchoolId: string;
  SchoolName: string;
  Password: string;
  Gender: number;
  Address: string;
}) => {
  try {
    const response = await apiInstance.post("/Account/StudentRegister", data);
    return response.data; // Return the response data on success
  } catch (error: any) {
    throw error.response?.data || new Error("Student registration failed");
  }
};
