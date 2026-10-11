import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import splashBg from '../assets/splash_bg.jpg';

const SplashScreen = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Keep the splash screen visible for 3.5 seconds, then fade out
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 3500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-container ${isFading ? 'fade-out' : ''}`}>
      {/* Display the exact provided image with absolutely no HTML overlays */}
      <img src={splashBg} alt="Portex Loading" className="splash-image" />
    </div>
  );
};

export default SplashScreen;
