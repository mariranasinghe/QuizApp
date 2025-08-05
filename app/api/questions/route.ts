import { NextResponse } from "next/server"

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface Question {
  question: string
  options: string[]
  answer: string
  category: string // Added category property
}

// Categorized question pools
const allQuestions: Question[] = [
  // Geography - Easy
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
    category: "geography",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: "Pacific",
    category: "geography",
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "Nauru", "San Marino"],
    answer: "Vatican City",
    category: "geography",
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    answer: "7",
    category: "geography",
  },
  {
    question: "What is the longest river in South America?",
    options: ["Paraná River", "Magdalena River", "Orinoco River", "Amazon River"],
    answer: "Amazon River",
    category: "geography",
  },
  {
    question: "What is the highest mountain in Africa?",
    options: ["Mount Kenya", "Mount Kilimanjaro", "Mount Stanley", "Mount Meru"],
    answer: "Mount Kilimanjaro",
    category: "geography",
  },
  {
    question: "Which country has the most natural lakes?",
    options: ["USA", "Canada", "Russia", "China"],
    answer: "Canada",
    category: "geography",
  },
  {
    question: "What is the only continent with land in all four hemispheres?",
    options: ["Asia", "Africa", "North America", "Antarctica"],
    answer: "Africa",
    category: "geography",
  },
  {
    question: "What is the capital of Burkina Faso?", // Hard Geography
    options: ["Accra", "Ouagadougou", "Bamako", "Niamey"],
    answer: "Ouagadougou",
    category: "geography",
  },
  {
    question: "Which country is the largest producer of coffee in the world?", // Hard Geography
    options: ["Colombia", "Vietnam", "Brazil", "Ethiopia"],
    answer: "Brazil",
    category: "geography",
  },
  {
    question: "What is the name of the deepest point in the Earth's oceans?", // Hard Geography
    options: ["Puerto Rico Trench", "Java Trench", "Mariana Trench", "Kermadec Trench"],
    answer: "Mariana Trench",
    category: "geography",
  },

  // Science - Easy
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
    category: "science",
  },
  {
    question: "What is the chemical symbol for water?",
    options: ["O2", "H2O", "CO2", "NaCl"],
    answer: "H2O",
    category: "science",
  },
  {
    question: "What is the main ingredient in guacamole?",
    options: ["Tomato", "Onion", "Avocado", "Lime"],
    answer: "Avocado",
    category: "science", // Can be pop culture too, but science of food
  },
  {
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Tiger", "Lion", "Elephant", "Bear"],
    answer: "Lion",
    category: "science", // Biology
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    answer: "Blue Whale",
    category: "science",
  },
  {
    question: "What is the primary component of the Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    answer: "Nitrogen",
    category: "science",
  },
  {
    question: "What is the smallest bone in the human body?",
    options: ["Femur", "Stapes", "Patella", "Tibia"],
    answer: "Stapes",
    category: "science",
  },
  {
    question: "Which element has the atomic number 79?", // Hard Science
    options: ["Silver", "Gold", "Mercury", "Lead"],
    answer: "Gold",
    category: "science",
  },
  {
    question: "Who developed the theory of general relativity?", // Hard Science
    options: ["Isaac Newton", "Niels Bohr", "Albert Einstein", "Max Planck"],
    answer: "Albert Einstein",
    category: "science",
  },
  {
    question: "What is the chemical formula for table salt?", // Hard Science
    options: ["KCl", "H2SO4", "NaCl", "C6H12O6"],
    answer: "NaCl",
    category: "science",
  },
  {
    question: "Which of these is NOT a real phobia?", // Hard Science/Trivia
    options: ["Arachnophobia", "Hippopotomonstrosesquippedaliophobia", "Anatidaephobia", "Phobophobia"],
    answer: "Hippopotomonstrosesquippedaliophobia", // This is a real phobia, but the question implies one is not. This is the trick.
    category: "science",
  },

  // History - Easy
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
    answer: "Leonardo da Vinci",
    category: "history", // Art history
  },
  {
    question: "In which year did the Battle of Hastings take place?",
    options: ["1066", "1088", "1100", "1122"],
    answer: "1066",
    category: "history",
  },
  {
    question: "Which ancient wonder was located in Alexandria, Egypt?",
    options: ["Colossus of Rhodes", "Lighthouse of Alexandria", "Temple of Artemis", "Hanging Gardens of Babylon"],
    answer: "Lighthouse of Alexandria",
    category: "history",
  },
  {
    question: "Who composed the opera 'The Marriage of Figaro'?", // Hard History/Music
    options: ["Ludwig van Beethoven", "Wolfgang Amadeus Mozart", "Johann Sebastian Bach", "Giuseppe Verdi"],
    answer: "Wolfgang Amadeus Mozart",
    category: "history",
  },

  // Pop Culture - Easy
  {
    question: "What is the name of Harry Potter's owl?",
    options: ["Hedwig", "Errol", "Pigwidgeon", "Fawkes"],
    answer: "Hedwig",
    category: "pop culture",
  },
  {
    question: "Which band released the album 'Nevermind'?",
    options: ["Pearl Jam", "Soundgarden", "Nirvana", "Alice in Chains"],
    answer: "Nirvana",
    category: "pop culture",
  },
  {
    question: "Who plays the character of Iron Man in the MCU?",
    options: ["Chris Evans", "Mark Ruffalo", "Robert Downey Jr.", "Chris Hemsworth"],
    answer: "Robert Downey Jr.",
    category: "pop culture",
  },

  // Literature - Hard
  {
    question: "Who wrote 'One Hundred Years of Solitude'?",
    options: ["Jorge Luis Borges", "Isabel Allende", "Gabriel García Márquez", "Mario Vargas Llosa"],
    answer: "Gabriel García Márquez",
    category: "literature",
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "Flannery O'Connor", "Carson McCullers", "Eudora Welty"],
    answer: "Harper Lee",
    category: "literature",
  },
  {
    question: "What is the primary setting of George Orwell's '1984'?",
    options: ["London", "New York", "Moscow", "Berlin"],
    answer: "London", // Specifically Oceania, but London is the city
    category: "literature",
  },

  // Philosophy - Hard
  {
    question: "Which philosopher is known for the concept of 'Tabula Rasa'?",
    options: ["Immanuel Kant", "John Locke", "René Descartes", "David Hume"],
    answer: "John Locke",
    category: "philosophy",
  },
  {
    question: "Which philosopher is famous for the quote 'I think, therefore I am'?",
    options: ["Plato", "Aristotle", "René Descartes", "Socrates"],
    answer: "René Descartes",
    category: "philosophy",
  },
  {
    question: "What is the central concept of utilitarianism?",
    options: ["Individual rights", "Moral duty", "Greatest good for the greatest number", "Virtue ethics"],
    answer: "Greatest good for the greatest number",
    category: "philosophy",
  },

  // Math - Hard
  {
    question: "Which of the following is a prime number?",
    options: ["91", "87", "51", "47"],
    answer: "47",
    category: "math",
  },
  {
    question: "What is the value of Pi (π) rounded to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.18"],
    answer: "3.14",
    category: "math",
  },
  {
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "13"],
    answer: "12",
    category: "math",
  },
  {
    question: "If a triangle has angles 30 and 60 degrees, what is the third angle?",
    options: ["45 degrees", "90 degrees", "120 degrees", "180 degrees"],
    answer: "90 degrees",
    category: "math",
  },
  {
    question: "What is 7 factorial (7!)?",
    options: ["720", "1440", "2520", "5040"],
    answer: "5040",
    category: "math",
  },
  {
    question: "What is the next number in the Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, ...?",
    options: ["18", "20", "21", "24"],
    answer: "21",
    category: "math",
  },
  {
    question: "What is the derivative of x^2?",
    options: ["x", "2", "2x", "x^3/3"],
    answer: "2x",
    category: "math",
  },
  {
    question: "What is the integral of 1/x?",
    options: ["x", "ln(x)", "ln|x| + C", "1"],
    answer: "ln|x| + C",
    category: "math",
  },
  {
    question: "What is the sum of the interior angles of a hexagon?",
    options: ["360 degrees", "540 degrees", "720 degrees", "900 degrees"],
    answer: "720 degrees",
    category: "math",
  },

  // Trivia - Hard
  {
    question: "What is the only letter in the alphabet that is not in the name of any U.S. state?",
    options: ["Z", "Q", "J", "X"],
    answer: "Q",
    category: "trivia",
  },
  {
    question: "What is the only number that has the same number of letters as its value?",
    options: ["One", "Two", "Three", "Four"],
    answer: "Four",
    category: "trivia",
  },
]

const DEFAULT_QUESTIONS_PER_QUIZ = 10 // Default number of questions for normal/timed/survival
const PRACTICE_QUESTION_COUNT = 5 // Number of questions for practice mode

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get("mode")
  const category = searchParams.get("category") // Get category parameter
  const countParam = searchParams.get("count")
  const requestedCount = countParam ? Number.parseInt(countParam, 10) : DEFAULT_QUESTIONS_PER_QUIZ

  let categorySpecificQuestions: Question[] = []

  if (category && category !== "all") {
    categorySpecificQuestions = allQuestions.filter((q) => q.category === category)
  } else {
    categorySpecificQuestions = allQuestions
  }

  let questionsPoolForDifficulty: Question[] = []

  if (mode === "survival" || mode === "survival-practice") {
    // For hard modes, filter for questions that are generally harder or from specific hard categories
    const hardQuestions = categorySpecificQuestions.filter(
      (q) =>
        ["philosophy", "literature", "math", "trivia"].includes(q.category) ||
        [
          "Burkina Faso",
          "Gold",
          "García Márquez",
          "John Locke",
          "Einstein",
          "Mariana Trench",
          "Q",
          "47",
          "Mozart",
          "Pi",
          "144",
          "7!",
          "Fibonacci",
          "derivative",
          "integral",
          "hexagon",
          "1984",
          "utilitarianism",
        ].some((keyword) => q.question.includes(keyword)),
    )
    // If no hard questions found within the category, use all questions from that category
    questionsPoolForDifficulty = hardQuestions.length > 0 ? hardQuestions : categorySpecificQuestions
  } else {
    // For easy/normal modes, filter for questions that are generally easier
    const easyQuestions = categorySpecificQuestions.filter(
      (q) =>
        ["geography", "science", "history", "pop culture"].includes(q.category) &&
        ![
          "Burkina Faso",
          "Gold",
          "García Márquez",
          "John Locke",
          "Einstein",
          "Mariana Trench",
          "Q",
          "47",
          "Mozart",
          "Pi",
          "144",
          "7!",
          "Fibonacci",
          "derivative",
          "integral",
          "hexagon",
          "1984",
          "utilitarianism",
        ].some((keyword) => q.question.includes(keyword)),
    )
    // If no easy questions found within the category, use all questions from that category
    questionsPoolForDifficulty = easyQuestions.length > 0 ? easyQuestions : categorySpecificQuestions
  }

  // Shuffle the filtered pool and then take a subset based on requestedCount
  const shuffledQuestions = shuffleArray(questionsPoolForDifficulty)
  const questionsToReturn = shuffledQuestions.slice(0, requestedCount)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(questionsToReturn)
}
