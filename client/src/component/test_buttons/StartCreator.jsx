// StartCreatorTest.jsx
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useState } from "react";


const StartCreatorTest = ({topic}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/assessment/start-test', {
        topic: topic,
        test_type: 'creator_verification'
      });
      navigate(`/test/${res.data.assessmentId}`, {
        state: { questions: res.data.questions, testType: 'creator_verification' }
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Could not start the test.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleStart} disabled={loading}>
      {loading ? 'Preparing your test...' : 'Start creator verification test'}
    </button>
  );
};