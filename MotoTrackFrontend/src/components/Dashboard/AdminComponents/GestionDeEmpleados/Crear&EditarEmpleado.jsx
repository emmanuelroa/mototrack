import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Select } from 'antd';
import esES from 'antd/es/date-picker/locale/es_ES';
import enUS from 'antd/es/date-picker/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import styled, { createGlobalStyle } from 'styled-components';
import { CalendarOutlined } from '@ant-design/icons';
// Fix the path from contexts to context
import { useLanguage } from '../../../../context/LanguageContext';
import Modal from '../../CommonComponts/Modals';
import Inputs from '../../CommonComponts/Inputs';
import MainButton from '../../CommonComponts/MainButton';
import SecondaryButton from '../../CommonComponts/SecondaryButton';
// 1. Importar el hook useNotification
import { useNotification } from '../../CommonComponts/ToastNotifications';

// Al inicio del archivo, agrega estos imports adicionales para plugins de dayjs
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/es';

// Extiende dayjs con los plugins necesarios
dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);

const FormContainer = styled.div`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Add province and municipality data
const provincias = [
  { value: 'santiago', label: 'Santiago' },
  { value: 'santo_domingo', label: 'Santo Domingo' },
  { value: 'la_vega', label: 'La Vega' },
  // Add more provinces...
];

const municipiosPorProvincia = {
  santiago: [
    { value: 'santiago_ciudad', label: 'Santiago de los Caballeros' },
    { value: 'tamboril', label: 'Tamboril' },
    // Add more municipalities...
  ],
  santo_domingo: [
    { value: 'santo_domingo_este', label: 'Santo Domingo Este' },
    { value: 'santo_domingo_norte', label: 'Santo Domingo Norte' },
    // Add more municipalities...
  ],
  // Add more provinces with their municipalities...
};
 
// Add roles data
const roles = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'EMPLEADO', label: 'Empleado' },
  // You can add more specific roles if needed
];

const StyledForm = styled(Form)`
  .ant-form-item-required::before {
    display: none !important;
  }

  .ant-form-item-explain-error {
    color: #ff4d4f;
    font-size: 14px;
    margin-top: 4px;
  }

  .ant-form-item-has-error .ant-input,
  .ant-form-item-has-error .ant-picker,
  .ant-form-item-has-error .ant-select-selector {
    border-color: #ff4d4f !important;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  &.ant-picker {
    width: 100%;
    height: 44px;
    border-radius: 8px;
    border: 1px solid ${props => props.theme?.token?.borderColorBase || '#d9d9d9'};
    
    &:hover {
      border-color: ${props => props.theme?.token?.colorPrimary || '#1890ff'};
    }
    
    .ant-picker-input {
      input {
        height: 42px;
        font-size: 14px;
      }
    }
  }
`;

// Añadir estos estilos para los mensajes de error
const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 4px;
`;

const GlobalStyle = createGlobalStyle`
  .styled-form .ant-form-item-required::before {
    display: none !important;
  }

  .styled-form .ant-form-item-explain-error {
    color: #ff4d4f !important;
    font-size: 14px;
    margin-top: 4px;
  }

  .styled-form .ant-form-item-has-error .ant-input,
  .styled-form .ant-form-item-has-error .ant-picker,
  .styled-form .ant-form-item-has-error .ant-select-selector {
    border-color: #ff4d4f !important;
  }
`;

const CrearEditarEmpleado = ({ visible, onClose, empleadoData, isEditing }) => {
  // Agregar el hook useNotification
  const notification = useNotification();
  
  // Asegúrate de que Form.useForm() se llame al principio del componente
  const [form] = Form.useForm();
  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [municipios, setMunicipios] = useState([]);
  
  // Add fallback for language context in case it's not available
  const languageContext = useLanguage ? useLanguage() : { language: 'es' };
  const { language = 'es' } = languageContext;

  // Translations object
  const t = {
    es: {
      createUser: 'Crear Usuario',
      editUser: 'Editar Usuario',
      names: 'Nombres',
      enterNames: 'Ingrese sus Nombres',
      lastName: 'Apellidos',
      enterLastName: 'Ingrese sus Apellidos',
      idNumber: 'Cédula de Identidad / Pasaporte',
      phone: 'Teléfono',
      birthDate: 'Fecha de Nacimiento',
      status: 'Estado',
      province: 'Provincia',
      selectProvince: 'Seleccione su Provincia',
      municipality: 'Municipio',
      selectMunicipality: 'Seleccione su Municipio',
      address: 'Dirección',
      enterAddress: 'Ingrese su Dirección',
      cancel: 'Cancelar',
      save: 'Guardar Cambios',
      create: 'Crear Usuario',
      active: 'Activo',
      inactive: 'Inactivo',
      enterBirthDate: 'Seleccione su fecha de nacimiento',
      email: 'Correo Electrónico',
      enterEmail: 'Ingrese su correo electrónico',
      invalidEmail: 'Por favor ingrese un correo electrónico válido',
      invalidPhone: 'Por favor ingrese un número de teléfono válido',
      invalidCedula: 'Por favor ingrese una cédula válida (000-0000000-0)',
      enterIdNumber: 'Ingrese su cédula',
      enterPhone: 'Ingrese su teléfono',
      selectProvince: 'Seleccione su provincia',
      selectMunicipality: 'Seleccione su municipio',
      userUpdated: 'Usuario Actualizado',
      userUpdatedDesc: 'El usuario ha sido actualizado correctamente',
      userCreated: 'Usuario Creado',
      userCreatedDesc: 'El usuario ha sido creado correctamente',
      validationError: 'Error de Validación',
      validationErrorDesc: 'Por favor complete todos los campos requeridos correctamente.',
      role: 'Rol',
      selectRole: 'Seleccione un rol',
      admin: 'Administrador',
      employee: 'Empleado',
    },
    en: {
      createUser: 'Create User',
      editUser: 'Edit User',
      names: 'Names',
      enterNames: 'Enter your Names',
      lastName: 'Last Name',
      enterLastName: 'Enter your Last Name',
      idNumber: 'ID Number / Passport',
      phone: 'Phone',
      birthDate: 'Birth Date',
      status: 'Status',
      province: 'Province',
      selectProvince: 'Select your Province',
      municipality: 'Municipality',
      selectMunicipality: 'Select your Municipality',
      address: 'Address',
      enterAddress: 'Enter your Address',
      cancel: 'Cancel',
      save: 'Save Changes',
      create: 'Create User',
      active: 'Active',
      inactive: 'Inactive',
      enterBirthDate: 'Select your birth date',
      email: 'Email',
      enterEmail: 'Enter your email address',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid phone number',
      invalidCedula: 'Please enter a valid ID number (000-0000000-0)',
      enterIdNumber: 'Enter your ID number',
      enterPhone: 'Enter your phone number',
      selectProvince: 'Select your province',
      selectMunicipality: 'Select your municipality',
      userUpdated: 'User Updated',
      userUpdatedDesc: 'User has been successfully updated',
      userCreated: 'User Created',
      userCreatedDesc: 'User has been successfully created',
      validationError: 'Validation Error',
      validationErrorDesc: 'Please complete all required fields correctly.',
      role: 'Role',
      selectRole: 'Select a role',
      admin: 'Administrator',
      employee: 'Employee',
    }
  };

  // Get current language translations
  const texts = t[language] || t.es;

  // Consolidar los tres useEffects en uno solo
  useEffect(() => {
    // Establecer el idioma para dayjs
    dayjs.locale(language === 'es' ? 'es' : 'en');

    // Manejo del formulario solo cuando es visible
    if (visible) {
      // Resetear formulario
      form.resetFields();
      
      // Reset selectedProvincia and municipios by default
      setSelectedProvincia(null);
      setMunicipios([]);
      
      // Manejar provincia y municipios solo en modo edición con datos existentes
      if (isEditing && empleadoData?.provincia) {
        setSelectedProvincia(empleadoData.provincia);
        setMunicipios(municipiosPorProvincia[empleadoData.provincia] || []);
      }
      
      // Establecer valores iniciales de manera segura
      if (isEditing && empleadoData) {
        let initialValues = { ...empleadoData, estado: empleadoData.estado || 'ACTIVO' };
        
        // Formatear la fecha de nacimiento si existe
        if (empleadoData.fechaNacimiento) {
          try {
            const parsedDate = dayjs(empleadoData.fechaNacimiento);
            if (parsedDate.isValid()) {
              initialValues.fechaNacimiento = parsedDate;
            } else {
              initialValues.fechaNacimiento = null;
              console.warn('Invalid date, setting to null');
            }
          } catch (error) {
            console.error('Error parsing date:', error);
            initialValues.fechaNacimiento = null;
          }
        }
        
        form.setFieldsValue(initialValues);
      } else {
        form.setFieldsValue({ 
          estado: 'ACTIVO',
          rol: 'EMPLEADO', // Set default role to employee
          fechaNacimiento: null
        });
      }
    }
  }, [visible, form, empleadoData, isEditing, language]);

  const handleProvinciaChange = (value) => {
    setSelectedProvincia(value);
    setMunicipios(municipiosPorProvincia[value] || []);
    form.setFieldsValue({ municipio: undefined }); // Clear municipio when provincia changes
  };

  // Add a clean-up function when the modal is closed
  const handleClose = () => {
    // Reset state when closing
    setSelectedProvincia(null);
    setMunicipios([]);
    onClose();
  };

  // Actualizar la función handleSubmit para mostrar notificaciones
  const handleSubmit = (values) => {
    // Formatear los datos de manera segura
    const formattedData = {
      ...values,
      fechaNacimiento: values.fechaNacimiento && dayjs(values.fechaNacimiento).isValid() 
        ? dayjs(values.fechaNacimiento).format('YYYY-MM-DD') 
        : null,
    };

    if (isEditing) {
      console.log('Editing employee:', formattedData);
      
      // Simular una operación de edición exitosa
      // En un caso real, aquí harías la llamada a la API
      
      // Mostrar notificación de éxito para edición
      notification.success(
        texts.userUpdated,
        `${texts.userUpdatedDesc} (${formattedData.nombres} ${formattedData.apellidos})`
      );
      
      handleClose();
    } else {
      console.log('Creating employee:', formattedData);
      
      // Simular una operación de creación exitosa
      // En un caso real, aquí harías la llamada a la API
      
      // Mostrar notificación de éxito para creación
      notification.success(
        texts.userCreated,
        `${texts.userCreatedDesc} (${formattedData.nombres} ${formattedData.apellidos})`
      );
      
      handleClose();
    }
  };

  // Agregar este console.log para depuración
  console.log('Form instance:', form); 

  // Asegúrate de que GlobalStyle se renderice dentro del componente
  return (
    <>
      <GlobalStyle />
      <Modal 
        show={visible}
        onClose={handleClose} // Use the new handleClose function
        width="800px"
        height="auto"
      >
        <h2>{isEditing ? texts.editUser : texts.createUser}</h2>
        
        {/* Asegúrate de que el Form reciba el objeto form como prop */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={empleadoData || {}}
          className="styled-form"
        >
          <FormContainer>
            <FormRow>
              <Form.Item 
                label={texts.names}
                name="nombres"
                rules={[{ 
                  required: true, 
                  message: texts.enterNames 
                }]}
                validateTrigger={['onBlur', 'onChange']}
              >
                <Inputs placeholder={texts.enterNames} />
              </Form.Item>
              
              <Form.Item
                label={texts.lastName}
                name="apellidos"
                rules={[{ required: true, message: texts.enterLastName }]}
              >
                <Inputs placeholder={texts.enterLastName} />
              </Form.Item>
            </FormRow>

            <FormRow>
              <Form.Item
                label={texts.idNumber}
                name="cedula"
                rules={[
                  { required: true, message: texts.enterIdNumber || "Enter your ID" },
                  { 
                    pattern: /^\d{3}-\d{7}-\d{1}$/, 
                    message: texts.invalidCedula 
                  }
                ]}
              >
                <Inputs placeholder="000-0000000-0" />
              </Form.Item>
              
              <Form.Item
                label={texts.email}
                name="email"
                rules={[
                  { required: true, message: texts.enterEmail },
                  { 
                    type: 'email', 
                    message: texts.invalidEmail 
                  }
                ]}
              >
                <Inputs placeholder="ejemplo@correo.com" />
              </Form.Item>
            </FormRow>

            <FormRow>
              <Form.Item
                label={texts.phone}
                name="telefono"
                rules={[
                  { required: true, message: texts.enterPhone || "Enter your phone number" },
                  { 
                    pattern: /^(\(\d{3}\)\s*\d{3}-\d{4}|\d{10})$/, 
                    message: texts.invalidPhone 
                  }
                ]}
              >
                <Inputs placeholder="(000) 000-0000" />
              </Form.Item>

              <Form.Item
                label={texts.birthDate}
                name="fechaNacimiento"
                rules={[{ required: true, message: texts.enterBirthDate }]}
              >
                <DatePicker 
                  style={{ 
                    width: '100%', 
                    height: '44px', 
                    borderRadius: '8px'
                  }}
                  format="DD/MM/YYYY"
                  placeholder="DD/MM/YYYY"
                  locale={language === 'es' ? esES : enUS}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  allowClear={true}
                />
              </Form.Item>
            </FormRow>

            <FormRow>
              <Form.Item
                label={texts.province}
                name="provincia"
                rules={[{ required: true, message: texts.selectProvince }]}
              >
                <Select 
                  placeholder={texts.selectProvince}
                  style={{ width: '100%', height: '44px' }}
                  onChange={handleProvinciaChange}
                >
                  {provincias.map(provincia => (
                    <Select.Option key={provincia.value} value={provincia.value}>
                      {provincia.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                label={texts.municipality}
                name="municipio"
                rules={[{ required: true, message: texts.selectMunicipality }]}
              >
                <Select 
                  placeholder={texts.selectMunicipality}
                  style={{ width: '100%', height: '44px' }}
                  disabled={!selectedProvincia}  // Esta línea ya deshabilita el select
                >
                  {municipios.map(municipio => (
                    <Select.Option key={municipio.value} value={municipio.value}>
                      {municipio.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </FormRow>

            <Form.Item
              label={texts.address}
              name="direccion"
              rules={[{ required: true, message: texts.enterAddress }]}
            >
              <Inputs placeholder={texts.enterAddress} />
            </Form.Item>

            {/* Add the Role selector field here */}
            <Form.Item
              label={texts.role}
              name="rol"
              rules={[{ required: true, message: texts.selectRole }]}
            >
              <Select 
                style={{ width: '100%', height: '44px' }}
                placeholder={texts.selectRole}
              >
                {roles.map(role => (
                  <Select.Option key={role.value} value={role.value}>
                    {role.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={texts.status}
              name="estado"
              rules={[{ required: true, message: 'Por favor seleccione un estado' }]}
            >
              <Select 
                style={{ width: '100%', height: '44px' }}
                placeholder={texts.status}
              >
                <Select.Option value="ACTIVO">{texts.active}</Select.Option>
                <Select.Option value="INACTIVO">{texts.inactive}</Select.Option>
              </Select>
            </Form.Item>

            <ButtonsContainer>
              <SecondaryButton onClick={handleClose}>
                {texts.cancel}
              </SecondaryButton>
              <MainButton 
                type="primary"
                onClick={() => {
                  form.validateFields()
                    .then((values) => {
                      handleSubmit(values);
                    })
                    .catch((info) => {
                      // Mostrar notificación de error
                      notification.error(
                        texts.validationError,
                        texts.validationErrorDesc
                      );
                      
                      // Código existente para el manejo de errores
                      const errorFields = info.errorFields;
                      console.log('Validation failed with fields:', errorFields);
                      
                      // Scroll al primer campo con error
                      const firstErrorField = errorFields[0]?.name[0];
                      if (firstErrorField) {
                        const fieldElement = document.querySelector(`[id$=_${firstErrorField}]`);
                        if (fieldElement) {
                          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          // Opcional: destacar visualmente el campo con error
                          fieldElement.focus();
                        }
                      }
                    });
                }}
              >
                {isEditing ? texts.save : texts.create}
              </MainButton>
            </ButtonsContainer>
          </FormContainer>
        </Form>
      </Modal>
    </>
  );
};

export default CrearEditarEmpleado;