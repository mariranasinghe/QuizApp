import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const word = searchParams.get("word")

  if (!word) {
    return NextResponse.json({ error: "Word parameter is required." }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)

    if (!response.ok) {
      // If the word is not found or another API error occurs
      if (response.status === 404) {
        return NextResponse.json({ error: `No definition found for "${word}".` }, { status: 404 })
      }
      throw new Error(`External API error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error fetching from dictionary API:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch definition." }, { status: 500 })
  }
}
