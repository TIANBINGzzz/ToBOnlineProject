import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 40px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  text-align: center;
  z-index: 3;
`;

const ErrorMessage = styled.p`
  font-size: 18px;
  color: black;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const ReturnButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: #4a98ff;
  color: white;
  border-radius: 20px;
  height: 50px;
  width: 180px;
  font-size: 120%;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const GETerror = ({ code, errorMessage, goToProfile, onClose, goToDashboard }) => {
  return (
    <>
      <Overlay />
      <ErrorContainer>
        <ErrorMessage>{errorMessage}!</ErrorMessage>
        {errorMessage === 'Lack of basic information' && <ErrorMessage>Do you want to complete your profile now?</ErrorMessage>}
        <ButtonContainer>
          {errorMessage === 'Lack of basic information' ?
            (
              <>
                <ReturnButton onClick={goToProfile}>Yes</ReturnButton>
                <ReturnButton onClick={onClose}>Not now</ReturnButton>
              </>
            )
            :
            (<ReturnButton onClick={goToDashboard}>Ok</ReturnButton>)}
        </ButtonContainer>
      </ErrorContainer>
    </>
  );
};

export default GETerror;

