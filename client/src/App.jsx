import logo from './logo.svg';
import './App.css';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import Home from './component/Home';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Courses from './component/Courses';
import Signin from './component/Signin';
import Signup from './component/Signup';
import Contact from './component/Contact';
import VideoPlayer from './component/VideoPlayer';
import UploadVideo from './component/UploadVideo';
import DashBoard from './component/DashBoard';
import Playlist from './component/Playlist';
import CoursePlaylist from './component/CoursePlaylist';
import ShowSearchPlaylist from './component/ShowSearchPlaylist';
import Certificates from './component/Certificates';
import About from './component/About';
import TestPage from './component/TestPage';
import TestResultPage from './component/TestResultPage';
import ScrollToTop from './utils/ScrollToTop';

// This wrapper handles showing/hiding layouts based on the active path
function AppLayout() {
  const location = useLocation();

  // Check if the current path starts with '/test/'
  const isTestPage = location.pathname.startsWith('/test/');

  const isCreatorVerified = sessionStorage.getItem('creatorVerification.access') !== null;

  return (
    <>
      <ScrollToTop />
      {/* Only show Navbar if we are NOT on the test page */}
      {!isTestPage && <Navbar />}



      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/course" element={<Courses />} />
        <Route exact path="/signin" element={<Signin />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/video" element={<VideoPlayer />} />
        <Route
          exact
          path="/uploadvideo"
          element={isCreatorVerified ? <UploadVideo /> : <Navigate to="/dashboard" replace />}
        />
        <Route exact path="/dashboard" element={<DashBoard />} />
        <Route exact path="/playlist/:id" element={<Playlist />} />
        <Route exact path="/courseplaylist/:id" element={<CoursePlaylist />} />
        <Route exact path="/ShowSearchPlaylist" element={<ShowSearchPlaylist />} />
        <Route exact path="/certificate" element={<Certificates />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/test/:assessmentId" element={<TestPage />} />
        <Route exact path="/test-result" element={<TestResultPage />} />
      </Routes>

      {/* Only show Footer if we are NOT on the test page */}
      {!isTestPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;