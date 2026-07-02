import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTopicData } from '../hooks/useData';
import dataService from '../services/dataService';
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
  
  const { data, loading } = useTopicData(topicId);
  const [activeTab, setActiveTab] = useState('concepts');
  const [fallbackData, setFallbackData] = useState(null);
  const [subjectName, setSubjectName] = useState(subjectFromQuery || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // If we already have data from the hook, use it
      if (data) {
        setSubjectName(data.subject || subjectFromQuery || '');
        setIsLoading(false);
        return;
      }
      
      // Otherwise, load fallback data
      try {
        const structuredData = await dataService.loadAllData();
        
        // Find the topic and its subject
        let foundTopic = null;
        let foundSubject = null;
        
        for (const subject of structuredData.subjects) {
          for (const topic of subject.topics || []) {
            if (String(topic.id) === String(topicId) || 
                topic.name?.toLowerCase() === String(topicId).toLowerCase()) {
              foundTopic = topic;
              foundSubject = subject;
              break;
            }
          }
          if (foundTopic) break;
        }
        
        if (foundTopic && foundSubject) {
          setSubjectName(foundSubject.name);
          setFallbackData({
            id: foundTopic.id || topicId,
            name: foundTopic.name,
            subject: foundSubject.name,
            description: foundTopic.description || `Master ${foundTopic.name}`,
            progress: foundTopic.progress || 0,
            totalQuestions: foundTopic.totalQuestions || 100,
            completedQuestions: foundTopic.completedQuestions || 0,
            icon: foundTopic.icon || '📚',
            subtopics: foundTopic.subtopics || [],
            videoUrl: foundTopic.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            formulas: foundTopic.formulas || [
              { id: 1, title: "Formula 1: Example formula" },
              { id: 2, title: "Formula 2: Example formula" }
            ],
            concepts: (foundTopic.subtopics || []).map(st => ({
              id: st.id || Math.random(),
              title: st.name,
              description: `Master ${st.name} concepts`,
              questionCount: st.totalQuestions || 10,
              difficulty: st.difficulty || 'Medium'
            })),
            shortcuts: foundTopic.shortcuts || [
              { id: 1, title: "Shortcut 1: Example shortcut" },
              { id: 2, title: "Shortcut 2: Example shortcut" }
            ]
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading fallback data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [topicId, data, subjectFromQuery]);

  const displayData = data || fallbackData;
  const finalSubject = subjectName || displayData?.subject || '';
  const finalLoading = loading || isLoading;

  if (finalLoading) {
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
        <p className="text-sm text-gray-400 mt-2">Topic ID: {topicId}</p>
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
    const id = displayData.id || topicId;
    const subject = finalSubject || displayData.subject || '';
    // Pass subject as query parameter to practice page
    navigate(`/practice/${id}?subject=${encodeURIComponent(subject)}`);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{displayData.icon || '📚'}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{displayData.name}</h1>
              <p className="text-gray-500">{finalSubject || displayData.subject} • {displayData.totalQuestions || 100} Questions</p>
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
      </div>

      {/* Subtopics Navigation */}
      {subtopics.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {subtopics.map((subtopic) => (
            <button
              key={subtopic.id}
              onClick={() => navigate(`/learn/${displayData.id || displayData.name}/${subtopic.id}?subject=${encodeURIComponent(finalSubject)}`)}
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
            src={displayData.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
            title={displayData.name}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold">{selectedSubtopic?.name || displayData.name}</h3>
          <p className="text-gray-400">{selectedSubtopic?.description || displayData.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            <span>📝 {selectedSubtopic?.questionCount || displayData.totalQuestions || 0} questions</span>
            <span>⏱️ 15 min</span>
          </div>
        </div>
      </Card>

      {/* Tabs: Formulas, Concepts, Shortcuts */}
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
              {(displayData.formulas || [
                { id: 1, title: "Formula 1" },
                { id: 2, title: "Formula 2" }
              ]).map((formula) => (
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
              {(selectedSubtopic?.concepts || displayData.concepts || subtopics).map((concept) => (
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
              {(displayData.shortcuts || [
                { id: 1, title: "Shortcut 1: Example shortcut" },
                { id: 2, title: "Shortcut 2: Example shortcut" }
              ]).map((shortcut) => (
                <div key={shortcut.id} className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-gray-800">{shortcut.title}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Start Practice Button - Bottom */}
      <div className="flex justify-center pt-6 pb-4">
        <Button 
          onClick={handleStartPractice}
          className="px-12 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl"
          size="lg"
        >
          🚀 Start Practice
        </Button>
      </div>
    </div>
  );
};

export default Learn;