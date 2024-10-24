import apiInstance from "./axiosInstance";

// Login function
export const adminLogin = async (username: string, password: string) => {
  try {
    const response = await apiInstance.post("/Account/AdminLogin", {
      username,
      password,
    });

    // Assuming the token is returned in the response data under "token"
    const { token } = response.data;

    // Store the token in localStorage
    if (token) {
      localStorage.setItem("token", token);
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
