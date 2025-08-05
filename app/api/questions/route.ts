import { NextResponse } from "next/server"

// Helper function to shuffle an array (moved here for API-side shuffling)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Expanded question pools for more variety
const allEasyQuestions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: "Pacific",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
    answer: "Leonardo da Vinci",
  },
  {
    question: "What is the chemical symbol for water?",
    options: ["O2", "H2O", "CO2", "NaCl"],
    answer: "H2O",
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "Nauru", "San Marino"],
    answer: "Vatican City",
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    answer: "7",
  },
  {
    question: "What is the main ingredient in guacamole?",
    options: ["Tomato", "Onion", "Avocado", "Lime"],
    answer: "Avocado",
  },
  {
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Tiger", "Lion", "Elephant", "Bear"],
    answer: "Lion",
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    answer: "Blue Whale",
  },
]

const allHardQuestions = [
  {
    question: "What is the capital of Burkina Faso?",
    options: ["Accra", "Ouagadougou", "Bamako", "Niamey"],
    answer: "Ouagadougou",
  },
  {
    question: "Which element has the atomic number 79?",
    options: ["Silver", "Gold", "Mercury", "Lead"],
    answer: "Gold",
  },
  {
    question: "Who wrote 'One Hundred Years of Solitude'?",
    options: ["Jorge Luis Borges", "Isabel Allende", "Gabriel García Márquez", "Mario Vargas Llosa"],
    answer: "Gabriel García Márquez",
  },
  {
    question: "In which year did the Battle of Hastings take place?",
    options: ["1066", "1088", "1100", "1122"],
    answer: "1066",
  },
  {
    question: "What is the longest river in South America?",
    options: ["Paraná River", "Magdalena River", "Orinoco River", "Amazon River"],
    answer: "Amazon River",
  },
  {
    question: "Which philosopher is known for the concept of 'Tabula Rasa'?",
    options: ["Immanuel Kant", "John Locke", "René Descartes", "David Hume"],
    answer: "John Locke",
  },
  {
    question: "What is the primary component of the Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    answer: "Nitrogen",
  },
  {
    question: "Who developed the theory of general relativity?",
    options: ["Isaac Newton", "Niels Bohr", "Albert Einstein", "Max Planck"],
    answer: "Albert Einstein",
  },
  {
    question: "What is the highest mountain in Africa?",
    options: ["Mount Kenya", "Mount Kilimanjaro", "Mount Stanley", "Mount Meru"],
    answer: "Mount Kilimanjaro",
  },
  {
    question: "Which country is the largest producer of coffee in the world?",
    options: ["Colombia", "Vietnam", "Brazil", "Ethiopia"],
    answer: "Brazil",
  },
]

const NUMBER_OF_QUESTIONS_PER_QUIZ = 5 // Define how many questions to return

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get("mode")

  let questionsPool = allEasyQuestions // Default to easy

  if (mode === "survival") {
    questionsPool = allHardQuestions
  }

  // Shuffle the entire pool and then take a subset
  const shuffledQuestions = shuffleArray(questionsPool)
  const questionsToReturn = shuffledQuestions.slice(0, NUMBER_OF_QUESTIONS_PER_QUIZ)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(questionsToReturn)
}
