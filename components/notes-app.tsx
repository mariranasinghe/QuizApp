"use client"

import { useState, useEffect, useCallback } from "react"
import { NoteListView } from "./note-list-view"
import { NoteEditor } from "./note-editor"
import type { Note } from "@/types/notes" // Import the Note interface

interface NotesAppProps {
  onClose: () => void
}

export function NotesApp({ onClose }: NotesAppProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"list" | "editor">("list")

  // Load notes from local storage on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("studyNotes")
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes))
      }
    } catch (error) {
      console.error("Failed to load notes from localStorage:", error)
    }
  }, [])

  // Save notes to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("studyNotes", JSON.stringify(notes))
    } catch (error) {
      console.error("Failed to save notes to localStorage:", error)
    }
  }, [notes])

  const handleNewNote = useCallback(() => {
    setSelectedNoteId(null) // Indicate a new note
    setCurrentView("editor")
  }, [])

  const handleSelectNote = useCallback((id: string) => {
    setSelectedNoteId(id)
    setCurrentView("editor")
  }, [])

  const handleSaveNote = useCallback((updatedNote: Note) => {
    setNotes((prevNotes) => {
      const existingNoteIndex = prevNotes.findIndex((n) => n.id === updatedNote.id)
      if (existingNoteIndex > -1) {
        // Update existing note
        const newNotes = [...prevNotes]
        newNotes[existingNoteIndex] = updatedNote
        return newNotes
      } else {
        // Add new note
        return [...prevNotes, updatedNote]
      }
    })
    setCurrentView("list") // Go back to list view after saving
  }, [])

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
    setCurrentView("list") // Go back to list view after deleting
  }, [])

  const handleBackToList = useCallback(() => {
    setSelectedNoteId(null)
    setCurrentView("list")
  }, [])

  const currentNote = selectedNoteId ? notes.find((n) => n.id === selectedNoteId) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-950 p-4">
      {currentView === "list" ? (
        <NoteListView
          notes={notes}
          onSelectNote={handleSelectNote}
          onNewNote={handleNewNote}
          onClose={onClose}
          onDeleteNote={handleDeleteNote}
        />
      ) : (
        <NoteEditor note={currentNote} onSave={handleSaveNote} onDelete={handleDeleteNote} onBack={handleBackToList} />
      )}
    </div>
  )
}
