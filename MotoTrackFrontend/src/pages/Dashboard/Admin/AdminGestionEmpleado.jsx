import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'antd';
import EmpleadosMetricsCards from '../../../components/Dashboard/AdminComponents/GestionDeEmpleados/EmpleadosMetricsCards';
import FilterBar from '../../../components/Dashboard/CommonComponts/Filterbar';
import GestionFilter from '../../../components/Dashboard/AdminComponents/GestionDeEmpleados/GestionFilter';
import GestionTable from '../../../components/Dashboard/AdminComponents/GestionDeEmpleados/GestionTable';
import { exportTableToPdf } from '../../../components/Dashboard/CommonComponts/ExportTablePdf';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { empleadosData, EMPLEADO_ROL } from '../../../data/empleadosData';
import { useNotification } from '../../../components/Dashboard/CommonComponts/ToastNotifications';
import { usePrimaryColor } from '../../../context/PrimaryColorContext';
import styled from 'styled-components';
import CrearEditarEmpleado from '../../../components/Dashboard/AdminComponents/GestionDeEmpleados/Crear&EditarEmpleado';

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

function AdminGestionEmpleado() {
  const { theme, currentTheme } = useTheme();
  const { language } = useLanguage();
  const { primaryColor } = usePrimaryColor();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    cedula: '',
    role: 'all',
    status: 'all'
  });
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const notification = useNotification();
  const tableColumnsRef = useRef([]);
  
  // Initialize with employee data
  useEffect(() => {
    setFilteredData(empleadosData);
  }, []);
  
  // Extract unique roles and statuses for filters
  const roles = [
    { id: 'ADMIN', name: language === 'es' ? 'Administrador' : 'Administrator' },
    { id: 'EMPLEADO', name: language === 'es' ? 'Empleado' : 'Employee' }
  ];
  
  const statuses = [
    { id: 'ACTIVO', name: language === 'es' ? 'Activo' : 'Active' },
    { id: 'INACTIVO', name: language === 'es' ? 'Inactivo' : 'Inactive' }
  ];
  
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  // Search function
  const handleSearch = (field, value) => {
    setSearchTerm(value);
    
    // If search is cleared, just apply existing filters without search term
    if (!value || value.trim() === '') {
      applyFiltersAndSearch('', activeFilters);
    } else {
      // Apply search with active filters
      applyFiltersAndSearch(value, activeFilters);
    }
  };
  
  // Filter function
  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(searchTerm, filters);
    setFiltersVisible(false);
  };
  
  // Combined filter and search function
  const applyFiltersAndSearch = (search, filters) => {
    // Start with original data
    let result = [...empleadosData];
    
    // Apply search if there's a search term
    if (search && search.trim() !== '') {
      const lowercaseSearch = search.toLowerCase();
      result = result.filter(employee =>
        String(employee.id).includes(lowercaseSearch) ||
        `${employee.nombres} ${employee.apellidos}`.toLowerCase().includes(lowercaseSearch) ||
        employee.cedula.toLowerCase().includes(lowercaseSearch) ||
        employee.telefono.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Apply filters
    if (filters.cedula && filters.cedula.trim() !== '') {
      const lowercaseCedula = filters.cedula.toLowerCase();
      result = result.filter(employee =>
        employee.cedula.toLowerCase().includes(lowercaseCedula)
      );
    }
    
    if (filters.role && filters.role !== 'all') {
      result = result.filter(employee => employee.role === filters.role);
    }
    
    if (filters.status && filters.status !== 'all') {
      result = result.filter(employee => employee.estado === filters.status);
    }
    
    setFilteredData(result);
  };

  // Handler functions for the table actions
  const handleView = (record) => {
    notification.info(
      language === 'es' ? 'Ver Empleado' : 'View Employee',
      `ID: ${record.id} - ${record.nombres} ${record.apellidos}`
    );
  };

  const handleEdit = (record) => {
    setSelectedEmployee(record);
    setShowCreateEditModal(true);
  };

  const handleDelete = (record) => {
    // Remove employee from filteredData
    const updatedData = filteredData.filter(item => item.id !== record.id);
    setFilteredData(updatedData);
  };

  const handleActivate = (record) => {
    // Activate employee
    const updatedData = filteredData.map(item => 
      item.id === record.id ? { ...item, estado: 'ACTIVO' } : item
    );
    setFilteredData(updatedData);
  };

  const handleDeactivate = (record) => {
    // Deactivate employee
    const updatedData = filteredData.map(item => 
      item.id === record.id ? { ...item, estado: 'INACTIVO' } : item
    );
    setFilteredData(updatedData);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null); // Ensure no employee is selected
    setShowCreateEditModal(true);
  };

  const handleTableReady = (columns) => {
    tableColumnsRef.current = columns;
  };

  const handleExportPDF = async () => {
    try {
      await exportTableToPdf({
        columns: tableColumnsRef.current,
        data: filteredData,
        fileName: language === 'es' ? 'empleados' : 'employees',
        title: language === 'es' ? 'Lista de Empleados' : 'Employee List',
        notificationSystem: notification
      });
    } catch (error) {
      console.error('Export error:', error);
      notification.error(
        language === 'es' ? 'Error' : 'Error', 
        language === 'es' 
          ? 'Error al generar el PDF' 
          : 'Error generating PDF'
      );
    }
  };

  const handleCloseModal = () => {
    setShowCreateEditModal(false);
    setSelectedEmployee(null);
  };

  return (
    <ResponsiveContainer>
      <Row gutter={[16, 24]} className="dashboard-row">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <SectionContainer>
            <EmpleadosMetricsCards />
          </SectionContainer>
        </Col>
      </Row>
      
      <Row gutter={[16, 24]} className="dashboard-row">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <SectionContainer>
            {/* Use the enhanced FilterBar with Add Employee button */}
            <FilterBar 
              onFilterClick={toggleFilters}
              onSearch={handleSearch}
              onExportPDF={handleExportPDF}
              showAddButton={true} // Only show Add button on employee management page
              onAddClick={handleAddEmployee}
              searchPlaceholder={language === 'es' ? 'Buscar empleado...' : 'Search employee...'}
            />
            
            <GestionFilter 
              isVisible={filtersVisible}
              onClose={() => setFiltersVisible(false)}
              onApplyFilters={handleApplyFilters}
              roles={roles}
              statuses={statuses}
            />
            
            <GestionTable 
              empleadosData={filteredData}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              onTableReady={handleTableReady}
            />
          </SectionContainer>
        </Col>
      </Row>

      <CrearEditarEmpleado
        visible={showCreateEditModal}
        onClose={handleCloseModal}
        empleadoData={selectedEmployee}
        isEditing={!!selectedEmployee}
      />
    </ResponsiveContainer>
  );
}

export default AdminGestionEmpleado;