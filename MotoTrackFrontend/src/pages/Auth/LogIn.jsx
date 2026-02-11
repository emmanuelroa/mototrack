import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Typography } from 'antd';
import { motion } from 'framer-motion'; // Import framer-motion
import SideImage from '../../components/Auth/SideImage';
import Input from '../../components/Auth/Input';
import Button from '../../components/Auth/Button';
import MotoTrackLogo from '../../assets/Lading/MotoTrackLogo-2.png';
import { useAuth } from '../../context/AuthContext';

const { Title, Text, Paragraph } = Typography;

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3, // Más rápido (antes 0.6)
      when: "beforeChildren",
      staggerChildren: 0.08, // Más rápido (antes 0.2)
    },
  },
  exit: { 
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2 }
  }
};

const itemVariants = {
  initial: { y: 15, opacity: 0 }, // Menor distancia (antes 20)
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 180, // Más rápido (antes 100)
      damping: 8, // Más rebote (antes 12)
      mass: 0.6 // Añadido para más velocidad
    }
  },
};

const sideImageVariants = {
  initial: { x: -50, opacity: 0 }, // Menor distancia (antes -100)
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120, // Más rápido (antes 50)
      damping: 12, // Más rebote (antes 20)
      duration: 0.5, // Más rápido (antes 0.8)
      mass: 0.8 // Añadido para controlar velocidad
    }
  },
};



const logoVariants = {
  initial: { scale: 0.7, opacity: 0, rotate: -5 },
  animate: { 
    scale: 1, 
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 8,
      delay: 0.1
    }
  }
};

// Wrap components with motion
const PageContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Prevent overflow */
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const SideImageContainer = styled(motion.div)`
  height: 100%;
  position: relative;
  
  @media (max-width: 768px) {
    display: none; /* Hide the side image on mobile */
  }
`;

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  height: 100%;
  max-height: 100vh;
  overflow-y: auto; /* Allow scrolling on mobile */
  
  @media (max-width: 768px) {
    padding: 20px;
    justify-content: flex-start;
    padding-top: 40px;
  }
`;

const LogoContainer = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const Logo = styled(motion.img)`
  height: 160px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    height: 120px;
    margin-bottom: 20px;
  }
`;

const StyledTitle = styled(motion(Title))`
  font-size: 3rem !important;
  text-align: center;
  line-height: 1.2 !important;
  font-weight: 600;
  margin-bottom: 20px !important;
  
  @media (max-width: 768px) {
    font-size: 2.2rem !important;
    margin-bottom: 10px !important;
  }
`;

const BrandSpan = styled.span`
  color: #635BFF;
  font-weight: 700;
  display: inline-block;
`;

const LoginForm = styled(motion.form)`
  width: 100%;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const StyledParagraph = styled(Paragraph)`
  margin-top: 20px !important;
  font-size: 18px !important;
  text-align: center;
  width: 100%;
  
  @media (max-width: 768px) {
    font-size: 16px !important;
    margin-top: 15px !important;
  }
`;

const StyledLink = styled(Link)`
  color: #635BFF !important;
  text-decoration: none;
  font-weight: 600;
  font-size: 18px;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ErrorMessage = styled(Text)`
  color: #ff4d4f !important;
  font-size: 14px !important;
  display: block;
  margin-top: 5px;
  margin-bottom: 0px;
  width: 100%;
  
  @media (max-width: 768px) {
    font-size: 12px !important;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`;

const FullWidthButton = styled(Button)`
  width: 100% !important; /* Asegura que ocupe el ancho completo */
  padding: 15px 40px !important;
  font-size: 18px !important;
  height: auto !important;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(99, 91, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(99, 91, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 12px 20px !important;
    font-size: 16px !important;
  }
`;

const LargerInput = styled(Input)`
  width: 100% !important;
  margin-bottom: 15px !important; /* Reduced for more consistent spacing */
  
  .ant-input, .ant-input-password {
    font-size: 16px;
    height: 55px;
    padding: 12px;
    display: flex;
    align-items: center;
    width: 100%;
    
    @media (max-width: 768px) {
      height: 50px;
      font-size: 14px;
    }
  }
  
  .ant-input-password .ant-input {
    height: auto;
    padding: 0;
  }
  
  .ant-input-affix-wrapper {
    height: 55px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    width: 100%;
    
    @media (max-width: 768px) {
      height: 50px;
    }
  }
  
  label {
    font-size: 18px;
    margin-bottom: 10px;
    width: 100%;
    
    @media (max-width: 768px) {
      font-size: 16px;
      margin-bottom: 8px;
    }
  }
`;

const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 30px; /* Increased from 20px to create more space between input groups */
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

// Add this new component for mobile-only back button
const MobileHeader = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 20px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #635BFF;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  &:before {
    content: "←";
    margin-right: 8px;
    font-size: 18px;
  }
`;

function LogIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const user = login(formData.email, formData.password);
      if (!user) {
        setErrors(prevErrors => ({
          ...prevErrors,
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        }));
      }
    }
  };

  const navigateToHome = () => {
    window.location.href = '/';
  };

  return (
    <PageContainer
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <SideImageContainer
        variants={sideImageVariants}
      >
        <SideImage type="login" />
      </SideImageContainer>
      
      <FormContainer
        variants={itemVariants}
      >
        <MobileHeader>
          <BackButton onClick={navigateToHome}>Inicio</BackButton>
        </MobileHeader>
        
        <LogoContainer>
          <Logo 
            src={MotoTrackLogo} 
            alt="MotoTrack Logo" 
            variants={logoVariants}
            initial="initial"
            animate="animate"
          />
          <StyledTitle 
            level={1}
            variants={itemVariants}
          >
            ¡Hola! Bienvenido a <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.2, duration: 0.2 } 
              }}
            ><BrandSpan>MotoTrack</BrandSpan></motion.span>
          </StyledTitle>
        </LogoContainer>
        
        <LoginForm 
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <InputGroup>
              <LargerInput 
                title="Email"
                placeholder="IliaOwnsVolk@gmail.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <ErrorMessage type="danger">{errors.email}</ErrorMessage>}
            </InputGroup>
          </motion.div>
          
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <InputGroup>
              <LargerInput 
                title="Contraseña"
                placeholder="********"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <ErrorMessage type="danger">{errors.password}</ErrorMessage>}
            </InputGroup>
          </motion.div>
          
          <motion.div 
            style={{ width: '100%' }}
         
            whileHover="hover"
            whileTap="tap"
          >
            <ButtonContainer>
              <FullWidthButton 
                size="large" 
                htmlType="submit"
              >
                Iniciar sesión
              </FullWidthButton>
            </ButtonContainer>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: 0.3, 
                duration: 0.2 
              }
            }}
          >
            <StyledParagraph>
              ¿Nuevo por aquí? <StyledLink to="/register">Crea una cuenta</StyledLink>
            </StyledParagraph>
          </motion.div>
        </LoginForm>
      </FormContainer>
    </PageContainer>
  );
}

export default LogIn;