import { useState, useEffect } from 'react';
import { 
  dashboardData, 
  subjectData, 
  topicData, 
  practiceQuestions, 
  resultData,
  profileData 
} from '../data/dummyData';

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(dashboardData);
      setLoading(false);
    }, 500);
  }, []);

  return { data, loading };
};

export const useSubjectData = (subjectId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(subjectData);
      setLoading(false);
    }, 500);
  }, [subjectId]);

  return { data, loading };
};

export const useTopicData = (topicId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(topicData);
      setLoading(false);
    }, 500);
  }, [topicId]);

  return { data, loading };
};

export const usePracticeQuestions = (topicId, difficulty) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(practiceQuestions);
      setLoading(false);
    }, 500);
  }, [topicId, difficulty]);

  return { data, loading };
};

export const useResultData = (practiceId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(resultData);
      setLoading(false);
    }, 500);
  }, [practiceId]);

  return { data, loading };
};

export const useProfileData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(profileData);
      setLoading(false);
    }, 500);
  }, []);

  return { data, loading };
};