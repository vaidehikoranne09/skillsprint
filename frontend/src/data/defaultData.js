// frontend/src/data/defaultData.js
export const defaultData = {
  subjects: [
    {
      id: 1,
      name: 'Arithmetic',
      icon: 'fa-calculator',
      description: 'Master quantitative aptitude with comprehensive topic coverage',
      color: '#667eea',
      totalQuestions: 696,
      topics: []
    },
    {
      id: 2,
      name: 'Logical Reasoning',
      icon: 'fa-brain',
      description: 'Enhance your logical and analytical thinking abilities',
      color: '#f45c43',
      totalQuestions: 223,
      topics: []
    },
    {
      id: 3,
      name: 'Verbal Ability',
      icon: 'fa-comment-dots',
      description: 'Improve your language skills for placement exams',
      color: '#764ba2',
      totalQuestions: 905,
      topics: []
    }
  ],
  stats: {
    overallAccuracy: 72,
    topicsCompleted: 0,
    practiceTime: "0h",
    testsTaken: 0,
    dailyStreak: 0
  },
  continueLearning: null,
  strongTopics: [],
  weakTopics: [],
  recentActivity: []
};