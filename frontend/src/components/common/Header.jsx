import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Notification from './notification';

const Logo = styled.div`
  font-family: 'Oleo Script Swash Caps', cursive;
  font-size: 36px;
  font-weight: bold;
  color: #007fff;
  position: fixed;
  right: 20px;
  top: 8px;

  @media (max-width: 768px) {
    color: #ffffff;
    width: 96%;
    font-size: 20px;
    top: 4px;
    left: 20px;
  }
`

const Header = styled.div`
  background: #ffffff;
  left: 10px;
  right: 10px;
  height: 50px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  position: fixed;
  top: 5px;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2), 0 1px 5px rgba(0, 0, 0, 0.19);

  @media (max-width: 768px) {
    background-color: #007fff;
    height: 40px;
    width:100%;
    left:0px;
    border-radius:0px;
    top:0px;
  }
`

const Title = styled.span`
  height: 25px;
  width: auto;
  left: 300px;
  position: fixed;
  top: 14px;
  font-size: 1.5rem;
  font-weight: bold;
  @media (max-width: 768px) {
    display: none;
  }
`

const Back = styled.img`
  height: 25px;
  width: 25px;
  left: 245px;
  position: fixed;
  top: 18px;

  @media (max-width: 768px) {
    display: none;
  }
`

const Container = styled.div`
  @media (max-width: 768px) {
    height: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
  }
`

const Image = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    height: 25px;
    width: 25px;
  }
`
const Img = styled.img`
  display: none;
  @media (max-width: 768px) {
    display: block;
    height: 100%;
    width: 100%;
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%);
    &.logout {
      filter: unset;
    }
  }
`

const ButtonContainer = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    gap: 20px;
  }
`

function HeaderModule({ handleClick, projectName }) {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('id');
  const userType = sessionStorage.getItem("userType");
  const location = useLocation();
  const [update, setUpdate] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const openNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  function logoutHandler() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('permission');
    sessionStorage.removeItem('enable');
    navigate('/');
  }
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/ws/${userId}`);

    socket.onopen = () => {
    };

    socket.onmessage = () => {
      setUpdate(true);
    };

    socket.onclose = () => {
    };

    socket.onerror = () => {
    };

  }, []);

  return (
    <Header>
      {location.pathname !== '/dashboard' && <Back src='/assets/back.png' onClick={handleClick}></Back>}
      {projectName && <Title>{projectName}</Title>}
      <Logo>Bridges</Logo>
      <Container>
        <ButtonContainer>
          <Image onClick={() => { navigate('/dashboard'); }}>
            <Img src='/assets/home.png' />
          </Image>
          <Image onClick={() => { navigate(`/profile/${userType}/${userId}`, { state: { from: location.pathname } }) }}>
            <Img src='/assets/user.png' />
          </Image>
          <Image onClick={() => {
            if (userType === 'company') {
              navigate('/MyProject/company', { state: { from: location.pathname } });
            }
            else if (userType === 'professional') {
              navigate('/MyProject/professional', { state: { from: location.pathname } });
            }
          }}>
            <Img src='/assets/folder.png' />
          </Image>
          <Image onClick={openNotification}>
            <Img src='/assets/bell.png' />
          </Image>
          <Image onClick={logoutHandler}>
            <Img className='logout' src='/assets/logout.svg' />
          </Image>
          {isNotificationOpen && (
            <Notification isNotificationOpen={isNotificationOpen} update={update} setUpdate={setUpdate} ></Notification>
          )}
        </ButtonContainer>

      </Container>
    </Header>
  )
}

export default HeaderModule;
