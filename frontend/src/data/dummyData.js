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
  description: "Master quantitative aptitude with comprehensive coverage of arithmetic topics.",
  icon: "fa-calculator",
  color: "#667eea",
  progress: 65,
  totalTopics: 17,
  completedTopics: 5,
  topics: []
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
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  subtopics: [
    {
      id: 1,
      name: "Basic Profit",
      description: "Understanding profit, cost price, and selling price",
      totalQuestions: 30,
      progress: 80,
      timeEstimate: "15 min",
      difficulty: "Easy"
    },
    {
      id: 2,
      name: "Profit Percentage",
      description: "Calculate profit percentage and related problems",
      totalQuestions: 25,
      progress: 60,
      timeEstimate: "20 min",
      difficulty: "Medium"
    }
  ],
  formulas: [
    { id: 1, title: "Profit = Selling Price - Cost Price" },
    { id: 2, title: "Profit % = (Profit/CP) × 100" }
  ],
  shortcuts: [
    { id: 1, title: "SP = CP × (1 + Profit%/100)" }
  ],
  concepts: [
    { id: 1, title: "Cost Price (CP)", description: "The price at which an item is purchased" },
    { id: 2, title: "Selling Price (SP)", description: "The price at which an item is sold" }
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
      difficulty: "Easy"
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
    { topic: "Basic Profit", correct: 3, total: 3, percentage: 100 }
  ],
  difficultyWisePerformance: [
    { difficulty: "Easy", correct: 4, total: 4, percentage: 100 }
  ],
  weakAreas: ["Successive Changes"],
  strongAreas: ["Basic Profit"],
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

export default {
  genderIllustrations,
  dashboardData,
  subjectData,
  topicData,
  practiceQuestions,
  resultData,
  profileData,
  authData
};