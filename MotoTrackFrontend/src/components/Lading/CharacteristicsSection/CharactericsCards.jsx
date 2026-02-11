import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Card } from 'antd';
import { motion } from 'framer-motion';
import Lottie from "lottie-react";
import AnalyticsAnimation from "../../../assets/Lading/Characteristics/analytics.json";
import DataUsageAnimation from "../../../assets/Lading/Characteristics/Data Usage-2.json";
import FileFoldAnimation from "../../../assets/Lading/Characteristics/file and folder.json";
import GDPRAnimation from "../../../assets/Lading/Characteristics/GDPR-2.json";
import NotificationAnimation from "../../../assets/Lading/Characteristics/notification.json";
import SecurityAnimation from "../../../assets/Lading/Characteristics/Security.json";
import TimeAnimation from "../../../assets/Lading/Characteristics/time.json";
import ValidationAnimation from "../../../assets/Lading/Characteristics/Validation.json";

// Create a motion version of Card first
const MotionCard = motion.create(Card);

// Then style the motion component
const StyledCard = styled(MotionCard)`
  width: clamp(260px, 25vw, 320px);
  height: clamp(150px, 16vw, 180px);
  margin: clamp(6px, 1vw, 12px);
  border-radius: 20px;
  background: ${props => props.$isHovered 
    ? 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFE 50%, #F7F6FF 100%)'
    : 'white'};
  box-shadow: ${props => props.$isHovered
    ? '0 4px 16px rgba(167,159,254,0.1)'
    : '0 4px 16px rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;
  
  .ant-card-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: clamp(12px, 2vw, 20px);
    height: 100%;
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    width: 260px; /* Tamaño fijo en móviles para mejor visualización */
    height: 150px;
  }
`;

const ShineEffect = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.15; // Reduced from 0.3 to 0.15
  pointer-events: none;
  background: ${props => `radial-gradient(
    circle at ${props.$mouseX}px ${props.$mouseY}px,
    rgba(167,159,254,0.5) 0%,
    rgba(167,159,254,0) 60%
  )`};
`;

const IconWrapper = styled.div`
  width: clamp(36px, 4vw, 48px);
  height: clamp(36px, 4vw, 48px);
  border-radius: 50%;
  background: ${props => props.$isHovered 
    ? 'rgba(99, 91, 255, 0.12)'
    : 'rgba(99, 91, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: clamp(8px, 1vw, 12px);
  transition: all 0.3s ease;
  transform: ${props => props.$isHovered ? 'scale(1.05)' : 'scale(1)'};
`;

const StyledLottie = styled(Lottie)`
  width: clamp(22px, 2.5vw, 28px);
  height: clamp(22px, 2.5vw, 28px);
  object-fit: contain;
`;

const Title = styled.h3`
  font-size: clamp(14px, 1.6vw, 16px);
  font-weight: 600;
  color: ${props => props.$isHovered ? '#5F5999' : '#1F2937'};
  margin: 0 0 clamp(4px, 0.6vw, 6px) 0;
  transition: color 0.3s ease;
`;

const Description = styled.p`
  font-size: clamp(11px, 1.3vw, 13px);
  color: ${props => props.$isHovered ? '#7A73A8' : '#6B7280'};
  margin: 0;
  line-height: 1.4;
  transition: color 0.3s ease;
  
  @media (max-width: 480px) {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const characteristics = [
  {
    icon: <StyledLottie animationData={ValidationAnimation} loop={true} />,
    title: "Validación Automática",
    description: "Sistema inteligente de verificación de documentos y datos."
  },
  {
    icon: <StyledLottie animationData={TimeAnimation} loop={true} />,
    title: "Consulta en Tiempo Real",
    description: "Verifica el estado de tu registro y accede a tu información al instante."
  },
  {
    icon: <StyledLottie animationData={SecurityAnimation} loop={true} />,
    title: "Mayor Seguridad",
    description: "Facilita la identificación de motocicletas robadas o irregulares."
  },
  {
    icon: <StyledLottie animationData={NotificationAnimation} loop={true} />,
    title: "Notificaciones Instantáneas",
    description: "Recibe alertas sobre tu registro y vencimientos."
  },
  {
    icon: <StyledLottie animationData={FileFoldAnimation} loop={true} />,
    title: "Gestión Documental",
    description: "Almacenamiento seguro de todos los documentos relacionados con tu registro"
  },
  {
    icon: <StyledLottie animationData={DataUsageAnimation} loop={true} />,
    title: "Consulta en Tiempo Real",
    description: "Verifica el estado de tu registro y accede a tu información al instante."
  },
  {
    icon: <StyledLottie animationData={AnalyticsAnimation} loop={true} />,
    title: "Estadísticas y Reportes",
    description: "Análisis detallado para la toma de decisiones municipales."
  },
  {
    icon: <StyledLottie animationData={GDPRAnimation} loop={true} />,
    title: "Protección de Datos",
    description: "Máxima seguridad en el manejo de información personal y documentos."
  }
];

// Define card animation variants
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

function CharactericsCards({ className }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRefs = useRef([]);

  const handleMouseMove = (e, index) => {
    if (cardRefs.current[index]) {
      const rect = cardRefs.current[index].getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className={className}>
      {characteristics.map((item, index) => (
        <StyledCard
          key={index}
          ref={el => cardRefs.current[index] = el}
          $isHovered={hoveredIndex === index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={(e) => handleMouseMove(e, index)}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          {hoveredIndex === index && (
            <ShineEffect
              $mouseX={mousePosition.x}
              $mouseY={mousePosition.y}
            />
          )}
          <IconWrapper $isHovered={hoveredIndex === index}>
            {item.icon}
          </IconWrapper>
          <Title $isHovered={hoveredIndex === index}>
            {item.title}
          </Title>
          <Description $isHovered={hoveredIndex === index}>
            {item.description}
          </Description>
        </StyledCard>
      ))}
    </div>
  );
}

export default CharactericsCards;