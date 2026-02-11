import React from 'react';
import { Button, message, Modal } from 'antd';
import styled from 'styled-components';
import { DownloadOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { jsPDF } from 'jspdf';
import { useTheme } from '../../../context/ThemeContext';
import sdeLogoImage from '../../../assets/Dashboard/CiudadanoDashbaord/AlcaldíaSantoDomingo.png';
import mototrackLogoImage from '../../../assets/Lading/MotoTrackLogo.png';

// Styled components
const DownloadButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const PreviewFrame = styled.div`
  width: 100%;
  max-width: 500px;
  height: 300px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PlateContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px 40px;
  margin: 10px 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 300px;
`;

const PlateNumber = styled.div`
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.5px; /* Reduce from 1px to 0.5px for less spacing */
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  max-width: 450px;
`;

const InfoItem = styled.div`
  margin-bottom: 8px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #8c8c8c;
`;

const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

/**
 * Component for generating and downloading motorcycle digital carnet as PDF
 */
const DescargarCarnet = ({ 
  motorcycleData = {}, 
  buttonProps = {}, 
  children,
  showPreview = false
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  
  // Default data for the carnet
  const defaultData = {
    placa: 'K01921231',
    propietario: 'Juan Carlos Pérez Rodríguez',
    modelo: 'Yamaha YBR 125 (2021)',
    registro: 'MOT-2023-039',
    fechaEmision: '11/02/2023'
  };
  
  // Merge provided data with defaults
  const carnetData = { ...defaultData, ...motorcycleData };
  
  // Function to generate and download the PDF
  const generateCarnetPDF = async () => {
    setLoading(true);
    
    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [210, 150] // Increased height from 130 to 150 for more bottom space
      });
      
      // Set white background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 150, 'F'); // Adjusted rect to match new height
      
      // Load images - convert to base64 first
      try {
        const loadImage = (src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => {
              console.error('Error loading image:', src);
              resolve(null);
            };
            img.src = src;
          });
        };
        
        // Load both images in parallel
        const [sdeLogoBase64, mototrackLogoBase64] = await Promise.all([
          loadImage(sdeLogoImage),
          loadImage(mototrackLogoImage)
        ]);
        
        // Position images in the top corners with slight adjustments to prevent overlap
        if (sdeLogoBase64) {
          doc.addImage(sdeLogoBase64, 'PNG', 10, 5, 25, 25); // Smaller size, moved to corner
        }
        
        // Make MotoTrack logo in opposite corner
        if (mototrackLogoBase64) {
          doc.addImage(mototrackLogoBase64, 'PNG', 175, 5, 25, 25); // Smaller size, moved to corner
        }
      } catch (imageError) {
        console.error('Error processing images:', imageError);
        // Continue without images if they fail to load
      }
      
      // Add "Carnet Digital" title in the center with larger font
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(36); // Increased font size
      doc.text('Carnet Digital', 105, 25, { align: 'center' });
      
      // Add white rounded rectangle for the plate number - make it larger
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(220, 220, 220);
      doc.roundedRect(25, 35, 160, 50, 5, 5, 'FD'); // Reduced height from 60 to 50
      
      // Add plate number in larger font with proper spacing
      doc.setFontSize(90); // Decreased font size from 72 to 60
      doc.setFont('helvetica', 'bold');
      
      // Calculate proper spacing based on plate length
      const plateText = carnetData.placa;
      
      // Use less spacing or no spacing at all
      // Option 1: No manual spacing (use the plate text as is)
      doc.text(plateText, 105, 70, { align: 'center' });
      
      // Or Option 2: Use minimal spacing for better readability (but less than before)
      // const plateSpacing = plateText.length > 8 ? 0.5 : 1; 
      // const plate = plateText.split('').join(' '.repeat(plateSpacing));
      // doc.text(plate, 105, 65, { align: 'center' });
      
      // Add dividing line below plate area with more space
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(25, 95, 185, 95); // Moved up from 100 to 95
      
      // Create a more balanced two-column layout for the information
      // Left column
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text('Propietario', 30, 105);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(carnetData.propietario, 30, 112);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text('Chasis', 30, 122);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(carnetData.chasis || 'JH2PC35G1MM200020', 30, 129);
      
      // Right column
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text('Motocicleta', 140, 105);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(carnetData.modelo, 140, 112);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text('Fecha de Emisión', 140, 122);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(carnetData.fechaEmision, 140, 129);
      
      // Add footer content with more bottom spacing
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text('Documento oficial del municipio de Santo Domingo Este & MotoTrack', 105, 145, { align: 'center' });
      
      // Add a decorative bottom line to create more space at bottom
      doc.setDrawColor(240, 240, 240);
      doc.setLineWidth(0.3);
      doc.line(25, 140, 185, 140);  // Keep the decorative line
      
      // Save the PDF with a filename based on the plate number
      doc.save(`carnet-digital-${carnetData.placa}.pdf`);
      
      message.success('Carnet digital descargado correctamente');
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.error('Error al generar el carnet digital');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Show preview modal
  const showPreviewModal = () => {
    setPreviewVisible(true);
  };
  
  // Handle download from preview
  const handleDownloadFromPreview = async () => {
    await generateCarnetPDF();
    setPreviewVisible(false);
  };
  
  // Render button or use children
  const renderButton = () => {
    const handleClick = async () => {
      // First run the internal handler
      if (showPreview) {
        showPreviewModal();
      } else {
        await generateCarnetPDF();
      }
      
      // Then run the external handler if provided
      if (buttonProps.onClick) {
        buttonProps.onClick();
      }
    };

    if (children) {
      return React.cloneElement(children, {
        ...buttonProps,
        loading: loading,
        onClick: handleClick
      });
    }
    
    return (
      <DownloadButton
        type="primary"
        icon={loading ? <LoadingOutlined /> : <DownloadOutlined />}
        {...buttonProps}
        loading={loading}
        onClick={handleClick}
      >
        Descargar Carnet
      </DownloadButton>
    );
  };
  
  return (
    <>
      {renderButton()}
      
      <Modal
        title="Vista previa del Carnet Digital"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPreviewVisible(false)}>
            Cancelar
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            icon={<DownloadOutlined />} 
            loading={loading}
            onClick={handleDownloadFromPreview}
          >
            Descargar PDF
          </Button>
        ]}
        width={600}
      >
        <PreviewContainer>
          <PreviewFrame>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2>Carnet Digital</h2>
            </div>
            
            <PlateContainer>
              <PlateNumber>{carnetData.placa}</PlateNumber>
            </PlateContainer>
            
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Propietario</InfoLabel>
                <InfoValue>{carnetData.propietario}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Motocicleta</InfoLabel>
                <InfoValue>{carnetData.modelo}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Registro</InfoLabel>
                <InfoValue>{carnetData.registro}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Emisión</InfoLabel>
                <InfoValue>{carnetData.fechaEmision}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </PreviewFrame>
          
          <div>
            <FilePdfOutlined style={{ marginRight: 8 }} />
            El PDF incluirá los logos oficiales y formato completo
          </div>
        </PreviewContainer>
      </Modal>
    </>
  );
};

export default DescargarCarnet;