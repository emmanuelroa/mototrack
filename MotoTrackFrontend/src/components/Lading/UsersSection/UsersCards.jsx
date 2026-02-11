import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Lottie from 'lottie-react';

// Import JSON animation files
import citizenAnimation from '../../../assets/Lading/Users/Individual-2.json';
import staffAnimation from '../../../assets/Lading/Users/Staff.json';
import adminAnimation from '../../../assets/Lading/Users/Training.json';

const CardsContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  background-color: transparent;
  flex-wrap: wrap;
  width: 1200px;
  
  @media (max-width: 992px) {
    width: 100%;
    padding: 2rem;
  }
`;

const Card = styled(motion.div)`
  width: 380px;
  height: 180px;
  border-radius: 20px;
  background: ${props => props.$isHovered || props.$isSelected
    ? '#1a1a1a'
    : 'transparent'};
  box-shadow: ${props => props.$isHovered || props.$isSelected
    ? '0 4px 20px rgba(99, 91, 255, 0.3)'
    : '0 4px 16px rgba(0, 0, 0, 0.2)'};
  transition: all 0.2s ease; /* Reduced from 0.3s for faster response */
  border: ${props => props.$isSelected ? '2px solid #635BFF' : '1px solid #333'};
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

// Container animation variants
const containerVariants = {
  hidden: { 
    opacity: 0
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.1 // Small stagger for a nice sequence
    }
  }
};

// Card animation variants - optimized for faster appearance with bottom-to-top motion
const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20, // Start from below
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0, // Move up to final position
    scale: 1,
    transition: {
      duration: 0.25, // Very quick animation
      ease: "easeOut" // Smoother easing
    }
  }
};

// Rest of the styled components remain the same
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  margin-left: 24px;
  flex: 1;
  
  @media (max-width: 480px) {
    margin-left: 0;
    margin-top: 16px;
    align-items: center;
    text-align: center;
  }
`;

const ShineEffect = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.15;
  pointer-events: none;
  background: ${props => `radial-gradient(
    circle at ${props.$mouseX}px ${props.$mouseY}px,
    rgba(167, 159, 254, 0.5) 0%,
    rgba(167, 159, 254, 0) 60%
  )`};
`;

const IconWrapper = styled.div`
  min-width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.$isHovered || props.$isSelected
    ? 'rgba(99, 91, 255, 0.25)'
    : 'rgba(255, 255, 255, 0.05)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  transform: ${props => props.$isHovered ? 'scale(1.05)' : 'scale(1)'};
  overflow: hidden;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.$isHovered || props.$isSelected ? '#A7A0FE' : '#FFFFFF'};
  margin: 0 0 8px 0;
  transition: color 0.3s ease;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${props => props.$isHovered || props.$isSelected ? '#C4C0FF' : '#BBBBBB'};
  margin: 0;
  line-height: 1.5;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const UsersCards = ({ selectedCard: externalSelectedCard, onCardSelect }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRefs = useRef([]);
  
  // Add animation controls for better performance
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  // Start animation when component comes into view
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const handleMouseMove = (e, id) => {
    if (cardRefs.current[id]) {
      const rect = cardRefs.current[id].getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleCardClick = (cardId) => {
    onCardSelect(cardId);
  };

  const cards = [
    {
      id: 1,
      title: "Ciudadanos",
      description: "Propietarios que necesitan registrar sus vehiculos y mantener actualizada su información vehicular.",
      animationData: citizenAnimation
    },
    {
      id: 2,
      title: "Empleados",
      description: "Personal que gestiona los registros y trámites, procesando solicitudes y verificando documentación.",
      animationData: staffAnimation
    },
    {
      id: 3,
      title: "Administradores",
      description: "Controlan accesos, permisos y configuración del sistema para garantizar su correcto funcionamiento.",
      animationData: adminAnimation
    }
  ];

  return (
    <CardsContainer
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          ref={el => cardRefs.current[card.id] = el}
          $isSelected={externalSelectedCard === card.id}
          $isHovered={hoveredIndex === card.id}
          onClick={() => handleCardClick(card.id)}
          onMouseEnter={() => setHoveredIndex(card.id)}
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={(e) => handleMouseMove(e, card.id)}
          variants={cardVariants}
          layoutId={`card-${card.id}`}
        >
          {hoveredIndex === card.id && (
            <ShineEffect
              $mouseX={mousePosition.x}
              $mouseY={mousePosition.y}
            />
          )}
          <IconWrapper 
            $isHovered={hoveredIndex === card.id}
            $isSelected={externalSelectedCard === card.id}
          >
            <Lottie 
              animationData={card.animationData}
              loop={externalSelectedCard === card.id}
              autoplay={externalSelectedCard === card.id}
              style={card.id === 1 ? { transform: 'scale(0.8)' } : {}}
            />
          </IconWrapper>
          
          <ContentWrapper>
            <Title 
              $isHovered={hoveredIndex === card.id}
              $isSelected={externalSelectedCard === card.id}
            >
              {card.title}
            </Title>
            <Description 
              $isHovered={hoveredIndex === card.id}
              $isSelected={externalSelectedCard === card.id}
            >
              {card.description}
            </Description>
          </ContentWrapper>
        </Card>
      ))}
    </CardsContainer>
  );
};

export default UsersCards;