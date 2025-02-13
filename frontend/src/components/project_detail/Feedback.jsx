import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

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
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
`

const StarsContainer = styled.div`
    display: flex;
`;

const Star = styled.span`
  font-size: 30px;
  cursor: ${props => (props.isSaved ? 'default' : 'pointer')};
  color: ${props => (props.filled ? '#FFD700' : '#ddd')};
  transition: color 0.2s;
  pointer-events: ${props => (props.isSaved ? 'none' : 'auto')};

  &:hover {
    color: ${props => (props.isSaved ? 'unset' : '#FFD700')};
  }
`;

const flowColors = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`

const Button = styled.button`
    all: unset;
    background-color: #1b8dff;
    padding-left: 10px;
    padding-right: 10px;
    color: white;
    margin-left: 20px;
    border-radius: 5px;
    font-family: Arial, Helvetica, sans-serif;
    transition: background-position 0.5s, transform 0.3s ease;

    &:hover {
      animation: ${flowColors} 1s infinite linear; 
      transform: scale(1.1);
    }
`;

const UserName = styled.div``;

const FeedbackModule = ({ companyName, companyId, applicationId }) => {
  const [rating, setRating] = useState({});
  const [participants, setParticipants] = useState([]);
  const userType = sessionStorage.getItem('userType');
  const param = useParams();
  const token = sessionStorage.getItem("token");
  const [isSaved, setIsSaved] = useState({});

  const handleRating = (value, userId) => {
    setRating((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

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
        const participantsData = response.data.records;
        const initialRatings = {};
        participantsData.forEach((participant) => {
          initialRatings[participant.userId] = participant.companyFeedback || 0;
          if (participant.companyFeedback > 0) {
            setIsSaved((prev) => ({
              ...prev,
              [participant.userId]: true,
            }));
          }
        });
        setRating(initialRatings);
        setParticipants(participantsData);
      }
    })
  }

  useEffect(() => {
    getParticipants();
  }, [])

  function handleFeedback(applicationId, userId) {
    fetch(`http://localhost:8080/application/feedback/${applicationId}?feedback=${rating[userId]}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    }).then((response) => {
      return response.json();
    }).then((response) => {
      if (response.code === 200) {
        setIsSaved((prev) => ({
          ...prev,
          [userId]: true,
        }));
      }
    });
  };
  
  return (
    <ListContainer>
      {userType === "company" && participants.length !== 0 &&
        participants.map((participant, index1) => (
          <UserContainer key={index1}>
            <UserName>{participant.userName}</UserName>
            <StarsContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  filled={star <= (rating[participant.userId] || 0)}
                  isSaved={isSaved[participant.userId]}
                  onClick={() => !isSaved[participant.userId] && handleRating(star, participant.userId)}
                >
                  ★
                </Star>
              ))}
              {!isSaved[participant.userId] && (
                <Button onClick={() => handleFeedback(participant.id, participant.userId)}>Save</Button>
              )}
            </StarsContainer>
          </UserContainer>
        ))
      }
      {
        userType === "professional" && (
          <UserContainer>
            <UserName>{companyName}</UserName>
            <StarsContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  filled={star <= (rating[companyId] || 0)}
                  isSaved={isSaved[companyId]}
                  onClick={() => !isSaved[companyId] && handleRating(star, companyId)}
                >
                  ★
                </Star>
              ))}
              {!isSaved[companyId] && (
                <Button onClick={() => handleFeedback(applicationId, companyId)}>Save</Button>
              )}
            </StarsContainer>
          </UserContainer>
        )
      }
    </ListContainer>
  );
};

export default FeedbackModule;
