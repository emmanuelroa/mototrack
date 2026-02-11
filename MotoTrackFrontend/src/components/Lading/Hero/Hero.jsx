import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Hero_Welcome from './Hero_Welcome';
import Hero_ParallexEffect from './Hero_ParallexEffect';

// Create a motion version of the container
const HeroContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: auto;
  place-items: center;
  margin-top: 50px; /* Add space for the fixed navbar */

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 100px;
  }
`;

const ParallaxWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Enhanced animation variants
const containerVariants = {
  hidden: { 
    opacity: 0,
    y: 100  // Starting position from below (increased from 30)
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      when: "beforeChildren",
      staggerChildren: 0.3,
      duration: 1.2  // Slightly longer duration for smoother motion
    }
  }
};

const welcomeVariants = {
  hidden: { y: 60, opacity: 0 },  // Also increased y distance
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
      delay: 0.1  // Small delay for better sequencing
    }
  }
};

// Add animation for parallax wrapper
const parallaxVariants = {
  hidden: { y: 80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 14,
      stiffness: 120,
      delay: 0.2  // Slightly delayed after welcome content
    }
  }
};

function Hero() {
  const [showParallax, setShowParallax] = useState(false);
  
  useEffect(() => {
    // Delay showing the parallax effect until after initial animation
    const timer = setTimeout(() => {
      setShowParallax(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <HeroContainer
      id="hero"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={welcomeVariants}>
        <Hero_Welcome />
      </motion.div>
      <ParallaxWrapper
        variants={parallaxVariants}  // Use the new parallax variants
      >
        <AnimatePresence>
          {showParallax && <Hero_ParallexEffect />}
        </AnimatePresence>
      </ParallaxWrapper>
    </HeroContainer>
  );
}

export default Hero;
