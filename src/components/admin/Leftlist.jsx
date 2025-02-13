import React, { useState } from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';

const Background = styled.div`
  width: 200px;
  height: calc(100vh - 10px);
  position: fixed;
  top: 5px;
  left: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  background-color:#007FFF;
  border-radius: 20px;
  z-index: 1;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Option = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  background-color: unset;
  background-image: linear-gradient(90deg, rgba(245, 245, 245, 0.3) 100%, rgba(245, 245, 245, 0.3) 100%);
  background-size: 0% 100%;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-size 0.5s ease;

  &:hover {
    background-size: 100% 100%;
    border-radius: 5px;
  }

  & + & {
    margin-top: 40px;
  }
`

const Button = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  margin-left: 15px;

`

const Btn = styled.button`
  border: none;
  background-color: unset;
  color: white;
  font-size: large;
  &.sub {
    font-size: small;
    font-weight: lighter;
  }
`

const Logout_button=styled.button`
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
  left: 25px;
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 30px;
`

const SubMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 90%;
  margin-left: 10px;
  transition: max-height 0.3s ease;
  overflow: hidden;
  max-height: ${({ isOpen }) => (isOpen ? '200px' : '0')};
`;

const SubOption = styled.div`
  display: flex;
  width: 100%;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
  }
`;

function Leftlist ({ setShowWorkModule, setShowRequest }) {
  const navigate = useNavigate();
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const permission = sessionStorage.getItem("permission");
  const initial = permission == "null" ? [] : permission;

  function logoutHandler(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('permission');
    sessionStorage.removeItem('enable');
    sessionStorage.removeItem('userName');
    navigate('/');
  }
  return (
    <Background>
      <Container>
        <ButtonContainer>
          {initial.includes(6) && <Option onClick={() => {
            setShowWorkModule(4);
            setIsUserManagementOpen(false);
            setShowRequest(-1);
          }}>
            <Button>
                <Btn>Admin Management</Btn>
            </Button>
          </Option>}
          {initial.includes(0) && <Option onClick={() => {
            setShowWorkModule(1);
            setIsUserManagementOpen(false);
            setShowRequest(-1);
          }}>
            <Button>
                <Btn>Platform Data</Btn>
            </Button>
          </Option>}
          {(initial.includes(4) || initial.includes(5)) && <Option onClick={() => {
            setShowWorkModule(2)
            setIsUserManagementOpen(false);
            setShowRequest(-1);
          }}>
            <Button>
                <Btn>Project Management</Btn>
            </Button>
          </Option>}
          {(initial.includes(1) || initial.includes(2) || initial.includes(3)) &&  <>
            <Option onClick={() => {
              setIsUserManagementOpen(true);
              setShowWorkModule(3)
              setShowRequest(-1);
              }}>
              <Button>
                <Btn>User Management</Btn>
              </Button>
            </Option>
            <SubMenu isOpen={isUserManagementOpen}>
              {initial.includes(3) && <SubOption onClick={() => setShowRequest(1)}>
                <Button className='sub'>
                  <Btn className='sub'>Password reset request</Btn>
                </Button>
              </SubOption>}
              {initial.includes(1) && <SubOption onClick={() => setShowRequest(2)}>
                <Button className='sub'>
                  <Btn className='sub'>User reports</Btn>
                </Button>
              </SubOption>}
              {initial.includes(1) && <SubOption onClick={() => setShowRequest(3)}>
                <Button className='sub'>
                  <Btn className='sub'>User complaints</Btn>
                </Button>
              </SubOption>}
            </SubMenu>
          </>}
        </ButtonContainer>
        <Logout_button type="button" onClick={logoutHandler}/>
      </Container>
    </Background>
  )
}

export default Leftlist;
