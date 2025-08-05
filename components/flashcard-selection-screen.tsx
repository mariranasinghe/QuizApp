"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react" // Removed Sparkles

interface FlashcardSelectionScreenProps {
  onSelectSubject: (subject: string) => void
  onClose: () => void
  isLoading: boolean
}

const subjects = [
  { name: "Math", icon: "➕" },
  { name: "History", icon: "🏛️" },
  { name: "Science", icon: "🧪" },
  { name: "Literature", icon: "✍️" },
  { name: "Geography", icon: "🗺️" },
  { name: "Philosophy", icon: "🤔" },
  { name: "Art", icon: "🎨" },
  { name: "Music", icon: "🎶" },
  { name: "Technology", icon: "💻" },
  { name: "Sports", icon: "⚽" },
  { name: "Animals", icon: "🐾" },
  { name: "Food", icon: "🍔" },
]

export function FlashcardSelectionScreen({ onSelectSubject, onClose, isLoading }: FlashcardSelectionScreenProps) {
  return (
    <Card className="w-full max-w-3xl h-full max-h-[90vh] rounded-xl shadow-2xl bg-white dark:bg-gray-800 flex flex-col">
      <CardHeader className="relative pb-4">
        <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">Flashcards 🧠</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
          onClick={onClose}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Back to Apps</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-6 pt-0 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4 text-center">Choose a Subject:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Button
                key={subject.name}
                variant="outline"
                className="h-auto py-4 text-lg flex flex-col gap-1 bg-transparent"
                onClick={() => onSelectSubject(subject.name)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="text-3xl">{subject.icon}</span>
                )}
                {subject.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
