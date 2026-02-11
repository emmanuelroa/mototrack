import React from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import IntroductionSection from '../CommonComponents/IntroductionSection';
import CharacteristicInfiniteCarousel from './CharacteristicInfiniteCarousel';

const SectionContainer = styled(motion.div)`
  width: 100%;
  overflow-x: hidden;
  
  .carousel-container {
    margin-top: clamp(-40px, -6vw, -80px);
  }
  
  @media (max-width: 768px) {
    .carousel-container {
      margin-top: -20px;
    }
  }
`;

// Optimized animation variants for faster appearance
const containerVariants = {
  hidden: { 
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2, // Reduced from 0.4
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.05 // Reduced from 0.1
    }
  }
};

const childVariants = {
  hidden: { 
    opacity: 0,
    y: 10, // Reduced from 20 for subtler movement
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3, // Reduced from 0.5
      ease: "easeInOut" // Changed for faster animation curve
    }
  }
};

const Characteristic = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05, // Lowered threshold to trigger animation earlier
    rootMargin: "-20px 0px" // Changed from -50px to make it trigger sooner
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <SectionContainer
      id="characteristics"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <motion.div variants={childVariants}>
        <IntroductionSection
          sectionName="Características"
          title="Beneficios del Sistema"
          subtitle="Nuestro sistema ofrece múltiples ventajas para ciudadanos y autoridades, 
          mejorando la gestión y control de motocicletas en Santo Domingo."
        />
      </motion.div>

      <motion.div className="carousel-container" variants={childVariants}>
        <CharacteristicInfiniteCarousel />
      </motion.div>
    </SectionContainer>
  );
};

export default Characteristic;
