import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EQuestionType } from "@/api/adminApis"; // Import the EQuestionType enum
import apiInstance from "@/api/axiosInstance";

const AddModelExamPage: React.FC = () => {
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

  interface Answer {
    Answer: string;
    IsCorrect: boolean;
    File: string;
  }

  interface RelatedQuestion {
    ContentQuestion: string;
    File: string;
    Importance: boolean;
    QuestionType: EQuestionType;
    Score: number;
    Answers: Answer[];
  }

  interface Question {
    ContentQuestion: string;
    File: string;
    Importance: boolean;
    QuestionType: EQuestionType;
    Score: number;
    RelatedQuestions: RelatedQuestion[];
    Answers: Answer[];
  }

  const [questions, setQuestions] = useState<Question[]>([
    {
      ContentQuestion: "",
      File: "",
      Importance: false,
      QuestionType: EQuestionType.MCQ,
      Score: 0,
      RelatedQuestions: [
        {
          ContentQuestion: "",
          File: "",
          Importance: false,
          QuestionType: EQuestionType.MCQ,
          Score: 0,
          Answers: [{ Answer: "", IsCorrect: false, File: "" }],
        },
      ],
      Answers: [{ Answer: "", IsCorrect: false, File: "" }],
    },
  ]);

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
      field: keyof Answer,
      value: any
    ) => {
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex].Answers[answerIndex][field] = value as never;
      setQuestions(updatedQuestions);
    };

  // const handleRelatedQuestionChange = (
  //   questionIndex: number,
  //   relatedQuestionIndex: number,
  //   field: keyof RelatedQuestion,
  //   value: any
  // ) => {
  //   const updatedQuestions = [...questions];
  //   updatedQuestions[questionIndex].RelatedQuestions[relatedQuestionIndex][
  //     field
  //   ] = value;
  //   setQuestions(updatedQuestions);
  // };

  const handleAddAnswer = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].Answers.push({
      Answer: "",
      IsCorrect: false,
      File: "",
    });
    setQuestions(updatedQuestions);
  };

  // const handleAddRelatedQuestion = (questionIndex: number) => {
  //   const updatedQuestions = [...questions];
  //   updatedQuestions[questionIndex].RelatedQuestions.push({
  //     ContentQuestion: "",
  //     File: "",
  //     Importance: false,
  //     QuestionType: EQuestionType.MCQ,
  //     Score: 0,
  //     Answers: [{ Answer: "", IsCorrect: false, File: "" }],
  //   });
  //   setQuestions(updatedQuestions);
  // };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        ContentQuestion: "",
        File: "",
        Importance: false,
        QuestionType: EQuestionType.MCQ,
        Score: 0,
        RelatedQuestions: [
          {
            ContentQuestion: "",
            File: "",
            Importance: false,
            QuestionType: EQuestionType.MCQ,
            Score: 0,
            Answers: [{ Answer: "", IsCorrect: false, File: "" }],
          },
        ],
        Answers: [{ Answer: "", IsCorrect: false, File: "" }],
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData, Questions: questions };
      const response = await apiInstance.post("/ModelExam/Add", payload);
      alert("Model Exam added successfully!");
      console.log("Response:", response.data);
      setQuestions([
        {
          ContentQuestion: "",
          File: "",
          Importance: false,
          QuestionType: EQuestionType.MCQ,
          Score: 0,
          RelatedQuestions: [
            {
              ContentQuestion: "",
              File: "",
              Importance: false,
              QuestionType: EQuestionType.MCQ,
              Score: 0,
              Answers: [{ Answer: "", IsCorrect: false, File: "" }],
            },
          ],
          Answers: [{ Answer: "", IsCorrect: false, File: "" }],
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

      {/* Main Form */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {Object.entries(formData).map(([field, value]) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-2">{field}</label>
            {typeof value === "boolean" ? (
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleFormChange(field, e.target.checked)}
              />
            ) : (
              <Input
                placeholder={`Enter ${field}`}
                value={value}
                onChange={(e) => handleFormChange(field, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Questions Section */}
      {questions.map((question, qIndex) => (
  <div key={qIndex} className="border p-4 mb-6 rounded-lg">
    <h2 className="font-semibold mb-4">Question {qIndex + 1}</h2>
    
    {/* Question Fields */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Question Content</label>
      <Input
        placeholder="Enter Question Content"
        value={question.ContentQuestion}
        onChange={(e) =>
          handleQuestionChange(qIndex, "ContentQuestion", e.target.value)
        }
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">File</label>
      <input
        type="file"
        onChange={(e) =>
          handleQuestionChange(qIndex, "File", e.target.files?.[0]?.name)
        }
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Importance</label>
      <input
        type="checkbox"
        checked={question.Importance}
        onChange={(e) =>
          handleQuestionChange(qIndex, "Importance", e.target.checked)
        }
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Question Type</label>
      <select
        value={question.QuestionType}
        onChange={(e) =>
          handleQuestionChange(qIndex, "QuestionType", Number(e.target.value))
        }
        className="w-full p-2 border rounded"
      >
        {Object.entries(EQuestionType).map(([key, value]) =>
          typeof value === "number" && (
            <option key={value} value={value}>
              {key}
            </option>
          )
        )}
      </select>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Score</label>
      <Input
        type="number"
        placeholder="Enter Score"
        value={question.Score}
        onChange={(e) =>
          handleQuestionChange(qIndex, "Score", Number(e.target.value))
        }
      />
    </div>

    {/* Answers Section */}
    <div className="mb-4">
      <h3 className="font-medium mb-2">Answers</h3>
      {question.Answers.map((answer, aIndex) => (
        <div key={aIndex} className="border p-2 mb-2 rounded-lg">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2">Answer</label>
            <Input
              placeholder="Enter Answer"
              value={answer.Answer}
              onChange={(e) =>
                handleAnswerChange(qIndex, aIndex, "Answer", e.target.value)
              }
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2">Is Correct</label>
            <input
              type="checkbox"
              checked={answer.IsCorrect}
              onChange={(e) =>
                handleAnswerChange(qIndex, aIndex, "IsCorrect", e.target.checked)
              }
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2">File</label>
            <input
              type="file"
              onChange={(e) =>
                handleAnswerChange(qIndex, aIndex, "File", e.target.files?.[0]?.name)
              }
            />
          </div>
        </div>
      ))}
      <Button
        onClick={() => handleAddAnswer(qIndex)}
        className="bg-purple-500 mt-2"
      >
        Add Answer
      </Button>
    </div>
  </div>
))}


      <Button onClick={handleAddQuestion} className="bg-green-500 mt-4">
        Add Question
      </Button>
      <Button onClick={handleSubmit} className="bg-blue-500 mt-4">
        Submit Model Exam
      </Button>
    </div>
  );
};

export default AddModelExamPage;
