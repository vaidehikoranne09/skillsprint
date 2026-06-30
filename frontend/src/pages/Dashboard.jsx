import React from 'react';
import { useDashboardData } from '../hooks/useData';
import { useAuth } from '../context/AuthContext';
import SubjectCard from '../components/dashboard/SubjectCard';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import ContinueLearning from '../components/dashboard/ContinueLearning';
import StatCard from '../components/cards/StatCard';
import Card from '../components/ui/Card';
import SectionTitle from '../components/ui/SectionTitle';
import Badge from '../components/ui/Badge';

const Dashboard = () => {
  const { user } = useAuth();
  const { data, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { subjects, stats, continueLearning, strongTopics, weakTopics, recentActivity } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <WelcomeBanner user={user} />

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard 
          icon="fa-bullseye" 
          title="Overall Accuracy" 
          value={`${stats.overallAccuracy}%`} 
          color="primary"
          trend={5}
        />
        <StatCard 
          icon="fa-check-circle" 
          title="Topics Completed" 
          value={stats.topicsCompleted} 
          color="green"
          trend={3}
        />
        <StatCard 
          icon="fa-clock" 
          title="Practice Time" 
          value={stats.practiceTime} 
          color="purple"
        />
        <StatCard 
          icon="fa-file-alt" 
          title="Tests Taken" 
          value={stats.testsTaken} 
          color="blue"
          trend={2}
        />
        <StatCard 
          icon="fa-fire" 
          title="Daily Streak" 
          value={`${stats.dailyStreak} days`} 
          color="orange"
          trend={-1}
        />
      </div>

      {/* Continue Learning */}
      <ContinueLearning data={continueLearning} />

      {/* Subjects Grid */}
      <div>
        <SectionTitle 
          title="Your Subjects" 
          subtitle="Continue your learning journey" 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>

      {/* Strong & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-green-200 bg-green-50/30">
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
            <span>💪</span> Strong Topics
          </h3>
          <div className="space-y-3">
            {strongTopics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-green-200">
                <div>
                  <p className="font-medium text-gray-900">{topic.name}</p>
                  <p className="text-sm text-gray-500">{topic.subject}</p>
                </div>
                <span className="text-green-600 font-bold text-lg">{topic.score}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-2 border-red-200 bg-red-50/30">
          <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
            <span>🎯</span> Areas to Improve
          </h3>
          <div className="space-y-3">
            {weakTopics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-red-200">
                <div>
                  <p className="font-medium text-gray-900">{topic.name}</p>
                  <p className="text-sm text-gray-500">{topic.subject}</p>
                </div>
                <span className="text-red-600 font-bold text-lg">{topic.score}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <SectionTitle title="Recent Activity" />
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <i className={`fas ${activity.icon || 'fa-clock'}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              <Badge variant="gray" size="sm">{activity.type}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;