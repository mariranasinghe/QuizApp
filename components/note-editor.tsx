"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, Trash } from "lucide-react"
import type { Note } from "@/types/notes"

interface NoteEditorProps {
  note: Note | null // null for new note
  onSave: (note: Note) => void
  onDelete: (id: string) => void
  onBack: () => void
}

export function NoteEditor({ note, onSave, onDelete, onBack }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    setTitle(note?.title || "")
    setContent(note?.content || "")
    setSaveStatus("idle") // Reset status when note changes
  }, [note])

  const handleSave = () => {
    setSaveStatus("saving")
    const now = Date.now()
    const updatedNote: Note = {
      id: note?.id || crypto.randomUUID(), // Use existing ID or generate new
      title: title.trim() || "Untitled Note",
      content: content,
      createdAt: note?.createdAt || now,
      updatedAt: now,
    }

    onSave(updatedNote)
    setTimeout(() => {
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000) // Reset status after 2 seconds
    }, 500) // Simulate save delay
  }

  const handleDelete = () => {
    if (note && confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id)
    }
  }

  return (
    <Card className="w-full max-w-3xl h-full max-h-[90vh] rounded-xl shadow-2xl bg-white dark:bg-gray-800 flex flex-col">
      <CardHeader className="relative pb-4">
        <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
          {note ? "Edit Note" : "New Note"} 📝
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
          onClick={onBack}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Back to Notes List</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-6 pt-0">
        <Input
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 text-2xl font-semibold p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-50"
        />
        <Textarea
          placeholder="Start writing your study notes here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-grow resize-none text-lg p-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-50"
        />
        <div className="mt-4 flex justify-between items-center">
          {note && (
            <Button onClick={handleDelete} variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete Note
            </Button>
          )}
          <Button onClick={handleSave} disabled={saveStatus === "saving" || (!title.trim() && !content.trim())}>
            <Save className="mr-2 h-4 w-4" />
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Note"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
