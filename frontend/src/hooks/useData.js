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
        setData({
          user: {
            name: "Vaidehi Koranne",
            email: "vaidehi09@gmail.com",
            gender: "female",
            avatar: "https://ui-avatars.com/api/?name=Vaidehi+Koranne&background=7c3aed&color=fff&size=100"
          },
          subjects: structuredData.subjects.map((s, i) => ({
            id: i + 1,
            name: s.name,
            icon: s.icon,
            description: s.description,
            totalQuestions: s.totalQuestions || 0,
            color: ['#667eea', '#f45c43', '#764ba2'][i % 3]
          })),
          stats: {
            overallAccuracy: 72,
            topicsCompleted: 0,
            practiceTime: "0h",
            testsTaken: 0,
            dailyStreak: 0
          }
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard:', error);
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
        // Find subject by ID - convert to number for comparison
        const subject = structuredData.subjects.find(s => Number(s.id) === Number(subjectId));
        
        console.log('🔍 useSubjectData - subjectId:', subjectId);
        console.log('📊 Found subject:', subject);
        
        if (subject) {
          setData({
            id: subject.id,
            name: subject.name,
            description: subject.description,
            icon: subject.icon,
            color: subject.color || '#7c3aed',
            totalTopics: subject.topics?.length || 0,
            completedTopics: 0,
            progress: 0,
            topics: (subject.topics || []).map(t => ({
              id: t.id,
              name: t.name,
              description: t.description || `Practice ${t.name}`,
              totalQuestions: t.totalQuestions || 0,
              completedQuestions: 0,
              progress: 0,
              difficulty: t.difficulty || 'Medium',
              icon: '📚',
              subtopics: t.subtopics || []
            }))
          });
        } else {
          console.warn('⚠️ Subject not found for ID:', subjectId);
          setData(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading subject:', error);
        setData(null);
        setLoading(false);
      }
    };
    loadData();
  }, [subjectId]);

  return { data, loading };
};

// Add this to the useTopicData function to handle both ID and name

export const useTopicData = (topicId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const structuredData = await dataService.loadAllData();
        
        // Check if topicId is a number or string
        const isNumeric = !isNaN(topicId);
        
        for (const subject of structuredData.subjects) {
          for (const topic of subject.topics || []) {
            let match = false;
            
            if (isNumeric) {
              // Match by ID
              match = String(topic.id) === String(topicId);
            } else {
              // Match by name (case insensitive)
              match = topic.name?.toLowerCase() === String(topicId).toLowerCase();
            }
            
            if (match) {
              setData({
                ...topic,
                subject: subject.name,
                subtopics: topic.subtopics || []
              });
              setLoading(false);
              return;
            }
          }
        }
        setData(null);
        setLoading(false);
      } catch (error) {
        console.error('Error loading topic:', error);
        setLoading(false);
      }
    };
    loadData();
  }, [topicId]);

  return { data, loading };
};
export const usePracticeQuestions = (topicId, difficulty, subjectName, subtopicName) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!topicId) {
        setData({ questions: [], totalQuestions: 0 });
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching practice questions:', { topicId, subjectName, subtopicName });
        
        const structuredData = await dataService.loadAllData();
        let foundSubject = null;
        let foundTopic = null;

        for (const subject of structuredData.subjects) {
          for (const topic of subject.topics || []) {
            if (String(topic.id) === String(topicId)) {
              foundSubject = subject;
              foundTopic = topic;
              break;
            }
          }
          if (foundTopic) break;
        }

        if (!foundTopic) {
          console.warn('⚠️ Topic not found:', topicId);
          setData({ questions: [], totalQuestions: 0 });
          setLoading(false);
          return;
        }

        const finalSubject = subjectName || foundSubject.name;
        const finalTopic = foundTopic.name;
        const finalSubtopic = subtopicName || null;

        console.log('📤 Fetching with:', { finalSubject, finalTopic, finalSubtopic });

        const response = await questionApi.getPracticeQuestions({
          subject: finalSubject,
          topic: finalTopic,
          subtopic: finalSubtopic,
          difficulty: difficulty === 'mixed' ? null : difficulty,
          limit: 50
        });

        let questions = [];
        if (response.data && Array.isArray(response.data.questions)) {
          questions = response.data.questions;
        }

        console.log(`✅ Found ${questions.length} questions`);

        const formattedQuestions = questions.map((q, index) => ({
          id: q.id || index + 1,
          question: q.question || '',
          options: q.options || ['', '', '', ''],
          correctAnswer: q.correct_option !== undefined ? q.correct_option : 0,
          explanation: q.explanation || '',
          formula: q.formula || '',
          shortcut: q.shortcut || '',
          difficulty: q.difficulty || 'Medium',
          hint: q.hint || ''
        }));

        setData({
          topicId: parseInt(topicId),
          topicName: foundTopic.name,
          totalQuestions: formattedQuestions.length,
          questions: formattedQuestions
        });
        setLoading(false);

      } catch (error) {
        console.error('❌ Error loading practice questions:', error);
        setData({ questions: [], totalQuestions: 0 });
        setLoading(false);
      }
    };
    loadQuestions();
  }, [topicId, difficulty, subjectName, subtopicName]);

  return { data, loading, error };
};

export const useResultData = () => {
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
        totalQuestions: 10
      });
      setLoading(false);
    }, 500);
  }, []);

  return { data, loading };
};

export const useProfileData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData({
        user: {
          name: "Vaidehi Koranne",
          email: "vaidehi09@gmail.com",
          gender: "female",
          avatar: "https://ui-avatars.com/api/?name=Vaidehi+Koranne&background=7c3aed&color=fff&size=200",
          joinedAt: new Date().toISOString()
        },
        stats: {
          overallProgress: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          accuracy: 0,
          practiceTime: "0h",
          testsTaken: 0,
          currentStreak: 0
        }
      });
      setLoading(false);
    }, 500);
  }, []);

  return { data, loading };
};