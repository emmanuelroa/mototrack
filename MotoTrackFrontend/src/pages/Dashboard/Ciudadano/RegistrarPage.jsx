import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Space, Form, Alert, Typography } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined, WarningOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTheme } from '../../../context/ThemeContext';
import { usePrimaryColor } from '../../../context/PrimaryColorContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useNotification } from '../../../components/Dashboard/CommonComponts/ToastNotifications';
import Steps from '../../../components/Dashboard/Ciudadanocomponents/RegistroDeMotocicletas/Steps';
import DatosPersonales from '../../../components/Dashboard/Ciudadanocomponents/RegistroDeMotocicletas/DatosPersonales';
import DatosMotocicletas from '../../../components/Dashboard/Ciudadanocomponents/RegistroDeMotocicletas/DatosMotocicletas';
import Documentos from '../../../components/Dashboard/Ciudadanocomponents/RegistroDeMotocicletas/Documentos';
import Confirmation from '../../../components/Dashboard/Ciudadanocomponents/RegistroDeMotocicletas/Confirmation';
import MainButton from '../../../components/Dashboard/CommonComponts/MainButton';
import { checkMotorcycleLimit, hasReachedActiveLimit as baseHasReachedLimit } from '../../../data/motorcycleService';

const { Title, Text } = Typography;

// Styled components for the page
const PageContainer = styled.div`
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const StepContainer = styled.div`
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const FormCard = styled(Card)`
  background-color: ${props => props.theme.token.contentBg};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid ${props => props.theme.token.titleColor}25;
  margin-bottom: 20px;
  min-height: 400px;
  
  .ant-card-body {
    padding: 24px;
    
    @media (max-width: 768px) {
      padding: 16px;
    }
    
    @media (max-width: 480px) {
      padding: 12px;
    }
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  
  .left-buttons {
    display: flex;
    gap: 16px; /* Increased spacing between Cancel and Previous buttons */
  }
  
  .right-buttons {
    display: flex;
    justify-content: flex-end;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    
    .left-buttons, .right-buttons {
      display: flex;
      gap: 12px; /* Increased from 8px to 12px for mobile */
    }
    
    .left-buttons {
      order: 2;
    }
    
    .right-buttons {
      order: 1;
      justify-content: flex-end;
    }
  }
`;

const StepTitle = styled.h2`
  color: ${props => props.theme.token.titleColor};
  margin-bottom: 20px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

const StepDescription = styled.p`
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
    font-size: 14px;
  }
`;

const LimitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 32px 16px;
  height: 100%;
`;

const LimitIcon = styled(WarningOutlined)`
  font-size: 64px;
  color: ${props => props.color};
  margin-bottom: 24px;
`;

const LimitTitle = styled(Title)`
  margin-bottom: 16px !important;
`;

const LimitDescription = styled(Text)`
  font-size: 16px;
  margin-bottom: 32px;
  max-width: 600px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const RegistrarPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const { theme } = useTheme();
  const { primaryColor } = usePrimaryColor();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const notification = useNotification();
  const [loading, setLoading] = useState(true);
  const [hasReachedActiveLimit, setHasReachedActiveLimit] = useState(false);
  const [formData, setFormData] = useState({});

  // Verificar el límite de motocicletas al cargar el componente
  useEffect(() => {
    const checkMotocicletasLimit = async () => {
      setLoading(true);
      try {
        // Obtener el conteo real de motocicletas activas utilizando el servicio compartido
        const activeCount = await checkMotorcycleLimit();
        
        // El límite se alcanza cuando hay 2 o más motocicletas activas
        setHasReachedActiveLimit(activeCount >= 2);
        setLoading(false);
      } catch (error) {
        console.error('Error al verificar el límite de motocicletas:', error);
        notification.error('Error al verificar tus motocicletas activas');
        setLoading(false);
      }
    };

    checkMotocicletasLimit();
  }, [notification]);

  // Translation object
  const translations = {
    en: {
      title: 'Register Motorcycle',
      steps: ['Personal Data', 'Motorcycle Data', 'Documents', 'Confirmation'],
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit Registration',
      cancel: 'Cancel',
      personalData: 'Enter your personal information',
      motorcycleData: 'Enter your motorcycle details',
      documents: 'Upload required documents',
      confirmation: 'Confirm your registration',
      successMessage: 'Registration submitted successfully',
      limitTitle: 'Maximum Limit Reached',
      limitDescription: 'You have reached the maximum limit of 2 active motorcycles. To register a new one, you must first deactivate one of your current motorcycles in the Motorcycles section.',
      viewMotorcycles: 'View My Motorcycles',
      returnToDashboard: 'Return to Dashboard',
    },
    es: {
      title: 'Registrar Motocicleta',
      steps: ['Datos Personales', 'Datos de Motocicleta', 'Documentos', 'Confirmación'],
      next: 'Siguiente',
      previous: 'Anterior',
      submit: 'Enviar Registro',
      cancel: 'Cancelar',
      personalData: 'Ingrese su información personal',
      motorcycleData: 'Ingrese los detalles de su motocicleta',
      documents: 'Suba los documentos requeridos',
      confirmation: 'Confirme su registro',
      successMessage: 'Registro enviado con éxito',
      limitTitle: 'Límite Máximo Alcanzado',
      limitDescription: 'Has alcanzado el límite máximo de 2 motocicletas activas. Para registrar una nueva, primero debes dar de baja una de tus motocicletas actuales en la sección de Motocicletas.',
      viewMotorcycles: 'Ver Mis Motocicletas',
      returnToDashboard: 'Volver al Dashboard',
    }
  };
  
  const t = translations[language] || translations.es;

  const handleNext = () => {
    form.validateFields()
      .then(values => {
        // Save the current form data
        setFormData(prevData => ({
          ...prevData,
          ...values
        }));
        
        if (currentStep < 3) {
          setCurrentStep(currentStep + 1);
        }
      })
      .catch(errorInfo => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would submit the form data to your API
    notification.success(t.successMessage);
    navigate('/panel/ciudadano/motocicletas');
  };

  const handleCancel = () => {
    navigate('/panel/ciudadano');
  };

  const handleViewMotorcycles = () => {
    navigate('/panel/ciudadano/motocicletas');
  };

  // Render different form content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Data
        return (
          <>
            <StepTitle theme={theme}>{t.steps[0]}</StepTitle>
            <StepDescription>{t.personalData}</StepDescription>
            <DatosPersonales form={form} />
          </>
        );
      case 1: // Motorcycle Data
        return (
          <>
            <StepTitle theme={theme}>{t.steps[1]}</StepTitle>
            <StepDescription>{t.motorcycleData}</StepDescription>
            <DatosMotocicletas form={form} />
          </>
        );
      case 2: // Documents
        return (
          <>
            <StepTitle theme={theme}>{t.steps[2]}</StepTitle>
            <StepDescription>{t.documents}</StepDescription>
            <Documentos form={form} />
          </>
        );
      case 3: // Confirmation
        return (
          <>
            <StepTitle theme={theme}>{t.steps[3]}</StepTitle>
            <StepDescription>{t.confirmation}</StepDescription>
            <Confirmation form={form} formData={formData} onSubmit={handleSubmit} />
          </>
        );
      default:
        return null;
    }
  };

  // Renderizar contenido cuando se ha alcanzado el límite
  const renderLimitContent = () => {
    return (
      <LimitContainer>
        <LimitIcon color={primaryColor} />
        <LimitTitle level={3}>{t.limitTitle}</LimitTitle>
        <LimitDescription>{t.limitDescription}</LimitDescription>
        <ButtonsWrapper>
          <MainButton 
            type="primary"
            onClick={handleViewMotorcycles}
          >
            {t.viewMotorcycles}
          </MainButton>
          <Button 
            onClick={handleCancel}
          >
            {t.returnToDashboard}
          </Button>
        </ButtonsWrapper>
      </LimitContainer>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <FormCard theme={theme}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="ant-spin ant-spin-spinning">
                    <span className="ant-spin-dot">
                      <i className="ant-spin-dot-item"></i>
                      <i className="ant-spin-dot-item"></i>
                      <i className="ant-spin-dot-item"></i>
                      <i className="ant-spin-dot-item"></i>
                    </span>
                  </div>
                  <div style={{ marginTop: '16px' }}>Verificando disponibilidad...</div>
                </div>
              </div>
            </FormCard>
          </Col>
        </Row>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          {!hasReachedActiveLimit && (
            <StepContainer>
              <Steps current={currentStep} />
            </StepContainer>
          )}
          
          <FormCard theme={theme}>
            {hasReachedActiveLimit ? renderLimitContent() : renderStepContent()}
          </FormCard>
          
          {!hasReachedActiveLimit && (
            <ButtonsContainer>
              <div className="left-buttons">
                <Button 
                  onClick={handleCancel}
                  danger
                  size={window.innerWidth <= 480 ? "middle" : "default"}
                >
                  {t.cancel}
                </Button>
                
                {currentStep > 0 && (
                  <Button 
                    onClick={handlePrevious}
                    icon={<ArrowLeftOutlined />}
                    size={window.innerWidth <= 480 ? "middle" : "default"}
                  >
                    {t.previous}
                  </Button>
                )}
              </div>
              
              <div className="right-buttons">
                {currentStep < 3 ? (
                  <MainButton 
                    onClick={handleNext}
                    icon={<ArrowRightOutlined />}
                    size={window.innerWidth <= 480 ? "middle" : "default"}
                  >
                    {t.next}
                  </MainButton>
                ) : (
                  <MainButton 
                    onClick={handleSubmit}
                    icon={<CheckOutlined />}
                    size={window.innerWidth <= 480 ? "middle" : "default"}
                  >
                    {t.submit}
                  </MainButton>
                )}
              </div>
            </ButtonsContainer>
          )}
        </Col>
      </Row>
    </PageContainer>
  );
};

export default RegistrarPage;