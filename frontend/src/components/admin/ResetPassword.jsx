import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import ScrollToTop from '../common/ToTop.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConvertDate from './ConverDate.jsx';
import Checkbox from '@mui/material/Checkbox';

const Background = styled.div`
  width:100%;
  height:100%;
  padding: 5px;
  background-color: #ffffff;
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

const InfiniteScroll_wrapper = styled.div`
  width: 100%;
  padding-top: 20px;
  & > div {
    & > div {
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:10px;
    }
  }
`

const Card=styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  width: 60%;
  min-height: 100px;
  border-style:solid;
  border-color:#F0F3F5;
  background-color: #FFF;
  border-width:2px;
  border-radius: 10px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 20px;
  position: relative;
`

const Project_date=styled.div`
  font-family: "Times New Roman", Times, serif;
  font-size: 14px;
  height: auto;
  width: auto;
`
const PublisherDateContainer = styled.div`
  width: 100%;
  text-align: end;
`

const Message = styled.div`
  font-family: "Times New Roman", Times, serif;
  font-size: 14px;
  height: auto;
  width: auto;
  display: flex;
  flex-direction: row;
`

// status=12
function ResetPassword () {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const token = sessionStorage.getItem("token");
  const projectOverviewRef = useRef(null);


  useEffect(() => {
    getNotifications();
  }, [page]);

  function getNotifications(){
    const body = {
      page: page,
      size: 100,
      status: 12,
    };
    const queryParams = new URLSearchParams(body).toString();
    fetch(`http://localhost:8080/notification/list?${queryParams}`, {
      method:'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      }
    }).then(
      response => response.json()
    ).then(
      response => {
        if(response.code === 200){
          if (response.data.records.length > 0) {
            if (notifications.length < 1){
              setNotifications(response.data.records);
            } else{
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

  function RemoveNotification(id, idx){
    fetch(`http://localhost:8080/notification/process/${id}?status=15&trigger=true`, {
      method:'PUT',
      headers: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      }
    }).then(
      response => response.json()
    ).then(
      response => {
        if(response.code === 200){
          setNotifications((prevNotifications) => {
            const updatedNotifications = [...prevNotifications];
            updatedNotifications.splice(idx, 1);
            return updatedNotifications;
          });
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

  return (
    <Background ref={projectOverviewRef} id='reset_scrollable_container'>
      <InfiniteScroll_wrapper>
        <InfiniteScroll
          dataLength={notifications.length} // Length of the current project list
          next={()=>{setPage(prevPage => prevPage + 1);}} // Function to fetch more data
          hasMore={hasMore} // Boolean flag for fetching more data
          loader={<h4>Loading...</h4>} // Show loader when fetching more data
          endMessage={<p>You have reached the bottom.</p>} // Message when no more data
          scrollableTarget="reset_scrollable_container"
        >
          {notifications.length !== 0 &&
            notifications.map((notification, index1) => (
              <Card key={notification.id}>
                <Checkbox
                  {...label}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px'
                  }}
                  onClick={() => RemoveNotification(notification.id, index1)}
                />
                <Message>{notification.feedback}</Message>
                <PublisherDateContainer>
                  <Project_date>{ConvertDate(notification.createTime)}</Project_date>
                </PublisherDateContainer>
              </Card>
            ))
          }
        </InfiniteScroll>
      </InfiniteScroll_wrapper>
      <ScrollToTop moduleRef={projectOverviewRef}/>
    </Background>
  )
}

export default ResetPassword;
