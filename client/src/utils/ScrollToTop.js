import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Adds the smooth scrolling transition animation
    });
  }, [pathname]); // Fires every time the URL path changes

  return null; // This component doesn't render any UI elements
}

export default ScrollToTop;