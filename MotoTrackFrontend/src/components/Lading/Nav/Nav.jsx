import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoImg from '../../../assets/Lading/MotoTrackLogo.png';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

// Convert NavContainer to a motion component
const NavContainer = styled(motion.nav)`
  padding: 0.8rem 2rem;
  background: white;
  border-radius: 0 0 50px 50px; /* Rounded corners only at the bottom */
  margin: 0 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  max-width: calc(100% - 2rem);
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
  }
`;

// Update the navbarVariants to have a more dramatic entrance animation
const navbarVariants = {
  hidden: { 
    opacity: 0, 
    y: -50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.6, 0.05, 0.01, 0.99], // Custom easing curve for more dynamic motion
      when: "beforeChildren",
      staggerChildren: 0.15 // Increased from 0.1 for more noticeable staggering
    }
  }
};

// Enhance the child variants for more dramatic entrances
const childVariants = {
  hidden: { opacity: 0, y: -25, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0], // Custom cubic bezier for smoother motion
    }
  }
};

const NavWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
`;

const Logo = styled.div`
  img {
    height: 110px;
    
    @media (max-width: 768px) {
      height: 80px;
    }
  }
  padding: 0 0 0 1rem 0;
`;

const MenuContainer = styled.div`
  background: #f4f4f5;
  border-radius: 50px;
  padding: 0.4rem;
  margin: 0 2rem;
  flex: 1;
  display: ${props => props.$isVisible ? 'flex' : 'none'};
  justify-content: center;
`;

const StyledMenu = styled(Menu)`
  border: none;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  
  .ant-menu-item {
    color: #1a1a1a;
    font-size: 1rem;
    padding: 0.5rem 1.2rem;
    margin: 0 8px !important;
    border-radius: 50px;
    height: auto;
    line-height: 1.5;
    z-index: 1;
    
    &:hover {
      color:rgba(99, 101, 241, 0.49) !important;
    }

    &.ant-menu-item-selected {
      background: white !important;
      color: #6366f1 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-radius: 50px;
    }

    &::after {
      display: none !important;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginButton = styled(motion.button)`
  padding: 0.5rem 1.2rem;
  background: transparent;
  border: 1px solid transparent;
  color: #1a1a1a;
  cursor: pointer;
  font-size: 0.9rem;
  border-radius: 50px;
  position: relative;
  overflow: hidden;
  min-width: 120px;
  height: 38px;
`;

const RegisterButton = styled(motion.button)`
  padding: 0.5rem 1.2rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
  min-width: 120px;
  height: 38px;
`;

// Mobile menu components
const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #1a1a1a;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const MobileMenuContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 300px;
  height: 100%;
  background: white;
  z-index: 999;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileMenuItem = styled(motion.div)`
  padding: 1rem;
  font-size: 1.2rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  
  &.selected {
    color: #6366f1;
    font-weight: bold;
  }
`;

const MobileButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

function Nav() {
  const [selectedKey, setSelectedKey] = useState('characteristics');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Implement scroll spy functionality
  useEffect(() => {
    // Define section IDs to observe, including hero and prefooter
    const sectionIds = [
      'hero',
      'characteristics', 
      'how-it-works',
      'users', 
      'testimonials',
      'collaboration', 
      'faq',
      'support',
      'prefooter'
    ];
    
    const observerOptions = {
      root: null, // use the viewport
      rootMargin: '-10% 0px -70% 0px', // detection zone adjustment
      threshold: 0.1 // 10% visibility threshold
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // When section is visible, update the selected menu item
          const sectionId = entry.target.id.toLowerCase();
          
          // If the section is hero or prefooter, deselect all menu items
          if (sectionId === 'hero' || sectionId === 'prefooter') {
            setSelectedKey('');
          } else {
            setSelectedKey(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Start observing all sections
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Also check if user is at the bottom of the page (footer)
    const handleScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        // User is near the bottom of the page (footer area)
        setSelectedKey('');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up observers when component unmounts
    return () => {
      sectionIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle click on menu item to scroll to section
  const handleMenuClick = ({key}) => {
    setSelectedKey(key);
    
    // Smooth scroll to the selected section
    const element = document.getElementById(key);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { key: 'characteristics', label: 'Características' },
    { key: 'how-it-works', label: 'Cómo Funciona' },
    { key: 'users', label: 'Usuarios' },
    { key: 'testimonials', label: 'Testimonios' },
    { key: 'collaboration', label: 'Colaboración' },
    { key: 'faq', label: 'FAQ' },
    { key: 'support', label: 'Soporte' },
  ];

  return (
    <NavContainer
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <NavWrapper>
        <motion.div variants={childVariants}>
          <Logo>
            <Link to="/">
              <img src={LogoImg} alt="Logo" />
            </Link>
          </Logo>
        </motion.div>
        
        <motion.div variants={childVariants} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <MenuContainer $isVisible={windowWidth > 768}>
            <StyledMenu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              onSelect={handleMenuClick}
              items={menuItems.map(item => ({
                ...item,
                label: (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {item.label}
                  </motion.div>
                )
              }))}
            />
          </MenuContainer>
        </motion.div>
        
        <motion.div variants={childVariants}>
          <ButtonContainer>
            <Link to="/login">
              <LoginButton
                initial={{ border: "1px solid transparent" }}
                whileHover={{ 
                  scale: 1.05,
                  color: "#6366f1",
                  border: "1px solid #6366f1",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
              >
                Iniciar Sesión
              </LoginButton>
            </Link>
            <Link to="/register">
              <RegisterButton
                whileHover={{ 
                  scale: 1.05,
                  background: "#4f46e5",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
              >
                Registrarse
              </RegisterButton>
            </Link>
          </ButtonContainer>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.div variants={childVariants}>
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <MenuOutlined />
          </MobileMenuButton>
        </motion.div>
        
        {/* Mobile Menu */}
        <MobileMenuOverlay 
          $isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <MobileMenuContainer
          initial={{ x: "100%" }}
          animate={{ x: isMobileMenuOpen ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <MobileMenuHeader>
            <h2>Menú</h2>
            <CloseOutlined onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
          </MobileMenuHeader>
          
          {menuItems.map(item => (
            <MobileMenuItem 
              key={item.key}
              className={selectedKey === item.key ? 'selected' : ''}
              whileHover={{ x: 10 }}
              onClick={() => {
                handleMenuClick({key: item.key});
              }}
            >
              {item.label}
            </MobileMenuItem>
          ))}
          
          <MobileButtonContainer>
            <Link to="/login" style={{ width: '100%' }}>
              <LoginButton
                style={{ width: '100%' }}
                initial={{ border: "1px solid transparent" }}
                whileHover={{ 
                  color: "#6366f1",
                  border: "1px solid #6366f1",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Iniciar Sesión
              </LoginButton>
            </Link>
            <Link to="/register" style={{ width: '100%' }}>
              <RegisterButton
                style={{ width: '100%' }}
                whileHover={{ 
                  background: "#4f46e5",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Registrarse
              </RegisterButton>
            </Link>
          </MobileButtonContainer>
        </MobileMenuContainer>
      </NavWrapper>
    </NavContainer>
  );
}

export default Nav;