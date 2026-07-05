import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import dataService from '../services/dataService';
import { questionApi } from '../services/api';
import QuestionCard from '../components/practice/QuestionCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';

const Practice = () => {
  const { topicId, subtopicId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get ALL parameters from URL
  const subjectFromQuery = searchParams.get('subject');
  const subtopicFromQuery = searchParams.get('subtopic');
  const difficultyFromQuery = searchParams.get('difficulty') || 'mixed';
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [timeLeft, setTimeLeft] = useState(900);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [subjectName, setSubjectName] = useState(subjectFromQuery || '');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        console.log('🔍 Practice Page - Params:', {
          topicId,
          subtopicId,
          subjectFromQuery,
          subtopicFromQuery
        });
        
        // Get all structured data to find topic info
        const structuredData = await dataService.loadAllData();
        
        let foundSubject = null;
        let foundTopic = null;
        let foundSubtopic = null;
        
        // First try: Use subject from query
        if (subjectFromQuery) {
          console.log('📌 Using subject from query:', subjectFromQuery);
          const subject = structuredData.subjects.find(s => 
            s.name?.toLowerCase() === subjectFromQuery.toLowerCase()
          );
          if (subject) {
            foundSubject = subject;
            // Find topic by name or ID
            for (const topic of subject.topics || []) {
              // Check if topicId matches by name or ID
              const topicNameMatch = topic.name?.toLowerCase() === String(topicId).toLowerCase();
              const topicIdMatch = String(topic.id) === String(topicId);
              if (topicNameMatch || topicIdMatch) {
                foundTopic = topic;
                console.log('✅ Found topic:', foundTopic.name);
                break;
              }
            }
          }
        }
        
        // Second try: Search all subjects
        if (!foundTopic) {
          console.log('🔍 Searching all subjects for topic');
          for (const subject of structuredData.subjects) {
            for (const topic of subject.topics || []) {
              const topicNameMatch = topic.name?.toLowerCase() === String(topicId).toLowerCase();
              const topicIdMatch = String(topic.id) === String(topicId);
              if (topicNameMatch || topicIdMatch) {
                foundSubject = subject;
                foundTopic = topic;
                console.log('✅ Found topic:', foundTopic.name, 'in subject:', foundSubject.name);
                break;
              }
            }
            if (foundTopic) break;
          }
        }
        
        if (!foundSubject || !foundTopic) {
          console.error('❌ Topic not found:', topicId);
          setError('Topic not found');
          setLoading(false);
          return;
        }
        
        setTopicName(foundTopic.name);
        setSubjectName(foundSubject.name);
        
        // Find subtopic if provided
        if (subtopicFromQuery || subtopicId) {
          const searchSubtopic = subtopicFromQuery || subtopicId;
          foundSubtopic = foundTopic.subtopics?.find(st => 
            st.name?.toLowerCase() === String(searchSubtopic).toLowerCase() ||
            String(st.id) === String(searchSubtopic)
          );
          if (foundSubtopic) {
            console.log('✅ Found subtopic:', foundSubtopic.name);
          }
        }
        
        // CRITICAL: Build the API request with ALL parameters
        const params = {
          subject: foundSubject.name,
          topic: foundTopic.name,
          limit: 50
        };
        
        if (foundSubtopic) {
          params.subtopic = foundSubtopic.name;
        } else if (subtopicFromQuery) {
          params.subtopic = subtopicFromQuery;
        }
        
        console.log('📤 Fetching questions with params:', params);
        
        // Make the API request
        const response = await questionApi.getPracticeQuestions(params);
        console.log('📝 API Response:', response.data);
        
        let questionsData = [];
        if (response.data && Array.isArray(response.data.questions)) {
          questionsData = response.data.questions;
        } else if (Array.isArray(response.data)) {
          questionsData = response.data;
        }
        
        // Double-check filtering
        questionsData = questionsData.filter(q => {
          const matchesSubject = q.subject === foundSubject.name;
          const matchesTopic = q.topic === foundTopic.name;
          const matchesSubtopic = foundSubtopic ? q.subtopic === foundSubtopic.name : true;
          return matchesSubject && matchesTopic && matchesSubtopic;
        });
        
        console.log(`✅ Found ${questionsData.length} questions for ${foundSubject.name} - ${foundTopic.name}`);
        
        if (questionsData.length === 0) {
          setError(`No questions available for ${foundSubtopic ? foundSubtopic.name : foundTopic.name}`);
          setLoading(false);
          return;
        }
        
        // Format questions
        const formattedQuestions = questionsData.map((q, index) => ({
          id: q.id || index + 1,
          question: q.question || '',
          options: q.options || ['', '', '', ''],
          correctAnswer: q.correct_option !== undefined ? q.correct_option : 0,
          explanation: q.explanation || '',
          formula: q.formula || '',
          shortcut: q.shortcut || '',
          difficulty: q.difficulty || 'Medium',
          hint: q.hint || '',
          subject: q.subject || foundSubject.name,
          topic: q.topic || foundTopic.name,
          subtopic: q.subtopic || foundSubtopic?.name || ''
        }));
        
        setQuestions(formattedQuestions);
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Error loading questions:', error);
        setError('Failed to load questions');
        setLoading(false);
      }
    };

    if (topicId) {
      loadQuestions();
    } else {
      setLoading(false);
    }
  }, [topicId, subtopicId, subjectFromQuery, subtopicFromQuery]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-red-500 text-lg font-semibold">{error}</p>
        <p className="text-sm text-gray-400 mt-2">
          {subjectName ? `Subject: ${subjectName}` : ''}
          {topicName ? ` • Topic: ${topicName}` : ''}
        </p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-4xl mb-4">📝</div>
        <p className="text-gray-500 text-lg font-semibold">No questions available</p>
        <p className="text-sm text-gray-400 mt-2">
          {subjectName ? `Subject: ${subjectName}` : ''}
          {topicName ? ` • Topic: ${topicName}` : ''}
        </p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (isSubmitted) return;
    
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    setAnswers({ ...answers, [questionId]: optionIndex });
    setHasAnsweredCurrent(true);
    
    if (optionIndex !== question.correctAnswer) {
      setShowExplanation(true);
    } else {
      setShowExplanation(false);
    }
  };

  const handleBookmark = (questionId) => {
    setBookmarks(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleNext = () => {
    if (!hasAnsweredCurrent && !isSubmitted) {
      alert('Please answer the question before proceeding.');
      return;
    }
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setHasAnsweredCurrent(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
      const prevQ = questions[currentQuestion - 1];
      setHasAnsweredCurrent(answers[prevQ.id] !== undefined);
    }
  };

  const handleSubmit = () => {
    const unanswered = questions.filter(q => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }
    
    setIsSubmitted(true);
    const correct = Object.keys(answers).filter(qId => {
      const q = questions.find(q => q.id === parseInt(qId));
      return q && answers[qId] === q.correctAnswer;
    }).length;
    const wrong = Object.keys(answers).filter(qId => {
      const q = questions.find(q => q.id === parseInt(qId));
      return q && answers[qId] !== undefined && answers[qId] !== q.correctAnswer;
    }).length;
    const skipped = totalQuestions - Object.keys(answers).length;
    
    navigate('/result', { 
      state: { 
        results: { answers, totalQuestions, correct, wrong, skipped },
        questions, 
        answers 
      } 
    });
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const currentQId = currentQ.id;
  const isCurrentAnswered = answers[currentQId] !== undefined;
  const isCurrentWrong = isCurrentAnswered && answers[currentQId] !== currentQ.correctAnswer;

  const difficultyCounts = {
    Easy: questions.filter(q => q.difficulty === 'Easy').length,
    Medium: questions.filter(q => q.difficulty === 'Medium').length,
    Hard: questions.filter(q => q.difficulty === 'Hard').length
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {topicName || 'Practice'}
          </h2>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <Badge variant="primary">{totalQuestions} Questions</Badge>
            <span className="text-sm text-gray-500">⏱️ {formatTime(timeLeft)}</span>
            {subjectName && (
              <span className="text-xs text-gray-400">({subjectName})</span>
            )}
            <div className="flex gap-1 text-xs">
              {Object.entries(difficultyCounts).map(([diff, count]) => {
                if (count === 0) return null;
                const colors = {
                  Easy: 'text-green-600 bg-green-50 border border-green-200',
                  Medium: 'text-yellow-600 bg-yellow-50 border border-yellow-200',
                  Hard: 'text-red-600 bg-red-50 border border-red-200'
                };
                return (
                  <span key={diff} className={`px-2 py-0.5 rounded-full ${colors[diff]}`}>
                    {diff}: {count}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <Badge variant="primary" className="text-sm">
          {Object.keys(answers).length}/{totalQuestions} Attempted
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <ProgressBar progress={progress} showLabel={false} className="flex-1" />
        <span className="text-sm font-medium text-gray-500">Q{currentQuestion + 1}/{totalQuestions}</span>
      </div>

      <QuestionCard
        question={currentQ}
        index={currentQuestion}
        total={totalQuestions}
        selectedOption={answers[currentQId]}
        onSelectOption={handleSelectOption}
        onBookmark={handleBookmark}
        isBookmarked={bookmarks.includes(currentQId)}
        showExplanation={showExplanation}
        isSubmitted={isSubmitted}
      />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <i className="fas fa-arrow-left mr-2" /> Previous
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setShowExplanation(!showExplanation)}
            disabled={!isCurrentAnswered}
          >
            {showExplanation ? 'Hide' : 'Show'} Explanation
          </Button>
        </div>
        <div className="flex gap-2">
          {currentQuestion === totalQuestions - 1 ? (
            <Button 
              onClick={handleSubmit} 
              variant="success"
              disabled={Object.keys(answers).length === 0}
            >
              Submit <i className="fas fa-check ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              variant={isCurrentWrong && !showExplanation ? 'warning' : 'primary'}
            >
              {isCurrentWrong && !showExplanation ? 'Check Answer' : 'Next'} 
              <i className="fas fa-arrow-right ml-2" />
            </Button>
          )}
        </div>
      </div>

      {isCurrentWrong && !showExplanation && (
        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-800 text-sm">
          💡 This answer is incorrect. Click "Check Answer" to see the explanation.
        </div>
      )}

      <Card>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Question Palette</h4>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCorrect = isAnswered && answers[q.id] === q.correctAnswer;
            const isWrong = isAnswered && !isCorrect;
            const isBookmarked = bookmarks.includes(q.id);
            const isCurrent = idx === currentQuestion;

            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentQuestion(idx);
                  setShowExplanation(false);
                }}
                className={`
                  w-10 h-10 rounded-lg text-sm font-medium transition-all
                  ${isCurrent ? 'ring-2 ring-primary-600 ring-offset-2' : ''}
                  ${isCorrect ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                  ${isWrong ? 'bg-red-500 text-white hover:bg-red-600' : ''}
                  ${!isAnswered && isBookmarked ? 'bg-yellow-500 text-white hover:bg-yellow-600' : ''}
                  ${!isAnswered && !isBookmarked ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : ''}
                `}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
          <span><span className="inline-block w-4 h-4 bg-green-500 rounded mr-1" /> Correct</span>
          <span><span className="inline-block w-4 h-4 bg-red-500 rounded mr-1" /> Wrong</span>
          <span><span className="inline-block w-4 h-4 bg-yellow-500 rounded mr-1" /> Bookmarked</span>
          <span><span className="inline-block w-4 h-4 bg-gray-200 rounded mr-1" /> Not Attempted</span>
        </div>
      </Card>
    </div>
  );
};

export default Practice;