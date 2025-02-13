import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroll-component';


const NotificationInfo = styled.div`
  width: 300px;
  height: calc(100vh - 95px);
  background-color:#ffffff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  border-top-left-radius: 20px;
  border-bottom-right-radius: 20px;
  position: fixed;
  left:calc(100vw - 390px);
  top: 65px;
  padding-top:20px;
  padding-left:30px;
  padding-right:50px;
  z-index: 100;
`;
const ApplicationContent = styled.div`
  padding-left: 40px;
`
const SmallHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Title = styled.div`
  font-size: 20px;
`;
const SmallBody = styled.div`
  max-height: calc(100vh - 210px);
  padding-top: 20px;
  padding-left:5px;
  padding-right:5px;
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
`;
const Notice1 = styled.div`
  background-color:#ffffff;
  border: 1px solid #ececec;
  min-height:90px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content:space-evenly;
  
  & + & {
    margin-top: 10px;
  }
`;
const SignalAvatarTitle = styled.div`
  padding-top:15px;
  display: flex;
  justify-content: flex-start;
  gap: 20px;
`;
const SignalAvatar = styled.div`
  padding-left: 10px;
  height: 24px;
  width: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const Signal = styled.div`
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius:5px;
`;
const SmallTitle = styled.div`
  font-size:18px;
  font-weight: bold;
  &:hover {
    cursor: pointer;
  }
`;
const AcceptReject = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 15px;
  margin-bottom: 5px;
  width: 100%;
`;
const AcceptButton = styled.button`
  all: unset;
  text-align: center;
  width: 60px;
  background-color: #007fff;
  transition: background-position 0.5s, transform 0.3s ease;
  color: white;
  padding: 7px;
  border-radius: 6px;
  &:hover {
    transform: scale(1.1);
  }
  &.reject{
    background-color: #ff7f00;
  }
`;

const ReleaseTime = styled.div`
  display: flex;
  justify-content: end;
  padding-right: 10px;
  padding-bottom: 5px;
  color: #939393;
`;

const ExplainInput = styled.input`
  all: unset;
  margin-top: 3px;
  padding: 3px;
  width: 70%;
  border-style: solid;
  border-color: #007fff;
  border-width: 2px;
  border-radius: 3px;

`

const ExplainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`




function Notification({ isNotificationOpen, update, setUpdate }) {
  const [notifications, setNotifications] = useState([]);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("id");
  const [showExplain, setShowExplain] = useState({});
  const [explain, setExplain] = useState({});

  useEffect(() => {
    getProjects();
  }, [page]);

  useEffect(() => {
    setNotifications([]);
    setPage(0);
    getProjects();
    setUpdate(false);
  }, [isNotificationOpen, update])

  function getProjects() {
    const body = {
      page: page,
      size: 20
    };
    const queryParams = new URLSearchParams(body).toString();
    return fetch(`http://localhost:8080/notification/list?${queryParams}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      }
    }).then(
      response => response.json()
    ).then(
      response => {
        if (response.code === 200) {
          if (response.data.records.length > 0) {
            if (notifications.length < 1) {
              setNotifications(response.data.records);
            }
            else {
              setNotifications(prevNotifications => [...prevNotifications, ...response.data.records]);
            }
          } else {
            setHasMore(false);
          }
        } else {
          throw new Error(response.status);
        }
      }
    ).catch(
      error => {
        alert(`error: ${error.message}`);
      }
    );
  };

  const handleRead = (id) => {
    fetch(`http://localhost:8080/notification/click/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      }
    }).then(
      response => response.json()
    ).then(
      response => {
        if (response.code === 200) {
          setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
              notification.id === id ? { ...notification, click: true } : notification
            )
          );
        }
      }
    )
  };

  const handleProcessApply = (notification, status, explain = null) => {
    if (status === 1 && explain === null) {
      explain = "you do not meet the requirements of the project."
    }
    fetch(`http://localhost:8080/application/process/${notification.applicationId}?status=${status}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      }
    }).then(
      response => response.json()
    ).then(() => {
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notification.id
            ? { ...n, feedback: explain || status.toString() }
            : n
        )
      );
    })

    fetch(`http://localhost:8080/notification`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      },
      body: JSON.stringify({
        applicationId: notification.applicationId,
        userId: notification.userId,
        userName: notification.userName,
        projectId: notification.projectId,
        projectTitle: notification.projectTitle,
        companyId: notification.companyId,
        companyName: notification.companyName,
        status: status,
        feedback: explain,
      })
    })
  };

  const handleProcessInvite = (notification, status) => {
    if (status === 2) {
      fetch(`http://localhost:8080/application/invite/${notification.projectId}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'Authorization': `${token}`
        }
      }).then(
        response => response.json()
      ).then((response) => {
        if (response.code === 200) {
          setNotifications(prevNotifications =>
            prevNotifications.map(n =>
              n.id === notification.id
                ? { ...n, feedback: `${status}` }
                : n
            )
          );
        }
      })
    }


    fetch(`http://localhost:8080/notification/process/${notification.id}?status=${status}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      }
    }).then(
      response => response.json()
    ).then(
      response => {
        if (response.code === 200) {
          setNotifications(prevNotifications =>
            prevNotifications.map(n =>
              n.id === notification.id
                ? { ...n, feedback: `${status}` }
                : n
            )
          );
        }
      }
    )
  };

  const handleChange = (notificationId, value) => {
    setExplain((prev) => ({
      ...prev,
      [notificationId]: value,
    }));
  };


  return (
    <NotificationInfo>
      <SmallHeader>
        <Title>Notifications</Title>
      </SmallHeader>
      <SmallBody id="notification_scrollable_container">
        <InfiniteScroll
          dataLength={notifications.length}
          next={() => { setPage(prevPage => prevPage + 1); }}
          hasMore={hasMore}
          loader={hasMore ? <h4>Loading...</h4> : null}
          endMessage={<p>You have no more notifications.</p>}
          scrollThreshold={0.9}
          scrollableTarget="notification_scrollable_container"
        >
          {notifications.length !== 0 &&
            notifications.map((notification, index1) => {
              let noticeContent;
              let sender;
              let time;
              let applicationContent;
              let explainContent;

              // show time
              const notificationTime = new Date(notification.createTime);
              const currentTime = new Date();
              const timeDiff = (currentTime.getTime() - notificationTime.getTime()) / 1000 - 39600;
              const minuteInSeconds = 60;
              const hourInSeconds = 3600;
              const dayInSeconds = 86400;
              const weekInSeconds = dayInSeconds * 7;
              const yearInSeconds = dayInSeconds * 365;

              if (timeDiff < minuteInSeconds) {
                time = 'now';
              } else if (timeDiff < hourInSeconds) {
                const minutes = Math.floor(timeDiff / 60);
                time = `${minutes} minutes ago`;
              } else if (timeDiff < dayInSeconds) {
                const hours = Math.floor(timeDiff / 3600);
                time = `${hours} hours ago`;
              } else if (timeDiff < weekInSeconds) {
                const days = Math.floor(timeDiff / 86400);
                time = `${days} days ago`;
              } else if (timeDiff < yearInSeconds) {
                const weeks = Math.floor(timeDiff / weekInSeconds);
                time = `${weeks} weeks ago`;
              } else {
                const years = Math.floor(timeDiff / yearInSeconds);
                time = `${years} years ago`;
              }
              // check status
              switch (notification.status) {
                case 0: // apply (company)
                  if (!notification.feedback) {
                    sender = (<SmallTitle onClick={() => {
                      navigate(`/profile/professional/${notification.userId}`, { state: { from: location.pathname } });
                    }}>From: <u>{notification.userName}</u></SmallTitle>);
                    noticeContent = (
                      <AcceptReject>
                        <AcceptButton onClick={() => handleProcessApply(notification, 2)}>Accept</AcceptButton>
                        <AcceptButton className='reject' onClick={() => {
                          setShowExplain((prev) => ({
                            ...prev,
                            [notification.id]: true,
                          }));
                        }}>Reject</AcceptButton>
                      </AcceptReject>
                    );
                    explainContent = (
                      <ExplainContainer>
                        <ExplainInput placeholder='Please enter the explain' onChange={(e) => handleChange(notification.id, e.target.value)} />
                        <AcceptReject>
                          <AcceptButton onClick={() => {
                            handleProcessApply(notification, 1, explain[notification.id]?.toLowerCase())
                            setExplain((prev) => ({
                              ...prev,
                              [notification.id]: '',
                            }));
                          }}>Confirm</AcceptButton>
                          <AcceptButton className='cancel' onClick={() => {
                            setShowExplain((prev) => ({
                              ...prev,
                              [notification.id]: false,
                            }));
                            setExplain((prev) => ({
                              ...prev,
                              [notification.id]: '',
                            }));
                          }}>Cancel</AcceptButton>
                        </AcceptReject>
                      </ExplainContainer>
                    )
                    applicationContent = (<ApplicationContent>Apply for {notification.projectTitle}</ApplicationContent>);
                  }
                  else if (notification.feedback !== '2') {
                    sender = (<SmallTitle onClick={() => {
                      navigate(`/profile/professional/${notification.userId}`, { state: { from: location.pathname } });
                    }}>From: {notification.userName}</SmallTitle>);
                    applicationContent = (<ApplicationContent>The application for {notification.projectTitle} has been rejected.</ApplicationContent>);
                  }
                  else if (notification.feedback === '2') {
                    sender = (<SmallTitle onClick={() => {
                      navigate(`/profile/professional/${notification.userId}`, { state: { from: location.pathname } });
                    }}>From: {notification.userName}</SmallTitle>);
                    applicationContent = (<ApplicationContent>The application for {notification.projectTitle} has been accepted.</ApplicationContent>);
                  }
                  break;
                case 1: // reject (user)
                  sender = (<SmallTitle onClick={() => {
                    navigate(`/profile/company/${notification.companyId}`, { state: { from: location.pathname } });
                  }}>From: {notification.companyName}</SmallTitle>);
                  applicationContent = (<ApplicationContent>Your application for {notification.projectTitle} has been rejected because {notification.feedback}</ApplicationContent>);
                  break;
                case 2: // accept (user)
                  sender = (<SmallTitle onClick={() => {
                    navigate(`/profile/company/${notification.companyId}`, { state: { from: location.pathname } });
                  }}>From: {notification.companyName}</SmallTitle>);
                  applicationContent = (<ApplicationContent>Your application for {notification.projectTitle} has been accepted!</ApplicationContent>);
                  break;
                case 3: // project done
                  sender = (<SmallTitle>From: {notification.projectTitle}</SmallTitle>);
                  applicationContent = (<ApplicationContent>This project has been completed!</ApplicationContent>);
                  break;
                case 4: // project done
                  sender = (<SmallTitle>From: {notification.projectTitle}</SmallTitle>);
                  applicationContent = (<ApplicationContent>This project has been completed!</ApplicationContent>);
                  break;
                case 5: // quit (company)
                  sender = (<SmallTitle>From: {notification.projectTitle}</SmallTitle>);
                  applicationContent = (<ApplicationContent>{notification.userName} has withdrawn from {notification.projectTitle} because {notification.feedback}</ApplicationContent>);
                  break;
                case 6: // user feedback
                  sender = (<SmallTitle>From: {notification.projectTitle}</SmallTitle>);
                  applicationContent = (<ApplicationContent>{notification.userName} has provided a rating of {notification.feedback}/5 for your project.</ApplicationContent>);
                  break;
                case 7: // company feedback
                  sender = (<SmallTitle>From: {notification.projectTitle}</SmallTitle>);
                  applicationContent = (<ApplicationContent>{notification.companyName} has rated your performance on this project: {notification.feedback}/5. We appreciate your hard work!</ApplicationContent>);
                  break;
                case 8: // invite (user)
                  if (!notification.feedback) {
                    sender = (<SmallTitle onClick={() => {
                      navigate(`/profile/professional/${notification.companyId}`, { state: { from: location.pathname } });
                    }}>From: {notification.companyName}</SmallTitle>);
                    noticeContent = (
                      <AcceptReject>
                        <AcceptButton onClick={() => handleProcessInvite(notification, 2)}>Accept</AcceptButton>
                        <AcceptButton className='reject' onClick={() => {
                          handleProcessInvite(notification, 1)
                          setExplain((prev) => ({
                            ...prev,
                            [notification.id]: '',
                          }));
                        }}>Reject</AcceptButton>
                      </AcceptReject>
                    );
                    applicationContent = (<ApplicationContent>Invitation from {notification.projectTitle}</ApplicationContent>);
                  }
                  else if (notification.feedback === '1') {
                    sender = (<SmallTitle onClick={() => {
                      navigate(`/profile/company/${notification.companyId}`, { state: { from: location.pathname } });
                    }}>From: {notification.companyName}</SmallTitle>);
                    applicationContent = (<ApplicationContent>The invitation from {notification.projectTitle} has been rejected.</ApplicationContent>);
                  }
                  else if (notification.feedback === '2') {
                    sender = (<SmallTitle onClick={() => {
                      navigate(`/profile/company/${notification.companyId}`, { state: { from: location.pathname } });
                    }}>From: {notification.companyName}</SmallTitle>);
                    applicationContent = (<ApplicationContent>The invitation from {notification.projectTitle} has been accepted.</ApplicationContent>);
                  }
                  break;
                case 9: // kick off
                  sender = (<SmallTitle>From: {notification.projectTitle}</SmallTitle>);
                  applicationContent = (<ApplicationContent>You have been removed from {notification.projectTitle}.</ApplicationContent>);
                  break;
                default:
                  break;
              }

              return (
                <Notice1 key={index1} onClick={() => handleRead(notification.id)}>
                  <SignalAvatarTitle>
                    <SignalAvatar>
                      {!notification.click && <Signal></Signal>}
                    </SignalAvatar>
                    {sender}
                  </SignalAvatarTitle>
                  {applicationContent}
                  {!showExplain[notification.id] && noticeContent}
                  {showExplain[notification.id] && explainContent}
                  <ReleaseTime>{time}</ReleaseTime>
                </Notice1>
              );
            })
          }
        </InfiniteScroll>
      </SmallBody>
    </NotificationInfo>
  );
}

export default Notification;
