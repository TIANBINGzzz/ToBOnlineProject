import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Container = styled.div`
  position: relative;
  width: 60%;
  max-width: 600px;
  height: 60%;
  max-height: 80vh;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.19);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: hidden;
  z-index: 1001;
`;

const flowColors = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`

const CloseButton = styled.button`
    all: unset;
    background-color: #007FFF;
    color: white;
    position: absolute;
    bottom: 3%;
    right: 2%;
    transition: background-position 0.5s, transform 0.3s ease;
    width: 10%;
    height: 8%;
    min-width: 60px;
    min-height: 40px;
    text-align: center;
    border-radius: 10px;

    &:hover {
    animation: ${flowColors} 1s infinite linear; 
    transform: scale(1.1);
  }
`

const ListContainer = styled.div`
    width: 85%;
    height: 70%;
    border-radius: 10px;
    transform: translate( 0, -3%);
    display: flex;
    flex-direction: column;
    gap:30px;
    overflow: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: unset;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #f5f5f5;
        border-radius: 10px;
        border: 2px solid #f1f1f1;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: #555;
    }
`

const UserContainer = styled.div`
    margin: 5px;
    border: 1px solid #b1b1b1;
    position: relative;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    overflow: hidden;
`

const InviteButton = styled.button`
  all: unset;
  position: absolute;
  right: 7px;
  bottom: 50%;
  transform: translate(0, 50%);
  font-family: Arial, Helvetica, sans-serif;
  background-color: ${({ invited }) => (invited ? '#b1b1b1' : '#9b0000')};
  padding: 5px;
  border-radius: 5px;
  color: white;
  cursor: ${({ invited }) => (invited ? 'unset' : 'pointer')};
  transition: background-position 0.5s, transform 0.3s ease;
  &:hover {
    animation: ${flowColors} 1s infinite linear;
    transform: ${({ invited }) => (invited ? 'translate(0, 50%)' : 'scale(1.1) translate(0, 45%)')};
  }
`;

const NameContainer = styled.div`
    padding-left: 5px;
`

const AvaterContainer = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
`

const SkillContainer = styled.div`
    padding-left: 35px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 8px;
`

const Tag = styled.span`
    background-color: #f5f5f5;
    border-radius: 16px;
    padding: 4px 8px;
    font-size: 14px;
    display: flex;
    align-items: center; 
    flex-wrap: wrap;
`

const RemoveModule = ({ setRemove, projectId, projectTitle, companyName, pathname }) => {
  const [participants, setParticipants] = useState([]);
  const token = sessionStorage.getItem("token");
  const companyId = sessionStorage.getItem("id");
  const navigate = useNavigate();
  const param = useParams();
  function handleClose() {
    setRemove(false);
  }

  const getParticipants = () => {
    fetch(`http://localhost:8080/application/project/${param.pid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    }).then((response) => {
      return response.json();
    }).then((response) => {
      if (response.code === 200) {
        setParticipants(response.data.records);
      }
    })
  }

  useEffect(() => {
    getParticipants();
  }, []);

  function handleRemove(participant, index) {
    fetch(`http://localhost:8080/application/process/${participant.id}?status=4`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    }).then((response) => {
      return response.json();
    }).then((response) => {
      if (response.code === 200) {
        setParticipants((prevParticipants) =>
          prevParticipants.filter((_, i) => i !== index)
        );
      }
    });

    fetch(`http://localhost:8080/notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
      body: JSON.stringify({
        applicationId: participant.id,
        userId: participant.userId,
        userName: participant.userName,
        projectId: participant.projectId,
        projectTitle: participant.projectTitle,
        companyId: participant.companyId,
        companyName: participant.companyName,
        status: 9
      })
    }).then((response) => {
      return response.json();
    })

  };

  return (
    <Background>
      <Container>
        <ListContainer>
          {participants.length !== 0 &&
            participants.map((participant, index1) => (
              <UserContainer key={index1}>
                <TitleContainer>
                  <AvaterContainer>
                  </AvaterContainer>
                  <NameContainer onClick={() => {
                    navigate(`/profile/professional/${participant.userId}`, { state: { from: pathname } });
                  }}>{participant.userName}</NameContainer>
                </TitleContainer>
                <InviteButton
                  onClick={() => handleRemove(participant, index1)}
                >
                  Remove
                </InviteButton>
              </UserContainer>
            ))
          }
        </ListContainer>
        <CloseButton onClick={handleClose}>Close</CloseButton>
      </Container>
    </Background>
  );
};

export default RemoveModule;

