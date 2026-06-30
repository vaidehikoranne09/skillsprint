import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import Badge from '../components/ui/Badge';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, questions, answers } = location.state || {};

  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No results found</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const { totalQuestions, correct, wrong, skipped } = results;
  const accuracy = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

  const stats = [
    { label: 'Score', value: `${correct}/${totalQuestions}`, icon: 'fa-trophy', color: 'text-yellow-500' },
    { label: 'Accuracy', value: `${accuracy}%`, icon: 'fa-bullseye', color: 'text-primary-500' },
    { label: 'Correct', value: correct, icon: 'fa-check-circle', color: 'text-green-500' },
    { label: 'Wrong', value: wrong, icon: 'fa-times-circle', color: 'text-red-500' },
    { label: 'Skipped', value: skipped, icon: 'fa-skip', color: 'text-gray-500' },
  ];

  // Calculate topic-wise performance (dummy data)
  const topicPerformance = [
    { topic: 'Percentages', correct: 3, total: 4, percentage: 75 },
    { topic: 'Averages', correct: 2, total: 3, percentage: 67 },
    { topic: 'Data Interpretation', correct: 3, total: 3, percentage: 100 },
  ];

  const weakAreas = ['Successive Changes', 'Time & Work'];
  const strongAreas = ['Data Interpretation', 'Basic Percentages'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Practice Results</h1>
        <p className="text-gray-500">Here's how you performed</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <div className={`text-3xl ${stat.color}`}>
              <i className={`fas ${stat.icon}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Topic-wise Performance */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Topic-wise Performance</h3>
        <div className="space-y-4">
          {topicPerformance.map((topic) => (
            <div key={topic.topic}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{topic.topic}</span>
                <span className="font-semibold">{topic.correct}/{topic.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    topic.percentage >= 70 ? 'bg-green-500' : 
                    topic.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${topic.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Strong & Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-green-600 mb-4">💪 Strong Areas</h3>
          <div className="space-y-2">
            {strongAreas.map((area) => (
              <div key={area} className="flex items-center gap-2 text-gray-700">
                <span>✅</span> {area}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-red-600 mb-4">🎯 Areas to Improve</h3>
          <div className="space-y-2">
            {weakAreas.map((area) => (
              <div key={area} className="flex items-center gap-2 text-gray-700">
                <span>📈</span> {area}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => navigate('/dashboard')}>
          <i className="fas fa-home mr-2" /> Back to Dashboard
        </Button>
        <Button variant="secondary">
          <i className="fas fa-redo mr-2" /> Retry Incorrect
        </Button>
        <Button variant="outline">
          <i className="fas fa-layer-group mr-2" /> Practice Similar
        </Button>
      </div>
    </div>
  );
};

export default Result;