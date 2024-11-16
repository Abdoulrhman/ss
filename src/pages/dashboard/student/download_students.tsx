import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadStudentsFile, downloadTemplate } from "@/api/adminApis";
import { useForm, FormProvider } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useSchoolSearch } from "@/hooks/useSchoolSearch";

export function StudentFilePage() {
  const methods = useForm(); // Use React Hook Form's `useForm`
  const { watch } = methods;
  const [isStudentFileDownloading, setIsStudentFileDownloading] =
    useState(false);

  // Fetch schools using hook
  const {
    schools,
    isLoading: isLoadingSchools,
    error: schoolError,
  } = useSchoolSearch();

  // Dummy grade options
  const gradeOptions = [
    { value: "grade1", label: "Grade 1" },
    { value: "grade2", label: "Grade 2" },
    { value: "grade3", label: "Grade 3" },
  ];

  const selectedGrade = watch("gradeId");
  const selectedSchool = watch("schoolId");

  // Handle student file download
  const handleStudentFileDownload = async () => {
    if (!selectedSchool || !selectedGrade) {
      alert("Please select a school and grade before downloading.");
      return;
    }

    setIsStudentFileDownloading(true);
    try {
      await downloadStudentsFile(selectedGrade, selectedSchool); // Download API call
      alert("Student file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading student file:", error);
      alert("Failed to download student file. Please try again.");
    } finally {
      setIsStudentFileDownloading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Select School and Grade */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Select Filters</h2>
          {/* Grade ID field */}
          <FormField
            control={methods.control}
            name="gradeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded p-2 bg-gray-100"
                  >
                    <option value="">Select grade</option>
                    {gradeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* School ID field */}
          <FormField
            control={methods.control}
            name="schoolId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded p-2 bg-gray-100"
                    disabled={isLoadingSchools}
                  >
                    <option value="">Select school</option>
                    {schools.map((school) => (
                      <option key={school.Id} value={school.Id}>
                        {school.NameEn}
                      </option>
                    ))}
                  </select>
                </FormControl>
                {isLoadingSchools && <p>Loading schools...</p>}
                {schoolError && <p className="text-red-500">{schoolError}</p>}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Download Student File Button */}
          <Button
            onClick={handleStudentFileDownload}
            disabled={
              isStudentFileDownloading || !selectedGrade || !selectedSchool
            }
          >
            {isStudentFileDownloading
              ? "Downloading..."
              : "Download Student File"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
