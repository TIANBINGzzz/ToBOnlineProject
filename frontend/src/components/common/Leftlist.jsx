import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Notification from './notification';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Background = styled.div`
  width: 220px;
  height: calc(100vh - 10px);
  position: fixed;
  top: 5px;
  left: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  background-color:#007FFF;
  border-radius: 20px;
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 80px;
`

const Option = styled.div`
  height: auto;
  width: 190px;
  display: flex;
  background-color: unset;
  background-image: linear-gradient(90deg, rgba(245, 245, 245, 0.3) 100%, rgba(245, 245, 245, 0.3) 100%);
  background-size: 0% 100%;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-size 0.5s ease;
  padding-left: 25px;
  padding-right: 5px;
  padding-top: 15px;
  padding-bottom: 15px;

  &:hover {
    background-size: 100% 100%;
    border-radius: 30px;
  }
`
const Image = styled.div`
  height: 30px;
  width: 30px;
`
const Img = styled.img`
  height: 100%;
  width: 100%;
  filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%);
`
const Button = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
`

const Btn = styled.button`
  border: none;
  background-color: unset;
  font-size: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: lighter;
  color: #ffffff;
`

const Logout_button = styled.button`
  position: fixed;
  background-image: url("/assets/logout.svg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width:30px;
  background-color: unset;
  height:30px;
  border:0px;
  bottom: 30px;
  left: 180px;
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const toastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};


function Leftlist() {
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

    socket.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      const message = newNotification.message || "You have a new message!";
      setUpdate(true);
      toast(message);
    };

    socket.onclose = () => {
    };

    socket.onerror = (error) => {
    };

  }, []);

  return (
    <Background>
      <ToastContainer {...toastOptions} />
      <Container>
        <ButtonContainer>
          <Option onClick={() => { navigate('/dashboard'); }}>
            <Image>
              <Img src='/assets/home.png' />
            </Image>
            <Button>
              <Btn>dashboard</Btn>
            </Button>
          </Option>
          <Option onClick={() => { navigate(`/profile/${userType}/${userId}`, { state: { from: location.pathname } }) }}>
            <Image>
              <Img src='/assets/user.png' />
            </Image>
            <Button>
              <Btn>profile</Btn>
            </Button>
          </Option>
          <Option onClick={() => {
            if (userType === 'company') {
              navigate('/MyProject/company', { state: { from: location.pathname } });
            }
            else if (userType === 'professional') {
              navigate('/MyProject/professional', { state: { from: location.pathname } });
            }
          }}>
            <Image>
              <Img src='/assets/folder.png' />
            </Image>
            <Button>
              <Btn>project</Btn>
            </Button>
          </Option>
          <Option onClick={openNotification}>
            <Image>
              <Img src='/assets/bell.png' />
            </Image>
            <Button>
              <Btn>notification</Btn>
            </Button>
          </Option>

          {isNotificationOpen && (
            <Notification isNotificationOpen={isNotificationOpen} update={update} setUpdate={setUpdate} ></Notification>
          )}
        </ButtonContainer>
        <Logout_button type="button" onClick={logoutHandler} />
      </Container>
    </Background>
  )
}

export default Leftlist;
