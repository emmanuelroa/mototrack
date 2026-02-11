import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'antd';
import SolicitudesMetricsCards from '../../../components/Dashboard/AdminComponents/GestionDeSolicitudes/SolicitudesMetricsCards';
import FilterBar from '../../../components/Dashboard/CommonComponts/Filterbar';
import GestionFilter from '../../../components/Dashboard/AdminComponents/GestionDeSolicitudes/GestionFilter';
import GestionTable from '../../../components/Dashboard/AdminComponents/GestionDeSolicitudes/GestionTable';
import { exportTableToPdf } from '../../../components/Dashboard/CommonComponts/ExportTablePdf';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { registrosData, REGISTRO_STATUS } from '../../../data/registrosData';
import { empleadosData, EMPLEADO_ROL } from '../../../data/empleadosData';
import { useNotification } from '../../../components/Dashboard/CommonComponts/ToastNotifications';
import styled from 'styled-components';

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

function AdminSolicitudes() {
  const { theme, currentTheme } = useTheme();
  const { language } = useLanguage();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    brand: 'all',
    model: 'all',
    status: 'all',
    employee: ['all'], // Set as array initially
    dateRange: null
  });

  const notification = useNotification();
  const tableColumnsRef = useRef([]);
  
  // Update registrosData with employee assignments on component mount
  useEffect(() => {
    // Clone the registrosData to avoid modifying the original
    const updatedData = registrosData.map(record => {
      // If status is not pending and there's no assignedEmployee, add one
      if (record.estado !== REGISTRO_STATUS.PENDIENTE && !record.asignadoA) {
        // Randomly select an employee for demonstration
        const randomEmployee = empleadosData[Math.floor(Math.random() * empleadosData.length)];
        return {
          ...record,
          asignadoA: {
            id: randomEmployee.id,
            nombre: `${randomEmployee.nombres} ${randomEmployee.apellidos}`,
            avatar: randomEmployee.avatar || null
          }
        };
      }
      return record;
    });
    
    setFilteredData(updatedData);
  }, []);
  
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
    { id: REGISTRO_STATUS.APROBADO, name: language === 'es' ? 'Aprobado' : 'Approved' },
    { id: REGISTRO_STATUS.PENDIENTE, name: language === 'es' ? 'Pendiente' : 'Pending' },
    { id: REGISTRO_STATUS.RECHAZADO, name: language === 'es' ? 'Rechazado' : 'Rejected' }
  ];
  
  const employees = empleadosData
    .filter(emp => emp.estado === 'ACTIVO')
    .map(emp => ({
      id: emp.id,
      name: `${emp.nombres} ${emp.apellidos}`
    }));
  
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  // Search function
  const handleSearch = (field, value) => {
    setSearchTerm(value);
    
    // If search is cleared, just apply existing filters without search term
    if (!value || value.trim() === '') {
      const originalData = [...registrosData];
      // Apply only existing active filters to the original data
      let result = originalData.map(record => {
        // Update employee assignment for display
        if (record.estado !== REGISTRO_STATUS.PENDIENTE && !record.asignadoA) {
          const randomEmployee = empleadosData[Math.floor(Math.random() * empleadosData.length)];
          return {
            ...record,
            asignadoA: {
              id: randomEmployee.id,
              nombre: `${randomEmployee.nombres} ${randomEmployee.apellidos}`,
              avatar: randomEmployee.avatar || null
            }
          };
        }
        return record;
      });
      
      // Apply only the active filters without search
      if (activeFilters.brand && activeFilters.brand !== 'all') {
        result = result.filter(record => record.datosMotocicleta.marca === activeFilters.brand);
      }
      
      if (activeFilters.model && activeFilters.model !== 'all') {
        result = result.filter(record => record.datosMotocicleta.modelo === activeFilters.model);
      }
      
      if (activeFilters.status && activeFilters.status !== 'all') {
        result = result.filter(record => record.estado === activeFilters.status);
      }
      
      // Enhanced employee filtering logic
      if (activeFilters.employee && Array.isArray(activeFilters.employee)) {
        // Only filter if the selection doesn't include 'all'
        if (!activeFilters.employee.includes('all')) {
          result = result.filter(record => {
            // If record has no assigned employee, it doesn't match any employee filter
            if (!record.asignadoA || !record.asignadoA.id) {
              return false;
            }
            
            // Check if the assigned employee ID is in the selected employees array
            return activeFilters.employee.some(selectedId => 
              record.asignadoA.id.toString() === selectedId.toString()
            );
          });
        }
      }
      
      if (activeFilters.dateRange && activeFilters.dateRange[0] && activeFilters.dateRange[1]) {
        const startDate = activeFilters.dateRange[0].startOf('day');
        const endDate = activeFilters.dateRange[1].endOf('day');
        
        result = result.filter(record => {
          const recordDate = new Date(record.fechaSolicitud);
          return recordDate >= startDate.toDate() && recordDate <= endDate.toDate();
        });
      }
      
      setFilteredData(result);
    } else {
      // Normal search with term and filters
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
    // Start with original data, not filtered data
    let result = [...registrosData].map(record => {
      // Update employee assignment for display
      if (record.estado !== REGISTRO_STATUS.PENDIENTE && !record.asignadoA) {
        const randomEmployee = empleadosData[Math.floor(Math.random() * empleadosData.length)];
        return {
          ...record,
          asignadoA: {
            id: randomEmployee.id,
            nombre: `${randomEmployee.nombres} ${randomEmployee.apellidos}`,
            avatar: randomEmployee.avatar || null
          }
        };
      }
      return record;
    });
    
    // Apply search if there's a search term
    if (search && search.trim() !== '') {
      const lowercaseSearch = search.toLowerCase();
      result = result.filter(record =>
        String(record.id).includes(lowercaseSearch) ||
        record.datosPersonales.nombreCompleto.toLowerCase().includes(lowercaseSearch) ||
        record.datosPersonales.cedula.toLowerCase().includes(lowercaseSearch) ||
        (record.datosMotocicleta?.placa && record.datosMotocicleta.placa.toLowerCase().includes(lowercaseSearch))
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
    
    // Enhanced employee filtering logic
    if (filters.employee && Array.isArray(filters.employee)) {
      // Only filter if "all" is not included
      if (!filters.employee.includes('all')) {
        result = result.filter(record => {
          // Skip records without assigned employees
          if (!record.asignadoA || !record.asignadoA.id) {
            return false;
          }
          
          // Check if this record's employee is in our selected employee list
          return filters.employee.some(empId => 
            String(record.asignadoA.id) === String(empId)
          );
        });
      }
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
    notification.info(
      language === 'es' ? 'Ver Solicitud' : 'View Request',
      `ID: ${record.id} - ${record.datosPersonales.nombreCompleto}`
    );
  };

  const handleApprove = (record) => {
    // Update record status in filteredData
    const updatedData = filteredData.map(item => {
      if (item.id === record.id) {
        return { ...item, estado: REGISTRO_STATUS.APROBADO };
      }
      return item;
    });
    
    setFilteredData(updatedData);
    
    notification.success(
      language === 'es' ? 'Solicitud Aprobada' : 'Request Approved',
      `ID: ${record.id} - ${record.datosPersonales.nombreCompleto}`
    );
  };

  const handleReject = (record) => {
    // Update record status in filteredData
    const updatedData = filteredData.map(item => {
      if (item.id === record.id) {
        return { ...item, estado: REGISTRO_STATUS.RECHAZADO };
      }
      return item;
    });
    
    setFilteredData(updatedData);
    
    notification.error(
      language === 'es' ? 'Solicitud Rechazada' : 'Request Rejected',
      `ID: ${record.id} - ${record.datosPersonales.nombreCompleto}`
    );
  };

  const handleAssign = (record, assignedEmployee) => {
    // Update record with assigned employee
    const updatedData = filteredData.map(item => {
      if (item.id === record.id) {
        return { ...item, asignadoA: assignedEmployee };
      }
      return item;
    });
    
    setFilteredData(updatedData);
  };

  const handleTableReady = (columns) => {
    tableColumnsRef.current = columns;
  };

  const handleExportPDF = async () => {
    try {
      if (!tableColumnsRef.current || tableColumnsRef.current.length === 0) {
        notification.warning(
          language === 'es' ? 'Advertencia' : 'Warning', 
          language === 'es' ? 'No hay columnas disponibles para exportar' : 'No columns available for export'
        );
        return;
      }

      // Generate subtitle based on active filters
      let subtitle = '';
      
      if (activeFilters.brand && activeFilters.brand !== 'all') {
        subtitle += `${language === 'es' ? 'Marca' : 'Brand'}: ${activeFilters.brand} `;
      }
      
      if (activeFilters.model && activeFilters.model !== 'all') {
        subtitle += `${language === 'es' ? 'Modelo' : 'Model'}: ${activeFilters.model} `;
      }
      
      if (activeFilters.status && activeFilters.status !== 'all') {
        const statusText = statuses.find(s => s.id === activeFilters.status)?.name || activeFilters.status;
        subtitle += `${language === 'es' ? 'Estado' : 'Status'}: ${statusText} `;
      }

      // Handle multiple employees in the subtitle
      if (activeFilters.employee && Array.isArray(activeFilters.employee) && 
          !activeFilters.employee.includes('all') && activeFilters.employee.length > 0) {
        
        const employeeLabel = language === 'es' ? 'Empleados' : 'Employees';
        const employeeNames = activeFilters.employee.map(empId => {
          const emp = employees.find(e => e.id.toString() === empId.toString());
          return emp ? emp.name : empId;
        }).join(', ');
        
        subtitle += `${employeeLabel}: ${employeeNames} `;
      }

      if (activeFilters.dateRange && activeFilters.dateRange[0] && activeFilters.dateRange[1]) {
        const startDate = activeFilters.dateRange[0].format('DD/MM/YYYY');
        const endDate = activeFilters.dateRange[1].format('DD/MM/YYYY');
        subtitle += `${language === 'es' ? 'Período' : 'Period'}: ${startDate} - ${endDate}`;
      }

      // Data transformation function to format dates
      const transformData = (data) => {
        return data.map(record => ({
          ...record,
          fechaSolicitud: new Date(record.fechaSolicitud).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        }));
      };

      await exportTableToPdf({
        columns: tableColumnsRef.current,
        data: filteredData,
        fileName: language === 'es' ? 'solicitudes-motocicletas' : 'motorcycle-requests',
        title: language === 'es' ? 'Solicitudes de Registro' : 'Registration Requests',
        subtitle: subtitle.trim(),
        transformData,
        notificationSystem: notification
      });
    } catch (error) {
      console.error('Export error:', error);
      notification.error(
        language === 'es' ? 'Error' : 'Error', 
        language === 'es' 
          ? 'Error al generar el PDF. Por favor, intente nuevamente.' 
          : 'Error generating PDF. Please try again.'
      );
    }
  };

  return (
    <ResponsiveContainer>
      <Row gutter={[16, 24]} className="dashboard-row">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <SectionContainer>
            <SolicitudesMetricsCards />
          </SectionContainer>
        </Col>
      </Row>
      
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
              employees={employees}
            />
            
            <GestionTable 
              solicitudesData={filteredData}
              onView={handleView} 
              onApprove={handleApprove} 
              onReject={handleReject}
              onAssign={handleAssign}
              onTableReady={handleTableReady}
            />
          </SectionContainer>
        </Col>
      </Row>
    </ResponsiveContainer>
  );
}

export default AdminSolicitudes;