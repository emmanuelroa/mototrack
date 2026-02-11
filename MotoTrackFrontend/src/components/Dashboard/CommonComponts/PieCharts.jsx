import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import styled from 'styled-components';
import { useTheme } from '../../../context/ThemeContext';
import { usePrimaryColor } from '../../../context/PrimaryColorContext';
import { useLanguage } from '../../../context/LanguageContext';

// Register ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer
]);

const ChartContainer = styled.div`
  background: ${props => props.theme.token.contentBg};
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid ${props => props.theme.token.titleColor}25;
  height: 450px; // Altura fija para todos los componentes
`;

const ChartContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChartDiv = styled.div`
  flex: 3;
  min-height: 300px; // Altura mínima para el gráfico
`;

const BottomSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.token.titleColor}25;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.token.titleColor};
  margin: 0 0 0.5rem 0;
`;

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

const LegendColor = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
`;

const LegendText = styled.div`
  color: ${props => props.theme.token.textColor};
  font-size: 0.8rem;
`;

const LegendPercentage = styled.div`
  color: ${props => props.theme.token.textColor};
  font-weight: 500;
  font-size: 0.8rem;
  margin-left: 0.3rem;
`;

const PieChartComponent = ({ title, data, height = 250 }) => {
  const chartRef = useRef(null);
  const { theme } = useTheme();
  const { primaryColor } = usePrimaryColor();
  const { language } = useLanguage();
  
  const translations = {
    es: {
      noData: 'No hay datos disponibles'
    },
    en: {
      noData: 'No data available'
    }
  };
  
  const t = translations[language] || translations.es;
  
  // Set default data if none provided
  const chartData = data || [
    { name: 'Honda', value: 38, percentage: '38%', color: '#FF6384' },
    { name: 'Yamaha', value: 25, percentage: '25%', color: '#36A2EB' },
    { name: 'Suzuki', value: 19, percentage: '19%', color: '#FFCE56' },
    { name: 'Bajaj', value: 13, percentage: '13%', color: '#4BC0C0' },
    { name: 'Otras', value: 6, percentage: '6%', color: '#9966FF' }
  ];
  
  useEffect(() => {
    // Initialize chart
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      
      // Theme settings
      const textColor = theme.token.textColor;
      const titleColor = theme.token.titleColor;
      const bgColor = theme.token.contentBg;
      
      // Chart options
      const option = {
        backgroundColor: 'transparent', // Use transparent to respect container background
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: bgColor,
          borderColor: theme.token.borderColor || bgColor,
          textStyle: {
            color: textColor
          }
        },
        series: [
          {
            name: title,
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 4,
              borderColor: bgColor,
              borderWidth: 2
            },
            label: {
              show: false  // Ensure labels are always hidden initially
            },
            emphasis: {
              focus: 'series',
              label: {
                show: false  // Also hide labels on emphasis
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: false
            },
            data: chartData.map(item => ({
              value: item.value,
              name: item.name,
              itemStyle: {
                color: item.color
              }
            }))
          }
        ]
      };
      
      // Set chart option
      chart.setOption(option);
      
      // Handle resize
      const handleResize = () => {
        chart.resize();
      };
      
      window.addEventListener('resize', handleResize);
      
      // Redraw chart when theme changes
      const resizeObserver = new ResizeObserver(() => {
        chart.resize();
      });
      
      resizeObserver.observe(chartRef.current);
      
      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
        resizeObserver.disconnect();
      };
    }
  }, [chartData, title, theme]); // Add theme as dependency to recreate chart when theme changes
  
  return (
    <div>
      <Title>{title}</Title>
      <ChartContainer>
        <ChartContent>
          <ChartDiv ref={chartRef} style={{ height }} />
          <BottomSection>
            <LegendContainer>
              {chartData.length > 0 ? (
                chartData.map((item, index) => (
                  <LegendItem key={index}>
                    <LegendColor color={item.color} />
                    <LegendText>{item.name}</LegendText>
                    <LegendPercentage>{item.percentage}</LegendPercentage>
                  </LegendItem>
                ))
              ) : (
                <LegendText>{t.noData}</LegendText>
              )}
            </LegendContainer>
          </BottomSection>
        </ChartContent>
      </ChartContainer>
    </div>
  );
};

export const DistribucionPorMarca = () => {
  const { language } = useLanguage();
  
  const translations = {
    es: {
      title: 'Distribución por Marca',
      honda: 'Honda',
      yamaha: 'Yamaha',
      suzuki: 'Suzuki',
      bajaj: 'Bajaj',
      others: 'Otras'
    },
    en: {
      title: 'Distribution by Brand',
      honda: 'Honda',
      yamaha: 'Yamaha',
      suzuki: 'Suzuki',
      bajaj: 'Bajaj',
      others: 'Others'
    }
  };

  const t = translations[language] || translations.es;

  return (
    <PieChartComponent 
      title={t.title}
      data={[
        { name: t.honda, value: 38, percentage: '38%', color: '#1890ff' },
        { name: t.yamaha, value: 25, percentage: '25%', color: '#fa8c16' },
        { name: t.suzuki, value: 19, percentage: '19%', color: '#52c41a' },
        { name: t.bajaj, value: 13, percentage: '13%', color: '#722ed1' },
        { name: t.others, value: 6, percentage: '6%', color: '#f5222d' }
      ]}
    />
  );
};

export const DistribucionPorTipo = () => {
  const { language } = useLanguage();
  
  const translations = {
    es: {
      title: 'Distribución por Tipo',
      motorcycle: 'Motocicleta',
      scooter: 'Pasola',
      moped: 'Margarita',
      others: 'Otros'
    },
    en: {
      title: 'Distribution by Type',
      motorcycle: 'Motorcycle',
      scooter: 'Scooter',
      moped: 'Moped',
      others: 'Others'
    }
  };

  const t = translations[language] || translations.es;

  return (
    <PieChartComponent 
      title={t.title}
      data={[
        { name: t.motorcycle, value: 56, percentage: '56%', color: '#1890ff' },
        { name: t.scooter, value: 25, percentage: '25%', color: '#fa8c16' },
        { name: t.moped, value: 13, percentage: '13%', color: '#52c41a' },
        { name: t.others, value: 6, percentage: '6%', color: '#722ed1' }
      ]}
    />
  );
};

export const DistribucionPorZona = () => {
  const { language } = useLanguage();
  
  const translations = {
    es: {
      title: 'Distribución en Santo Domingo Este',
      frailes: 'Los Frailes',
      sanLuis: 'San Luis',
      caleta: 'La Caleta',
      victoria: 'La Victoria',
      others: 'Otros'
    },
    en: {
      title: 'Distribution in Santo Domingo East',
      frailes: 'Los Frailes',
      sanLuis: 'San Luis',
      caleta: 'La Caleta',
      victoria: 'La Victoria',
      others: 'Others'
    }
  };

  const t = translations[language] || translations.es;

  return (
    <PieChartComponent 
      title={t.title}
      data={[
        { name: t.frailes, value: 38, percentage: '38%', color: '#1890ff' },
        { name: t.sanLuis, value: 20, percentage: '20%', color: '#fa8c16' },
        { name: t.caleta, value: 19, percentage: '19%', color: '#52c41a' },
        { name: t.victoria, value: 8, percentage: '8%', color: '#722ed1' },
        { name: t.others, value: 15, percentage: '15%', color: '#f5222d' }
      ]}
    />
  );
};

export default PieChartComponent;