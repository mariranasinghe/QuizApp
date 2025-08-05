"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import type { Flashcard } from "@/types/flashcards"
import { cn } from "@/lib/utils"

interface FlashcardPlayerProps {
  flashcards: Flashcard[]
  onBack: () => void
}

export function FlashcardPlayer({ flashcards, onBack }: FlashcardPlayerProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const currentCard = flashcards[currentCardIndex]

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length)
  }

  if (flashcards.length === 0) {
    return (
      <Card className="w-full max-w-md rounded-xl shadow-2xl bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-red-500">No Flashcards Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Please go back and generate some flashcards or select a subject.
          </p>
          <Button onClick={onBack} className="w-full">
            Back to Selection
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl h-full max-h-[90vh] rounded-xl shadow-2xl bg-white dark:bg-gray-800 flex flex-col">
      <CardHeader className="relative pb-4">
        <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
          {currentCard.subject} Flashcards
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
          onClick={onBack}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Back to Flashcard Selection</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center p-6 pt-0">
        <div
          className="relative w-full max-w-md h-64 bg-blue-100 dark:bg-blue-900 rounded-xl shadow-lg flex items-center justify-center text-center cursor-pointer perspective-1000"
          onClick={handleFlip}
        >
          <div
            className={cn(
              "absolute w-full h-full backface-hidden transition-transform duration-500",
              isFlipped ? "rotate-y-180" : "rotate-y-0",
            )}
          >
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <p className="text-2xl font-semibold text-blue-800 dark:text-blue-200">{currentCard.front}</p>
            </div>
          </div>
          <div
            className={cn(
              "absolute w-full h-full backface-hidden transition-transform duration-500",
              isFlipped ? "rotate-y-0" : "-rotate-y-180",
            )}
          >
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <p className="text-2xl font-semibold text-blue-800 dark:text-blue-200">{currentCard.back}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 w-full">
          <Button
            onClick={handlePrevious}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-transparent"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous Card</span>
          </Button>
          <Button onClick={handleFlip} variant="secondary" className="flex items-center gap-2 px-6 py-3">
            <RotateCcw className="h-5 w-5" />
            Flip Card
          </Button>
          <Button onClick={handleNext} variant="outline" size="icon" className="h-12 w-12 rounded-full bg-transparent">
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next Card</span>
          </Button>
        </div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Card {currentCardIndex + 1} / {flashcards.length}
        </p>
      </CardContent>
    </Card>
  )
}
