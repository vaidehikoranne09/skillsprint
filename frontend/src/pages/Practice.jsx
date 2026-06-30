import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePracticeQuestions } from '../hooks/useData';
import QuestionCard from '../components/practice/QuestionCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';

const Practice = () => {
  const { topicId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const difficulty = searchParams.get('difficulty') || 'mixed';
  
  const { data, loading } = usePracticeQuestions(topicId, difficulty);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [timeLeft, setTimeLeft] = useState(900);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);

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

  if (!data || !data.questions || data.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No questions available</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const questions = data.questions;
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
    
    const isCorrect = optionIndex === question.correctAnswer;
    
    setAnswers({ ...answers, [questionId]: optionIndex });
    setHasAnsweredCurrent(true);
    
    // If wrong, automatically show explanation
    if (!isCorrect) {
      setShowExplanation(true);
    } else {
      // If correct, hide explanation (user can still click "Show Explanation")
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
    // If we haven't answered the current question, don't proceed
    if (!hasAnsweredCurrent && !isSubmitted) {
      alert('Please answer the question before proceeding.');
      return;
    }

    // Check if the answer is wrong and we're not showing explanation
    const currentQ = questions[currentQuestion];
    const selectedAnswer = answers[currentQ.id];
    const isWrong = selectedAnswer !== undefined && selectedAnswer !== currentQ.correctAnswer;

    if (isWrong && !showExplanation) {
      // If wrong and explanation not shown, show it first
      setShowExplanation(true);
      return;
    }

    // Proceed to next question
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
      // Check if the previous question was answered
      const prevQ = questions[currentQuestion - 1];
      setHasAnsweredCurrent(answers[prevQ.id] !== undefined);
    }
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const unanswered = questions.filter(q => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }
    
    setIsSubmitted(true);
    const results = {
      answers,
      totalQuestions,
      correct: Object.keys(answers).filter(qId => {
        const q = questions.find(q => q.id === parseInt(qId));
        return q && answers[qId] === q.correctAnswer;
      }).length,
      wrong: Object.keys(answers).filter(qId => {
        const q = questions.find(q => q.id === parseInt(qId));
        return q && answers[qId] !== undefined && answers[qId] !== q.correctAnswer;
      }).length,
      skipped: totalQuestions - Object.keys(answers).length,
    };
    
    navigate('/result', { state: { results, questions, answers } });
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Check if current question is answered
  const isCurrentAnswered = answers[currentQ.id] !== undefined;
  const isCurrentCorrect = isCurrentAnswered && answers[currentQ.id] === currentQ.correctAnswer;
  const isCurrentWrong = isCurrentAnswered && !isCurrentCorrect;

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{data.topicName}</h2>
          <p className="text-sm text-gray-500">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} • {totalQuestions} Questions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <i className={`fas fa-clock ${timeLeft < 60 ? 'text-red-500' : 'text-gray-500'}`} />
            <span className={`font-mono font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <Badge variant="primary">
            {Object.keys(answers).length}/{totalQuestions} Attempted
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-4">
        <ProgressBar progress={progress} showLabel={false} className="flex-1" />
        <span className="text-sm font-medium text-gray-500">Q{currentQuestion + 1}/{totalQuestions}</span>
      </div>

      {/* Question */}
      <QuestionCard
        question={currentQ}
        index={currentQuestion}
        total={totalQuestions}
        selectedOption={answers[currentQ.id]}
        onSelectOption={handleSelectOption}
        onBookmark={handleBookmark}
        isBookmarked={bookmarks.includes(currentQ.id)}
        showExplanation={showExplanation}
        isSubmitted={isSubmitted}
      />

      {/* Navigation */}
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

      {/* Hint if answer is wrong */}
      {isCurrentWrong && !showExplanation && (
        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-800 text-sm">
          💡 This answer is incorrect. Click "Check Answer" to see the explanation.
        </div>
      )}

      {/* Question Palette */}
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