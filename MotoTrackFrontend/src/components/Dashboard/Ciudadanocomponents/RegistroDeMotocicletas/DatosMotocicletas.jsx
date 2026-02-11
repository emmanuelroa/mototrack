import React, { useState, useEffect } from 'react';
import { Form, Radio, InputNumber, Select, Row, Col } from 'antd';
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

const StyledInputNumber = styled(InputNumber)`
  width: 100%;
  height: ${inputHeight} !important;
  background-color: transparent;
  color: ${props => props.$isDarkMode ? '#fff' : '#000'};
  border: ${inputBorderWidth} solid ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  border-radius: ${inputBorderRadius};
  padding: ${inputPadding};
  font-size: ${inputFontSize};
  
  .ant-input-number-input-wrap {
    height: 100%;
    display: flex;
    align-items: center;
  }
  
  input {
    height: 100%;
    padding: 0 !important;
    font-size: ${inputFontSize};
  }
  
  &:hover {
    border-color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'};
  }

  &:focus {
    border-color: ${props => props.$primaryColor};
    box-shadow: 0 0 5px ${props => props.$primaryColor}80;
    outline: none;
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
`;

const DatosMotocicletas = ({ form }) => {
  const { theme, currentTheme } = useTheme();
  const { language } = useLanguage();
  const isDarkMode = currentTheme === 'themeDark';
  const [hasInsurance, setHasInsurance] = useState('yes');
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  const translations = {
    es: {
      brand: 'Marca',
      brandPlaceholder: 'Seleccione la marca',
      brandRequired: 'Por favor seleccione una marca',
      model: 'Modelo',
      modelPlaceholder: 'Seleccione el modelo',
      modelRequired: 'Por favor seleccione un modelo',
      year: 'Año',
      yearRequired: 'Por favor ingrese el año',
      color: 'Color',
      colorPlaceholder: 'Color',
      colorRequired: 'Por favor seleccione un color',
      engineSize: 'Cilindraje (cc)',
      engineSizeRequired: 'Por favor ingrese el cilindraje',
      useType: 'Tipo de Uso',
      useTypeRequired: 'Por favor seleccione el tipo de uso',
      personal: 'Personal',
      commercial: 'Comercial',
      delivery: 'Delivery',
      chassisNumber: 'Número de Chasis',
      chassisPlaceholder: 'Número de chasis',
      chassisRequired: 'Por favor ingrese el número de chasis',
      insurance: 'Seguro',
      insuranceRequired: 'Por favor indique si tiene seguro',
      yes: 'Si',
      no: 'No',
      insuranceProvider: 'Seleccione su proveedor de seguro',
      insuranceProviderRequired: 'Por favor seleccione su proveedor de seguro',
      policyNumber: 'Número de Póliza',
      policyPlaceholder: 'Ingrese el número de póliza',
      policyRequired: 'Por favor ingrese el número de póliza'
    },
    en: {
      brand: 'Brand',
      brandPlaceholder: 'Select the brand',
      brandRequired: 'Please select a brand',
      model: 'Model',
      modelPlaceholder: 'Select the model',
      modelRequired: 'Please select a model',
      year: 'Year',
      yearRequired: 'Please enter the year',
      color: 'Color',
      colorPlaceholder: 'Color',
      colorRequired: 'Please select a color',
      engineSize: 'Engine Size (cc)',
      engineSizeRequired: 'Please enter the engine size',
      useType: 'Type of Use',
      useTypeRequired: 'Please select the type of use',
      personal: 'Personal',
      commercial: 'Commercial',
      delivery: 'Delivery',
      chassisNumber: 'Chassis Number',
      chassisPlaceholder: 'Chassis number',
      chassisRequired: 'Please enter the chassis number',
      insurance: 'Insurance',
      insuranceRequired: 'Please indicate if you have insurance',
      yes: 'Yes',
      no: 'No',
      insuranceProvider: 'Select your insurance provider',
      insuranceProviderRequired: 'Please select your insurance provider',
      policyNumber: 'Policy Number',
      policyPlaceholder: 'Enter the policy number',
      policyRequired: 'Please enter the policy number'
    }
  };
  
  const t = translations[language] || translations.es;
  
  // Motorcycle brands
  const motorcycleBrands = [
    { value: 'honda', label: 'Honda' },
    { value: 'yamaha', label: 'Yamaha' },
    { value: 'suzuki', label: 'Suzuki' },
    { value: 'kawasaki', label: 'Kawasaki' },
    { value: 'harley_davidson', label: 'Harley-Davidson' },
    { value: 'bmw', label: 'BMW' },
    { value: 'ducati', label: 'Ducati' },
    { value: 'ktm', label: 'KTM' },
    { value: 'triumph', label: 'Triumph' },
    { value: 'bajaj', label: 'Bajaj' },
  ];
  
  // Models by brand
  const modelsByBrand = {
    honda: [
      { value: 'cbr_600rr', label: 'CBR 600RR' },
      { value: 'cbr_1000rr', label: 'CBR 1000RR' },
      { value: 'crf_250l', label: 'CRF 250L' },
      { value: 'rebel_500', label: 'Rebel 500' },
      { value: 'africa_twin', label: 'Africa Twin' },
      { value: 'goldwing', label: 'Gold Wing' },
    ],
    yamaha: [
      { value: 'yzf_r6', label: 'YZF-R6' },
      { value: 'yzf_r1', label: 'YZF-R1' },
      { value: 'mt_07', label: 'MT-07' },
      { value: 'mt_09', label: 'MT-09' },
      { value: 'tenere_700', label: 'Ténéré 700' },
    ],
    suzuki: [
      { value: 'gsx_r600', label: 'GSX-R600' },
      { value: 'gsx_r750', label: 'GSX-R750' },
      { value: 'gsx_r1000', label: 'GSX-R1000' },
      { value: 'v_strom_650', label: 'V-Strom 650' },
      { value: 'hayabusa', label: 'Hayabusa' },
    ],
    kawasaki: [
      { value: 'ninja_400', label: 'Ninja 400' },
      { value: 'ninja_650', label: 'Ninja 650' },
      { value: 'ninja_zx6r', label: 'Ninja ZX-6R' },
      { value: 'ninja_zx10r', label: 'Ninja ZX-10R' },
      { value: 'z900', label: 'Z900' },
    ],
    harley_davidson: [
      { value: 'sportster', label: 'Sportster' },
      { value: 'street_glide', label: 'Street Glide' },
      { value: 'road_king', label: 'Road King' },
      { value: 'fat_boy', label: 'Fat Boy' },
      { value: 'softail', label: 'Softail' },
    ],
    bmw: [
      { value: 's1000rr', label: 'S 1000 RR' },
      { value: 'r1250gs', label: 'R 1250 GS' },
      { value: 'f850gs', label: 'F 850 GS' },
      { value: 'r_nine_t', label: 'R nineT' },
    ],
    ducati: [
      { value: 'panigale_v4', label: 'Panigale V4' },
      { value: 'monster', label: 'Monster' },
      { value: 'multistrada', label: 'Multistrada' },
      { value: 'scrambler', label: 'Scrambler' },
    ],
    ktm: [
      { value: 'duke_390', label: '390 Duke' },
      { value: 'duke_890', label: '890 Duke' },
      { value: 'adventure_790', label: '790 Adventure' },
      { value: 'rc_390', label: 'RC 390' },
    ],
    triumph: [
      { value: 'street_triple', label: 'Street Triple' },
      { value: 'speed_triple', label: 'Speed Triple' },
      { value: 'bonneville', label: 'Bonneville' },
      { value: 'tiger_900', label: 'Tiger 900' },
    ],
    bajaj: [
      { value: 'pulsar_ns200', label: 'Pulsar NS200' },
      { value: 'pulsar_rs200', label: 'Pulsar RS200' },
      { value: 'dominar_400', label: 'Dominar 400' },
      { value: 'avenger', label: 'Avenger' },
    ],
  };
  
  // Mock insurance providers
  const insuranceProviders = [
    { value: 'mapfre', label: 'Mapfre' },
    { value: 'seguros_sura', label: 'Seguros Sura' },
    { value: 'seguros_universal', label: 'Seguros Universal' },
    { value: 'seguros_banreservas', label: 'Seguros Banreservas' },
    { value: 'patria', label: 'La Colonial de Seguros' },
    { value: 'humano', label: 'Humano Seguros' },
  ];

  // Define color options
  const colorOptions = [
    { value: 'black', label: 'Negro / Black' },
    { value: 'white', label: 'Blanco / White' },
    { value: 'red', label: 'Rojo / Red' },
    { value: 'blue', label: 'Azul / Blue' },
    { value: 'green', label: 'Verde / Green' },
    { value: 'yellow', label: 'Amarillo / Yellow' },
    { value: 'orange', label: 'Naranja / Orange' },
    { value: 'purple', label: 'Morado / Purple' },
    { value: 'gray', label: 'Gris / Gray' },
    { value: 'silver', label: 'Plateado / Silver' },
  ];

  // Handle brand change
  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    form.setFieldsValue({ model: undefined }); // Reset model when brand changes
  };

  // Set initial values for the form fields
  useEffect(() => {
    // Only set if the field doesn't already have a value
    form.getFieldValue('hasInsurance') === undefined && 
      form.setFieldsValue({ hasInsurance: 'yes' });
      
    // Get initial brand value if it exists
    const initialBrand = form.getFieldValue('brand');
    if (initialBrand) {
      setSelectedBrand(initialBrand);
    }
  }, [form]);

  return (
    <FormContainer>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="brand" 
              label={t.brand}
              rules={[{ required: true, message: t.brandRequired }]}
              theme={theme}
            >
              <StyledSelect 
                $isDarkMode={isDarkMode}
                placeholder={t.brandPlaceholder}
                onChange={handleBrandChange}
              >
                {motorcycleBrands.map(brand => (
                  <Option key={brand.value} value={brand.value}>
                    {brand.label}
                  </Option>
                ))}
              </StyledSelect>
            </StyledFormItem>
          </Col>
          
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="model" 
              label={t.model}
              rules={[{ required: true, message: t.modelRequired }]}
              theme={theme}
            >
              <StyledSelect 
                $isDarkMode={isDarkMode}
                placeholder={t.modelPlaceholder}
                disabled={!selectedBrand}
              >
                {selectedBrand && modelsByBrand[selectedBrand]?.map(model => (
                  <Option key={model.value} value={model.value}>
                    {model.label}
                  </Option>
                ))}
              </StyledSelect>
            </StyledFormItem>
          </Col>
          
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="year" 
              label={t.year}
              rules={[{ required: true, message: t.yearRequired }]}
              theme={theme}
            >
              <StyledInputNumber 
                min={1970} 
                max={2025} 
                $isDarkMode={isDarkMode}
                placeholder={t.year}
              />
            </StyledFormItem>
          </Col>
          
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="color" 
              label={t.color}
              rules={[{ required: true, message: t.colorRequired }]}
              theme={theme}
            >
              <StyledSelect 
                $isDarkMode={isDarkMode}
                placeholder={t.colorPlaceholder}
              >
                {colorOptions.map(color => (
                  <Option key={color.value} value={color.value}>
                    {color.label}
                  </Option>
                ))}
              </StyledSelect>
            </StyledFormItem>
          </Col>
          
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="engineSize" 
              label={t.engineSize}
              rules={[{ required: true, message: t.engineSizeRequired }]}
              theme={theme}
            >
              <StyledInputNumber 
                min={50} 
                max={2000} 
                $isDarkMode={isDarkMode}
                placeholder="cc"
              />
            </StyledFormItem>
          </Col>
          
          <Col xs={24} md={12}>
            <StyledFormItem 
              name="useType" 
              label={t.useType}
              rules={[{ required: true, message: t.useTypeRequired }]}
              theme={theme}
            >
              <StyledSelect $isDarkMode={isDarkMode}>
                <Option value="personal">{t.personal}</Option>
                <Option value="commercial">{t.commercial}</Option>
                <Option value="delivery">{t.delivery}</Option>
              </StyledSelect>
            </StyledFormItem>
          </Col>
          
          <Col span={24}>
            <StyledFormItem 
              name="chassisNumber" 
              label={t.chassisNumber}
              rules={[{ required: true, message: t.chassisRequired }]}
              theme={theme}
            >
              <Inputs placeholder={t.chassisPlaceholder} />
            </StyledFormItem>
          </Col>
          
          <Col span={24}>
            <StyledFormItem 
              name="hasInsurance" 
              label={t.insurance}
              rules={[{ required: true, message: t.insuranceRequired }]}
              theme={theme}
            >
              <StyledRadioGroup 
                onChange={(e) => setHasInsurance(e.target.value)}
              >
                <Radio value="yes">{t.yes}</Radio>
                <Radio value="no">{t.no}</Radio>
              </StyledRadioGroup>
            </StyledFormItem>
          </Col>
          
          {hasInsurance === 'yes' && (
            <>
              <Col xs={24} md={12}>
                <StyledFormItem 
                  name="insuranceProvider" 
                  label={t.insuranceProvider}
                  rules={[{ required: true, message: t.insuranceProviderRequired }]}
                  theme={theme}
                >
                  <StyledSelect $isDarkMode={isDarkMode}>
                    {insuranceProviders.map(provider => (
                      <Option key={provider.value} value={provider.value}>
                        {provider.label}
                      </Option>
                    ))}
                  </StyledSelect>
                </StyledFormItem>
              </Col>
              
              <Col xs={24} md={12}>
                <StyledFormItem 
                  name="policyNumber" 
                  label={t.policyNumber}
                  rules={[{ required: true, message: t.policyRequired }]}
                  theme={theme}
                >
                  <Inputs placeholder={t.policyPlaceholder} />
                </StyledFormItem>
              </Col>
            </>
          )}
        </Row>
      </Form>
    </FormContainer>
  );
};

export default DatosMotocicletas;