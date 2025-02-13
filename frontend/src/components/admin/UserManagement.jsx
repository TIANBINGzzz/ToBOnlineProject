import React, {useState,useEffect,useRef} from 'react';
import {useLoaderData, useLocation, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollToTop from '../common/ToTop.jsx';
import ResetPassword from './ResetPassword.jsx';
import UserComplaint from './UserComplaint.jsx';
import UserReport from './UserReport.jsx';
import LockResetIcon from '@mui/icons-material/LockReset';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditIcon from '@mui/icons-material/Edit';

const Background = styled.div`
  width: calc(100vw - 230px);
  height: calc(100vh - 40px);
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  right: 10px;
  top: 10px;
  padding-top: 20px;
  background-color: #ffffff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.19);
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`

const WorkContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 97%;
  width: 100%;
`
const RequestContainer = styled.div`
  width: 25%;
  height: 100%;
  border-left: 1px solid #a5a5a5;
  margin-left: 15px;
`

const Container = styled.div`
  height: 100%;
  width: 70%;
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

const Card=styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  width: calc(100% - 15px);
  min-height: 120px;
  border-style:solid;
  border-color:#F0F3F5;
  background-color: #FFF;
  border-width:2px;
  border-radius: 10px;
  position: relative;
  padding-left: 5px;
  gap: 10px;
`

const UserTitle=styled.div`
  font-family: system-ui;
  font-size: 20px;
  font-weight: bold;
  width: auto;
  height: auto;


  &.id{
    font-weight: lighter;
    font-size: small;
    color: #999999;
    margin-top: 5px;
  }

  & + & {
    margin-left: 10px;
  }
`

const UserDate=styled.div`
  font-family: "Times New Roman", Times, serif;
  font-size: 14px;
  height: auto;
  width: auto;
`

const InfiniteScroll_wrapper = styled.div`
  width: 100%;
  & > div {
    & > div {
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:10px;
    }
  }
`

const PublisherDateContainer = styled.div`
  display: flex;
  gap: 40px;
`

const TitleContainer = styled.div`
  display: flex;
`

const UserDetails = styled.div`
  width: 100%;
  display: flex;
  gap: 10%;
`

const Searchbar=styled.div`
  position: relative;
  width: 40%;
  height: 36px;
  border: 2px solid #ccc;
  border-radius: 20px;
  margin-top:10px;
  margin-bottom: 20px;
`

const SearchIcon=styled.img`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
`

const Search=styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
`

const SearchInput=styled.input`
  width: calc(100% - 120px);
  height: 100%;
  padding-left: 40px;
  font-size: 16px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border: 0px;
  outline: none;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`

const UserDetail = styled.div``

const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  right: 10px;
  gap: 10px;
`

function UserManagement ({ showRequest }) {
    const permission = sessionStorage.getItem("permission");
    const navigate=useNavigate();
    const projectOverviewRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const token = sessionStorage.getItem("token");
    const [key, setKey] = useState("");
    const [search, setSearch] = useState(false)
    const location = useLocation();
    
    useEffect(() => { 
      getUserList(true);
    }, [page]);

    function getUserList(update){
      const body = {
        start: page,
        size: 20,
      };
      const queryParams = new URLSearchParams(body).toString();
      return fetch(`http://localhost:8080/user/list?${queryParams}`,{
          method:'GET',
          headers:{
            'content-type': 'application/json',
            'Authorization': `${token}`
          }
      }).then(
          response=>{
            return response.json();
          }
      ).then(
        response => {
            if(response.code===200){
              if (update===true){
                if (response.data.records.length > 0) {
                  if (users.length < 1){
                    setUsers(response.data.records);
                  }
                  else{
                    setUsers(preUsers => [...preUsers, ...response.data.records]);
                  }
                } else {
                  setHasMore(false);
                }
              }else{
                return response.data.records;
              }
            }
          }
      )
    }

    function getUser(id) {
      if (id === "") {
        setSearch(false);
        setUsers([])
        setPage(1);
        getUserList(true);
      } else {
        fetch(`http://localhost:8080/user/${id}`,{
          method:'GET',
          headers:{
            'content-type': 'application/json',
            'Authorization': `${token}`
          }
        }).then(
            response=>{
              return response.json();
            }
        ).then(
          response => {
              if(response.code===200){
                setUsers(response.data);
                setSearch(true);
              }
          }
        )
      }
    }
    
    function formatDateToAustralia(dateString) {
      const date = new Date(dateString);
      if (isNaN(date)) return "Invalid Date Format";
    
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Australia/Sydney'
      };
    
      return date.toLocaleString('en-AU', options);
    }

    function changeEnable(enable, id) {
      fetch(`http://localhost:8080/user/process/${id}?enable=${enable}`,{
        method:'PUT',
        headers:{
          'content-type': 'application/json',
          'Authorization': `${token}`
        }
      }).then(
          response=>{
            return response.json();
          }
      ).then(
        response => {
            if(response.code===200){
              setUsers(prevUsers =>
                prevUsers.map(user =>
                  user.id === id ? { ...user, enable: enable } : user
                )
              );
            }
        }
      )
    }

    function resetPassword (id) {
      fetch(`http://localhost:8080/user/reset/${id}`,{
        method:'PUT',
        headers:{
          'content-type': 'application/json',
          'Authorization': `${token}`
        }
      }).then(
          response=>{
            return response.json();
          }
      )
    }

    return (
        <Background>
          <WorkContainer>
            <Container ref={projectOverviewRef} id='scrollable_container'>
              <Search>
                  <Searchbar>
                    <SearchInput type="text" value={key} onChange={(e)=>{setKey(e.target.value);}} onKeyDown={
                      (event)=>{
                        if (event.key === "Enter"){
                          getUser(key)
                        }
                      }
                    }></SearchInput>
                    <SearchIcon src='/assets/magnifying_glass.svg'></SearchIcon>
                  </Searchbar>
              </Search>
              {search === false && <InfiniteScroll_wrapper>
                <InfiniteScroll
                  dataLength={users.length} // Length of the current project list
                  next={()=>{setPage(prevPage => prevPage + 1);}} // Function to fetch more data
                  hasMore={hasMore} // Boolean flag for fetching more data
                  loader={<h4>Loading...</h4>} // Show loader when fetching more data
                  endMessage={<p>You have reached the bottom.</p>} // Message when no more data
                  scrollableTarget="scrollable_container"
                >
                  {users.length !== 0 &&
                    users.map((user, index1) => (
                      <Card key={index1}>
                        <TitleContainer>
                          <UserTitle className='id'>ID: {user.id}</UserTitle>
                        </TitleContainer>
                        <UserDetails>
                          <UserDetail>Email: {user.email}</UserDetail>
                          <UserDetail>Phone: {user.telephone}</UserDetail>
                          <UserDetail>Name: {user.name}</UserDetail>
                        </UserDetails>
                        <PublisherDateContainer>
                          <UserDate>Create Date: {formatDateToAustralia(user.createTime)}</UserDate>
                        </PublisherDateContainer>
                        <ButtonContainer>
                          {permission.includes(1) && (user.enable === true ? <LockIcon onClick={()=>changeEnable(false, user.id)}/> : <LockOpenIcon onClick={()=>changeEnable(true, user.id)}/> )}
                          {permission.includes(3) && <LockResetIcon onClick={()=>resetPassword(user.id)}/>}
                          <EditIcon onClick={()=>{
                            navigate(`/profile/${user.userType}/${user.id}`, { state: { from: location.pathname } });
                          }}/>
                        </ButtonContainer>
                      </Card>
                    ))
                  }
                </InfiniteScroll>
              </InfiniteScroll_wrapper>}
              {search === true && 
                <Card>
                  <TitleContainer>
                    <UserTitle className='id'>ID: {users.id}</UserTitle>
                  </TitleContainer>
                  <UserDetails>
                    <UserDetail>Email: {users.email}</UserDetail>
                    <UserDetail>Phone: {users.telephone}</UserDetail>
                    <UserDetail>Name: {users.name}</UserDetail>
                  </UserDetails>
                  <PublisherDateContainer>
                    <UserDate>Create Date: {formatDateToAustralia(users.createTime)}</UserDate>
                  </PublisherDateContainer>
                </Card>
              }
              <ScrollToTop moduleRef={projectOverviewRef}/>
            </Container>
            {showRequest !== -1 && 
              <RequestContainer>
                {showRequest === 1 && (<ResetPassword></ResetPassword>)}
                {showRequest === 2 && (<UserReport getUser={getUser}></UserReport>)}
                {showRequest === 3 && (<UserComplaint getUser={getUser}></UserComplaint>)}
              </RequestContainer>
            }
          </WorkContainer>
        </Background>
    )
}

export default UserManagement;
