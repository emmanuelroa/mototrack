import React from 'react';
import { Row, Col } from 'antd';
import { CarOutlined, ClockCircleOutlined, FileProtectOutlined, CheckSquareOutlined } from '@ant-design/icons';
import MetricCard from '../../CommonComponts/MetricCard';
import styled from 'styled-components';
import { useLanguage } from '../../../../context/LanguageContext';

const MetricsContainer = styled.div`
  margin-bottom: 24px;
`;

function DashboardMetricsCards() {
  const { language } = useLanguage();
  
  const translations = {
    es: {
      totalRegistrations: {
        title: 'Total Matrículas',
        subtitle: 'Total de motocicletas registradas'
      },
      pendingRequests: {
        title: 'Solicitudes Pendientes',
        subtitle: 'En proceso de revisión'
      },
      activeRegistrations: {
        title: 'Registros Activos',
        subtitle: 'Matrículas con documentación completa'
      },
      approvalRate: {
        title: 'Tasa de Aprobación',
        subtitle: 'Porcentaje de solicitudes aprobadas'
      }
    },
    en: {
      totalRegistrations: {
        title: 'Total Registrations',
        subtitle: 'Total motorcycles registered'
      },
      pendingRequests: {
        title: 'Pending Requests',
        subtitle: 'In review process'
      },
      activeRegistrations: {
        title: 'Active Registrations',
        subtitle: 'Registrations with complete documentation'
      },
      approvalRate: {
        title: 'Approval Rate',
        subtitle: 'Percentage of approved requests'
      }
    }
  };

  const t = translations[language] || translations.es;

  const metricsData = [
    {
      id: 1,
      title: t.totalRegistrations.title,
      icon: <CarOutlined />,
      value: '1,234',
      subtitle: t.totalRegistrations.subtitle,
      bubbleColor: '#e6f7ff',  // Light blue background
      iconColor: '#1890ff'     // Blue icon
    },
    {
      id: 2,
      title: t.pendingRequests.title,
      icon: <ClockCircleOutlined />,
      value: '42',
      subtitle: t.pendingRequests.subtitle,
      bubbleColor: '#fff7e6',  // Light orange background
      iconColor: '#fa8c16'     // Orange icon
    },
    {
      id: 3,
      title: t.activeRegistrations.title,
      icon: <FileProtectOutlined />,
      value: '89',
      subtitle: t.activeRegistrations.subtitle,
      bubbleColor: '#f6ffed',  // Light green background
      iconColor: '#52c41a'     // Green icon
    },
    {
      id: 4,
      title: t.approvalRate.title,
      icon: <CheckSquareOutlined />,
      value: '94.2%',
      subtitle: t.approvalRate.subtitle,
      bubbleColor: '#f9f0ff',  // Light purple background
      iconColor: '#722ed1'     // Purple icon
    }
  ];

  return (
    <MetricsContainer>
      <Row gutter={[16, 16]}>
        {metricsData.map(metric => (
          <Col xs={24} sm={12} md={6} key={metric.id}>
            <MetricCard
              title={metric.title}
              icon={metric.icon}
              value={metric.value}
              subtitle={metric.subtitle}
              bubbleColor={metric.bubbleColor}
              iconColor={metric.iconColor}
            />
          </Col>
        ))}
      </Row>
    </MetricsContainer>
  );
}

export default DashboardMetricsCards;