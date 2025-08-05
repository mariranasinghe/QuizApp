"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import QuizGame from "./quiz-game"

export type QuizMode = "normal" | "timed" | "survival"

export default function ModeSelection() {
  const [selectedMode, setSelectedMode] = useState<QuizMode | null>(null)

  const handleQuitQuiz = () => {
    setSelectedMode(null) // Go back to mode selection
  }

  if (selectedMode) {
    return <QuizGame mode={selectedMode} onQuit={handleQuitQuiz} />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Choose Your Quiz Mode</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={() => setSelectedMode("normal")} className="h-16 text-lg">
            Normal Mode
            <p className="text-sm text-muted-foreground">No time limit, no sudden death.</p>
          </Button>
          <Button onClick={() => setSelectedMode("timed")} className="h-16 text-lg">
            Timed Mode
            <p className="text-sm text-muted-foreground">Answer within a time limit per question.</p>
          </Button>
          <Button onClick={() => setSelectedMode("survival")} className="h-16 text-lg">
            Survival Mode
            <p className="text-sm text-muted-foreground">One wrong answer, game over!</p>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
