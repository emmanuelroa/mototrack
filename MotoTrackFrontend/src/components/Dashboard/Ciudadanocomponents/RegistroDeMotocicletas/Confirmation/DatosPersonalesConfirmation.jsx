import React from 'react';
import styled from 'styled-components';
import { Typography, Row, Col } from 'antd';
import { useLanguage } from '../../../../../context/LanguageContext';

const { Text } = Typography;

const DataRow = styled(Row)`
  margin-bottom: 16px;
  
  @media (max-width: 576px) {
    margin-bottom: 12px;
  }
`;

const DataLabel = styled(Text)`
  color: #8c8c8c;
  font-size: 14px;
  display: block;
  margin-bottom: 4px;
  
  @media (max-width: 576px) {
    font-size: 13px;
  }
`;

const DataValue = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  display: block;
  word-break: break-word;
  
  @media (max-width: 576px) {
    font-size: 15px;
  }
`;

const DatosPersonalesConfirmation = ({ userData }) => {
  const { language } = useLanguage();
  
  // Create translations for field labels
  const translations = {
    en: {
      fullName: 'Full Name',
      birthDate: 'Date of Birth',
      gender: 'Gender',
      id: 'ID Number',
      phone: 'Phone',
      maritalStatus: 'Marital Status',
      address: 'Address',
      email: 'Email',
      sector: 'Sector'
    },
    es: {
      fullName: 'Nombre Completo',
      birthDate: 'Fecha de Nacimiento',
      gender: 'Sexo',
      id: 'Cédula de Identidad',
      phone: 'Teléfono',
      maritalStatus: 'Estado Civil',
      address: 'Dirección',
      email: 'Correo Electrónico',
      sector: 'Sector'
    }
  };
  
  // Get current translations
  const t = translations[language] || translations.es;
  
  // Map marital status values to readable text
  const getMaritalStatus = (status) => {
    const statusMap = {
      en: {
        single: 'Single',
        married: 'Married',
        divorced: 'Divorced',
        widowed: 'Widowed'
      },
      es: {
        single: 'Soltero/a',
        married: 'Casado/a',
        divorced: 'Divorciado/a',
        widowed: 'Viudo/a'
      }
    };
    
    return statusMap[language]?.[status] || statusMap.es[status] || status;
  };

  return (
    <>
      <DataRow gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <DataLabel>{t.fullName}</DataLabel>
          <DataValue>{userData.nombreCompleto || "No disponible"}</DataValue>
        </Col>
        <Col xs={24} sm={12}>
          <DataLabel>{t.birthDate}</DataLabel>
          <DataValue>{userData.fechaNacimiento || "No disponible"}</DataValue>
        </Col>
      </DataRow>
      
      <DataRow gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <DataLabel>{t.gender}</DataLabel>
          <DataValue>{userData.sexo || "No disponible"}</DataValue>
        </Col>
        <Col xs={24} sm={12}>
          <DataLabel>{t.id}</DataLabel>
          <DataValue>{userData.cedula || "No disponible"}</DataValue>
        </Col>
      </DataRow>
      
      <DataRow gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <DataLabel>{t.phone}</DataLabel>
          <DataValue>{userData.telefono || "No disponible"}</DataValue>
        </Col>
        <Col xs={24} sm={12}>
          <DataLabel>{t.maritalStatus}</DataLabel>
          <DataValue>{getMaritalStatus(userData.estadoCivil) || "No disponible"}</DataValue>
        </Col>
      </DataRow>
      
      <DataRow gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <DataLabel>{t.sector}</DataLabel>
          <DataValue>{userData.sector || "No disponible"}</DataValue>
        </Col>
        <Col xs={24} sm={12}>
          <DataLabel>{t.email}</DataLabel>
          <DataValue>{userData.correoElectronico || "No disponible"}</DataValue>
        </Col>
      </DataRow>
      
      <DataRow gutter={[16, 0]}>
        <Col xs={24}>
          <DataLabel>{t.address}</DataLabel>
          <DataValue>{userData.direccion || "No disponible"}</DataValue>
        </Col>
      </DataRow>
    </>
  );
};

export default DatosPersonalesConfirmation;