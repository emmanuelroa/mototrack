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

const DatosMotocicletasConfirmation = ({ motoData }) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      color: 'Color',
      engineSize: 'Engine Size',
      useType: 'Use Type',
      chassisNumber: 'Chassis Number',
      insurance: 'Insurance',
      insuranceProvider: 'Insurance Provider',
      policyNumber: 'Policy Number',
      plateNumber: 'Plate Number',
      yes: 'Yes',
      no: 'No'
    },
    es: {
      brand: 'Marca',
      model: 'Modelo',
      year: 'Año',
      color: 'Color',
      engineSize: 'Cilindraje',
      useType: 'Tipo de Uso',
      chassisNumber: 'Número de Chasis',
      insurance: 'Seguro',
      insuranceProvider: 'Proveedor de Seguro',
      policyNumber: 'Número de Póliza',
      plateNumber: 'Número de Placa',
      yes: 'Si',
      no: 'No'
    }
  };
  
  const t = translations[language] || translations.es;
  
  return (
    <>
      <DataRow gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <DataLabel>{t.brand}</DataLabel>
          <DataValue>{motoData.marca || "No disponible"}</DataValue>
        </Col>
        <Col xs={24} sm={12}>
          <DataLabel>{t.model}</DataLabel>
          <DataValue>{motoData.modelo || "No disponible"}</DataValue>
        </Col>
      </DataRow>
      
      <DataRow gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <DataLabel>{t.year}</DataLabel>
          <DataValue>{motoData.año || "No disponible"}</DataValue>
        </Col>
        <Col xs={24} sm={12}>
          <DataLabel>{t.color}</DataLabel>
          <DataValue>{motoData.color || "No disponible"}</DataValue>
        </Col>
      </DataRow>
      
      <DataRow gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <DataLabel>{t.engineSize}</DataLabel>
          <DataValue>{motoData.cilindraje || "No disponible"} cc</DataValue>
        </Col>
        <Col xs={24} sm={12}>
          <DataLabel>{t.useType}</DataLabel>
          <DataValue>{motoData.tipoUso || "No disponible"}</DataValue>
        </Col>
      </DataRow>
      
      <DataRow gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <DataLabel>{t.chassisNumber}</DataLabel>
          <DataValue>{motoData.numeroChasis || "No disponible"}</DataValue>
        </Col>
        <Col xs={24} sm={12}>
          <DataLabel>{t.insurance}</DataLabel>
          <DataValue>{motoData.seguro || "No disponible"}</DataValue>
        </Col>
      </DataRow>
      
      {motoData.seguro === 'Si' && (
        <>
          <DataRow gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <DataLabel>{t.insuranceProvider}</DataLabel>
              <DataValue>{motoData.proveedorSeguro || "No disponible"}</DataValue>
            </Col>
            <Col xs={24} sm={12}>
              <DataLabel>{t.policyNumber}</DataLabel>
              <DataValue>{motoData.numeroPoliza || "No disponible"}</DataValue>
            </Col>
          </DataRow>
        </>
      )}
      
      <DataRow gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <DataLabel>{t.plateNumber}</DataLabel>
          <DataValue>{motoData.placa || "No disponible"}</DataValue>
        </Col>
      </DataRow>
    </>
  );
};

export default DatosMotocicletasConfirmation;