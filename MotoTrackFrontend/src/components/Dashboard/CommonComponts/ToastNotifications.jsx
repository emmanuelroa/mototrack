import React, { createContext, useContext, useEffect } from 'react';
import { App } from 'antd'; // Import App to access the notification context
import styled, { createGlobalStyle } from 'styled-components';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { usePrimaryColor } from '../../../context/PrimaryColorContext';

// Add translations object
const translations = {
  en: {
    success: {
      defaultTitle: 'Success',
      defaultDescription: 'Operation completed successfully'
    },
    error: {
      defaultTitle: 'Error',
      defaultDescription: 'An error occurred'
    },
    warning: {
      defaultTitle: 'Warning',
      defaultDescription: 'Warning message'
    },
    info: {
      defaultTitle: 'Information',
      defaultDescription: 'Information message'
    }
  },
  es: {
    success: {
      defaultTitle: 'Éxito',
      defaultDescription: 'Operación completada con éxito'
    },
    error: {
      defaultTitle: 'Error',
      defaultDescription: 'Ha ocurrido un error'
    },
    warning: {
      defaultTitle: 'Advertencia',
      defaultDescription: 'Mensaje de advertencia'
    },
    info: {
      defaultTitle: 'Información',
      defaultDescription: 'Mensaje informativo'
    }
  }
};

// Estilos globales para notificaciones basados en el theme
const NotificationGlobalStyle = createGlobalStyle`
  /* Base styles for all notifications */
  .ant-notification-notice {
    background-color: ${props => props.theme.token.sidebarBg} !important;
    border-radius: 8px;
    padding: 12px !important;
    box-shadow: ${({ currentTheme }) =>
      currentTheme === 'themeDark'
        ? '0 3px 10px rgba(0,0,0,0.6)'
        : '0 3px 10px rgba(0,0,0,0.15)'};
  }

  /* Clases específicas según el tipo de notificación */
  .notification-success {
    border-left: 4px solid #52c41a !important;
  }
  .notification-error {
    border-left: 4px solid #ff4d4f !important;
  }
  .notification-warning {
    border-left: 4px solid #faad14 !important;
  }
  .notification-info {
    border-left: 4px solid ${props => props.$primaryColor || '#1677ff'} !important;
  }
  
  /* Title and description styling */
  .ant-notification-notice-message {
    color: ${props => props.theme.token.titleColor} !important;
    font-weight: 500 !important;
  }
  
  .ant-notification-notice-description {
    color: ${props => props.theme.token.subtitleBlack} !important;
  }
  
  /* Handle close button color for dark theme */
  .ant-notification-notice-close {
    color: ${props => props.currentTheme === 'themeDark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)'} !important;
    
    &:hover {
      color: ${props => props.currentTheme === 'themeDark' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.65)'} !important;
    }
  }
`;

// Creamos el contexto de notificaciones
const NotificationContext = createContext(null);

// Configuración por defecto para todas las notificaciones
const defaultConfig = {
  placement: 'topRight',
  duration: 4.5,
  
};

/**
 * Componente NotificationProvider
 * Provee funciones de notificación tipo toast con soporte para tema y lenguaje
 */
export const NotificationProvider = ({ children }) => {
  const { theme, currentTheme } = useTheme();
  const { language } = useLanguage();
  const { primaryColor } = usePrimaryColor();
  const { notification } = App.useApp(); // Get notification from App context
  
  // Configure global notification styles when theme changes
  useEffect(() => {
    console.log('Setting up notification context with theme:', { currentTheme });
    
    // Close all existing notifications when theme changes to avoid mixed styles
    notification.destroy();
  }, [currentTheme, notification]);

  // Helper function to get translations
  const getTranslation = (type, key, defaultValue) => {
    return translations[language]?.[type]?.[key] || defaultValue;
  };

  // Notification functions with theme and language support
  const notificationFunctions = {
    success: (title, description, config = {}) => {
      console.log('SUCCESS NOTIFICATION TRIGGERED:', { title, description, config });
      const defaultTitle = getTranslation('success', 'defaultTitle', 'Success');
      const defaultDesc = getTranslation('success', 'defaultDescription', '');
      
      // Handle both object and string parameters
      if (typeof title === 'object') {
        console.log('Calling notification.success with object config');
        notification.success({
          ...defaultConfig,
          ...title,
          className: `notification-success ${currentTheme === 'themeDark' ? 'dark-theme' : 'light-theme'}`,
        });
      } else {
        console.log('Calling notification.success with individual params');
        notification.success({
          message: title || defaultTitle,
          description: description || defaultDesc,
          ...defaultConfig,
          ...config,
          className: `notification-success ${currentTheme === 'themeDark' ? 'dark-theme' : 'light-theme'}`,
        });
      }
    },

    error: (title, description, config = {}) => {
      console.log('ERROR NOTIFICATION TRIGGERED:', { title, description, config });
      const defaultTitle = getTranslation('error', 'defaultTitle', 'Error');
      const defaultDesc = getTranslation('error', 'defaultDescription', '');
      
      if (typeof title === 'object') {
        console.log('Calling notification.error with object config');
        notification.error({
          ...defaultConfig,
          ...title,
          className: `notification-error ${currentTheme === 'themeDark' ? 'dark-theme' : 'light-theme'}`,
        });
      } else {
        console.log('Calling notification.error with individual params');
        notification.error({
          message: title || defaultTitle,
          description: description || defaultDesc,
          ...defaultConfig,
          ...config,
          className: `notification-error ${currentTheme === 'themeDark' ? 'dark-theme' : 'light-theme'}`,
        });
      }
    },

    warning: (title, description, config = {}) => {
      const defaultTitle = getTranslation('warning', 'defaultTitle', 'Warning');
      const defaultDesc = getTranslation('warning', 'defaultDescription', '');
      
      if (typeof title === 'object') {
        notification.warning({
          ...defaultConfig,
          ...title,
          className: `notification-warning ${currentTheme === 'themeDark' ? 'dark-theme' : 'light-theme'}`,
        });
      } else {
        notification.warning({
          message: title || defaultTitle,
          description: description || defaultDesc,
          ...defaultConfig,
          ...config,
          className: `notification-warning ${currentTheme === 'themeDark' ? 'dark-theme' : 'light-theme'}`,
        });
      }
    },

    info: (title, description, config = {}) => {
      const defaultTitle = getTranslation('info', 'defaultTitle', 'Information');
      const defaultDesc = getTranslation('info', 'defaultDescription', '');
      
      if (typeof title === 'object') {
        notification.info({
          ...defaultConfig,
          ...title,
          className: `notification-info ${currentTheme === 'themeDark' ? 'dark-theme' : 'light-theme'}`,
        });
      } else {
        notification.info({
          message: title || defaultTitle,
          description: description || defaultDesc,
          ...defaultConfig,
          ...config,
          className: `notification-info ${currentTheme === 'themeDark' ? 'dark-theme' : 'light-theme'}`,
        });
      }
    },

    // For compatibility
    open: (config) => notification.open({
      ...defaultConfig,
      ...config,
      className: `${config.className || ''} ${currentTheme === 'themeDark' ? 'dark-theme' : 'light-theme'}`,
    }),
    destroy: (key) => key ? notification.destroy(key) : notification.destroy()
  };

  return (
    <>
      <NotificationGlobalStyle 
        theme={theme} 
        currentTheme={currentTheme} 
        $primaryColor={primaryColor} 
      />
      <NotificationContext.Provider value={notificationFunctions}>
        {children}
      </NotificationContext.Provider>
    </>
  );
};

/**
 * Hook personalizado para usar las notificaciones
 */
export const useNotification = () => {
  const notificationContext = useContext(NotificationContext);
  if (!notificationContext) {
    console.error('useNotification called outside NotificationProvider');
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  console.log('useNotification hook used, context exists:', !!notificationContext);
  return notificationContext;
};

// Para compatibilidad hacia atrás con imports directos
const ToastNotifications = {};
export default ToastNotifications;
