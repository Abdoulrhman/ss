/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EQuestionType } from "@/api/adminApis"; // Import the EQuestionType enum
import apiInstance from "@/api/axiosInstance";

const AddQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState([
    {
      ContentQuestion: "",
      File: null as File | null,
      Importance: false,
      QuestionType: EQuestionType.MCQ,
      Score: 0,
      RelatedQuestions: [
        {
          ContentQuestion: "",
          File: null as File | null,
          Importance: false,
          QuestionType: EQuestionType.MCQ,
          Score: 0,
          Answers: [
            { Answer: "", IsCorrect: false, File: null as File | null },
          ],
        },
      ],
      Answers: [{ Answer: "", IsCorrect: false, File: null as File | null }],
    },
  ]);

  const [formData, setFormData] = useState({
    NameAr: "",
    NameEn: "",
    piece: "",
    Skill: 0,
    SubjectId: "",
    GradeId: "",
    LevelId: "",
    IsActive: true,
  });

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    (updatedQuestions[index] as any)[field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    field: string,
    value: any
  ) => {
    const updatedQuestions = [...questions];
    (updatedQuestions[questionIndex].Answers[answerIndex] as any)[field] =
      value;
    setQuestions(updatedQuestions);
  };

  const handleRelatedQuestionChange = (
    questionIndex: number,
    relatedQuestionIndex: number,
    field: string,
    value: any
  ) => {
    const updatedQuestions = [...questions];
    (
      updatedQuestions[questionIndex].RelatedQuestions[
        relatedQuestionIndex
      ] as any
    )[field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddAnswer = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].Answers.push({
      Answer: "",
      IsCorrect: false,
      File: null,
    });
    setQuestions(updatedQuestions);
  };

  const handleAddRelatedQuestion = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].RelatedQuestions.push({
      ContentQuestion: "",
      File: null,
      Importance: false,
      QuestionType: EQuestionType.MCQ,
      Score: 0,
      Answers: [{ Answer: "", IsCorrect: false, File: null }],
    });
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        ContentQuestion: "",
        File: null,
        Importance: false,
        QuestionType: EQuestionType.MCQ,
        Score: 0,
        RelatedQuestions: [
          {
            ContentQuestion: "",
            File: null,
            Importance: false,
            QuestionType: EQuestionType.MCQ,
            Score: 0,
            Answers: [{ Answer: "", IsCorrect: false, File: null }],
          },
        ],
        Answers: [{ Answer: "", IsCorrect: false, File: null }],
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      const formattedQuestions = questions.map((q) => ({
        ContentQuestion: q.ContentQuestion,
        File: q.File ? q.File.name : undefined,
        Importance: q.Importance,
        QuestionType: q.QuestionType,
        Score: q.Score,
        RelatedQuestions: q.RelatedQuestions.map((rq) => ({
          ContentQuestion: rq.ContentQuestion,
          File: rq.File ? rq.File.name : undefined,
          Importance: rq.Importance,
          QuestionType: rq.QuestionType,
          Score: rq.Score,
          Answers: rq.Answers.map((a) => ({
            Answer: a.Answer,
            IsCorrect: a.IsCorrect,
            File: a.File ? a.File.name : undefined,
          })),
        })),
        Answers: q.Answers.map((a) => ({
          Answer: a.Answer,
          IsCorrect: a.IsCorrect,
          File: a.File ? a.File.name : undefined,
        })),
      }));

      const payload = {
        ...formData,
        Questions: formattedQuestions,
      };

      const response = await apiInstance.post("/api/ModelExam/Add", payload);
      alert("Model Exam added successfully!");
      console.log("Response:", response.data);

      // Reset form
      setQuestions([
        {
          ContentQuestion: "",
          File: null,
          Importance: false,
          QuestionType: EQuestionType.MCQ,
          Score: 0,
          RelatedQuestions: [
            {
              ContentQuestion: "",
              File: null,
              Importance: false,
              QuestionType: EQuestionType.MCQ,
              Score: 0,
              Answers: [{ Answer: "", IsCorrect: false, File: null }],
            },
          ],
          Answers: [{ Answer: "", IsCorrect: false, File: null }],
        },
      ]);
      setFormData({
        NameAr: "",
        NameEn: "",
        piece: "",
        Skill: 0,
        SubjectId: "",
        GradeId: "",
        LevelId: "",
        IsActive: true,
      });
    } catch (error) {
      console.error("Error adding model exam:", error);
      alert("Failed to add model exam.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Model Exam</h1>

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Arabic Name</label>
          <Input
            placeholder="Enter Arabic Name"
            value={formData.NameAr}
            onChange={(e) => handleFormChange("NameAr", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">English Name</label>
          <Input
            placeholder="Enter English Name"
            value={formData.NameEn}
            onChange={(e) => handleFormChange("NameEn", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Piece</label>
          <Input
            placeholder="Enter Piece"
            value={formData.piece}
            onChange={(e) => handleFormChange("piece", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Skill</label>
          <Input
            type="number"
            placeholder="Enter Skill"
            value={formData.Skill}
            onChange={(e) => handleFormChange("Skill", Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Subject ID</label>
          <Input
            placeholder="Enter Subject ID"
            value={formData.SubjectId}
            onChange={(e) => handleFormChange("SubjectId", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Grade ID</label>
          <Input
            placeholder="Enter Grade ID"
            value={formData.GradeId}
            onChange={(e) => handleFormChange("GradeId", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Level ID</label>
          <Input
            placeholder="Enter Level ID"
            value={formData.LevelId}
            onChange={(e) => handleFormChange("LevelId", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Is Active</label>
          <input
            type="checkbox"
            checked={formData.IsActive}
            onChange={(e) => handleFormChange("IsActive", e.target.checked)}
          />
        </div>
      </div>

      {/* Questions */}
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="border p-6 mb-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Question {qIndex + 1}</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Question Content
            </label>
            <Input
              placeholder="Enter the question"
              value={question.ContentQuestion}
              onChange={(e) =>
                handleQuestionChange(qIndex, "ContentQuestion", e.target.value)
              }
            />
          </div>

          <Button
            onClick={() => handleAddRelatedQuestion(qIndex)}
            className="mt-2 bg-purple-600 text-white"
          >
            Add Related Question
          </Button>
        </div>
      ))}

      {/* Add New Question */}
      <Button
        onClick={handleAddQuestion}
        className="mt-4 bg-green-600 text-white"
      >
        Add New Question
      </Button>

      {/* Submit Button */}
      <Button onClick={handleSubmit} className="bg-blue-600 text-white">
        Submit Model Exam
      </Button>
    </div>
  );
};

export default AddQuestionsPage;
