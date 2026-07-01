import { useState, useEffect } from 'react';
import dataService from '../services/dataService';
import { questionApi } from '../services/api';

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const structuredData = await dataService.loadAllData();
        
        const dashboardData = {
          user: {
            name: "Vaidehi Koranne",
            email: "vaidehi09@gmail.com",
            gender: "female",
            avatar: "https://ui-avatars.com/api/?name=Vaidehi+Koranne&background=7c3aed&color=fff&size=100"
          },
          subjects: structuredData.subjects.map((subject, index) => ({
            id: index + 1,
            name: subject.name,
            icon: subject.icon || 'fa-book',
            description: subject.description || `Practice ${subject.name} questions`,
            progress: subject.progress || 0,
            questionsSolved: Math.floor((subject.progress || 0) / 100 * (subject.totalQuestions || 100)),
            totalQuestions: subject.totalQuestions || 100,
            color: ['#667eea', '#f45c43', '#764ba2'][index % 3],
            bgColor: ['bg-blue-50', 'bg-orange-50', 'bg-purple-50'][index % 3],
            textColor: ['text-blue-600', 'text-orange-600', 'text-purple-600'][index % 3]
          })),
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
            topicName: "Time & Work",
            subtopicId: 1,
            subtopicName: "Single Person",
            progress: 60,
            estimatedTimeLeft: "15 min",
            nextSubtopic: "Two Persons"
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
        
        setData(dashboardData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading };
};

export const useSubjectData = (subjectId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const structuredData = await dataService.loadAllData();
        const subject = structuredData.subjects[subjectId - 1];
        
        if (subject) {
          const topicsResponse = await questionApi.getTopics(subject.name);
          
          setData({
            id: subjectId,
            name: subject.name,
            description: subject.description,
            icon: subject.icon,
            color: ['#667eea', '#f45c43', '#764ba2'][subjectId - 1],
            progress: subject.progress || 0,
            totalTopics: topicsResponse.data.topics?.length || 0,
            completedTopics: topicsResponse.data.topics?.filter(t => t.progress > 80).length || 0,
            topics: topicsResponse.data.topics?.map((t, idx) => ({
              id: idx + 1,
              name: t.name,
              description: `Practice ${t.name} questions`,
              totalQuestions: t.total_questions || 0,
              completedQuestions: Math.floor((t.progress || 0) / 100 * (t.total_questions || 100)),
              progress: t.progress || 0,
              difficulty: t.difficulty || 'Medium',
              icon: getTopicIcon(t.name),
              subtopics: t.subtopics?.map((st, stIdx) => ({
                id: stIdx + 1,
                name: st.name,
                description: `Practice ${st.name}`,
                totalQuestions: st.total_questions || 0,
                progress: st.progress || 0,
                timeEstimate: `${Math.ceil((st.total_questions || 10) / 2)} min`
              })) || []
            }))
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading subject data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [subjectId]);

  return { data, loading };
};

// ============ ADD THIS EXPORT ============
export const useTopicData = (topicId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔍 Fetching topic data for ID:', topicId);
        console.log('🔍 Topic ID type:', typeof topicId);
        
        const structuredData = await dataService.loadAllData();
        console.log('📊 Loaded data:', structuredData);
        
        // Log all subjects and topics for debugging
        structuredData.subjects.forEach(subject => {
          console.log(`📚 Subject: ${subject.name}`);
          subject.topics.forEach(topic => {
            console.log(`  └─ Topic: ${topic.name} (ID: ${topic.id}, Type: ${typeof topic.id})`);
          });
        });
        
        // Find the topic across all subjects
        let foundTopic = null;
        let foundSubject = null;
        
        for (const subject of structuredData.subjects) {
          for (const topic of subject.topics || []) {
            // Compare as strings
            const topicIdStr = String(topicId);
            const topicIdFromData = String(topic.id);
            
            console.log(`Comparing: ${topicIdStr} === ${topicIdFromData}`);
            
            if (topicIdStr === topicIdFromData) {
              foundTopic = topic;
              foundSubject = subject;
              console.log('✅ Found topic:', topic.name);
              break;
            }
          }
          if (foundTopic) break;
        }
        
        if (!foundTopic) {
          console.error('❌ Topic not found for ID:', topicId);
          console.log('Available topic IDs:', structuredData.subjects.flatMap(s => 
            s.topics.map(t => ({ subject: s.name, id: t.id, name: t.name }))
          ));
          setData(null);
          setLoading(false);
          return;
        }
        
        // Build the topic data
        const topicData = {
          id: parseInt(topicId),
          name: foundTopic.name,
          subject: foundSubject.name,
          description: foundTopic.description || `Master ${foundTopic.name}`,
          progress: foundTopic.progress || 0,
          totalQuestions: foundTopic.totalQuestions || 100,
          completedQuestions: foundTopic.completedQuestions || 0,
          icon: foundTopic.icon || '📚',
          subtopics: foundTopic.subtopics || [],
          concepts: (foundTopic.subtopics || []).map(st => ({
            id: st.id || Math.random(),
            title: st.name,
            description: `Master ${st.name} concepts`,
            questionCount: st.totalQuestions || 10,
            difficulty: st.difficulty || 'Medium',
            progress: st.progress || 0,
            timeEstimate: st.timeEstimate || `${Math.ceil((st.totalQuestions || 10) / 2)} min`
          })),
          videoPlaceholder: {
            title: `Introduction to ${foundTopic.name}`,
            description: `Learn the fundamentals of ${foundTopic.name}`,
            duration: "15:30"
          },
          formulas: [
            { id: 1, title: "Formula 1" },
            { id: 2, title: "Formula 2" }
          ],
          shortcuts: [
            { id: 1, title: "Shortcut 1" },
            { id: 2, title: "Shortcut 2" }
          ],
          importantNotes: [
            { id: 1, title: "Note 1" },
            { id: 2, title: "Note 2" }
          ]
        };
        
        console.log('✅ Topic data built:', topicData);
        setData(topicData);
        setLoading(false);
        
      } catch (error) {
        console.error('Error loading topic data:', error);
        setLoading(false);
      }
    };

    if (topicId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [topicId]);

  return { data, loading };
};
// ============ ADD THIS EXPORT ============
export const usePracticeQuestions = (topicId, difficulty) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Find the topic to get subject and topic name
        const structuredData = await dataService.loadAllData();
        let foundSubject = null;
        let foundTopic = null;
        
        for (const subject of structuredData.subjects) {
          for (const topic of subject.topics || []) {
            if (topic.id === parseInt(topicId)) {
              foundSubject = subject;
              foundTopic = topic;
              break;
            }
          }
          if (foundTopic) break;
        }
        
        if (foundSubject && foundTopic) {
          // Fetch questions from API
          const response = await questionApi.getPracticeQuestions({
            subject: foundSubject.name,
            topic: foundTopic.name,
            difficulty: difficulty || 'mixed',
            limit: 10
          });
          
          setData({
            topicId: parseInt(topicId),
            topicName: foundTopic.name,
            subtopicId: 1,
            subtopicName: foundTopic.name,
            totalQuestions: response.data.questions?.length || 0,
            timeLimit: 15,
            questions: response.data.questions?.map(q => ({
              id: q.id,
              question: q.question,
              options: q.options || ['', '', '', ''],
              correctAnswer: q.correct_option,
              explanation: q.explanation || '',
              formula: q.formula || '',
              shortcut: q.shortcut || '',
              wrongReason: 'Review the explanation above to understand the correct approach.',
              difficulty: q.difficulty || 'Medium'
            })) || []
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading practice questions:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [topicId, difficulty]);

  return { data, loading };
};

// ============ ADD THIS EXPORT ============
export const useResultData = (practiceId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData({
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
      });
      setLoading(false);
    }, 500);
  }, [practiceId]);

  return { data, loading };
};

// ============ ADD THIS EXPORT ============
export const useProfileData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData({
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
      });
      setLoading(false);
    }, 500);
  }, []);

  return { data, loading };
};

// Helper function for topic icons
const getTopicIcon = (topicName) => {
  const icons = {
    'Time & Work': '⏰',
    'Simplification & Approximation': '🧮',
    'Time Speed Distance': '🚗',
    'Problems on Ages': '👴',
    'Algebra': '📐',
    'Percentages': '📊',
    'Number System': '🔢',
    'Average': '📈',
    'Compound Interest': '💰',
    'Simple Interest': '💵',
    'Data Interpretation': '📉',
    'Partnership': '🤝',
    'Probability': '🎲',
    'Mixture & Alligation': '🧪',
    'Profit & Loss': '📊',
    'Permutation & Combination': '🔀',
    'Ratio & Proportion': '⚖️',
    'Active Passive Voice': '🎤',
    'Antonyms': '🔤',
    'Cloze Test': '📝',
    'Critical Reasoning': '🧠',
    'Direct Indirect Speech': '💬',
    'Error Detection': '❌',
    'Fill in the Blanks': '✏️',
    'Idioms & Phrases': '📖',
    'One Word Substitution': '📚',
    'Para Jumbles': '🧩',
    'Parts of Speech': '🗣️',
    'Reading Comprehension': '📖',
    'Sentence Completion': '✅',
    'Sentence Improvement': '🔧',
    'Sentence Rearrangement': '🔄',
    'Synonyms': '🔗',
    'Verbal Analogy': '🧬',
    'Vocabulary': '📕',
    'Word Usage': '💬',
    'Blood Relations': '👨‍👩‍👧‍👦',
    'Coding Decoding': '🔐',
    'Direction Sense': '🧭',
    'Number Series': '🔢'
  };
  return icons[topicName] || '📚';
};