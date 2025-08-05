import { NextResponse } from "next/server"

interface ResearchPaper {
  id: string
  title: string
  authors: string[]
  year: number
  journal: string
  abstract: string
  url: string
}

const mockPapers: ResearchPaper[] = [
  {
    id: "1",
    title: "The Impact of Artificial Intelligence on Modern Education",
    authors: ["Dr. A. Sharma", "Prof. B. Lee"],
    year: 2023,
    journal: "Journal of Educational Technology",
    abstract:
      "This paper explores the transformative effects of artificial intelligence technologies on various aspects of modern education, including personalized learning, automated grading, and administrative efficiency. It discusses both the opportunities and challenges presented by AI integration in educational settings.",
    url: "https://example.com/ai-education-paper",
  },
  {
    id: "2",
    title: "Quantum Computing: A Review of Recent Advances and Future Prospects",
    authors: ["Dr. C. Chen", "Dr. D. Miller"],
    year: 2024,
    journal: "Physics Review Letters",
    abstract:
      "A comprehensive review of the latest breakthroughs in quantum computing, covering topics such as qubit stability, error correction, and the development of new quantum algorithms. The paper also speculates on the potential societal and technological impacts of widespread quantum adoption.",
    url: "https://example.com/quantum-computing-review",
  },
  {
    id: "3",
    title: "Climate Change Mitigation Strategies: A Global Perspective",
    authors: ["Prof. E. Garcia", "Dr. F. Kim"],
    year: 2022,
    journal: "Environmental Science & Policy",
    abstract:
      "This study analyzes various climate change mitigation strategies implemented worldwide, evaluating their effectiveness, economic viability, and political feasibility. It emphasizes the importance of international cooperation and technological innovation in achieving global climate goals.",
    url: "https://example.com/climate-mitigation-strategies",
  },
  {
    id: "4",
    title: "The Role of Blockchain in Supply Chain Management",
    authors: ["G. White", "H. Black"],
    year: 2021,
    journal: "International Journal of Logistics Management",
    abstract:
      "Investigates how blockchain technology can enhance transparency, traceability, and efficiency in complex global supply chains. Case studies from various industries are presented to illustrate practical applications and benefits.",
    url: "https://example.com/blockchain-supply-chain",
  },
  {
    id: "5",
    title: "Neuroplasticity and Learning: Mechanisms and Applications",
    authors: ["I. Green", "J. Brown"],
    year: 2020,
    journal: "Cognitive Neuroscience Review",
    abstract:
      "Examines the underlying mechanisms of neuroplasticity and its implications for learning and memory. The paper discusses how understanding brain plasticity can lead to improved educational practices and therapeutic interventions for neurological disorders.",
    url: "https://example.com/neuroplasticity-learning",
  },
  {
    id: "6",
    title: "Sustainable Urban Planning: Challenges and Opportunities",
    authors: ["K. Blue", "L. Red"],
    year: 2023,
    journal: "Urban Studies Journal",
    abstract:
      "This paper explores the multifaceted challenges and emerging opportunities in sustainable urban planning, focusing on green infrastructure, smart city technologies, and community engagement. It provides a framework for developing resilient and environmentally friendly urban environments.",
    url: "https://example.com/sustainable-urban-planning",
  },
  {
    id: "7",
    title: "The Ethics of Autonomous Systems in Healthcare",
    authors: ["M. Purple", "N. Orange"],
    year: 2024,
    journal: "Journal of Medical Ethics",
    abstract:
      "Discusses the ethical considerations surrounding the deployment of autonomous systems, such as AI diagnostics and robotic surgery, in healthcare. Key areas of focus include patient safety, accountability, and the impact on human-provider relationships.",
    url: "https://example.com/autonomous-healthcare-ethics",
  },
  {
    id: "8",
    title: "Big Data Analytics for Financial Market Prediction",
    authors: ["O. Yellow", "P. Cyan"],
    year: 2022,
    journal: "Quantitative Finance Review",
    abstract:
      "Applies big data analytics techniques to predict trends and anomalies in financial markets. The study evaluates the performance of various machine learning models using large datasets of historical market data.",
    url: "https://example.com/big-data-finance",
  },
  {
    id: "9",
    title: "Renewable Energy Integration in Smart Grids",
    authors: ["Q. Magenta", "R. Lime"],
    year: 2023,
    journal: "Energy Systems Research",
    abstract:
      "Investigates the challenges and solutions for integrating renewable energy sources into smart grid infrastructures. Topics include grid stability, energy storage, and demand-side management strategies.",
    url: "https://example.com/renewable-smart-grids",
  },
  {
    id: "10",
    title: "The Psychology of Online Consumer Behavior",
    authors: ["S. Teal", "T. Indigo"],
    year: 2021,
    journal: "Journal of Digital Marketing",
    abstract:
      "Examines psychological factors influencing consumer behavior in online environments, including decision-making processes, trust, and the impact of digital advertising. Empirical studies and theoretical frameworks are discussed.",
    url: "https://example.com/online-consumer-psychology",
  },
  {
    id: "11",
    title: "Advanced Robotics for Space Exploration",
    authors: ["U. Violet", "V. Gold"],
    year: 2024,
    journal: "Aerospace Robotics",
    abstract:
      "This paper reviews the latest advancements in robotic technologies designed for deep space exploration, focusing on autonomous navigation, sample collection, and extreme environment resilience. Future missions and technological roadmaps are also considered.",
    url: "https://example.com/space-robotics",
  },
  {
    id: "12",
    title: "Genomic Editing Technologies: CRISPR and Beyond",
    authors: ["W. Silver", "X. Bronze"],
    year: 2023,
    journal: "Molecular Biology Insights",
    abstract:
      "A detailed exploration of current genomic editing technologies, with a particular emphasis on CRISPR-Cas9 systems. The paper discusses their applications in disease therapy, agriculture, and the ethical implications of gene manipulation.",
    url: "https://example.com/genomic-editing",
  },
  {
    id: "13",
    title: "The Evolution of Cybersecurity Threats and Defenses",
    authors: ["Y. Platinum", "Z. Diamond"],
    year: 2022,
    journal: "Cybersecurity Quarterly",
    abstract:
      "Analyzes the historical evolution of cybersecurity threats, from early viruses to sophisticated nation-state attacks, and the corresponding development of defensive strategies and technologies. Future trends in cyber warfare are also discussed.",
    url: "https://example.com/cybersecurity-evolution",
  },
  {
    id: "14",
    title: "Machine Learning in Drug Discovery and Development",
    authors: ["Dr. A. Sharma"],
    year: 2024,
    journal: "Pharmaceutical Research",
    abstract:
      "Explores the application of machine learning algorithms to accelerate various stages of drug discovery, including target identification, lead optimization, and clinical trial design. Case studies highlight successful implementations and future potential.",
    url: "https://example.com/ml-drug-discovery",
  },
  {
    id: "15",
    title: "The Impact of Social Media on Political Polarization",
    authors: ["Prof. B. Lee"],
    year: 2023,
    journal: "Political Science Review",
    abstract:
      "Investigates how social media platforms contribute to political polarization by creating echo chambers and facilitating the spread of misinformation. The paper proposes strategies for fostering more constructive online discourse.",
    url: "https://example.com/social-media-polarization",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required." }, { status: 400 })
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  const lowerCaseQuery = query.toLowerCase()
  const filteredPapers = mockPapers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(lowerCaseQuery) ||
      paper.abstract.toLowerCase().includes(lowerCaseQuery) ||
      paper.authors.some((author) => author.toLowerCase().includes(lowerCaseQuery)) ||
      paper.journal.toLowerCase().includes(lowerCaseQuery) ||
      paper.year.toString().includes(lowerCaseQuery),
  )

  if (filteredPapers.length === 0) {
    return NextResponse.json({ error: `No papers found for "${query}".` }, { status: 404 })
  }

  return NextResponse.json(filteredPapers)
}
