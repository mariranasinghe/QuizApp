"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, ExternalLink, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

interface ResearchPaper {
  id: string
  title: string
  authors: string[]
  year: number
  journal: string
  abstract: string
  url: string
}

interface ResearchAppProps {
  onClose: () => void
}

export function ResearchApp({ onClose }: ResearchAppProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<ResearchPaper[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search query.")
      setResults([])
      setHasSearched(true)
      return
    }

    setLoading(true)
    setError(null)
    setResults([])
    setHasSearched(true)

    try {
      const response = await fetch(`/api/research?query=${encodeURIComponent(searchTerm.trim())}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Could not fetch research papers.")
      }

      const data: ResearchPaper[] = await response.json()
      if (data && data.length > 0) {
        setResults(data)
      } else {
        setError(`No papers found for "${searchTerm}". Try a different query.`)
      }
    } catch (err: any) {
      console.error("Research fetch error:", err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-4xl h-full max-h-[95vh] rounded-xl shadow-2xl bg-white dark:bg-gray-800 flex flex-col">
        <CardHeader className="relative pb-4">
          <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
            Research Platform 🔬
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
              placeholder="Search for papers, authors, topics..."
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
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              <span className="sr-only">Search</span>
            </Button>
          </div>

          {loading && (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-1/4 mb-3" />
                  <Skeleton className="h-16 w-full" />
                </Card>
              ))}
            </div>
          )}

          {error && <div className="text-red-500 text-center text-lg font-medium mb-4">{error}</div>}

          {!hasSearched && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <Search className="h-16 w-16 mb-4" />
              <p className="text-xl mb-2">Start your research journey!</p>
              <p className="text-lg">Enter keywords to find academic papers.</p>
            </div>
          )}

          {hasSearched && !loading && !error && results.length > 0 && (
            <ScrollArea className="flex-grow pr-4">
              <div className="grid gap-4">
                {results.map((paper) => (
                  <Card
                    key={paper.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-1">{paper.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {paper.authors.join(", ")} ({paper.year})
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">{paper.journal}</p>
                    <p className="text-base text-gray-800 dark:text-gray-200 line-clamp-3">{paper.abstract}</p>
                    <Button variant="link" className="p-0 h-auto mt-2 text-blue-600 dark:text-blue-400" asChild>
                      <a href={paper.url} target="_blank" rel="noopener noreferrer">
                        Read Paper <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </Button>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
        <CardFooter className="pt-4">
          <Button onClick={onClose} variant="outline" className="w-full h-12 text-lg bg-transparent">
            Back to Apps
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
