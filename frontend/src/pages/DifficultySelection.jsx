import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';

const DifficultySelection = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  console.log('Difficulty Page - topicId:', topicId);

  const difficulties = [
    { 
      id: 'easy', 
      label: 'Easy', 
      icon: '😊', 
      color: 'bg-green-500',
      questionCount: 10,
      timeEstimate: '10 min',
      description: 'Basic concept questions to build confidence'
    },
    { 
      id: 'medium', 
      label: 'Medium', 
      icon: '🤔', 
      color: 'bg-yellow-500',
      questionCount: 15,
      timeEstimate: '20 min',
      description: 'Moderate difficulty to test your understanding'
    },
    { 
      id: 'hard', 
      label: 'Hard', 
      icon: '😤', 
      color: 'bg-red-500',
      questionCount: 20,
      timeEstimate: '30 min',
      description: 'Challenging questions to push your limits'
    },
    { 
      id: 'mixed', 
      label: 'Mixed', 
      icon: '🎯', 
      color: 'bg-purple-500',
      questionCount: 25,
      timeEstimate: '35 min',
      description: 'Mix of easy, medium, and hard questions'
    },
  ];

  const handleStartPractice = () => {
    if (selectedDifficulty) {
      console.log('Starting practice with difficulty:', selectedDifficulty);
      // Navigate to practice with topicId and difficulty
      navigate(`/practice/${topicId}?difficulty=${selectedDifficulty}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <SectionTitle 
        title="Select Difficulty" 
        subtitle="Choose the difficulty level for your practice session" 
      />

      <div className="space-y-4">
        {difficulties.map((diff) => (
          <Card
            key={diff.id}
            hover
            className={`
              cursor-pointer transition-all border-2
              ${selectedDifficulty === diff.id 
                ? 'border-primary-600 bg-primary-50 shadow-lg' 
                : 'border-transparent hover:border-gray-300'}
            `}
            onClick={() => setSelectedDifficulty(diff.id)}
          >
            <div className="flex items-center gap-6">
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white flex-shrink-0
                ${diff.color}
              `}>
                {diff.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{diff.label}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{diff.questionCount} questions</span>
                    <span>⏱️ {diff.timeEstimate}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">{diff.description}</p>
              </div>
              {selectedDifficulty === diff.id && (
                <div className="text-primary-600">
                  <i className="fas fa-check-circle text-2xl" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          variant="secondary" 
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left mr-2" /> Back
        </Button>
        <Button 
          disabled={!selectedDifficulty}
          onClick={handleStartPractice}
          className="flex-1"
        >
          Start Practice <i className="fas fa-arrow-right ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DifficultySelection;