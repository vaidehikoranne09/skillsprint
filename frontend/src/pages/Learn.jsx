import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTopicData } from '../hooks/useData';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';

const Learn = () => {
  const { topicId, subtopicId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subjectFromQuery = searchParams.get('subject');
  
  // useTopicData now handles both ID and name
  const { data, loading } = useTopicData(topicId);
  const [activeTab, setActiveTab] = useState('concepts');

  console.log('🔍 Learn Page - topicId:', topicId);
  console.log('🔍 Learn Page - subjectFromQuery:', subjectFromQuery);
  console.log('📊 Learn Page - data:', data);

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
        <p className="text-sm text-gray-400 mt-2">Topic: {topicId}</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const subtopics = data.subtopics || [];
  const selectedSubtopic = subtopicId 
    ? subtopics.find(s => String(s.id) === String(subtopicId)) 
    : subtopics[0];

  const handleStartPractice = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const subject = subjectFromQuery || data.subject || '';
    const topicName = data.name || topicId;
    
    console.log('🎯 Start Practice clicked!');
    console.log('  Topic Name:', topicName);
    console.log('  Subject:', subject);
    console.log('  Subtopic:', selectedSubtopic?.name || '');
    
    // Build URL with parameters
    let url = `/practice/${encodeURIComponent(topicName)}`;
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (selectedSubtopic?.name) params.append('subtopic', selectedSubtopic.name);
    if (params.toString()) url += `?${params.toString()}`;
    
    console.log('  Navigating to:', url);
    navigate(url);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{data.icon || '📚'}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
              <p className="text-gray-500">{subjectFromQuery || data.subject} • {data.totalQuestions || 0} Questions</p>
            </div>
          </div>
          <p className="text-gray-600 mt-2">{data.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="info">{data.completedQuestions || 0}/{data.totalQuestions || 0} Completed</Badge>
            <span className="text-sm text-gray-500">{Math.round(data.progress || 0)}% Progress</span>
          </div>
          <div className="mt-2 w-full md:w-96">
            <ProgressBar progress={data.progress || 0} showLabel label="Topic Progress" />
          </div>
        </div>
      </div>

      {/* Subtopics Navigation */}
      {subtopics.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {subtopics.map((subtopic) => (
            <button
              key={subtopic.id}
              onClick={() => {
                const subject = subjectFromQuery || data.subject || '';
                navigate(`/learn/${encodeURIComponent(data.name)}/${subtopic.id}?subject=${encodeURIComponent(subject)}`);
              }}
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
      <Card className="bg-gray-900 text-white overflow-hidden shadow-xl">
        <div className="aspect-video w-full">
          <iframe
            src={data.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
            title={data.name}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold">{selectedSubtopic?.name || data.name}</h3>
          <p className="text-gray-400">{selectedSubtopic?.description || data.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            <span>📝 {selectedSubtopic?.totalQuestions || data.totalQuestions || 0} questions</span>
            <span>⏱️ 15 min</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['formulas', 'concepts', 'shortcuts'].map((tab) => (
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
      <div className="min-h-[200px]">
        {activeTab === 'formulas' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📐 Formula Sheet</h3>
            <div className="space-y-3">
              {(data.formulas || []).map((formula) => (
                <div key={formula.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="font-mono text-sm text-gray-700">{formula.title}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'concepts' && (
          <div>
            <SectionTitle title="Key Concepts" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(selectedSubtopic?.concepts || data.concepts || subtopics).map((concept) => (
                <Card key={concept.id} hover className="border border-gray-200">
                  <h4 className="font-semibold text-gray-900">{concept.title || concept.name}</h4>
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

        {activeTab === 'shortcuts' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Shortcut Tricks</h3>
            <div className="space-y-4">
              {(data.shortcuts || []).map((shortcut) => (
                <div key={shortcut.id} className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-gray-800">{shortcut.title}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Start Practice Button */}
      <div className="flex justify-center pt-6 pb-4">
        <Button 
          onClick={handleStartPractice}
          className="px-12 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl cursor-pointer"
          size="lg"
          type="button"
        >
          🚀 Start Practice
        </Button>
      </div>
    </div>
  );
};

export default Learn;