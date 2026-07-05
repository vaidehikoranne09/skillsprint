import { questionApi } from './api';

class DataService {
  constructor() {
    this.isLoaded = false;
    this.subjects = [];
  }

  async loadAllData() {
    if (this.isLoaded) return this.getStructuredData();

    try {
      console.log('📊 Loading data from backend API...');
      
      // Fetch subjects
      const subjectsResponse = await questionApi.getSubjects();
      console.log('📊 Subjects response:', subjectsResponse.data);
      
      let subjectsList = [];
      if (Array.isArray(subjectsResponse.data)) {
        subjectsList = subjectsResponse.data;
      } else if (typeof subjectsResponse.data === 'object') {
        subjectsList = Object.values(subjectsResponse.data);
      }
      
      // Process each subject with its own topics
      const processedSubjects = [];
      
      for (const subject of subjectsList) {
        const subjectName = subject.name;
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
          console.warn(`⚠️ Could not load topics for ${subjectName}:`, error);
        }
        
        processedSubjects.push({
          id: processedSubjects.length + 1,
          name: subjectName,
          icon: subject.icon || this.getSubjectIcon(subjectName),
          description: subject.description || this.getSubjectDescription(subjectName),
          color: subject.color || '#7c3aed',
          totalQuestions: subject.total_questions || subject.totalQuestions || 0,
          topics: topicsList.map((t, idx) => ({
            id: idx + 1,
            name: t.name || 'General',
            totalQuestions: t.total_questions || t.totalQuestions || 0,
            subtopics: (t.subtopics || []).map((st, stIdx) => ({
              id: stIdx + 1,
              name: st.name || 'General',
              totalQuestions: st.total_questions || st.totalQuestions || 0,
              difficulty: st.difficulty || 'Medium'
            }))
          }))
        });
      }
      
      this.subjects = processedSubjects;
      this.isLoaded = true;
      console.log('✅ Data loaded successfully');
      return this.getStructuredData();
      
    } catch (error) {
      console.error('❌ Error loading data:', error);
      // Return fallback subjects
      return this.getFallbackData();
    }
  }

  getStructuredData() {
    return {
      subjects: this.subjects.map(s => ({
        ...s,
        topics: s.topics || []
      }))
    };
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
      'Arithmetic': 'Master quantitative aptitude',
      'Verbal Ability': 'Improve your language skills',
      'Logical Reasoning': 'Enhance your logical thinking'
    };
    return descriptions[subject] || `Practice ${subject}`;
  }

  getFallbackData() {
    console.warn('⚠️ Using fallback data');
    return {
      subjects: [
        { id: 1, name: 'Arithmetic', icon: 'fa-calculator', topics: [], totalQuestions: 0 },
        { id: 2, name: 'Logical Reasoning', icon: 'fa-brain', topics: [], totalQuestions: 0 },
        { id: 3, name: 'Verbal Ability', icon: 'fa-comment-dots', topics: [], totalQuestions: 0 }
      ]
    };
  }
}

const dataService = new DataService();
export default dataService;