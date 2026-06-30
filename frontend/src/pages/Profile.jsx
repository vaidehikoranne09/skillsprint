import React from 'react';
import { useProfileData } from '../hooks/useData';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import SectionTitle from '../components/ui/SectionTitle';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user } = useAuth();
  const { data, loading } = useProfileData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, achievements, badges, subjectProgress, recentTests } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="text-center">
        <img
          src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff&size=200'}
          alt={user?.name}
          className="w-28 h-28 rounded-full mx-auto border-4 border-primary-500"
        />
        <h1 className="text-2xl font-bold text-gray-900 mt-4">{user?.name || 'User'}</h1>
        <p className="text-gray-500">{user?.email || 'user@email.com'}</p>
        <p className="text-sm text-gray-400 mt-1">
          Member since {new Date(user?.joinedAt || Date.now()).toLocaleDateString()}
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge variant="success">Active</Badge>
          <Badge variant="info">{stats.totalQuestions} Questions</Badge>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value={stats.overallProgress} label="Overall Progress" suffix="%" />
        <StatCard value={stats.accuracy} label="Accuracy" suffix="%" />
        <StatCard value={stats.currentStreak} label="Current Streak" suffix=" days" />
        <StatCard value={stats.testsTaken} label="Tests Taken" />
      </div>

      {/* Subject Progress */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Subject Progress</h3>
        <div className="space-y-4">
          {subjectProgress.map((subject) => (
            <div key={subject.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{subject.name}</span>
                <span className="font-semibold" style={{ color: subject.color }}>
                  {subject.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all"
                  style={{ 
                    width: `${subject.progress}%`,
                    backgroundColor: subject.color 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements & Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-4 p-3 rounded-xl ${
                  achievement.unlocked ? 'bg-gray-50' : 'bg-gray-100 opacity-60'
                }`}
              >
                <span className="text-3xl">{achievement.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{achievement.title}</p>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <Badge variant="success" size="sm" className="ml-auto">Unlocked</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎖️ Badges</h3>
          <div className="flex flex-wrap gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: badge.color + '20' }}
                >
                  {badge.icon}
                </div>
                <p className="text-sm font-medium text-gray-700 mt-2">{badge.name}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Tests */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📝 Recent Tests</h3>
          <Button variant="secondary" size="sm">View All</Button>
        </div>
        <div className="space-y-3">
          {recentTests.map((test) => (
            <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{test.name}</p>
                <p className="text-sm text-gray-500">{test.date}</p>
              </div>
              <Badge variant={test.score >= 80 ? 'success' : test.score >= 60 ? 'warning' : 'danger'}>
                {test.score}%
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-4">
        <Button>
          <i className="fas fa-cog mr-2" /> Settings
        </Button>
        <Button variant="secondary">
          <i className="fas fa-download mr-2" /> Download Report
        </Button>
      </div>
    </div>
  );
};

// Helper StatCard component for Profile page
const StatCard = ({ value, label, suffix = '' }) => (
  <Card className="text-center">
    <p className="text-2xl font-bold text-gray-900">{value}{suffix}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </Card>
);

export default Profile;