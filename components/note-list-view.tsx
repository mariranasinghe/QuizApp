"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash } from "lucide-react"
import type { Note } from "@/types/notes"

interface NoteListViewProps {
  notes: Note[]
  onSelectNote: (id: string) => void
  onNewNote: () => void
  onClose: () => void
  onDeleteNote: (id: string) => void // Added onDeleteNote prop
}

export function NoteListView({ notes, onSelectNote, onNewNote, onClose, onDeleteNote }: NoteListViewProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <Card className="w-full max-w-3xl h-full max-h-[90vh] rounded-xl shadow-2xl bg-white dark:bg-gray-800 flex flex-col">
      <CardHeader className="relative pb-4">
        <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
          My Study Notes 📝
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
          onClick={onClose}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Back to Apps</span>
        </Button>
        <Button className="absolute top-4 right-4 flex items-center gap-2" onClick={onNewNote}>
          <Plus className="h-5 w-5" />
          New Note
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-6 pt-0 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <p className="text-xl mb-4">No notes yet!</p>
            <p className="text-lg">Click "New Note" to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notes
              .sort((a, b) => b.updatedAt - a.updatedAt) // Sort by most recently updated
              .map((note) => (
                <div
                  key={note.id}
                  className="relative p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer group"
                  onClick={() => onSelectNote(note.id)}
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 truncate pr-10">
                    {note.title || "Untitled Note"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {note.content || "No content"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Last updated: {formatDate(note.updatedAt)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent opening the note when deleting
                      onDeleteNote(note.id)
                    }}
                  >
                    <Trash className="h-5 w-5" />
                    <span className="sr-only">Delete Note</span>
                  </Button>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
