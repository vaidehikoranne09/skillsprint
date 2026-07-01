import { questionApi } from './api';

class DataService {
  constructor() {
    this.questions = [];
    this.subjects = [];
    this.isLoaded = false;
  }

  // Load all data from backend API
  async loadAllData() {
    if (this.isLoaded) return this.getStructuredData();

    try {
      // Fetch subjects
      const subjectsResponse = await questionApi.getSubjects();
      this.subjects = subjectsResponse.data;
      
      // Fetch topics for each subject
      const structuredSubjects = await Promise.all(
        this.subjects.map(async (subject) => {
          const topicsResponse = await questionApi.getTopics(subject.name);
          return {
            ...subject,
            topics: topicsResponse.data.topics || []
          };
        })
      );
      
      this.subjects = structuredSubjects;
      this.isLoaded = true;
      
      return this.getStructuredData();
    } catch (error) {
      console.error('Error loading data from API:', error);
      return this.getFallbackData();
    }
  }

  // Load practice questions
  async getPracticeQuestions(subject, topic, subtopic, difficulty, limit = 10) {
    try {
      const response = await questionApi.getPracticeQuestions({
        subject,
        topic,
        subtopic,
        difficulty,
        limit
      });
      return response.data.questions || [];
    } catch (error) {
      console.error('Error loading practice questions:', error);
      return [];
    }
  }

  // Get structured data for UI
  getStructuredData() {
    return {
      subjects: this.subjects.map((subject, subjectIndex) => ({
        id: subject.id || subjectIndex + 1,
        name: subject.name,
        icon: subject.icon || this.getSubjectIcon(subject.name),
        description:
          subject.description || this.getSubjectDescription(subject.name),
        totalQuestions: subject.total_questions || subject.totalQuestions || 0,
        progress: subject.progress || 0,

        topics: (subject.topics || []).map((topic, topicIndex) => ({
          id: topic.id || topicIndex + 1,
          name: topic.name,
          description:
            topic.description || `Practice ${topic.name} questions`,
          totalQuestions: topic.total_questions || topic.totalQuestions || 0,
          progress: topic.progress || 0,

          subtopics: (topic.subtopics || []).map(
            (subtopic, subtopicIndex) => ({
              id: subtopic.id || subtopicIndex + 1,
              name: subtopic.name,
              totalQuestions:
                subtopic.total_questions || subtopic.totalQuestions || 0,
              progress: subtopic.progress || 0,
              difficulty: subtopic.difficulty || "Medium",
              questions: subtopic.questions || [],
            })
          ),
        })),
      })),

      questions: this.questions,
    };
  }

  // Fallback data if API fails
  getFallbackData() {
    return import('../data/dummyData.js').then(module => module.dashboardData);
  }
}

const dataService = new DataService();
export default dataService;