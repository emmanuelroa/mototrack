import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import FilterBar from '../../../components/Dashboard/CommonComponts/Filterbar';
import GestionFilter from '../../../components/Dashboard/EmpleadoComponents/GestionComponents/GestionFilter';
import GestionTable from '../../../components/Dashboard/EmpleadoComponents/GestionComponents/GestionTable';
import { exportTableToPdf } from '../../../components/Dashboard/CommonComponts/ExportTablePdf';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { registrosData, REGISTRO_STATUS } from '../../../data/registrosData';
import { useNotification } from '../../../components/Dashboard/CommonComponts/ToastNotifications';

const ResponsiveContainer = styled.div`
  padding: 0 16px;
  
  @media (max-width: 768px) {
    padding: 0 8px;
  }
  
  .dashboard-row {
    margin-bottom: 24px;
    
    @media (max-width: 576px) {
      margin-bottom: 16px;
    }
  }
`;

const SectionContainer = styled.div`
  @media (max-width: 576px) {
    padding: 8px;
  }
`;

function EmpleadoGestion() {
  const { theme, currentTheme } = useTheme();
  const { language } = useLanguage();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filteredData, setFilteredData] = useState(registrosData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    brand: 'all',
    model: 'all',
    status: 'all',
    dateRange: null
  });

  const notification = useNotification();
  const tableColumnsRef = useRef([]);
  
  // Extract unique brands and models for filters
  const brands = [...new Set(registrosData.map(item => item.datosMotocicleta.marca))].map(
    brand => ({ id: brand, name: brand })
  );
  
  const models = registrosData.map(item => ({
    id: item.datosMotocicleta.modelo,
    name: item.datosMotocicleta.modelo,
    brandId: item.datosMotocicleta.marca
  }));
  
  const statuses = [
    { id: REGISTRO_STATUS.APROBADO, name: 'Aprobado' },
    { id: REGISTRO_STATUS.PENDIENTE, name: 'Pendiente' },
    { id: REGISTRO_STATUS.RECHAZADO, name: 'Rechazado' }
  ];
  
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  // Search function
  const handleSearch = (field, value) => {
    setSearchTerm(value);
    applyFiltersAndSearch(value, activeFilters);
  };
  
  // Filter function
  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(searchTerm, filters);
    setFiltersVisible(false);
  };
  
  // Combined filter and search function
  const applyFiltersAndSearch = (search, filters) => {
    let result = [...registrosData];
    
    // Apply search if there's a search term
    if (search && search.trim() !== '') {
      const lowercaseSearch = search.toLowerCase();
      result = result.filter(record =>
        record.id.toString().includes(lowercaseSearch) ||
        record.datosPersonales.nombreCompleto.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Apply filters
    if (filters.brand && filters.brand !== 'all') {
      result = result.filter(record => record.datosMotocicleta.marca === filters.brand);
    }
    
    if (filters.model && filters.model !== 'all') {
      result = result.filter(record => record.datosMotocicleta.modelo === filters.model);
    }
    
    if (filters.status && filters.status !== 'all') {
      result = result.filter(record => record.estado === filters.status);
    }
    
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const startDate = filters.dateRange[0].startOf('day');
      const endDate = filters.dateRange[1].endOf('day');
      
      result = result.filter(record => {
        const recordDate = new Date(record.fechaSolicitud);
        return recordDate >= startDate.toDate() && recordDate <= endDate.toDate();
      });
    }
    
    setFilteredData(result);
  };

  // Handler functions for the table actions
  const handleView = (record) => {
    console.log('View details for:', record);
  };

  const handleReview = (record) => {
    console.log('Review application:', record);
  };

  const handleCarnet = (record) => {
    console.log('Generate card for:', record);
  };

  const handleTableReady = (columns) => {
    tableColumnsRef.current = columns;
  };

  const handleExportPDF = async () => {
    try {
      if (!tableColumnsRef.current || tableColumnsRef.current.length === 0) {
        notification.warning(
          'Advertencia', 
          'No hay columnas disponibles para exportar'
        );
        return;
      }

      // Generate subtitle based on active filters
      let subtitle = '';
      
      if (activeFilters.brand && activeFilters.brand !== 'all') {
        subtitle += `Marca: ${activeFilters.brand} `;
      }
      
      if (activeFilters.model && activeFilters.model !== 'all') {
        subtitle += `Modelo: ${activeFilters.model} `;
      }
      
      if (activeFilters.status && activeFilters.status !== 'all') {
        const statusText = statuses.find(s => s.id === activeFilters.status)?.name || activeFilters.status;
        subtitle += `Estado: ${statusText} `;
      }

      if (activeFilters.dateRange && activeFilters.dateRange[0] && activeFilters.dateRange[1]) {
        const startDate = activeFilters.dateRange[0].format('DD/MM/YYYY');
        const endDate = activeFilters.dateRange[1].format('DD/MM/YYYY');
        subtitle += `Período: ${startDate} - ${endDate}`;
      }

      // Data transformation function to format dates
      const transformData = (data) => {
        return data.map(record => ({
          ...record,
          fechaSolicitud: new Date(record.fechaSolicitud).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        }));
      };

      await exportTableToPdf({
        columns: tableColumnsRef.current,
        data: filteredData,
        fileName: 'registro-motocicletas',
        title: 'Registro de Motocicletas',
        subtitle: subtitle.trim(),
        transformData,
        notificationSystem: notification
      });
    } catch (error) {
      console.error('Export error:', error);
      notification.error(
        'Error', 
        'Error al generar el PDF. Por favor, intente nuevamente.'
      );
    }
  };

  return (
    <ResponsiveContainer>
      <Row gutter={[16, 24]} className="dashboard-row">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <SectionContainer>
            <FilterBar 
              onFilterClick={toggleFilters}
              onSearch={handleSearch}
              onExportPDF={handleExportPDF}
            />
            
            <GestionFilter 
              isVisible={filtersVisible}
              onClose={() => setFiltersVisible(false)}
              onApplyFilters={handleApplyFilters}
              brands={brands}
              models={models}
              statuses={statuses}
            />
            
            <GestionTable 
              registrosData={filteredData}
              onView={handleView} 
              onReview={handleReview} 
              onCarnet={handleCarnet}
              onTableReady={handleTableReady}
            />
          </SectionContainer>
        </Col>
      </Row>
    </ResponsiveContainer>
  );
}

export default EmpleadoGestion;