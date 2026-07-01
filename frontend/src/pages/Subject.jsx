import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubjectData } from '../hooks/useData';
import TopicCard from '../components/cards/TopicCard';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import SectionTitle from '../components/ui/SectionTitle';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const Subject = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useSubjectData(subjectId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  console.log('🔍 Subject Page - subjectId:', subjectId);
  console.log('📊 Subject Data:', data);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading subject...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Subject not found</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const filteredTopics = data.topics?.filter(topic => {
    const matchesSearch = topic.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || topic.difficulty === filter;
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl text-white flex-shrink-0"
          style={{ backgroundColor: data.color || '#7c3aed' }}
        >
          <i className={`fas ${data.icon}`} />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
          <p className="text-gray-500 mt-1">{data.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="info">{data.totalTopics || 0} Topics</Badge>
            <Badge variant="success">{data.completedTopics || 0} Completed</Badge>
            <span className="text-sm text-gray-500">{Math.round(data.progress || 0)}% Complete</span>
          </div>
          <div className="mt-3 w-full md:w-96">
            <ProgressBar progress={data.progress || 0} showLabel label="Overall Progress" />
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={({ className }) => <i className={`fas fa-search ${className}`} />}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilter(diff)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${filter === diff 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {diff === 'all' ? 'All' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div>
        <SectionTitle 
          title="Topics" 
          subtitle={`${filteredTopics.length} topics available`}
        />
        {filteredTopics.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500">No topics found matching your criteria</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => {
              // Ensure each topic has an ID
              const topicWithId = {
                ...topic,
                id: topic.id || topic.name // Fallback to name if no ID
              };
              return (
                <TopicCard 
                  key={topicWithId.id} 
                  topic={topicWithId} 
                  subjectId={data.id}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subject;