"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming ScrollArea is available from shadcn/ui

interface DictionaryAppProps {
  onClose: () => void
}

interface Phonetic {
  text?: string
  audio?: string
}

interface Definition {
  definition: string
  example?: string
  synonyms?: string[]
  antonyms?: string[]
}

interface Meaning {
  partOfSpeech: string
  definitions: Definition[]
}

interface DictionaryEntry {
  word: string
  phonetics: Phonetic[]
  meanings: Meaning[]
  sourceUrls?: string[]
}

export function DictionaryApp({ onClose }: DictionaryAppProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [definition, setDefinition] = useState<DictionaryEntry | null>(null)

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a word to search.")
      setDefinition(null)
      return
    }

    setLoading(true)
    setError(null)
    setDefinition(null)

    try {
      // Using a proxy API route to avoid CORS issues and keep external API calls server-side
      const response = await fetch(`/api/dictionary?word=${encodeURIComponent(searchTerm.trim())}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Could not fetch definition.")
      }

      const data: DictionaryEntry[] = await response.json()
      if (data && data.length > 0) {
        setDefinition(data[0]) // Take the first entry
      } else {
        setError(`No definition found for "${searchTerm}".`)
      }
    } catch (err: any) {
      console.error("Dictionary fetch error:", err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-2xl h-full max-h-[95vh] rounded-xl shadow-2xl bg-white dark:bg-gray-800 flex flex-col">
        <CardHeader className="relative pb-4">
          <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
            Dictionary 📚
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
        </CardHeader>
        <CardContent className="flex-grow flex flex-col p-6 pt-0">
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter a word..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
              disabled={loading}
              className="flex-grow text-lg p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-50"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : <Search className="h-5 w-5" />}
              <span className="sr-only">Search</span>
            </Button>
          </div>

          {error && <div className="text-red-500 text-center text-lg font-medium mb-4">{error}</div>}

          {definition && (
            <ScrollArea className="flex-grow pr-4">
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-2">{definition.word}</h2>
              {definition.phonetics.map((phonetic, index) => (
                <div key={index} className="mb-2">
                  {phonetic.text && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-mono">{phonetic.text}</p>
                  )}
                  {phonetic.audio && (
                    <audio controls src={phonetic.audio} className="mt-1">
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              ))}

              {definition.meanings.map((meaning, meaningIndex) => (
                <div key={meaningIndex} className="mb-6">
                  <h3 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mt-4 mb-2">
                    {meaning.partOfSpeech}
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    {meaning.definitions.map((def, defIndex) => (
                      <li key={defIndex} className="text-gray-800 dark:text-gray-200 text-lg">
                        {def.definition}
                        {def.example && (
                          <p className="text-gray-600 dark:text-gray-400 text-base italic mt-1">"{def.example}"</p>
                        )}
                        {def.synonyms && def.synonyms.length > 0 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="font-semibold">Synonyms:</span> {def.synonyms.join(", ")}
                          </p>
                        )}
                        {def.antonyms && def.antonyms.length > 0 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="font-semibold">Antonyms:</span> {def.antonyms.join(", ")}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
