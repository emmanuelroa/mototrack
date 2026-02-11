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
  statuses = [],
  employees = []
}) => {
  const [form] = Form.useForm();
  const { language } = useLanguage();
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Translations
  const translations = {
    es: {
      filterTitle: 'Filtros de búsqueda',
      brand: 'Marca',
      model: 'Modelo',
      status: 'Estado',
      registrationDate: 'Fecha de registro',
      employees: 'Empleados',
      allBrands: 'Todas las marcas',
      allModels: 'Todos los modelos',
      allStatuses: 'Todos los estados',
      allEmployees: 'Todos los empleados',
      selectEmployees: 'Seleccionar empleados',
      dateRange: 'Rango de fechas'
    },
    en: {
      filterTitle: 'Search Filters',
      brand: 'Brand',
      model: 'Model',
      status: 'Status',
      registrationDate: 'Registration Date',
      employees: 'Employees',
      allBrands: 'All brands',
      allModels: 'All models',
      allStatuses: 'All statuses',
      allEmployees: 'All employees',
      selectEmployees: 'Select employees',
      dateRange: 'Date range'
    }
  };

  const t = translations[language] || translations.es;

  // Memoize filtered models
  const filteredModels = useMemo(() => {
    if (selectedBrand === 'all') {
      return models;
    }
    return models.filter(model => model.brandId === selectedBrand);
  }, [selectedBrand, models]);

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

  // Custom handling for employee selection including the "all" option
  const handleEmployeeChange = (values) => {
    // If no values selected (all cleared), set to "all"
    if (!values || values.length === 0) {
      form.setFieldValue('employee', ['all']);
      return;
    }
    
    // Handle transition from "all" to specific employees
    // If we previously had just "all" selected and now added other values,
    // we should remove "all" and keep only the specific employees
    const currentValue = form.getFieldValue('employee');
    const hadOnlyAll = currentValue.length === 1 && currentValue[0] === 'all';
    
    if (hadOnlyAll && values.length > 1 && values.includes('all')) {
      // Remove "all" and keep only specific employees
      form.setFieldValue('employee', values.filter(v => v !== 'all'));
      return;
    }
    
    // If the user specifically selects "all", clear other selections
    if (values.includes('all') && values.length > 1) {
      // Check if "all" was just added (not previously selected)
      const allWasJustAdded = !currentValue.includes('all');
      
      if (allWasJustAdded) {
        // User added "all" while having specific selections, so clear to just "all"
        form.setFieldValue('employee', ['all']);
      } else {
        // User had "all" and is trying to add specific employees,
        // so remove "all" and keep the specific selections
        form.setFieldValue('employee', values.filter(v => v !== 'all'));
      }
      return;
    }
    
    // For all other cases, keep the values as is
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
          employee: ['all'],
          dateRange: null
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6} lg={6}>
            <FormItem name="brand" label={t.brand}>
              <Select 
                placeholder={t.allBrands}
                onChange={handleBrandChange}
              >
                <Option value="all">{t.allBrands}</Option>
                {brands?.map(brand => (
                  <Option key={brand.id} value={brand.id}>{brand.name}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={6}>
            <FormItem name="model" label={t.model}>
              <Select 
                placeholder={t.allModels}
                disabled={selectedBrand === 'all' ? false : filteredModels.length === 0}
              >
                <Option value="all">{t.allModels}</Option>
                {filteredModels?.map(model => (
                  <Option key={model.id} value={model.id}>{model.name}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={6}>
            <FormItem name="status" label={t.status}>
              <Select placeholder={t.allStatuses}>
                <Option value="all">{t.allStatuses}</Option>
                {statuses?.map(status => (
                  <Option key={status.id} value={status.id}>{status.name}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={6}>
            <FormItem name="employee" label={t.employees}>
              <Select 
                mode="multiple"
                placeholder={t.selectEmployees}
                onChange={handleEmployeeChange}
                maxTagCount={2}
                allowClear
              >
                <Option value="all">{t.allEmployees}</Option>
                {employees
                  ?.filter(employee => 
                    employee.role !== 'PROPIETARIO' && 
                    employee.role !== 'OWNER' &&
                    employee.type !== 'PROPIETARIO'
                  )
                  .map(employee => (
                    <Option key={employee.id} value={employee.id}>
                      {employee.name}
                    </Option>
                  ))
                }
              </Select>
            </FormItem>
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={6}>
            <FormItem name="dateRange" label={t.registrationDate}>
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