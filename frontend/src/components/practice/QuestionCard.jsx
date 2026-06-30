import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const QuestionCard = ({ 
  question, 
  index, 
  total, 
  selectedOption, 
  onSelectOption,
  onBookmark,
  isBookmarked = false,
  showExplanation = false,
  isSubmitted = false
}) => {
  const [isBookmarkedLocal, setIsBookmarkedLocal] = useState(isBookmarked);
  const hasAnswered = selectedOption !== undefined;
  const isCorrect = hasAnswered && selectedOption === question.correctAnswer;
  const isWrong = hasAnswered && selectedOption !== question.correctAnswer;

  const handleBookmark = () => {
    setIsBookmarkedLocal(!isBookmarkedLocal);
    if (onBookmark) onBookmark(question.id);
  };

  return (
    <Card className="mb-4 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge variant="primary">Question {index + 1} of {total}</Badge>
          <Badge variant={question.difficulty === 'Easy' ? 'success' : question.difficulty === 'Medium' ? 'warning' : 'danger'}>
            {question.difficulty}
          </Badge>
          {hasAnswered && (
            <Badge variant={isCorrect ? 'success' : 'danger'}>
              {isCorrect ? '✅ Correct' : '❌ Incorrect'}
            </Badge>
          )}
        </div>
        <button
          onClick={handleBookmark}
          className={`text-2xl transition-colors ${isBookmarkedLocal ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}
        >
          ★
        </button>
      </div>

      <p className="text-lg text-gray-900 font-medium mb-4">{question.question}</p>

      <div className="space-y-3 mb-4">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrectAnswer = idx === question.correctAnswer;
          
          let optionClassName = 'p-3 rounded-xl border-2 cursor-pointer transition-all duration-200';
          
          // If showing explanation OR submitted, show correct/incorrect highlights
          if (showExplanation || isSubmitted) {
            if (isCorrectAnswer) {
              optionClassName += ' border-green-500 bg-green-50 shadow-sm';
            } else if (isSelected && isWrong) {
              optionClassName += ' border-red-500 bg-red-50 shadow-sm';
            } else if (isSelected) {
              optionClassName += ' border-green-500 bg-green-50 shadow-sm';
            } else {
              optionClassName += ' border-gray-200 opacity-60';
            }
          } 
          // If the user has answered but we're not showing explanation yet
          else if (hasAnswered && !showExplanation && !isSubmitted) {
            if (isSelected) {
              optionClassName += isCorrect 
                ? ' border-green-500 bg-green-50 shadow-sm' 
                : ' border-red-500 bg-red-50 shadow-sm';
            } else {
              optionClassName += ' border-gray-200 hover:border-primary-300 hover:bg-gray-50';
            }
          }
          // Default state - no answer selected
          else {
            optionClassName += isSelected 
              ? ' border-primary-500 bg-primary-50 shadow-sm' 
              : ' border-gray-200 hover:border-primary-300 hover:bg-gray-50';
          }

          return (
            <div
              key={idx}
              onClick={() => !showExplanation && !isSubmitted && onSelectOption(question.id, idx)}
              className={optionClassName}
            >
              <span className="text-gray-700">
                {String.fromCharCode(65 + idx)}. {option}
              </span>
              {showExplanation && isCorrectAnswer && (
                <span className="ml-2 text-green-600 font-semibold">✓ Correct Answer</span>
              )}
              {showExplanation && isSelected && isWrong && (
                <span className="ml-2 text-red-600 font-semibold">✗ Your Answer</span>
              )}
              {!showExplanation && hasAnswered && isSelected && isCorrect && (
                <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
              )}
              {!showExplanation && hasAnswered && isSelected && isWrong && (
                <span className="ml-2 text-red-600 font-semibold">✗ Incorrect</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick feedback when answer is selected but explanation is not shown */}
      {!showExplanation && !isSubmitted && hasAnswered && (
        <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${
          isCorrect 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {isCorrect ? (
            '✅ Correct! Click "Show Explanation" for details or "Next" to continue.'
          ) : (
            '❌ Incorrect. Click "Show Explanation" to see the correct answer and explanation.'
          )}
        </div>
      )}

      {/* Explanation Section - Show when toggled or after submission */}
      {showExplanation && (
        <div className="space-y-3 mt-4">
          <div className={`p-5 rounded-xl border-2 ${
            isCorrect 
              ? 'bg-green-50 border-green-300' 
              : 'bg-red-50 border-red-300'
          }`}>
            <h4 className={`font-bold text-lg mb-2 ${
              isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </h4>
            
            <div className="text-gray-800 space-y-2">
              <p><strong>📖 Explanation:</strong> {question.explanation}</p>
              
              {question.formula && (
                <p className="bg-white p-2 rounded-lg border border-gray-200">
                  <strong>📐 Formula:</strong> <code className="px-2 py-1 bg-gray-100 rounded font-mono text-sm">{question.formula}</code>
                </p>
              )}
              
              {question.shortcut && (
                <p><strong>⚡ Shortcut:</strong> <span className="text-primary-700">{question.shortcut}</span></p>
              )}
              
              {isWrong && question.wrongReason && (
                <div className="bg-red-100/50 p-3 rounded-lg border border-red-200">
                  <p className="text-red-700 text-sm">
                    <strong>💡 Why was this wrong?</strong> {question.wrongReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;