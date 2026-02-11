import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../../../context/LanguageContext';
import DatosPersonalesConfirmation from './Confirmation/DatosPersonalesConfirmation';
import DatosMotocicletasConfirmation from './Confirmation/DatosMotocicletasConfirmation';
import DocumentosConfirmation from './Confirmation/DocumentosConfirmation';
import TabsRegistro from './Confirmation/TabsRegistro';

const ConfirmationContainer = styled.div`
  margin-top: 20px;
`;

const Confirmation = ({ form, formData, onSubmit }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = React.useState('1');
  
  // Map form data to the expected structure for each component
  const personalData = {
    nombreCompleto: formData?.fullName,
    fechaNacimiento: formData?.birthDate ? formData.birthDate.format('YYYY-MM-DD') : '',
    sexo: formData?.gender === 'male' ? 'Masculino' : 'Femenino',
    cedulaIdentidad: formData?.idDocument,
    telefono: formData?.phone,
    estadoCivil: formData?.maritalStatus,
    direccion: formData?.address,
    correoElectronico: formData?.email,
    sector: formData?.sector
  };

  const motorcycleData = {
    marca: formData?.brand,
    modelo: formData?.model,
    año: formData?.year,
    color: formData?.color,
    cilindraje: formData?.engineSize ? `${formData.engineSize} cc` : '',
    tipoUso: formData?.useType,
    numeroChasis: formData?.chassisNumber,
    seguro: formData?.hasInsurance === 'yes' ? 'Sí' : 'No',
    proveedorSeguro: formData?.insuranceProvider,
    numeroPóliza: formData?.policyNumber
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Obtener todos los valores del formulario, incluyendo los documentos
  const allFormValues = form.getFieldsValue(true); // El true asegura que se obtengan todos los valores
  
  // Log para verificar qué valores se están pasando
  console.log("Confirmation está pasando formData:", allFormValues);

  return (
    <ConfirmationContainer>
      <TabsRegistro
        activeKey={activeTab}
        onChange={handleTabChange}
        datosPersonalesContent={<DatosPersonalesConfirmation userData={personalData} />}
        datosMotocicletaContent={<DatosMotocicletasConfirmation motoData={motorcycleData} />}
        documentosContent={<DocumentosConfirmation formData={allFormValues} />}
      />
    </ConfirmationContainer>
  );
};

export default Confirmation;