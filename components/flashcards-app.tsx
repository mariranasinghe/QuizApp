"use client"

import { useState, useCallback } from "react"
import { FlashcardSelectionScreen } from "./flashcard-selection-screen"
import { FlashcardPlayer } from "./flashcard-player"
import type { Flashcard } from "@/types/flashcards"

interface FlashcardsAppProps {
  onClose: () => void
}

export function FlashcardsApp({ onClose }: FlashcardsAppProps) {
  const [currentScreen, setCurrentScreen] = useState<"selection" | "player">("selection")
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectSubject = useCallback(async (subject: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/flashcards/subject?subject=${encodeURIComponent(subject)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data: { flashcards: Flashcard[] } = await response.json()
      if (data.flashcards.length === 0) {
        setError(`No flashcards found for ${subject}.`)
        setFlashcards([])
      } else {
        setFlashcards(data.flashcards)
        setCurrentScreen("player")
      }
    } catch (err: any) {
      setError(`Failed to load flashcards: ${err.message}`)
      setFlashcards([]) // Clear flashcards on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleBackToSelection = useCallback(() => {
    setFlashcards([]) // Clear flashcards when going back
    setCurrentScreen("selection")
    setError(null)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-950 p-4">
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}
      {currentScreen === "selection" ? (
        <FlashcardSelectionScreen onSelectSubject={handleSelectSubject} onClose={onClose} isLoading={isLoading} />
      ) : (
        <FlashcardPlayer flashcards={flashcards} onBack={handleBackToSelection} />
      )}
    </div>
  )
}
