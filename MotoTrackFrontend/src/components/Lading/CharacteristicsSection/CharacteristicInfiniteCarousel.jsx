import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CharactericsCards from './CharactericsCards';

const CarouselContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  background: transparent;
  padding: clamp(20px, 4vw, 40px) 0;
  display: flex;
  flex-direction: column;
  gap: clamp(15px, 3vw, 30px);
`;

const CarouselTrack = styled(motion.div)`
  display: flex;
  width: fit-content;
`;

const StyledCharactericsCards = styled(motion(CharactericsCards))`
  display: flex;
  gap: clamp(10px, 2vw, 20px);
  &:hover {
    cursor: pointer;
  }
`;

const Platform = styled.div`
  width: 100%;
  overflow: hidden;
  
  &:nth-child(2) ${CarouselTrack} {
    margin-left: clamp(-50px, -8vw, -100px); // Offset responsive
  }
  
  @media (max-width: 768px) {
    &:nth-child(2) ${CarouselTrack} {
      margin-left: -30px; // Menor offset en móviles
    }
  }
`;

// Add container variants for appearance animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Add row variants
const rowVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.03
    }
  }
};

function CharacteristicInfiniteCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(40);
  const topControls = useAnimation();
  const bottomControls = useAnimation();
  const appearanceControls = useAnimation();
  
  // Use intersection observer to trigger appearance animation
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      appearanceControls.start("visible");
    }
  }, [appearanceControls, inView]);

  // Ajusta la velocidad según el ancho de pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Más rápido en móviles para compensar el menor espacio
      setAnimationDuration(width < 768 ? 20 : 40);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startAnimation = async () => {
    await Promise.all([
      topControls.start({
        x: [0, -1800],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: animationDuration,
            ease: "linear",
          },
        },
      }),
      bottomControls.start({
        x: [-1800, 0],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: animationDuration,
            ease: "linear",
          },
        },
      }),
    ]);
  };

  useEffect(() => {
    if (!isPaused) {
      startAnimation();
    }
    return () => {
      topControls.stop();
      bottomControls.stop();
    };
  }, [isPaused, animationDuration]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  return (
    <CarouselContainer
      as={motion.div}
      ref={ref}
      initial="hidden"
      animate={appearanceControls}
      variants={containerVariants}
    >
      <Platform as={motion.div} variants={rowVariants}>
        <CarouselTrack
          animate={topControls}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          variants={rowVariants}
        >
          <StyledCharactericsCards variants={rowVariants} />
          <StyledCharactericsCards variants={rowVariants} />
        </CarouselTrack>
      </Platform>

      <Platform as={motion.div} variants={rowVariants}>
        <CarouselTrack
          animate={bottomControls}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          variants={rowVariants}
        >
          <StyledCharactericsCards variants={rowVariants} />
          <StyledCharactericsCards variants={rowVariants} />
        </CarouselTrack>
      </Platform>
    </CarouselContainer>
  );
}

export default CharacteristicInfiniteCarousel;