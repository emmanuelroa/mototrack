import React from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import DashboardMetricsCards from '../../../components/Dashboard/AdminComponents/DashboarInitial/DashboardMetricsCards';
import AreaChart from '../../../components/Dashboard/CommonComponts/AreaChart';
import { DistribucionPorMarca, DistribucionPorTipo, DistribucionPorZona } from '../../../components/Dashboard/CommonComponts/PieCharts';
import { useLanguage } from '../../../context/LanguageContext';

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

function AdminDashboard() {
  const { language } = useLanguage();
  
  // Data could be fetched from an API in a real implementation
  const requestData = {
    year: [
      { month: 'Ene', total: 520 },
      { month: 'Feb', total: 480 },
      { month: 'Mar', total: 550 },
      { month: 'Abr', total: 620 },
      { month: 'May', total: 680 },
      { month: 'Jun', total: 720 },
      { month: 'Jul', total: 780 },
      { month: 'Ago', total: 620 },
      { month: 'Sep', total: 480 },
      { month: 'Oct', total: 720 },
      { month: 'Nov', total: 580 },
      { month: 'Dic', total: 880 }
    ],
    quarter: [
      { month: 'Oct', total: 720 },
      { month: 'Nov', total: 580 },
      { month: 'Dic', total: 880 },
      { month: 'Ene', total: 750 }
    ],
    month: [
      { month: 'Sem 1', total: 220 },
      { month: 'Sem 2', total: 260 },
      { month: 'Sem 3', total: 200 },
      { month: 'Sem 4', total: 280 }
    ],
    week: [
      { month: 'Lun', total: 55 },
      { month: 'Mar', total: 62 },
      { month: 'Mié', total: 48 },
      { month: 'Jue', total: 72 },
      { month: 'Vie', total: 80 },
      { month: 'Sáb', total: 58 },
      { month: 'Dom', total: 45 }
    ]
  };

  return (
    <ResponsiveContainer>
      {/* Metrics Cards */}
      <Row gutter={[16, 24]} className="dashboard-row">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <SectionContainer>
            <DashboardMetricsCards />
          </SectionContainer>
        </Col>
      </Row>
      
      {/* Area Chart Section */}
      <Row gutter={[16, 24]} className="dashboard-row">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <SectionContainer style={{ height: '450px' }}>
            <AreaChart />
          </SectionContainer>
        </Col>
      </Row>
      
      {/* Pie Charts Section */}
      <Row gutter={[16, 24]} className="dashboard-row">
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <SectionContainer>
            <DistribucionPorMarca />
          </SectionContainer>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <SectionContainer>
            <DistribucionPorTipo />
          </SectionContainer>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <SectionContainer>
            <DistribucionPorZona />
          </SectionContainer>
        </Col>
      </Row>
    </ResponsiveContainer>
  );
}

export default AdminDashboard;