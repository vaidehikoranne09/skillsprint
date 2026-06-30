import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTopicData } from '../hooks/useData';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';

const Learn = () => {
  const { topicId, subtopicId } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useTopicData(topicId);
  const [activeTab, setActiveTab] = useState('concepts');

  console.log('Learn Page - topicId:', topicId);
  console.log('Learn Page - data:', data);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading topic...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Topic not found</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Find the selected subtopic or use the first one
  const subtopics = data.subtopics || [];
  const selectedSubtopic = subtopicId 
    ? subtopics.find(s => s.id === parseInt(subtopicId)) 
    : subtopics[0];

  // FIX: Handle Start Practice button
  const handleStartPractice = () => {
    console.log('Start Practice clicked - topicId:', data.id);
    // Navigate to difficulty selection with the topic ID
    navigate(`/difficulty/${data.id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{data.icon || '📚'}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
              <p className="text-gray-500">{data.subject} • {data.totalQuestions} Questions</p>
            </div>
          </div>
          <p className="text-gray-600 mt-2">{data.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="info">{data.completedQuestions}/{data.totalQuestions} Completed</Badge>
            <span className="text-sm text-gray-500">{Math.round(data.progress)}% Progress</span>
          </div>
          <div className="mt-2 w-full md:w-96">
            <ProgressBar progress={data.progress} showLabel label="Topic Progress" />
          </div>
        </div>
        <Button 
          onClick={handleStartPractice}
          className="whitespace-nowrap"
        >
          Start Practice <i className="fas fa-arrow-right ml-2" />
        </Button>
      </div>

      {/* Subtopics Navigation */}
      {subtopics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subtopics.map((subtopic) => (
            <button
              key={subtopic.id}
              onClick={() => navigate(`/learn/${data.id}/${subtopic.id}`)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${selectedSubtopic?.id === subtopic.id 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {subtopic.name}
            </button>
          ))}
        </div>
      )}

      {/* Video Section */}
      {selectedSubtopic && selectedSubtopic.youtubeVideo && (
        <Card className="bg-gray-900 text-white overflow-hidden">
          <div className="aspect-video w-full">
            <iframe
              src={selectedSubtopic.youtubeVideo}
              title={selectedSubtopic.name}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold">{selectedSubtopic.name}</h3>
            <p className="text-gray-400">{selectedSubtopic.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span>📝 {selectedSubtopic.questions} questions</span>
              <span>⏱️ {selectedSubtopic.timeEstimate}</span>
              <span>📊 {Math.round(selectedSubtopic.progress)}% complete</span>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['concepts', 'formulas', 'shortcuts', 'notes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-6 py-3 font-medium text-sm transition-all border-b-2
              ${activeTab === tab 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'}
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'concepts' && selectedSubtopic && (
          <div>
            <SectionTitle title="Concept Cards" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedSubtopic.concepts?.map((concept) => (
                <Card key={concept.id} hover className="border border-gray-200">
                  <h4 className="font-semibold text-gray-900">{concept.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{concept.description}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-500">{concept.questionCount || 0} questions</span>
                    <Badge variant="info">{concept.difficulty || 'Medium'}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'formulas' && selectedSubtopic && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📐 Formula Sheet</h3>
            <div className="space-y-3">
              {selectedSubtopic.formulas?.map((formula) => (
                <div key={formula.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="font-mono text-sm text-gray-700">{formula.title}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'shortcuts' && selectedSubtopic && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Shortcut Tricks</h3>
            <div className="space-y-4">
              {selectedSubtopic.shortcuts?.map((shortcut) => (
                <div key={shortcut.id} className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-gray-800">{shortcut.title}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'notes' && selectedSubtopic && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Important Notes</h3>
            <div className="space-y-4">
              {selectedSubtopic.concepts?.map((concept) => (
                <div key={concept.id} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <p className="text-gray-800"><strong>{concept.title}:</strong> {concept.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Learn;