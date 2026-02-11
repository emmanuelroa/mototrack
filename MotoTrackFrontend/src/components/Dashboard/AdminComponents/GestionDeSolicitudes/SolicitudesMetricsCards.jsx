import React from 'react';
import { Row, Col } from 'antd';
import { 
  DatabaseOutlined, 
  CheckCircleOutlined, 
  SyncOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';
import MetricCard from '../../CommonComponts/MetricCard';
import styled from 'styled-components';
import { useLanguage } from '../../../../context/LanguageContext';

const MetricsContainer = styled.div`
  margin-bottom: 24px;
`;

function SolicitudesMetricsCards() {
  const { language } = useLanguage();
  
  const translations = {
    es: {
      totalSolicitudes: {
        title: 'Total Solicitudes',
        subtitle: 'Solicitudes en el sistema'
      },
      aprobadas: {
        title: 'Aprobadas',
        subtitle: 'Solicitudes completadas'
      },
      enProceso: {
        title: 'En Proceso',
        subtitle: 'Pendientes de revisión'
      },
      rechazadas: {
        title: 'Rechazadas',
        subtitle: 'No cumplen requisitos'
      }
    },
    en: {
      totalSolicitudes: {
        title: 'Total Requests',
        subtitle: 'Requests in the system'
      },
      aprobadas: {
        title: 'Approved',
        subtitle: 'Completed requests'
      },
      enProceso: {
        title: 'In Progress',
        subtitle: 'Pending review'
      },
      rechazadas: {
        title: 'Rejected',
        subtitle: 'Don\'t meet requirements'
      }
    }
  };

  const t = translations[language] || translations.es;

  const metricsData = [
    {
      id: 1,
      title: t.totalSolicitudes.title,
      icon: <DatabaseOutlined />,
      value: '1,234',
      subtitle: t.totalSolicitudes.subtitle,
      bubbleColor: '#e6f7ff',  // Light blue background
      iconColor: '#1890ff'     // Blue icon
    },
    {
      id: 2,
      title: t.aprobadas.title,
      icon: <CheckCircleOutlined />,
      value: '1,103',
      subtitle: t.aprobadas.subtitle,
      bubbleColor: '#f6ffed',  // Light green background
      iconColor: '#52c41a'     // Green icon
    },
    {
      id: 3,
      title: t.enProceso.title,
      icon: <SyncOutlined />,
      value: '89',
      subtitle: t.enProceso.subtitle,
      bubbleColor: '#fff7e6',  // Light orange background
      iconColor: '#fa8c16'     // Orange icon
    },
    {
      id: 4,
      title: t.rechazadas.title,
      icon: <CloseCircleOutlined />,
      value: '42',
      subtitle: t.rechazadas.subtitle,
      bubbleColor: '#fff1f0',  // Light red background
      iconColor: '#f5222d'     // Red icon
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

export default SolicitudesMetricsCards;