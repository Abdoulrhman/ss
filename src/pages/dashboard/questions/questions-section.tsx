/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EQuestionType } from "@/api/adminApis";

const QuestionsSection: React.FC<{
  questions: any[];
  setQuestions: (questions: any[]) => void;
  onChange: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}> = ({ questions, setQuestions, onChange, onRemove }) => {
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        ContentQuestion: "",
        File: "",
        Importance: false,
        QuestionType: EQuestionType.MCQ,
        Score: 0,
        RelatedQuestions: [],
        Answers: [{ Answer: "", IsCorrect: false, File: "" }],
      },
    ]);
  };

  const handleAddAnswer = (qIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].Answers.push({
      Answer: "",
      IsCorrect: false,
      File: "",
    });
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (
    qIndex: number,
    aIndex: number,
    field: string,
    value: any
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].Answers[aIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const questionFieldConfig = [
    {
      name: "ContentQuestion",
      label: "Question Content",
      type: "text",
      placeholder: "Enter Question Content",
    },
    {
      name: "File",
      label: "File",
      type: "file",
    },
    {
      name: "Importance",
      label: "Importance",
      type: "checkbox",
    },
    {
      name: "QuestionType",
      label: "Question Type",
      type: "select",
      options: Object.entries(EQuestionType).map(([key, value]) => ({
        id: value,
        name: key,
      })),
    },
    {
      name: "Score",
      label: "Score",
      type: "number",
      placeholder: "Enter Score",
    },
  ];

  const answerFieldConfig = [
    {
      name: "Answer",
      label: "Answer Content",
      type: "text",
      placeholder: "Enter Answer Content",
    },
    {
      name: "IsCorrect",
      label: "Is Correct",
      type: "checkbox",
    },
    {
      name: "File",
      label: "File",
      type: "file",
    },
  ];

  return (
    <>
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="border p-4 mb-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Question {qIndex + 1}</h2>
            <Button onClick={() => onRemove(qIndex)} className="bg-red-500">
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {questionFieldConfig.map((field) => (
              <div key={field.name} className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-2">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    value={question[field.name]}
                    onChange={(e) =>
                      onChange(qIndex, field.name, Number(e.target.value))
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={question[field.name]}
                    onChange={(e) =>
                      onChange(qIndex, field.name, e.target.checked)
                    }
                  />
                ) : field.type === "file" ? (
                  <input
                    type="file"
                    onChange={(e) =>
                      onChange(
                        qIndex,
                        field.name,
                        e.target.files?.[0]?.name || ""
                      )
                    }
                  />
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={question[field.name]}
                    onChange={(e) =>
                      onChange(qIndex, field.name, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>

          {/* Answers Section */}
          <div className="mt-6">
            <h3 className="font-medium mb-4">Answers</h3>
            {question.Answers.map((answer: any, aIndex: number) => (
              <div key={aIndex} className="border p-2 mb-4 rounded-lg">
                <div className="grid grid-cols-6 gap-4">
                  {answerFieldConfig.map((field) => (
                    <div key={field.name} className="col-span-6 md:col-span-3">
                      <label className="block text-sm font-medium mb-1">
                        {field.label}
                      </label>
                      {field.type === "checkbox" ? (
                        <input
                          type="checkbox"
                          checked={answer[field.name]}
                          onChange={(e) =>
                            handleAnswerChange(
                              qIndex,
                              aIndex,
                              field.name,
                              e.target.checked
                            )
                          }
                        />
                      ) : field.type === "file" ? (
                        <input
                          type="file"
                          onChange={(e) =>
                            handleAnswerChange(
                              qIndex,
                              aIndex,
                              field.name,
                              e.target.files?.[0]?.name || ""
                            )
                          }
                        />
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={answer[field.name]}
                          onChange={(e) =>
                            handleAnswerChange(
                              qIndex,
                              aIndex,
                              field.name,
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                  ))}
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
    </>
  );
};

export default QuestionsSection;
