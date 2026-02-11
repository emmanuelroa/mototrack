import React from 'react';
import { Form, Radio, DatePicker, Select, Row, Col } from 'antd';
import styled from 'styled-components';
import Inputs from '../../CommonComponts/Inputs';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';

const { Option } = Select;

const FormContainer = styled.div`
  margin-top: 20px;
`;

// Common input styling variables to ensure consistency
const inputHeight = '48px';
const inputPadding = '8px 16px';
const inputFontSize = '16px';
const inputBorderRadius = '10px';
const inputBorderWidth = '2px';

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 20px;
  
  .ant-form-item-label > label {
    color: ${props => props.theme.token.titleColor};
    font-weight: 500;
  }
  
  /* Hide red asterisks for required fields */
  .ant-form-item-required::before {
    display: none !important;
  }
  
  /* Hide red asterisks for required fields (alternative method) */
  .ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after {
    display: none !important;
  }
  
  /* Ensure all input containers are the same height */
  .ant-input-wrapper, 
  .ant-select, 
  .ant-picker,
  .ant-radio-group,
  .ant-input-number {
    height: ${inputHeight} !important;
    line-height: ${inputHeight} !important;
  }
`;

const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;
  height: ${inputHeight} !important;
  display: flex !important;
  align-items: center !important;
  
  .ant-radio-wrapper {
    color: ${props => props.theme.token.titleColor};
    height: 100%;
    display: flex;
    align-items: center;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  height: ${inputHeight} !important;
  background-color: transparent;
  color: ${props => props.$isDarkMode ? '#fff' : '#000'};
  border: ${inputBorderWidth} solid ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  border-radius: ${inputBorderRadius};
  padding: ${inputPadding};
  font-size: ${inputFontSize};
  
  .ant-picker-input {
    height: 100%;
    display: flex;
    align-items: center;
  }
  
  &:hover {
    border-color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'};
  }

  &:focus {
    border-color: ${props => props.$primaryColor};
    box-shadow: 0 0 5px ${props => props.$primaryColor}80;
    outline: none;
  }
  
  input {
    height: 100%;
    font-size: ${inputFontSize};
  }
`;

const StyledSelect = styled(Select)`
  width: 100%;
  
  .ant-select-selector {
    height: ${inputHeight} !important;
    background-color: transparent !important;
    color: ${props => props.$isDarkMode ? '#fff' : '#000'} !important;
    border: ${inputBorderWidth} solid ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
    border-radius: ${inputBorderRadius} !important;
    padding: 0 16px !important;
    display: flex !important;
    align-items: center !important;
  }
  
  .ant-select-selection-item {
    display: flex !important;
    align-items: center !important;
    line-height: normal !important;
    font-size: ${inputFontSize};
  }
  
  &:hover .ant-select-selector {
    border-color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'} !important;
  }
  
  &.ant-select-focused .ant-select-selector {
    border-color: ${props => props.$primaryColor} !important;
    box-shadow: 0 0 5px ${props => props.$primaryColor}80 !important;
  }
  
  /* Make dropdown position consistent */
  &.ant-select-dropdown {
    position: absolute;
    z-index: 1050;
  }
`;

const DatosPersonales = ({ form }) => {
  const { theme, currentTheme } = useTheme();
  const { language } = useLanguage();
  const isDarkMode = currentTheme === 'themeDark';
  
  const translations = {
    es: {
      fullName: 'Nombre Completo',
      fullNamePlaceholder: 'Ingrese su nombre completo',
      fullNameRequired: 'Por favor ingrese su nombre completo',
      gender: 'Sexo',
      genderRequired: 'Por favor seleccione su sexo',
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro',
      idDocument: 'Cédula de Identidad / Pasaporte',
      idPlaceholder: '000-0000000-0',
      idRequired: 'Por favor ingrese su cédula de identidad o pasaporte',
      phone: 'Teléfono',
      phonePlaceholder: '(000) 000-0000',
      phoneRequired: 'Por favor ingrese su número de teléfono',
      maritalStatus: 'Estado Civil',
      maritalStatusRequired: 'Por favor seleccione su estado civil',
      single: 'Soltero/a',
      married: 'Casado/a',
      divorced: 'Divorciado/a',
      widowed: 'Viudo/a',
      birthDate: 'Fecha de Nacimiento',
      birthDateRequired: 'Por favor seleccione su fecha de nacimiento',
      email: 'Correo Electrónico',
      emailPlaceholder: 'ejemplo@correo.com',
      emailRequired: 'Por favor ingrese su correo electrónico',
      address: 'Dirección',
      addressPlaceholder: 'Ingrese su dirección',
      addressRequired: 'Por favor ingrese su dirección',
      sector: 'Sector',
      sectorPlaceholder: 'Seleccione su sector',
      sectorRequired: 'Por favor seleccione su sector'
    },
    en: {
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      fullNameRequired: 'Please enter your full name',
      gender: 'Gender',
      genderRequired: 'Please select your gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      idDocument: 'ID / Passport',
      idPlaceholder: '000-0000000-0',
      idRequired: 'Please enter your ID or passport number',
      phone: 'Phone',
      phonePlaceholder: '(000) 000-0000',
      phoneRequired: 'Please enter your phone number',
      maritalStatus: 'Marital Status',
      maritalStatusRequired: 'Please select your marital status',
      single: 'Single',
      married: 'Married',
      divorced: 'Divorced',
      widowed: 'Widowed',
      birthDate: 'Birth Date',
      birthDateRequired: 'Please select your birth date',
      email: 'Email',
      emailPlaceholder: 'example@email.com',
      emailRequired: 'Please enter your email address',
      address: 'Address',
      addressPlaceholder: 'Enter your address',
      addressRequired: 'Please enter your address',
      sector: 'Sector',
      sectorPlaceholder: 'Select your sector',
      sectorRequired: 'Please select your sector'
    }
  };
  
  const t = translations[language] || translations.es;

  // Common sectors in Dominican Republic
  const sectors = [
    "Los Frailes", 
    "San Luis", 
    "La Caleta", 
    "Arroyo Hondo", 
    "Bella Vista", 
    "Ciudad Nueva", 
    "Evaristo Morales", 
    "Gazcue", 
    "La Esperilla", 
    "Los Jardines", 
    "Los Prados", 
    "Naco", 
    "Paraíso", 
    "Piantini", 
    "Villa Juana", 
    "Zona Colonial",
    "Los Mina",
    "Villa Consuelo",
    "Cristo Rey",
    "Los Ríos"
  ];

  return (
    <FormContainer>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="fullName" 
              label={t.fullName}
              rules={[{ required: true, message: t.fullNameRequired }]}
              theme={theme}
            >
              <Inputs placeholder={t.fullNamePlaceholder} />
            </StyledFormItem>
          </Col>
          
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="gender" 
              label={t.gender}
              rules={[{ required: true, message: t.genderRequired }]}
              theme={theme}
            >
              <StyledRadioGroup>
                <Radio value="male">{t.male}</Radio>
                <Radio value="female">{t.female}</Radio>
              </StyledRadioGroup>
            </StyledFormItem>
          </Col>
          
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="idDocument" 
              label={t.idDocument}
              rules={[{ required: true, message: t.idRequired }]}
              theme={theme}
            >
              <Inputs placeholder={t.idPlaceholder} />
            </StyledFormItem>
          </Col>
          
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="phone" 
              label={t.phone}
              rules={[{ required: true, message: t.phoneRequired }]}
              theme={theme}
            >
              <Inputs placeholder={t.phonePlaceholder} />
            </StyledFormItem>
          </Col>
          
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="maritalStatus" 
              label={t.maritalStatus}
              rules={[{ required: true, message: t.maritalStatusRequired }]}
              theme={theme}
            >
              <StyledSelect $isDarkMode={isDarkMode}>
                <Option value="single">{t.single}</Option>
                <Option value="married">{t.married}</Option>
                <Option value="divorced">{t.divorced}</Option>
                <Option value="widowed">{t.widowed}</Option>
              </StyledSelect>
            </StyledFormItem>
          </Col>
          
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="birthDate" 
              label={t.birthDate}
              rules={[{ required: true, message: t.birthDateRequired }]}
              theme={theme}
            >
              <StyledDatePicker 
                $isDarkMode={isDarkMode}
                format="DD/MM/YYYY"
              />
            </StyledFormItem>
          </Col>
          
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="email" 
              label={t.email}
              rules={[
                { required: true, message: t.emailRequired },
                { type: 'email', message: language === 'es' ? 'Por favor ingrese un correo electrónico válido' : 'Please enter a valid email address' }
              ]}
              theme={theme}
            >
              <Inputs placeholder={t.emailPlaceholder} />
            </StyledFormItem>
          </Col>
          
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="sector" 
              label={t.sector}
              rules={[{ required: true, message: t.sectorRequired }]}
              theme={theme}
            >
              <StyledSelect $isDarkMode={isDarkMode} placeholder={t.sectorPlaceholder}>
                {sectors.map(sector => (
                  <Option key={sector} value={sector}>{sector}</Option>
                ))}
              </StyledSelect>
            </StyledFormItem>
          </Col>
          
          <Col span={24}>
            <StyledFormItem 
              name="address" 
              label={t.address}
              rules={[{ required: true, message: t.addressRequired }]}
              theme={theme}
            >
              <Inputs placeholder={t.addressPlaceholder} />
            </StyledFormItem>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default DatosPersonales;