import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Select, DatePicker, Form } from 'antd';
import styled from 'styled-components';
import FilterSection from '../../CommonComponts/FilterSection';
import { useLanguage } from '../../../../context/LanguageContext';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FormItem = styled(Form.Item)`
  margin-bottom: 16px;
`;

const GestionFilter = ({ 
  isVisible, 
  onClose, 
  onApplyFilters, 
  brands = [],
  models = [],
  statuses = []
}) => {
  const [form] = Form.useForm();
  const { language } = useLanguage();
  const [selectedBrand, setSelectedBrand] = useState('all');
  
  // If we don't have real data yet, use placeholder data
  const placeholderBrands = useMemo(() => brands.length ? brands : [
    { id: 'honda', name: 'Honda' },
    { id: 'yamaha', name: 'Yamaha' },
    { id: 'suzuki', name: 'Suzuki' },
    { id: 'bajaj', name: 'Bajaj' }
  ], [brands]);
  
  const placeholderModels = useMemo(() => models.length ? models : [
    { id: 'wave', name: 'Wave', brandId: 'honda' },
    { id: 'cbr', name: 'CBR', brandId: 'honda' },
    { id: 'fz', name: 'FZ', brandId: 'yamaha' },
    { id: 'pulsar', name: 'Pulsar', brandId: 'bajaj' }
  ], [models]);
  
  const placeholderStatuses = useMemo(() => statuses.length ? statuses : [
    { id: 'active', name: 'Activo' },
    { id: 'pending', name: 'Pendiente' },
    { id: 'expired', name: 'Expirado' }
  ], [statuses]);
  
  // Memoize filtered models to prevent recalculation on every render
  const filteredModels = useMemo(() => {
    if (selectedBrand === 'all') {
      return placeholderModels;
    } else {
      return placeholderModels.filter(model => model.brandId === selectedBrand);
    }
  }, [selectedBrand, placeholderModels]);
  
  const translations = {
    es: {
      filterTitle: 'Filtros de búsqueda',
      brand: 'Marca',
      model: 'Modelo',
      status: 'Estado',
      registrationDate: 'Fecha de registro',
      allBrands: 'Todas las marcas',
      allModels: 'Todos los modelos',
      allStatuses: 'Todos los estados',
      dateRange: 'Rango de fechas'
    },
    en: {
      filterTitle: 'Search Filters',
      brand: 'Brand',
      model: 'Model',
      status: 'Status',
      registrationDate: 'Registration Date',
      allBrands: 'All brands',
      allModels: 'All models',
      allStatuses: 'All statuses',
      dateRange: 'Date range'
    }
  };

  const t = translations[language] || translations.es;
  
  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    form.setFieldValue('model', 'all');
  };
  
  const handleApply = () => {
    const values = form.getFieldsValue();
    onApplyFilters(values);
  };
  
  const handleClear = () => {
    form.resetFields();
    setSelectedBrand('all');
  };

  return (
    <FilterSection 
      title={t.filterTitle}
      isVisible={isVisible}
      onClose={onClose}
      onApply={handleApply}
      onClear={handleClear}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          brand: 'all',
          model: 'all',
          status: 'all',
          dateRange: null
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6} lg={6}>
            <FormItem 
              name="brand" 
              label={t.brand}
            >
              <Select 
                placeholder={t.allBrands}
                onChange={handleBrandChange}
              >
                <Option value="all">{t.allBrands}</Option>
                {placeholderBrands.map(brand => (
                  <Option key={brand.id} value={brand.id}>{brand.name}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={6}>
            <FormItem 
              name="model" 
              label={t.model}
            >
              <Select 
                placeholder={t.allModels}
                disabled={selectedBrand === 'all' ? false : filteredModels.length === 0}
              >
                <Option value="all">{t.allModels}</Option>
                {filteredModels.map(model => (
                  <Option key={model.id} value={model.id}>{model.name}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={6}>
            <FormItem 
              name="status" 
              label={t.status}
            >
              <Select placeholder={t.allStatuses}>
                <Option value="all">{t.allStatuses}</Option>
                {placeholderStatuses.map(status => (
                  <Option key={status.id} value={status.id}>{status.name}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={6}>
            <FormItem 
              name="dateRange" 
              label={t.registrationDate}
            >
              <RangePicker 
                style={{ width: '100%' }} 
                placeholder={[t.dateRange, t.dateRange]}
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </FilterSection>
  );
};

export default GestionFilter;