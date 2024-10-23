import apiInstance from './axiosInstance';

// Login function
export const adminLogin = async (username: string, password: string) => {
  try {
    const response = await apiInstance.post('/Account/AdminLogin', {
      username,
      password,
    });
    return response.data;  // Assuming the response contains user data or token
  } catch (error:any) {
    throw error.response ? error.response.data : new Error('Login failed');
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
      return response.data;  // Return the successful response data
    } catch (error:any) {
      throw error.response?.data || new Error("Registration failed");  // Handle the error
    }
  };


  export const addFileStudent = async (gradeId: string, schoolId: string, studentFile: File) => {
    try {
      // Create a FormData object to hold the file and other parameters
      const formData = new FormData();
      formData.append("StudentFile", studentFile);  // Add the file to the form data
  
      // Make the POST request with the form data and query parameters
      const response = await apiInstance.post(`/Account/AddFileStudent`, formData, {
        params: {
          GradeId: gradeId,  // Query parameter GradeId
          SchoolId: schoolId,  // Query parameter SchoolId
        },
        headers: {
          "Content-Type": "multipart/form-data",  // Ensure the correct content type is set
        },
      });
  
      return response.data;  // Return the response data
    } catch (error: any) {
      throw error.response?.data || new Error("File upload failed");
    }
  };
  