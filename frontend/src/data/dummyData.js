// frontend/src/data/dummyData.js

// ==================== AUTH DATA ====================
export const authData = {
  user: {
    id: 1,
    name: "Vaidehi Koranne",
    email: "vaidehi09@gmail.com",
    gender: "female",
    avatar: "https://ui-avatars.com/api/?name=Vaidehi+Koranne&background=7c3aed&color=fff&size=100",
    joinedAt: "2026-06-29T10:30:00Z"
  }
};

// ==================== GENDER ILLUSTRATIONS ====================
export const genderIllustrations = {
  female: "https://illustrations.popsy.co/girl/girl-reading.svg",
  male: "https://illustrations.popsy.co/boy/boy-reading.svg",
  neutral: "https://illustrations.popsy.co/learning/learning.svg"
};

// ==================== DASHBOARD DATA ====================
export const dashboardData = {
  user: {
    name: "Vaidehi Koranne",
    email: "vaidehi09@gmail.com",
    gender: "female",
    avatar: "https://ui-avatars.com/api/?name=Vaidehi+Koranne&background=7c3aed&color=fff&size=100"
  },
  subjects: [
    {
      id: 1,
      name: "Arithmetic",
      icon: "fa-calculator",
      description: "Quantitative, DI, Arithmetic, Mensuration & more",
      progress: 65,
      questionsSolved: 78,
      totalQuestions: 120,
      color: "#667eea",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      id: 2,
      name: "Logical Reasoning",
      icon: "fa-brain",
      description: "Puzzles, Seating, Syllogism, Coding-Decoding & more",
      progress: 45,
      questionsSolved: 54,
      totalQuestions: 120,
      color: "#f45c43",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      borderColor: "border-orange-200"
    },
    {
      id: 3,
      name: "Verbal Ability",
      icon: "fa-comment-dots",
      description: "RC, Vocabulary, Grammar, Parajumbles & more",
      progress: 30,
      questionsSolved: 36,
      totalQuestions: 120,
      color: "#764ba2",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200"
    },
    {
      id: 4,
      name: "Mock Tests",
      icon: "fa-file-alt",
      description: "Full-length placement mock tests",
      progress: 10,
      questionsSolved: 12,
      totalQuestions: 120,
      color: "#fbbf24",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-200"
    }
  ],
  stats: {
    overallAccuracy: 72,
    topicsCompleted: 34,
    practiceTime: "42h 30m",
    testsTaken: 8,
    dailyStreak: 5
  },
  continueLearning: {
    subjectId: 1,
    subjectName: "Arithmetic",
    topicId: 1,
    topicName: "Profit & Loss",
    subtopicId: 1,
    subtopicName: "Basic Profit",
    progress: 60,
    estimatedTimeLeft: "15 min",
    nextSubtopic: "Profit Percentage"
  },
  strongTopics: [
    { id: 1, name: "Percentages", subject: "Arithmetic", score: 85 },
    { id: 2, name: "Blood Relations", subject: "Logical Reasoning", score: 82 },
    { id: 3, name: "Reading Comprehension", subject: "Verbal Ability", score: 78 }
  ],
  weakTopics: [
    { id: 4, name: "Time & Work", subject: "Arithmetic", score: 45 },
    { id: 5, name: "Syllogism", subject: "Logical Reasoning", score: 40 },
    { id: 6, name: "Grammar", subject: "Verbal Ability", score: 38 }
  ],
  recentActivity: [
    { id: 1, title: "Completed Practice Set: Percentages", time: "2 hours ago", type: "practice", icon: "fa-check-circle" },
    { id: 2, title: "Scored 85% in Arithmetic Quiz", time: "5 hours ago", type: "quiz", icon: "fa-trophy" },
    { id: 3, title: "Started Topic: Averages", time: "1 day ago", type: "topic", icon: "fa-book-open" }
  ]
};

// ==================== SUBJECT DATA ====================
export const subjectData = {
  id: 1,
  name: "Arithmetic",
  description: "Master quantitative aptitude with comprehensive coverage of arithmetic topics including percentages, averages, ratios, and more.",
  icon: "fa-calculator",
  color: "#667eea",
  progress: 65,
  totalTopics: 8,
  completedTopics: 5,
  topics: [
    {
      id: 1,
      name: "Profit & Loss",
      description: "Learn profit, loss, discount, and marked price concepts",
      totalQuestions: 120,
      completedQuestions: 72,
      progress: 60,
      difficulty: "Medium",
      icon: "💰",
      subtopics: [
        {
          id: 1,
          name: "Basic Profit",
          description: "Understanding profit, cost price, and selling price",
          youtubeVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          questions: 30,
          progress: 80,
          timeEstimate: "15 min",
          concepts: [
            { id: 1, title: "Cost Price (CP)", description: "The price at which an item is purchased" },
            { id: 2, title: "Selling Price (SP)", description: "The price at which an item is sold" },
            { id: 3, title: "Profit", description: "SP - CP (when SP > CP)" }
          ],
          formulas: [
            { id: 1, title: "Profit = Selling Price - Cost Price" },
            { id: 2, title: "Profit % = (Profit/CP) × 100" }
          ],
          shortcuts: [
            { id: 1, title: "To find SP with profit%: SP = CP × (1 + Profit%/100)" }
          ]
        },
        {
          id: 2,
          name: "Profit Percentage",
          description: "Calculate profit percentage and related problems",
          youtubeVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          questions: 25,
          progress: 60,
          timeEstimate: "20 min",
          concepts: [
            { id: 4, title: "Profit Percentage", description: "Profit expressed as percentage of CP" },
            { id: 5, title: "SP with Profit %", description: "SP = CP × (1 + Profit%/100)" }
          ],
          formulas: [
            { id: 3, title: "Profit% = (Profit/CP) × 100" },
            { id: 4, title: "SP = CP × (1 + Profit%/100)" }
          ],
          shortcuts: [
            { id: 2, title: "To find CP with Profit%: CP = SP / (1 + Profit%/100)" }
          ]
        },
        {
          id: 3,
          name: "Discount",
          description: "Calculate discounts, marked price, and selling price",
          youtubeVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          questions: 20,
          progress: 40,
          timeEstimate: "25 min",
          concepts: [
            { id: 6, title: "Marked Price (MP)", description: "The original price before discount" },
            { id: 7, title: "Discount", description: "MP - SP" },
            { id: 8, title: "Discount %", description: "(Discount/MP) × 100" }
          ],
          formulas: [
            { id: 5, title: "Discount = Marked Price - Selling Price" },
            { id: 6, title: "Discount % = (Discount/MP) × 100" }
          ],
          shortcuts: [
            { id: 3, title: "SP = MP × (1 - Discount%/100)" }
          ]
        },
        {
          id: 4,
          name: "Marked Price",
          description: "Understanding marked price and relationship with discount",
          youtubeVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          questions: 20,
          progress: 30,
          timeEstimate: "20 min",
          concepts: [
            { id: 9, title: "Marked Price", description: "Price printed on the product" },
            { id: 10, title: "SP after discount", description: "SP = MP - Discount" }
          ],
          formulas: [
            { id: 7, title: "MP = SP / (1 - Discount%/100)" },
            { id: 8, title: "Discount = MP × Discount%/100" }
          ],
          shortcuts: [
            { id: 4, title: "If two discounts: SP = MP × (1-d1/100) × (1-d2/100)" }
          ]
        }
      ]
    }
  ]
};

// ==================== TOPIC DATA ====================
export const topicData = {
  id: 1,
  name: "Profit & Loss",
  subject: "Arithmetic",
  description: "Master profit and loss calculations with comprehensive practice.",
  progress: 60,
  totalQuestions: 120,
  completedQuestions: 72,
  icon: "💰",
  videoPlaceholder: {
    title: "Introduction to Profit & Loss",
    description: "Learn the fundamentals of profit and loss calculations",
    duration: "15:30"
  },
  concepts: [
    { id: 1, title: "Cost Price (CP)", questionCount: 30, difficulty: "Easy", progress: 80, timeEstimate: "15 min" },
    { id: 2, title: "Selling Price (SP)", questionCount: 25, difficulty: "Medium", progress: 60, timeEstimate: "20 min" },
    { id: 3, title: "Profit & Loss", questionCount: 20, difficulty: "Hard", progress: 40, timeEstimate: "25 min" }
  ],
  formulas: [
    { id: 1, title: "Profit = SP - CP" },
    { id: 2, title: "Loss = CP - SP" },
    { id: 3, title: "Profit% = (Profit/CP) × 100" },
    { id: 4, title: "Loss% = (Loss/CP) × 100" }
  ],
  shortcuts: [
    { id: 1, title: "SP = CP × (1 + Profit%/100)" },
    { id: 2, title: "CP = SP / (1 + Profit%/100)" }
  ],
  importantNotes: [
    { id: 1, title: "Profit/Loss is always calculated on CP" },
    { id: 2, title: "For discount, it is calculated on MP" }
  ]
};

// ==================== PRACTICE QUESTIONS ====================
export const practiceQuestions = {
  topicId: 1,
  topicName: "Profit & Loss",
  subtopicId: 1,
  subtopicName: "Basic Profit",
  totalQuestions: 10,
  timeLimit: 15,
  questions: [
    {
      id: 1,
      question: "If CP = ₹100 and SP = ₹120, what is the profit?",
      options: ["₹10", "₹15", "₹20", "₹25"],
      correctAnswer: 2,
      explanation: "Profit = SP - CP = ₹120 - ₹100 = ₹20",
      formula: "Profit = SP - CP",
      shortcut: "Direct subtraction gives profit",
      wrongReason: "You may have confused profit with profit percentage. Profit is simply SP - CP.",
      difficulty: "Easy"
    },
    {
      id: 2,
      question: "If CP = ₹200 and Profit = ₹40, what is SP?",
      options: ["₹160", "₹200", "₹240", "₹280"],
      correctAnswer: 2,
      explanation: "SP = CP + Profit = ₹200 + ₹40 = ₹240",
      formula: "SP = CP + Profit",
      shortcut: "Add profit to CP to get SP",
      wrongReason: "Remember: SP is always CP + Profit. Don't subtract!",
      difficulty: "Easy"
    },
    {
      id: 3,
      question: "If CP = ₹500 and SP = ₹450, what is the loss?",
      options: ["₹30", "₹40", "₹50", "₹60"],
      correctAnswer: 2,
      explanation: "Loss = CP - SP = ₹500 - ₹450 = ₹50",
      formula: "Loss = CP - SP",
      shortcut: "Subtract SP from CP for loss",
      wrongReason: "Loss occurs when CP > SP. Here CP 500 > SP 450, so loss is 50.",
      difficulty: "Medium"
    }
  ]
};

// ==================== RESULTS ====================
export const resultData = {
  score: 75,
  accuracy: 80,
  timeTaken: "12m 30s",
  correct: 8,
  wrong: 2,
  skipped: 0,
  totalQuestions: 10,
  topicWisePerformance: [
    { topic: "Basic Profit", correct: 3, total: 3, percentage: 100 },
    { topic: "Profit Percentage", correct: 2, total: 3, percentage: 67 },
    { topic: "Discount", correct: 2, total: 2, percentage: 100 },
    { topic: "Marked Price", correct: 1, total: 2, percentage: 50 }
  ],
  difficultyWisePerformance: [
    { difficulty: "Easy", correct: 4, total: 4, percentage: 100 },
    { difficulty: "Medium", correct: 3, total: 4, percentage: 75 },
    { difficulty: "Hard", correct: 1, total: 2, percentage: 50 }
  ],
  weakAreas: ["Successive Changes", "Advanced Percentage Problems"],
  strongAreas: ["Basic Profit", "Data Interpretation"],
  incorrectQuestions: [3, 5, 7]
};

// ==================== PROFILE DATA ====================
export const profileData = {
  user: {
    id: 1,
    name: "Vaidehi Koranne",
    email: "vaidehi09@gmail.com",
    gender: "female",
    avatar: "https://ui-avatars.com/api/?name=Vaidehi+Koranne&background=7c3aed&color=fff&size=200",
    joinedAt: "2026-06-29T10:30:00Z",
    bio: "Aspiring Full-Stack Developer | Learning everyday"
  },
  stats: {
    overallProgress: 65,
    totalQuestions: 450,
    correctAnswers: 315,
    accuracy: 70,
    practiceTime: "42h 30m",
    testsTaken: 8,
    currentStreak: 5,
    longestStreak: 12
  },
  achievements: [
    { id: 1, title: "First Quiz Completed", description: "Completed your first quiz", icon: "🎯", unlocked: true },
    { id: 2, title: "5-Day Streak", description: "Practiced for 5 consecutive days", icon: "🔥", unlocked: true },
    { id: 3, title: "Perfect Score", description: "Scored 100% in a quiz", icon: "💯", unlocked: false }
  ],
  badges: [
    { id: 1, name: "Arithmetic Master", icon: "🧮", color: "#667eea" },
    { id: 2, name: "Logical Thinker", icon: "🧠", color: "#f45c43" },
    { id: 3, name: "Verbal Expert", icon: "📚", color: "#764ba2" }
  ],
  subjectProgress: [
    { name: "Arithmetic", progress: 65, color: "#667eea" },
    { name: "Logical Reasoning", progress: 45, color: "#f45c43" },
    { name: "Verbal Ability", progress: 30, color: "#764ba2" }
  ],
  recentTests: [
    { id: 1, name: "Arithmetic Practice Set", score: 85, date: "2 days ago" },
    { id: 2, name: "Logical Reasoning Quiz", score: 70, date: "5 days ago" },
    { id: 3, name: "Verbal Ability Test", score: 65, date: "1 week ago" }
  ]
};