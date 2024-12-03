/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Input } from "@/components/ui/input";
import { Skills } from "@/api/adminApis";

const MainForm: React.FC<{
  formData: any;
  onChange: (field: string, value: any) => void;
  useSchoolSearch: any;
  useGradeSearch: any;
  useLevelSearch: any;
}> = ({
  formData,
  onChange,
  useSchoolSearch,
  useGradeSearch,
  useLevelSearch,
}) => {
  const { schools } = useSchoolSearch();
  const { grades } = useGradeSearch();
  const { levels } = useLevelSearch();

  const skillOptions = Object.entries(Skills).filter(
    ([_key, value]) => typeof value === "number"
  );

  // Field Configuration Object
  const fieldConfig = [
    {
      name: "NameAr",
      label: "Name (Arabic)",
      type: "text",
      placeholder: "Enter Arabic Name",
    },
    {
      name: "NameEn",
      label: "Name (English)",
      type: "text",
      placeholder: "Enter English Name",
    },
    {
      name: "piece",
      label: "Piece",
      type: "textarea", // Change to textarea
      placeholder: "Enter Piece",
    },
    {
      name: "Skill",
      label: "Skill",
      type: "select",
      options: skillOptions.map(([key, value]) => ({ id: value, name: key })),
    },
    {
      name: "SubjectId",
      label: "Subject",
      type: "select",
      options: schools?.map((school: any) => ({
        id: school.Id,
        name: school.NameEn,
      })),
    },
    {
      name: "GradeId",
      label: "Grade",
      type: "select",
      options: grades?.map((grade: any) => ({
        id: grade.Id,
        name: grade.NameEn,
      })),
    },
    {
      name: "LevelId",
      label: "Level",
      type: "select",
      options: levels?.map((level: any) => ({
        id: level.Id,
        name: level.NameEn,
      })),
    },
    {
      name: "IsActive",
      label: "Active",
      type: "checkbox",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {fieldConfig.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium mb-2">
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              value={
                formData[field.name] as
                  | string
                  | number
                  | readonly string[]
                  | undefined
              }
              onChange={(e) => onChange(field.name, e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option: { id: number; name: string }) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={formData[field.name]}
              onChange={(e) => onChange(field.name, e.target.checked)}
            />
          ) : field.type === "textarea" ? (
            <textarea
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="w-full p-2 border rounded h-32"
            />
          ) : (
            <Input
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={(e) => onChange(field.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MainForm;
