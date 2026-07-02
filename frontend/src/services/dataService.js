import { questionApi } from './api';
import { dashboardData } from '../data/dummyData';

class DataService {
  constructor() {
    this.questions = [];
    this.isLoaded = false;
    this.subjects = {};
  }

  async loadAllData() {
    if (this.isLoaded) return this.getStructuredData();

    try {
      console.log('📊 Loading data from backend API...');
      
      const subjectsResponse = await questionApi.getSubjects();
      console.log('📊 Subjects API response:', subjectsResponse.data);
      
      let subjectsData = [];
      if (Array.isArray(subjectsResponse.data)) {
        subjectsData = subjectsResponse.data;
      } else if (typeof subjectsResponse.data === 'object') {
        subjectsData = Object.values(subjectsResponse.data);
      }
      
      if (subjectsData.length === 0) {
        console.warn('⚠️ No subjects found, using fallback');
        return this.getFallbackData();
      }
      
      this.subjects = {};
      
      for (const subject of subjectsData) {
        const subjectName = subject.name || 'Unknown';
        console.log(`📊 Processing subject: ${subjectName}`);
        
        let topicsList = [];
        try {
          const topicsResponse = await questionApi.getTopics(subjectName);
          console.log(`📊 Topics for ${subjectName}:`, topicsResponse.data);
          
          if (topicsResponse.data && Array.isArray(topicsResponse.data.topics)) {
            topicsList = topicsResponse.data.topics;
          } else if (Array.isArray(topicsResponse.data)) {
            topicsList = topicsResponse.data;
          }
        } catch (error) {
          console.error(`Error fetching topics for ${subjectName}:`, error);
        }
        
        this.subjects[subjectName] = {
          id: Object.keys(this.subjects).length + 1,
          name: subjectName,
          icon: subject.icon || this.getSubjectIcon(subjectName),
          description: subject.description || this.getSubjectDescription(subjectName),
          color: subject.color || '#7c3aed',
          totalQuestions: subject.total_questions || subject.totalQuestions || 0,
          topics_count: topicsList.length,
          progress: 0,
          topics: {}
        };
        
        for (const topic of topicsList) {
          const topicName = topic.name || 'General';
          this.subjects[subjectName].topics[topicName] = {
            id: Object.keys(this.subjects[subjectName].topics).length + 1,
            name: topicName,
            totalQuestions: topic.total_questions || topic.totalQuestions || 0,
            progress: 0,
            description: topic.description || `Practice ${topicName} questions`,
            icon: topic.icon || '📚',
            subtopics: {}
          };
          
          const subtopics = topic.subtopics || [];
          for (const subtopic of subtopics) {
            const subtopicName = subtopic.name || 'General';
            this.subjects[subjectName].topics[topicName].subtopics[subtopicName] = {
              id: Object.keys(this.subjects[subjectName].topics[topicName].subtopics).length + 1,
              name: subtopicName,
              totalQuestions: subtopic.total_questions || subtopic.totalQuestions || 0,
              progress: 0,
              difficulty: subtopic.difficulty || 'Medium',
              questions: []
            };
          }
        }
      }
      
      console.log('📊 Subjects built:', Object.keys(this.subjects));
      this.isLoaded = true;
      return this.getStructuredData();
      
    } catch (error) {
      console.error('❌ Error loading data:', error);
      return this.getFallbackData();
    }
  }

  getStructuredData() {
    const subjects = Object.values(this.subjects).map(s => ({
      ...s,
      topics: Object.values(s.topics).map(t => ({
        ...t,
        subtopics: Object.values(t.subtopics)
      }))
    }));
    
    return { subjects, questions: [] };
  }

  getSubjectIcon(subject) {
    const icons = {
      'Arithmetic': 'fa-calculator',
      'Verbal Ability': 'fa-comment-dots',
      'Logical Reasoning': 'fa-brain'
    };
    return icons[subject] || 'fa-book';
  }

  getSubjectDescription(subject) {
    const descriptions = {
      'Arithmetic': 'Master quantitative aptitude with comprehensive topic coverage',
      'Verbal Ability': 'Improve your language skills for placement exams',
      'Logical Reasoning': 'Enhance your logical and analytical thinking abilities'
    };
    return descriptions[subject] || `Practice ${subject} questions`;
  }

  getFallbackData() {
    console.warn('⚠️ Using fallback dummy data');
    const fallbackSubjects = (dashboardData.subjects || []).map(s => ({
      ...s,
      topics: (s.topics || []).map(t => ({
        ...t,
        subtopics: t.subtopics || []
      }))
    }));
    return { subjects: fallbackSubjects, questions: [] };
  }
}

const dataService = new DataService();
export default dataService;