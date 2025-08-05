"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import type { QuizMode, QuizCategory } from "./mode-selection"

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface Question {
  question: string
  options: string[]
  answer: string
  category: string // Ensure this matches the API
}

const TIME_PER_QUESTION = 10 // seconds for timed mode
const PRACTICE_QUESTION_COUNT = 5 // Number of questions for practice mode

interface QuizGameProps {
  mode: QuizMode
  category: QuizCategory // New prop
  onQuit: () => void
  onQuizComplete: (score: number, totalQuestions: number, mode: QuizMode, isWin?: boolean) => void // New prop for stats
}

export default function QuizGame({ mode, category, onQuit, onQuizComplete }: QuizGameProps) {
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [quizState, setQuizState] = useState<
    "loading" | "playing" | "answered" | "practiceComplete" | "quizComplete" | "gameOver" | "error"
  >("loading")

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const isPracticeMode = mode === "survival-practice"

  const fetchQuestions = useCallback(async () => {
    setQuizState("loading")
    try {
      const count = isPracticeMode ? PRACTICE_QUESTION_COUNT : 5 // Default to 5 for normal/timed/survival
      const response = await fetch(`/api/questions?mode=${mode}&category=${category}&count=${count}`) // Pass category
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Question[] = await response.json()
      if (data.length === 0) {
        throw new Error("No questions found for this category and mode combination.")
      }
      setQuizQuestions(shuffleArray(data))
      // Reset quiz state for new questions
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setScore(0)
      setFeedbackMessage(null)
      setTimeLeft(TIME_PER_QUESTION)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setQuizState("playing")
    } catch (e: any) {
      setQuizState("error")
      setFeedbackMessage(`Failed to fetch questions: ${e.message}`)
      setQuizQuestions([]) // Clear questions on error
    }
  }, [mode, category, isPracticeMode]) // Add category to dependencies

  // Fetch questions on component mount and when mode or category changes
  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const currentQuestion = quizQuestions[currentQuestionIndex]

  // Timer logic for 'timed' mode
  useEffect(() => {
    if (mode === "timed" && quizState === "playing" && quizQuestions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!)
            handleSubmitAnswer(true) // Auto-submit when time runs out
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentQuestionIndex, quizState, mode, quizQuestions.length])

  // Reset timer when question changes
  useEffect(() => {
    if (mode === "timed" && quizState === "playing") {
      setTimeLeft(TIME_PER_QUESTION)
    }
  }, [currentQuestionIndex, mode, quizState])

  const handleAnswerSelect = (value: string) => {
    if (quizState === "playing") {
      setSelectedAnswer(value)
    }
  }

  const handleSubmitAnswer = (timedOut = false) => {
    if (quizState !== "playing") return

    if (mode === "timed" && timerRef.current) {
      clearInterval(timerRef.current)
    }

    const isCorrect = selectedAnswer === currentQuestion.answer
    if (timedOut) {
      setFeedbackMessage(`Time's up! The correct answer was: ${currentQuestion.answer}`)
    } else if (isCorrect) {
      setScore(score + 1)
      setFeedbackMessage("Correct! 🎉")
    } else {
      setFeedbackMessage(`Incorrect. The correct answer was: ${currentQuestion.answer}`)
      if (mode === "survival") {
        setQuizState("gameOver")
        // Report loss for survival mode immediately
        onQuizComplete(score, quizQuestions.length, mode, false)
        return // End game immediately for survival mode
      }
    }
    setQuizState("answered")
  }

  const handleNextQuestion = () => {
    setSelectedAnswer(null)
    setFeedbackMessage(null)

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setQuizState("playing")
    } else {
      if (isPracticeMode) {
        setQuizState("practiceComplete")
      } else {
        setQuizState("quizComplete")
        // Report results for non-practice modes
        const isSurvivalWin = mode === "survival" && score === quizQuestions.length
        onQuizComplete(score, quizQuestions.length, mode, isSurvivalWin)
      }
    }
  }

  const handleRestartQuiz = () => {
    fetchQuestions() // Re-fetch and re-shuffle questions for a new game
  }

  const renderContent = () => {
    switch (quizState) {
      case "loading":
        return (
          <Card className="w-full max-w-md rounded-xl shadow-2xl bg-white dark:bg-gray-800">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-8 w-full" />
              <div className="grid gap-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardFooter>
          </Card>
        )
      case "error":
        return (
          <Card className="w-full max-w-md rounded-xl shadow-2xl bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-red-500">Error Loading Quiz</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-300">{feedbackMessage}</p>
              <Button onClick={fetchQuestions} className="w-full">
                Try Again
              </Button>
              <Button onClick={onQuit} variant="outline" className="w-full bg-transparent">
                Go to Mode Selection
              </Button>
            </CardContent>
          </Card>
        )
      case "quizComplete":
      case "gameOver":
        return (
          <Card className="w-full max-w-md rounded-xl shadow-2xl bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
                {quizState === "gameOver" ? "Game Over!" : "Quiz Results"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-xl text-gray-700 dark:text-gray-300">You scored:</p>
              <p className="text-6xl font-extrabold text-green-600 dark:text-green-400">
                {score} / {quizQuestions.length}
              </p>
              {quizState === "gameOver" && (
                <p className="text-lg text-red-500 font-medium">
                  You got an answer wrong in Survival Mode. Better luck next time!
                </p>
              )}
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {score === quizQuestions.length
                  ? "Fantastic! You got all answers correct! 🥳"
                  : score >= quizQuestions.length / 2
                    ? "Great effort! You did well. 👍"
                    : "Keep practicing! You'll get there. 💪"}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button onClick={handleRestartQuiz} className="w-full h-12 text-lg">
                Play Again
              </Button>
              <Button onClick={onQuit} variant="outline" className="w-full h-12 text-lg bg-transparent">
                Quit Game
              </Button>
            </CardFooter>
          </Card>
        )
      case "practiceComplete":
        return (
          <Card className="w-full max-w-md rounded-xl shadow-2xl bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
                Practice Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-xl text-gray-700 dark:text-gray-300">You've completed the practice session.</p>
              <p className="text-lg text-gray-700 dark:text-gray-300">Ready for the real challenge?</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button onClick={onQuit} className="w-full h-12 text-lg">
                Go to Survival Mode
              </Button>
              <Button onClick={onQuit} variant="outline" className="w-full h-12 text-lg bg-transparent">
                Back to Challenge Modes
              </Button>
            </CardFooter>
          </Card>
        )
      case "playing":
      case "answered":
        return (
          <Card className="w-full max-w-md rounded-xl shadow-2xl bg-white dark:bg-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
                Quiz Time! ({mode.charAt(0).toUpperCase() + mode.slice(1)} Mode)
              </CardTitle>
              <p className="text-center text-base text-muted-foreground mt-1">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </p>
              {mode === "timed" && (
                <div className="mt-4">
                  <Progress
                    value={(timeLeft / TIME_PER_QUESTION) * 100}
                    className="h-3 bg-gray-200 dark:bg-gray-700"
                    indicatorClassName="bg-green-500"
                  />
                  <p className="text-center text-sm mt-2 font-medium text-gray-700 dark:text-gray-300">
                    Time Left: {timeLeft}s
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
                {currentQuestion.question}
              </h2>
              <RadioGroup
                value={selectedAnswer || ""}
                onValueChange={handleAnswerSelect}
                className="grid gap-4"
                disabled={quizState === "answered"}
              >
                {currentQuestion.options.map((option) => (
                  <div
                    key={option}
                    className={`flex items-center rounded-lg border-2 p-4 cursor-pointer transition-all duration-300
                      ${selectedAnswer === option ? "bg-primary/10 border-primary" : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"}
                      ${quizState === "answered" && option === currentQuestion.answer ? "bg-green-100 dark:bg-green-900/50 border-green-500" : ""}
                      ${quizState === "answered" && selectedAnswer === option && selectedAnswer !== currentQuestion.answer ? "bg-red-100 dark:bg-red-900/50 border-red-500" : ""}
                    `}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    <RadioGroupItem value={option} id={option} className="sr-only" />
                    <Label
                      htmlFor={option}
                      className="w-full cursor-pointer text-lg font-medium text-gray-800 dark:text-gray-100"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {feedbackMessage && (
                <p
                  className={`text-center text-xl font-bold ${feedbackMessage.includes("Correct") ? "text-green-600" : "text-red-600"} transition-opacity duration-300`}
                >
                  {feedbackMessage}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <div className="flex flex-col w-full gap-3">
                <Button
                  onClick={() => handleSubmitAnswer()}
                  disabled={selectedAnswer === null || quizState === "answered"}
                  className="w-full h-12 text-lg"
                >
                  Submit Answer
                </Button>
                <Button
                  onClick={handleNextQuestion}
                  disabled={quizState !== "answered"}
                  className="w-full h-12 text-lg bg-transparent"
                  variant="outline"
                >
                  {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              </div>
              <Button onClick={onQuit} variant="destructive" className="w-full h-12 text-lg">
                Quit Game
              </Button>
            </CardFooter>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-800 dark:to-gray-950 p-4">
      {renderContent()}
    </div>
  )
}
