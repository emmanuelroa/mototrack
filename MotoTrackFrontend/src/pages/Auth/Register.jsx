import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Typography, Checkbox } from 'antd';
import { motion } from 'framer-motion'; // Import framer-motion
import SideImage from '../../components/Auth/SideImage';
import Input from '../../components/Auth/Input';
import Button from '../../components/Auth/Button';
import MotoTrackLogo from '../../assets/Lading/MotoTrackLogo-2.png';

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
      staggerChildren: 0.06, // Más rápido (antes 0.15)
    },
  },
  exit: { 
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2 }
  }
};

const itemVariants = {
  initial: { y: 15, opacity: 0 }, // Menor distancia (antes 30)
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 180, // Más rápido (antes 100)
      damping: 6, // Más rebote (antes 10)
      mass: 0.5 // Masa más ligera = movimiento más rápido
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
      damping: 12, // Más control (antes 20)
      duration: 0.5, // Más rápido (antes 0.8)
      mass: 0.8 // Añadido para control
    }
  },
};

// Añadir animaciones especiales para inputs y botón
const inputRowVariants = {
  initial: { opacity: 0, x: -5 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring",
      stiffness: 150,
      damping: 8
    }
  }
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
      damping: 6,
      delay: 0.05
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
  overflow: hidden;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const SideImageContainer = styled(motion.div)`
  height: 100%;
  position: relative;
  max-height: 100vh;
  overflow: hidden;
  
  @media (max-width: 768px) {
    display: none;
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
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 20px;
    justify-content: flex-start;
    padding-top: 40px;
  }
`;

const LogoContainer = styled(motion.div)`
  text-align: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Logo = styled(motion.img)`
  height: 160px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    height: 100px;
    margin-bottom: 15px;
  }
`;

const StyledTitle = styled(motion(Title))`
  font-size: 2.8rem !important;
  text-align: center;
  line-height: 1.2 !important;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 2rem !important;
    margin-bottom: 10px !important;
  }
`;

const BrandSpan = styled.span`
  color: #635BFF;
  font-weight: 700;
  display: inline-block;
`;

const RegisterForm = styled(motion.form)`
  width: 100%;
  max-width: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  overflow: visible;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const InputRow = styled(motion.div)`
  display: flex;
  gap: 20px;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
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
  margin-top: 2px; /* Reducido de 5px */
  margin-bottom: 8px; /* Añadido para separación consistente */
  width: 100%;
  
  @media (max-width: 768px) {
    font-size: 12px !important;
    margin-bottom: 6px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`;

const FullWidthButton = styled(Button)`
  width: 100% !important;
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
  margin-bottom: 6px !important; /* Reducido para que los mensajes de error no creen tanto espacio */
  
  .ant-input, .ant-input-password {
    font-size: 16px;
    height: 45px; /* Cambia este valor al que prefieras */
    padding: 10px 12px;
    display: flex;
    align-items: center;
    width: 100%;
    
    @media (max-width: 768px) {
      height: 45px;
      font-size: 14px;
    }
  }
  
  .ant-input-affix-wrapper {
    height: 45px; /* Cambia este valor para ajustar la altura del contenedor del input de contraseña */
    padding: 0 12px;
    display: flex;
    align-items: center;
    width: 100%;
    
    @media (max-width: 768px) {
      height: 45px;
    }
  }
  
  .ant-input-password .ant-input {
    height: 100%; /* Esto asegura que el input interno tenga la misma altura */
    padding: 0;
  }
  
  label {
    font-size: 16px;
    margin-bottom: 6px; /* Consistente */
    display: block; /* Asegura que ocupe su propio espacio */
    width: 100%;
    
    @media (max-width: 768px) {
      font-size: 15px;
      margin-bottom: 4px;
    }
  }
`;

const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 24px; /* Más consistente */
  
  &:last-child {
    margin-bottom: 16px; /* Menor margen para el último grupo */
  }
  
  @media (max-width: 768px) {
    margin-bottom: 18px;
  }
`;

const CheckboxContainer = styled.div`
  width: 100%;
  margin-top: 0px;
  margin-bottom: 10px; /* Reducido de 15px */
  display: flex;
  align-items: center;
`;

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #635BFF;
    border-color: #635BFF;
  }
  
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #635BFF;
    background-color: rgba(99, 91, 255, 0.1); /* Fondo púrpura con baja opacidad en hover */
  }
  
  /* Efecto hover para checkbox ya marcado */
  .ant-checkbox-checked:hover .ant-checkbox-inner {
    background-color: rgba(99, 91, 255, 0.8); /* Púrpura más translúcido cuando ya está marcado */
    border-color: #635BFF;
  }
  
  .ant-checkbox-checked::after {
    border-color: #635BFF;
  }
  
  /* Efecto hover para el texto */
  &:hover {
    span:last-child {
      color: #635BFF;
    }
  }
  
  span {
    font-size: 16px;
    transition: color 0.3s ease;
    
    @media (max-width: 768px) {
      font-size: 14px;
    }
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

// Modified to allow scrolling
const GlobalStyles = createGlobalStyle`
  body, html {
    overflow: auto;
  }
`;

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
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
    const newErrors = { 
      firstName: '', 
      lastName: '', 
      email: '', 
      password: '', 
      confirmPassword: '',
      agreeToTerms: ''
    };
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
      valid = false;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
      valid = false;
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar la contraseña es requerido';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      valid = false;
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Debes aceptar los términos y condiciones';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Handle registration logic here
      console.log('Registration attempt with:', formData);
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
      <GlobalStyles />
      
      <SideImageContainer
        variants={sideImageVariants}
      >
        <SideImage type="register" />
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
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.15, duration: 0.2 } 
              }}
            >
              Crear Cuenta
            </motion.span>
          </StyledTitle>
        </LogoContainer>
        
        <RegisterForm 
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <InputGroup>
              <InputRow variants={inputRowVariants}>
                <motion.div style={{ flex: 1 }} variants={inputRowVariants}>
                  <LargerInput 
                    title="Nombre"
                    placeholder="Ilia"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && <ErrorMessage type="danger">{errors.firstName}</ErrorMessage>}
                </motion.div>
                
                <motion.div style={{ flex: 1 }} variants={inputRowVariants}>
                  <LargerInput 
                    title="Apellido"
                    placeholder="Topuria"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && <ErrorMessage type="danger">{errors.lastName}</ErrorMessage>}
                </motion.div>
              </InputRow>
            </InputGroup>
          </motion.div>
          
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
              <InputRow>
                <div style={{ flex: 1 }}>
                  <LargerInput 
                    title="Contraseña"
                    placeholder="********"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <ErrorMessage type="danger">{errors.password}</ErrorMessage>}
                </div>
                
                <div style={{ flex: 1 }}>
                  <LargerInput 
                    title="Confirmar Contraseña"
                    placeholder="********"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && <ErrorMessage type="danger">{errors.confirmPassword}</ErrorMessage>}
                </div>
              </InputRow>
            </InputGroup>
          </motion.div>
          
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <CheckboxContainer>
              <StyledCheckbox 
                name="agreeToTerms" 
                checked={formData.agreeToTerms}
                onChange={handleChange}
              >
                Acepto los Términos y Condiciones
              </StyledCheckbox>
            </CheckboxContainer>
            {errors.agreeToTerms && <ErrorMessage type="danger">{errors.agreeToTerms}</ErrorMessage>}
          </motion.div>
          
          <motion.div 
            style={{ width: '100%' }}
         
            whileHover="hover"
            whileTap="tap"
          >
            <ButtonContainer>
              <FullWidthButton size="large" htmlType="submit">
                Registrarse
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
                delay: 0.25, 
                duration: 0.2 
              }
            }}
          >
            <StyledParagraph>
              ¿Ya tienes una cuenta? <StyledLink to="/login">Inicia sesión</StyledLink>
            </StyledParagraph>
          </motion.div>
        </RegisterForm>
      </FormContainer>
    </PageContainer>
  );
}

export default Register;