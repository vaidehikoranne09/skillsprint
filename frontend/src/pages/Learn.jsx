import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTopicData } from '../hooks/useData';
import dataService from '../services/dataService';
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
  const [fallbackData, setFallbackData] = useState(null);

  // If useTopicData fails, try direct lookup by name
  useEffect(() => {
    if (!loading && !data) {
      const loadFallback = async () => {
        try {
          console.log('🔄 Loading fallback data for:', topicId);
          const structuredData = await dataService.loadAllData();
          
          // Try to find topic by name or ID
          for (const subject of structuredData.subjects) {
            for (const topic of subject.topics || []) {
              const topicIdStr = String(topicId);
              const topicIdFromData = String(topic.id);
              const topicNameFromData = topic.name?.toLowerCase();
              const searchTerm = topicIdStr.toLowerCase();
              
              if (topicIdStr === topicIdFromData || 
                  topicNameFromData === searchTerm ||
                  topicNameFromData?.includes(searchTerm)) {
                console.log('✅ Found topic in fallback:', topic.name);
                setFallbackData({
                  id: topic.id || topicId,
                  name: topic.name,
                  subject: subject.name,
                  description: topic.description || `Master ${topic.name}`,
                  progress: topic.progress || 0,
                  totalQuestions: topic.totalQuestions || 100,
                  completedQuestions: topic.completedQuestions || 0,
                  icon: topic.icon || '📚',
                  subtopics: topic.subtopics || [],
                  concepts: (topic.subtopics || []).map(st => ({
                    id: st.id || Math.random(),
                    title: st.name,
                    description: `Master ${st.name} concepts`,
                    questionCount: st.totalQuestions || 10,
                    difficulty: st.difficulty || 'Medium',
                    progress: st.progress || 0,
                    timeEstimate: `${Math.ceil((st.totalQuestions || 10) / 2)} min`
                  })),
                  videoPlaceholder: {
                    title: `Introduction to ${topic.name}`,
                    description: `Learn the fundamentals of ${topic.name}`,
                    duration: "15:30"
                  }
                });
                return;
              }
            }
          }
          console.error('❌ Topic not found in fallback:', topicId);
        } catch (error) {
          console.error('Fallback load failed:', error);
        }
      };
      loadFallback();
    }
  }, [loading, data, topicId]);

  const displayData = data || fallbackData;

  console.log('🔍 Learn Page - topicId:', topicId);
  console.log('📊 displayData:', displayData);

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

  if (!displayData) {
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

  const subtopics = displayData.subtopics || displayData.concepts || [];
  const selectedSubtopic = subtopicId 
    ? subtopics.find(s => String(s.id) === String(subtopicId)) 
    : subtopics[0];

  const handleStartPractice = () => {
    const id = displayData.id || displayData.name;
    navigate(`/difficulty/${id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{displayData.icon || '📚'}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{displayData.name}</h1>
              <p className="text-gray-500">{displayData.subject} • {displayData.totalQuestions} Questions</p>
            </div>
          </div>
          <p className="text-gray-600 mt-2">{displayData.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="info">{displayData.completedQuestions || 0}/{displayData.totalQuestions || 100} Completed</Badge>
            <span className="text-sm text-gray-500">{Math.round(displayData.progress || 0)}% Progress</span>
          </div>
          <div className="mt-2 w-full md:w-96">
            <ProgressBar progress={displayData.progress || 0} showLabel label="Topic Progress" />
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
              onClick={() => navigate(`/learn/${displayData.id || displayData.name}/${subtopic.id}`)}
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

      {/* Rest of the component remains the same... */}
    </div>
  );
};

export default Learn;