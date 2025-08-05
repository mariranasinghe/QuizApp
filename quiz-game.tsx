"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import type { QuizMode } from "./mode-selection"

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
}

const TIME_PER_QUESTION = 10 // seconds for timed mode

interface QuizGameProps {
  mode: QuizMode
  onQuit: () => void
}

export default function QuizGame({ mode, onQuit }: QuizGameProps) {
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [gameOver, setGameOver] = useState(false)

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/questions?mode=${mode}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Question[] = await response.json()
      setQuizQuestions(shuffleArray(data))
      // Reset quiz state for new questions
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setScore(0)
      setShowResults(false)
      setFeedbackMessage(null)
      setAnswered(false)
      setTimeLeft(TIME_PER_QUESTION)
      setGameOver(false)
    } catch (e: any) {
      setError(`Failed to fetch questions: ${e.message}`)
      setQuizQuestions([]) // Clear questions on error
    } finally {
      setLoading(false)
    }
  }, [mode])

  // Fetch questions on component mount and when mode changes
  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const currentQuestion = quizQuestions[currentQuestionIndex]

  // Timer logic for 'timed' mode
  useEffect(() => {
    if (mode === "timed" && !answered && !showResults && !gameOver && !loading && quizQuestions.length > 0) {
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
  }, [currentQuestionIndex, answered, showResults, gameOver, mode, loading, quizQuestions.length])

  // Reset timer when question changes
  useEffect(() => {
    if (mode === "timed") {
      setTimeLeft(TIME_PER_QUESTION)
    }
  }, [currentQuestionIndex, mode])

  const handleAnswerSelect = (value: string) => {
    if (!answered) {
      setSelectedAnswer(value)
    }
  }

  const handleSubmitAnswer = (timedOut = false) => {
    if (answered || gameOver || loading) return

    if (mode === "timed" && timerRef.current) {
      clearInterval(timerRef.current)
    }

    setAnswered(true)

    const isCorrect = selectedAnswer === currentQuestion.answer
    if (timedOut) {
      setFeedbackMessage(`Time's up! The correct answer was: ${currentQuestion.answer}`)
    } else if (isCorrect) {
      setScore(score + 1)
      setFeedbackMessage("Correct! 🎉")
    } else {
      setFeedbackMessage(`Incorrect. The correct answer was: ${currentQuestion.answer}`)
      if (mode === "survival") {
        setGameOver(true)
      }
    }
  }

  const handleNextQuestion = () => {
    setSelectedAnswer(null)
    setFeedbackMessage(null)
    setAnswered(false)

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleRestartQuiz = () => {
    fetchQuestions() // Re-fetch and re-shuffle questions for a new game
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-6 w-full" />
            <div className="grid gap-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg">{error}</p>
            <Button onClick={fetchQuestions}>Try Again</Button>
            <Button onClick={onQuit} variant="outline" className="ml-2 bg-transparent">
              Go to Mode Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizQuestions.length === 0 && !loading && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">No Questions Available</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg">Could not load any quiz questions for this mode.</p>
            <Button onClick={fetchQuestions}>Reload Questions</Button>
            <Button onClick={onQuit} variant="outline" className="ml-2 bg-transparent">
              Go to Mode Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults || gameOver) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">{gameOver ? "Game Over!" : "Quiz Results"}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg">You scored:</p>
            <p className="text-5xl font-bold text-green-600 dark:text-green-400">
              {score} / {quizQuestions.length}
            </p>
            {gameOver && <p className="text-md text-red-500">You got an answer wrong in Survival Mode. Try again!</p>}
            <p className="text-md">
              {score === quizQuestions.length
                ? "Congratulations! You got all answers correct! 🥳"
                : score >= quizQuestions.length / 2
                  ? "Good job! You did well. 👍"
                  : "Keep practicing! You'll get there. 💪"}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button onClick={handleRestartQuiz}>Play Again</Button>
            <Button onClick={onQuit} variant="outline">
              Quit Game
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Quiz Time! ({mode.charAt(0).toUpperCase() + mode.slice(1)} Mode)
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </p>
          {mode === "timed" && (
            <div className="mt-2">
              <Progress value={(timeLeft / TIME_PER_QUESTION) * 100} className="h-2" />
              <p className="text-center text-sm mt-1">Time Left: {timeLeft}s</p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <h2 className="text-xl font-semibold text-center">{currentQuestion.question}</h2>
          <RadioGroup
            value={selectedAnswer || ""}
            onValueChange={handleAnswerSelect}
            className="grid gap-3"
            disabled={answered}
          >
            {currentQuestion.options.map((option) => (
              <div
                key={option}
                className={`flex items-center rounded-lg border p-4 cursor-pointer transition-colors duration-200
                  ${selectedAnswer === option ? "bg-gray-100 dark:bg-gray-800 border-primary" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}
                  ${answered && option === currentQuestion.answer ? "bg-green-100 dark:bg-green-900/50 border-green-500" : ""}
                  ${answered && selectedAnswer === option && selectedAnswer !== currentQuestion.answer ? "bg-red-100 dark:bg-red-900/50 border-red-500" : ""}
                `}
                onClick={() => handleAnswerSelect(option)}
              >
                <RadioGroupItem value={option} id={option} className="sr-only" />
                <Label htmlFor={option} className="w-full cursor-pointer text-lg font-medium">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {feedbackMessage && (
            <p
              className={`text-center text-lg font-medium ${feedbackMessage.includes("Correct") ? "text-green-600" : "text-red-600"}`}
            >
              {feedbackMessage}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="flex flex-col w-full gap-2">
            {" "}
            {/* Changed to flex-col */}
            <Button
              onClick={() => handleSubmitAnswer()}
              disabled={selectedAnswer === null || answered}
              className="w-full"
            >
              Submit Answer
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={!answered}
              className="w-full bg-transparent"
              variant="outline"
            >
              {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          </div>
          <Button onClick={onQuit} variant="destructive" className="w-full">
            Quit Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
