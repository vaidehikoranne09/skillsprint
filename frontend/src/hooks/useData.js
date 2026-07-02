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
            progress: 0,
            questionsSolved: 0,
            totalQuestions: subject.totalQuestions || 0,
            color: ['#667eea', '#f45c43', '#764ba2'][index % 3]
          })),
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
        const subject = structuredData.subjects.find(s => s.id === parseInt(subjectId));
        
        if (subject) {
          setData({
            id: subject.id,
            name: subject.name,
            description: subject.description,
            icon: subject.icon,
            color: subject.color,
            progress: 0,
            totalTopics: subject.topics?.length || 0,
            completedTopics: 0,
            topics: subject.topics?.map((t, idx) => ({
              id: t.id || idx + 1,
              name: t.name,
              description: t.description || `Practice ${t.name} questions`,
              totalQuestions: t.totalQuestions || 0,
              completedQuestions: 0,
              progress: 0,
              difficulty: 'Medium',
              icon: '📚',
              subtopics: t.subtopics || []
            })) || []
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading subject:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [subjectId]);

  return { data, loading };
};

export const useTopicData = (topicId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const structuredData = await dataService.loadAllData();
        
        for (const subject of structuredData.subjects) {
          for (const topic of subject.topics || []) {
            if (String(topic.id) === String(topicId) || 
                topic.name?.toLowerCase() === String(topicId).toLowerCase()) {
              setData({
                id: topic.id || topicId,
                name: topic.name,
                subject: subject.name,
                description: topic.description || `Master ${topic.name}`,
                progress: 0,
                totalQuestions: topic.totalQuestions || 0,
                completedQuestions: 0,
                icon: '📚',
                subtopics: topic.subtopics || [],
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                formulas: [{ id: 1, title: "Formula 1" }, { id: 2, title: "Formula 2" }],
                shortcuts: [{ id: 1, title: "Shortcut 1" }, { id: 2, title: "Shortcut 2" }]
              });
              setLoading(false);
              return;
            }
          }
        }
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

export const usePracticeQuestions = (topicId, difficulty) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const structuredData = await dataService.loadAllData();
        
        let foundSubject = null;
        let foundTopic = null;
        
        for (const subject of structuredData.subjects) {
          for (const topic of subject.topics || []) {
            if (String(topic.id) === String(topicId) || 
                topic.name?.toLowerCase() === String(topicId).toLowerCase()) {
              foundSubject = subject;
              foundTopic = topic;
              break;
            }
          }
          if (foundTopic) break;
        }
        
        if (foundSubject && foundTopic) {
          const response = await questionApi.getPracticeQuestions({
            subject: foundSubject.name,
            topic: foundTopic.name,
            difficulty: difficulty === 'mixed' ? null : difficulty,
            limit: 50
          });
          
          let questions = [];
          if (response.data && Array.isArray(response.data.questions)) {
            questions = response.data.questions;
          } else if (Array.isArray(response.data)) {
            questions = response.data;
          }
          
          // Verify subject
          questions = questions.filter(q => q.subject === foundSubject.name);
          
          const formattedQuestions = questions.map((q, index) => ({
            id: q.id || index + 1,
            question: q.question || '',
            options: q.options || [q.option_a, q.option_b, q.option_c, q.option_d] || ['', '', '', ''],
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
            timeLimit: 15,
            questions: formattedQuestions
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
        topicWisePerformance: [],
        difficultyWisePerformance: [],
        weakAreas: [],
        strongAreas: [],
        incorrectQuestions: []
      });
      setLoading(false);
    }, 500);
  }, [practiceId]);

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
        },
        achievements: [],
        badges: [],
        subjectProgress: [],
        recentTests: []
      });
      setLoading(false);
    }, 500);
  }, []);

  return { data, loading };
};