import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../../../context/LanguageContext';

import Modal from '../../CommonComponts/Modals';
import TabsDeDetalles from '../../CommonComponts/VerDetallesDeRegistros/TabsDeDetalles';
import DetalleAprobado from '../../CommonComponts/VerDetallesDeRegistros/DetalleAprobado';
import DetallePendiente from '../../CommonComponts/VerDetallesDeRegistros/DetallePendiente';
import DetalleRechazado from '../../CommonComponts/VerDetallesDeRegistros/DetalleRechazado';
import DatosPersonalesConfirmation from '../RegistroDeMotocicletas/Confirmation/DatosPersonalesConfirmation';
import DatosMotocicletasConfirmation from '../RegistroDeMotocicletas/Confirmation/DatosMotocicletasConfirmation';
import DocumentosConfirmationParaVerDetalles from '../RegistroDeMotocicletas/Confirmation/DocumentosConfirmationParaVerDetalles';
import StatusTag, { MOTO_STATUS } from '../../CommonComponts/StatusTag';

const { Title } = Typography;

const ModalTitle = styled(Title)`
  margin-bottom: 24px !important;
  font-size: 20px !important;
  margin: 0 !important;
  
  @media (max-width: 576px) {
    font-size: 18px !important;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  
  @media (max-width: 576px) {
    margin-bottom: 16px;
  }
`;

const ModalContent = styled.div`
  margin-top: 40px; // Space for the close button
  
  @media (max-width: 576px) {
    margin-top: 30px;
  }
`;

/**
 * VerDetallesMotocicleta - Component for viewing motorcycle registration details
 * 
 * @param {Object} props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {Function} props.onClose - Function to close the modal
 * @param {Object} props.data - Motorcycle data
 */
const VerDetallesMotocicleta = ({ visible, onClose, data }) => {
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  // Translations
  const translations = {
    en: {
      details: "Details of",
      unavailableStatus: "Status not available",
      downloading: "Downloading circulation card for moto ID:",
      editing: "Editing request for moto ID:"
    },
    es: {
      details: "Detalles de",
      unavailableStatus: "Estado no disponible",
      downloading: "Descargando tarjeta de circulación para moto ID:",
      editing: "Editando solicitud de moto ID:"
    }
  };
  
  // Get current translations
  const t = translations[language] || translations.es;
  
  // Reset active tab when the modal opens with new data
  useEffect(() => {
    if (visible) {
      setActiveTab("1");
    }
  }, [visible, data?.id]);
  
  // Mock data for examples (in a real app, this would come from API)
  const mockUserData = {
    nombreCompleto: "Juan Pérez Rodríguez",
    fechaNacimiento: "15/05/1985",
    sexo: "Masculino",
    cedulaIdentidad: "001-1234567-8",
    telefono: "(809) 555-1234",
    estadoCivil: "Casado",
    direccion: "Calle Principal #123, Santo Domingo",
    correoElectronico: "juan.perez@example.com"
  };
  
  // Actualizar las URLs para usar formato de URL pública para Vite
  const mockDocumentos = [
    { 
      id: 1, 
      tipo: "Cédula de Identidad", 
      archivo: "cedula.jpg",
      url: "/placeholder-cedula.jpg" // Usar URL pública
    },
    { 
      id: 2, 
      tipo: "Licencia de Conducir", 
      archivo: "licencia2.jpg",
      // Usar rutas públicas precedidas por "/" para Vite
      url: "/assets/Dashboard/CiudadanoDashbaord/licencia2.jpg"
    },
    { 
      id: 3, 
      tipo: "Factura de Compra", 
      archivo: "Registro municipal de motocicletas .pdf",
      // Usar rutas públicas precedidas por "/" para Vite
      url: "/assets/Dashboard/CiudadanoDashbaord/Registro municipal de motocicletas .pdf"
    },
    { 
      id: 4, 
      tipo: "Póliza de Seguro", 
      archivo: "poliza.pdf",
      url: "/placeholder-poliza.pdf" // Usar URL pública
    }
  ];
  
  // Handle download card for approved motorcycles
  const handleDownloadCard = () => {
    console.log(`${t.downloading} ${data?.id}`);
    // Implementation for downloading the card
  };
  
  // Handle edit request for rejected motorcycles
  const handleEditRequest = () => {
    console.log(`${t.editing} ${data?.id}`);
    onClose();
    // Navigate to edit page with pre-filled data
    navigate(`/panel/ciudadano/registrar?edit=${data?.id}`);
  };
  
  // Memoize tab content to prevent unnecessary re-renders
  const datosPersonalesContent = <DatosPersonalesConfirmation userData={mockUserData} />;
  const datosMotocicletaContent = data ? <DatosMotocicletasConfirmation motoData={data} /> : null;
  
  // Transform mockDocumentos to match the format required by DocumentosConfirmationParaVerDetalles
  const documentFormData = {
    driverLicenseName: mockDocumentos[1]?.archivo || "licencia.jpg",
    driverLicenseType: "JPG",
    driverLicenseURL: mockDocumentos[1]?.url || "",
    
    idCardName: mockDocumentos[0]?.archivo || "cedula.png",
    idCardType: "PNG",
    idCardURL: mockDocumentos[0]?.url || "",
    
    vehicleInsuranceName: mockDocumentos[3]?.archivo || "seguro.pdf",
    vehicleInsuranceType: "PDF",
    vehicleInsuranceURL: mockDocumentos[3]?.url || "",
    
    motorInvoiceName: mockDocumentos[2]?.archivo || "factura.pdf",
    motorInvoiceType: "PDF",
    motorInvoiceURL: mockDocumentos[2]?.url || "",
  };
  
  const documentosContent = <DocumentosConfirmationParaVerDetalles formData={documentFormData} />;
  
  // Render appropriate status component based on motorcycle state
  const renderEstadoContent = () => {
    if (!data) return null;
    
    switch (data.estado) {
      case MOTO_STATUS.APROBADA:
        return <DetalleAprobado data={data} onDownloadCard={handleDownloadCard} />;
      case MOTO_STATUS.PENDIENTE:
        return <DetallePendiente data={data} />;
      case MOTO_STATUS.RECHAZADA:
        return <DetalleRechazado data={data} onEditRequest={handleEditRequest} />;
      default:
        return <div>{t.unavailableStatus}</div>;
    }
  };
  
  if (!data) return null;
  
  return (
    <Modal
      show={visible}
      onClose={onClose}
      width="800px" 
      height="auto"
      mobileWidth="95%" 
      mobileHeight="90vh"
    >
      <ModalContent>
        <TitleContainer>
          <ModalTitle level={4}>
            {t.details} {data.modelo}
          </ModalTitle>
          <StatusTag status={data.estado || MOTO_STATUS.PENDIENTE} />
        </TitleContainer>
        
        <TabsDeDetalles
          activeKey={activeTab}
          onChange={setActiveTab}
          datosPersonalesContent={datosPersonalesContent}
          datosMotocicletaContent={datosMotocicletaContent}
          documentosContent={documentosContent}
          estadoContent={renderEstadoContent()}
        />
      </ModalContent>
    </Modal>
  );
};

export default VerDetallesMotocicleta;