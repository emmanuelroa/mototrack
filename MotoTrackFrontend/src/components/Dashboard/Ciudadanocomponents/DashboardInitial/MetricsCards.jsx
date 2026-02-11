import React from 'react';
import { Row, Col } from 'antd';
import { CarOutlined, ProfileOutlined, CheckCircleOutlined, IdcardOutlined } from '@ant-design/icons';
import MetricCard from '../../CommonComponts/MetricCard';
import styled from 'styled-components';
import { useLanguage } from '../../../../context/LanguageContext';

const MetricsContainer = styled.div`
  margin-bottom: 24px;
`;

function MetricsCards() {
  const { language } = useLanguage();
  
  const translations = {
    es: {
      totalMotorcycles: {
        title: 'Total Motocicletas',
        subtitle: 'Motocicletas registradas'
      },
      pending: {
        title: 'Pendientes',
        subtitle: 'Solicitudes en proceso de revisión'
      },
      approved: {
        title: 'Aprobadas',
        subtitle: 'Motocicletas con registro aprobado'
      },
      documents: {
        title: 'Documentos',
        subtitle: 'Carnés disponibles para descargar'
      }
    },
    en: {
      totalMotorcycles: {
        title: 'Total Motorcycles',
        subtitle: 'Motorcycles registered in the system'
      },
      pending: {
        title: 'Pending',
        subtitle: 'Requests in review process'
      },
      approved: {
        title: 'Approved',
        subtitle: 'Motorcycles with approved registration'
      },
      documents: {
        title: 'Documents',
        subtitle: 'ID cards available for download'
      }
    }
  };

  const t = translations[language] || translations.es;

  const metricsData = [
    {
      id: 1,
      title: t.totalMotorcycles.title,
      icon: <CarOutlined />,
      value: 2,
      subtitle: t.totalMotorcycles.subtitle,
      bubbleColor: '#e6f7ff',  // Azul claro para el fondo
      iconColor: '#1890ff'     // Azul para el icono
    },
    {
      id: 2,
      title: t.pending.title,
      icon: <ProfileOutlined />,
      value: 1,
      subtitle: t.pending.subtitle,
      bubbleColor: '#fff7e6',  // Naranja claro para el fondo
      iconColor: '#fa8c16'     // Naranja para el icono
    },
    {
      id: 3,
      title: t.approved.title,
      icon: <CheckCircleOutlined />,
      value: 2,
      subtitle: t.approved.subtitle,
      bubbleColor: '#f6ffed',  // Verde claro para el fondo
      iconColor: '#52c41a'     // Verde para el icono
    },
    {
      id: 4,
      title: t.documents.title,
      icon: <IdcardOutlined />,
      value: 2,
      subtitle: t.documents.subtitle,
      bubbleColor: '#f9f0ff',  // Morado claro para el fondo
      iconColor: '#722ed1'     // Morado para el icono
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

export default MetricsCards;