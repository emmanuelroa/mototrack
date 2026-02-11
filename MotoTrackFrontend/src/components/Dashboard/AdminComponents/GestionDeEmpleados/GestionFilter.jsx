import React, { useState } from 'react';
import { Row, Col, Select, Form, Input } from 'antd';
import styled from 'styled-components';
import FilterSection from '../../CommonComponts/FilterSection';
import { useLanguage } from '../../../../context/LanguageContext';

const { Option } = Select;

const FormItem = styled(Form.Item)`
  margin-bottom: 16px;
`;

const GestionFilter = ({ 
  isVisible, 
  onClose, 
  onApplyFilters, 
  roles = [],
  statuses = []
}) => {
  const [form] = Form.useForm();
  const { language } = useLanguage();

  // Translations
  const translations = {
    es: {
      filterTitle: 'Filtros de búsqueda',
      cedula: 'Cédula',
      role: 'Rol',
      status: 'Estado',
      allCedulas: 'Todas las cédulas',
      allRoles: 'Todos los roles',
      allStatuses: 'Todos los estados',
      cedulaPlaceholder: 'Buscar por cédula'
    },
    en: {
      filterTitle: 'Search Filters',
      cedula: 'ID Number',
      role: 'Role',
      status: 'Status',
      allCedulas: 'All ID numbers',
      allRoles: 'All roles',
      allStatuses: 'All statuses',
      cedulaPlaceholder: 'Search by ID number'
    }
  };

  const t = translations[language] || translations.es;

  const handleApply = () => {
    const values = form.getFieldsValue();
    onApplyFilters(values);
  };

  const handleClear = () => {
    form.resetFields();
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
          cedula: '',
          role: 'all',
          status: 'all'
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={8}>
            <FormItem name="cedula" label={t.cedula}>
              <Input 
                placeholder={t.cedulaPlaceholder}
                allowClear
              />
            </FormItem>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={8}>
            <FormItem name="role" label={t.role}>
              <Select placeholder={t.allRoles}>
                <Option value="all">{t.allRoles}</Option>
                {roles?.map(role => (
                  <Option key={role.id || role.value} value={role.id || role.value}>
                    {role.name || role.label}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={8}>
            <FormItem name="status" label={t.status}>
              <Select placeholder={t.allStatuses}>
                <Option value="all">{t.allStatuses}</Option>
                {statuses?.map(status => (
                  <Option key={status.id || status.value} value={status.id || status.value}>
                    {status.name || status.label}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </FilterSection>
  );
};

export default GestionFilter;