import React, { useState, useMemo } from 'react';
import { 
  AreaChart as RechartsArea, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer 
} from 'recharts';
import { Radio, Space, Select } from 'antd';
import styled from 'styled-components';
import { useLanguage } from '../../../context/LanguageContext';
import { usePrimaryColor } from '../../../context/PrimaryColorContext';
import { useTheme } from '../../../context/ThemeContext';

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
`;

const ChartContainer = styled.div`
  background: ${props => props.theme.token.contentBg};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
  border: 1px solid ${props => props.theme.token.titleColor}25;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ChartControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.token.titleColor};
  margin: 0;
`;

const YearSelector = styled(Select)`
  width: auto !important;
  min-width: 85px;
  
  .ant-select-selector {
    border-color: ${props => props.theme.token.borderColorSplit} !important;
    height: 24px !important; /* Match Radio.Button small size */
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    display: flex !important;
    align-items: center !important;
  }
  
  .ant-select-selection-item {
    line-height: 22px !important;
    padding: 0 4px !important;
  }
`;

const CustomTooltip = ({ active, payload, label, language, primaryColor, theme }) => {
  const translations = {
    es: {
      requests: 'solicitudes'
    },
    en: {
      requests: 'requests'
    }
  };
  
  const t = translations[language] || translations.es;
  
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: theme.token.componentBackground || theme.token.contentBg,
          padding: '8px 12px',
          border: `1px solid ${theme.token.borderColorSplit}`,
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          color: theme.token.textColor
        }}
      >
        <p style={{ margin: 0, fontWeight: 500, color: theme.token.textColor }}>{label}</p>
        <p style={{ margin: '4px 0 0', color: primaryColor }}>
          {payload[0].value} {t.requests}
        </p>
      </div>
    );
  }
  return null;
};

const AreaChart = ({ data }) => {
  const { language } = useLanguage();
  const { primaryColor } = usePrimaryColor();
  const { theme } = useTheme();
  const [timePeriod, setTimePeriod] = useState('year');
  const [selectedYear, setSelectedYear] = useState(2025); // Default to current year
  
  const currentYear = 2025; // Since user mentioned 2025 is current year
  
  // Generate available years (current year -3 to current year +1)
  const availableYears = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => currentYear - 3 + i);
  }, [currentYear]);
  
  const translations = {
    es: {
      title: 'Tendencias de solicitudes',
      week: 'Semana',
      month: 'Mes',
      quarter: 'Trimestre',
      year: 'Año',
      weekdays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      selectYear: 'Año:'
    },
    en: {
      title: 'Request Trends',
      week: 'Week',
      month: 'Month',
      quarter: 'Quarter',
      year: 'Year',
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      selectYear: 'Year:'
    }
  };
  
  const t = translations[language] || translations.es;
  
  // Generate dynamic chart data based on selected year
  const generateChartData = useMemo(() => {
    // Create a date object for the selected year
    const baseDate = new Date();
    baseDate.setFullYear(selectedYear);
    
    // Generate random but more dynamic data for demo purposes
    const getRandomTotal = (seed, isPeak = false, yearFactor = 1) => {
      // Use a consistent seed for reproducible "random" numbers
      const seedValue = (seed * 9301 + 49297) % 233280;
      const baseRandom = seedValue / 233280;
      
      // Scale factor based on year (more recent years have higher values)
      const yearScale = 0.85 + ((selectedYear - (currentYear - 3)) * 0.1);
      
      // Add more extreme variations
      if (isPeak) {
        return Math.floor((700 + baseRandom * 800) * yearScale); // Create dramatic spikes
      }
      
      // Create more dramatic valleys and peaks
      const variationFactor = Math.sin(seed) * 250; // Adds sinusoidal variation
      const volatilityFactor = (baseRandom > 0.7) ? 2 : 1; // Occasional higher volatility

      return Math.max(150, Math.floor((300 + (baseRandom * 500) + variationFactor * volatilityFactor) * yearScale));
    };
    
    // More chaotic randomizer for older years
    const legacyRandomTotal = (seed) => {
      const seedValue = (seed * 12211 + 19997) % 233280;
      const baseRandom = seedValue / 233280;
      
      const yearOffset = currentYear - selectedYear;
      const volatility = yearOffset > 1 ? 1.4 : 1.1; // Older years have more unpredictable patterns
      
      return Math.max(100, Math.floor(200 + Math.sin(seed * 3) * 150 + baseRandom * 400 * volatility));
    };
    
    // Determine which month will have a spike (based on selected year and current date)
    const yearSeed = selectedYear * 13;
    const peakMonth = (yearSeed + 4) % 12;
    const peakQuarterMonth = (yearSeed + 2) % 4;
    const peakWeek = (yearSeed + 3) % 7;
    
    // Year data - 12 months with dramatic variations
    const yearData = Array.from({ length: 12 }, (_, i) => {
      const isPeak = i === peakMonth; // Create a spike for one month
      const randomFunc = selectedYear < currentYear - 1 ? legacyRandomTotal : getRandomTotal;
      
      return {
        month: t.months[i],
        total: randomFunc(i + 100 + selectedYear, isPeak),
        // Use actual month index for display
        monthIndex: i
      };
    }).sort((a, b) => a.monthIndex - b.monthIndex)
      .map(({ month, total }) => ({ month, total }));
    
    // Quarter data - last 3 months + current month with dramatic variations
    const quarterData = Array.from({ length: 4 }, (_, i) => {
      const monthIndex = ((baseDate.getMonth() - 3 + i) + 12) % 12;
      const isPeak = i === peakQuarterMonth;
      const randomFunc = selectedYear < currentYear - 1 ? legacyRandomTotal : getRandomTotal;
      
      return {
        month: t.months[monthIndex],
        total: randomFunc(monthIndex + 200 + selectedYear, isPeak),
        monthIndex
      };
    }).sort((a, b) => a.monthIndex - b.monthIndex)
      .map(({ month, total }) => ({ month, total }));
    
    // Month data - 4 weeks with dramatic variations
    const monthData = Array.from({ length: 4 }, (_, i) => {
      const isPeak = i === 2; // Create a spike in week 3
      const randomFunc = selectedYear < currentYear - 1 ? legacyRandomTotal : getRandomTotal;
      
      return {
        month: `${t.week} ${i + 1}`,
        total: randomFunc(i + 300 + selectedYear, isPeak)
      };
    });
    
    // Week data - 7 days with dramatic variations
    const weekData = Array.from({ length: 7 }, (_, i) => {
      const isPeak = i === peakWeek; // Create a spike for one day
      const randomFunc = selectedYear < currentYear - 1 ? legacyRandomTotal : getRandomTotal;
      
      return {
        month: t.weekdays[i],
        total: randomFunc(i + 400 + selectedYear, isPeak),
        dayIndex: i
      };
    }).sort((a, b) => a.dayIndex - b.dayIndex)
      .map(({ month, total }) => ({ month, total }));
    
    return { yearData, quarterData, monthData, weekData };
  }, [t, language, selectedYear, currentYear]);
  
  const chartData = useMemo(() => {
    if (data) return data;
    
    const { yearData, quarterData, monthData, weekData } = generateChartData;
    
    switch (timePeriod) {
      case 'week':
        return weekData;
      case 'month':
        return monthData;
      case 'quarter':
        return quarterData;
      case 'year':
      default:
        return yearData;
    }
  }, [timePeriod, data, generateChartData]);

  // Dynamically determine max Y value based on data
  const maxValue = useMemo(() => {
    const max = Math.max(...chartData.map(item => item.total));
    // Round up to nearest 100
    return Math.ceil(max / 100) * 100;
  }, [chartData]);

  // Generate ticks based on max value
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const tickInterval = maxValue / (tickCount - 1);
    return Array.from({ length: tickCount }, (_, i) => Math.round(i * tickInterval));
  }, [maxValue]);

  return (
    <ChartWrapper>
      <ChartHeader>
        <Title>{t.title}</Title>
        <ChartControls>
          <Radio.Group 
            value={timePeriod} 
            onChange={e => setTimePeriod(e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="week">{t.week}</Radio.Button>
            <Radio.Button value="month">{t.month}</Radio.Button>
            <Radio.Button value="quarter">{t.quarter}</Radio.Button>
            <Radio.Button value="year">{t.year}</Radio.Button>
          </Radio.Group>
          <YearSelector
            value={selectedYear}
            onChange={setSelectedYear}
            options={availableYears.map(year => ({ value: year, label: year }))}
            size="small"
            dropdownMatchSelectWidth={false}
          />
        </ChartControls>
      </ChartHeader>
      <ChartContainer theme={theme}>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <RechartsArea
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={primaryColor} stopOpacity={0.3}/>
                  <stop offset="50%" stopColor={primaryColor} stopOpacity={0.2}/>
                  <stop offset="75%" stopColor={primaryColor} stopOpacity={0.15}/>
                  <stop offset="88%" stopColor={primaryColor} stopOpacity={0.1}/>
                  <stop offset="94%" stopColor={primaryColor} stopOpacity={0.08}/>
                  <stop offset="97%" stopColor={primaryColor} stopOpacity={0.06}/>
                  <stop offset="100%" stopColor={primaryColor} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke={theme.token.borderColorSplit}
              />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.token.textColor, fontSize: 12 }}
                padding={{ left: 30, right: 30 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.token.textColor, fontSize: 12 }}
                domain={[0, maxValue]}
                ticks={yTicks}
              />
              <Tooltip content={
                <CustomTooltip 
                  language={language} 
                  primaryColor={primaryColor} 
                  theme={theme}
                />
              } />
              <Area
                type="monotone"
                dataKey="total"
                stroke={primaryColor}
                strokeWidth={3}
                fill="url(#colorTotal)"
              />
            </RechartsArea>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </ChartWrapper>
  );
};

export default AreaChart;