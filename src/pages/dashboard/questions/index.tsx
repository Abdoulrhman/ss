/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addQuestions, EQuestionType } from "@/api/adminApis"; // Add the API function here

const AddQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState([
    {
      ContentQuestion: "",
      File: null as File | null,
      Importance: false,
      QuestionType: EQuestionType.MCQ,
      Score: 0,
      Answers: [{ Answer: "", IsCorrect: false, File: null as File | null }],
    },
  ]);

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

  const handleAddAnswer = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].Answers.push({
      Answer: "",
      IsCorrect: false,
      File: null,
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
        Answers: q.Answers.map((a) => ({
          Answer: a.Answer,
          IsCorrect: a.IsCorrect,
          File: a.File ? a.File.name : undefined,
        })),
      }));

      await addQuestions(formattedQuestions);
      alert("Questions added successfully!");
      setQuestions([
        {
          ContentQuestion: "",
          File: null,
          Importance: false,
          QuestionType: EQuestionType.MCQ,
          Score: 0,
          Answers: [{ Answer: "", IsCorrect: false, File: null }],
        },
      ]);
    } catch (error) {
      console.error("Error adding questions:", error);
      alert("Failed to add questions.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Questions</h1>

      {questions.map((question, qIndex) => (
        <div key={qIndex} className="border p-6 mb-6 rounded-lg">
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

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Question Type
            </label>
            <select
              value={question.QuestionType}
              onChange={(e) =>
                handleQuestionChange(
                  qIndex,
                  "QuestionType",
                  Number(e.target.value)
                )
              }
              className="w-full border rounded p-2 bg-gray-100"
            >
              {Object.entries(EQuestionType).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Score</label>
            <Input
              type="number"
              placeholder="Enter the score"
              value={question.Score}
              onChange={(e) =>
                handleQuestionChange(qIndex, "Score", Number(e.target.value))
              }
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Importance</label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={question.Importance}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "Importance", e.target.checked)
                }
              />
              Mark as Important
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">File</label>
            <Input
              type="file"
              onChange={(e) =>
                handleQuestionChange(
                  qIndex,
                  "File",
                  e.target.files ? e.target.files[0] : null
                )
              }
            />
          </div>

          <h2 className="text-lg font-semibold mb-4">Answers</h2>
          {question.Answers.map((answer, aIndex) => (
            <div key={aIndex} className="mb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    Answer
                  </label>
                  <Input
                    placeholder="Enter the answer"
                    value={answer.Answer}
                    onChange={(e) =>
                      handleAnswerChange(
                        qIndex,
                        aIndex,
                        "Answer",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Correct Answer
                  </label>
                  <input
                    type="checkbox"
                    checked={answer.IsCorrect}
                    onChange={(e) =>
                      handleAnswerChange(
                        qIndex,
                        aIndex,
                        "IsCorrect",
                        e.target.checked
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">File</label>
                <Input
                  type="file"
                  onChange={(e) =>
                    handleAnswerChange(
                      qIndex,
                      aIndex,
                      "File",
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                />
              </div>
            </div>
          ))}

          <Button
            onClick={() => handleAddAnswer(qIndex)}
            className="mt-4 bg-blue-600 text-white"
          >
            Add Answer
          </Button>
        </div>
      ))}

      <div className="flex gap-4">
        <Button onClick={handleAddQuestion} className="bg-green-600 text-white">
          Add Question
        </Button>
        <Button onClick={handleSubmit} className="bg-blue-600 text-white">
          Submit Questions
        </Button>
      </div>
    </div>
  );
};

export default AddQuestionsPage;
