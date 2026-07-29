import logo from './logo.svg';
import './App.css';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import Home from './component/Home';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
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

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/course" element={<Courses />} />
          <Route exact path="/signin" element={<Signin />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/video" element={<VideoPlayer />} />
          <Route exact path="/uploadvideo" element={<UploadVideo />} />
          <Route exact path="/dashboard" element={<DashBoard />} />
          <Route exact path="/playlist/:id" element={<Playlist />} />
          <Route exact path="/courseplaylist/:id" element={<CoursePlaylist />} />
          <Route exact path="/ShowSearchPlaylist" element={<ShowSearchPlaylist />} />
          <Route exact path="/certificate" element={<Certificates />} />
          <Route exact path="/about" element={<About />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
