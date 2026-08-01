import api from "../../utils/api";

// StartCourseTest.jsx
const StartCourseTest = ({ playlistName }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/assessment/start-test', {
        topic: playlistName, // stored in topicOrPlaylistId, also used later as certificate "purpose"
        test_type: 'course_certification'
      });
      navigate(`/test/${res.data.assessmentId}`, {
        state: { questions: res.data.questions, testType: 'course_certification' }
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
      {loading ? 'Preparing your test...' : `Take test for ${playlistName}`}
    </button>
  );
};

export default StartCourseTest;