import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const FloatingButton = styled.button`
  position: fixed;
  bottom: ${(props) => props.bottom};
  right: ${(props) => props.right};
  width: 40px;
  height: 40px;
  background-color: #3299ff;
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.19);
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, background-color 0.3s ease, opacity 0.3s ease;
  opacity: 0.8;
  pointer-events: auto;
  z-index: 20;

  &:hover {
    transform: scale(1.1);
    background-color: #007fff;
  }
`;

const ScrollToTop = ({ moduleRef, right = '30px', bottom = '40px' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    if (moduleRef && moduleRef.current) {
      moduleRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (moduleRef && moduleRef.current) {
      const scrollTop = moduleRef.current.scrollTop;
      if (scrollTop > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  useEffect(() => {
    const currentModule = moduleRef.current;
    if (currentModule) {
      currentModule.addEventListener('scroll', handleScroll);

      return () => {
        currentModule.removeEventListener('scroll', handleScroll);
      };
    }
  }, [moduleRef]);

  return (
    isVisible && <FloatingButton onClick={scrollToTop} right={right} bottom={bottom}>↑</FloatingButton>
  );
};

export default ScrollToTop

