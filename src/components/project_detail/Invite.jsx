import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes }  from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

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
  background-color: ${({ invited }) => (invited ? '#b1b1b1' : '#007fff')};
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

const Searchbar=styled.div`
  position: relative;
  width: 80%;
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

const InviteModule = ({ skills, setInvite, projectId, projectTitle, companyName, pathname }) => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [key, setKey] = useState("");
    const token = sessionStorage.getItem("token");
    const companyId = sessionStorage.getItem("id");
    const navigate = useNavigate();
    const location = useLocation();
    function handleClose () {
      setInvite(false);
    }

    function getProfessionalUser(key){
      let url;
      if (key === '') {
        url = `http://localhost:8080/professional/list?start=${page}&size=5&skill=${skills}`
      } else {
        url = `http://localhost:8080/professional/list?start=${page}&size=5&name=${key}`
      }
      fetch(url, {
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
              const fetchedUsers = response.data.records.map(user => ({
                ...user,
                invited: false
              }));
              if (fetchedUsers.length > 0) {
                setUsers(prevUsers => [...prevUsers, ...fetchedUsers]);
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

    useEffect(() => {
      getProfessionalUser('');
    }, [page]);

    function handleInvite (userId, userFirstName, userLastName, index) {
      fetch(`http://localhost:8080/notification`, {
        method:'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({
          userId: userId,
          userName: `${userFirstName} ${userLastName}`,
          projectId: projectId,
          projectTitle: projectTitle,
          companyId: companyId,
          companyName: companyName,
          status: 8
        })
      }).then(
        response => response.json()
      ).then(
        response => {
          if(response.code === 200){
            setUsers(prevUsers =>
              prevUsers.map((user, idx) =>
                idx === index ? { ...user, invited: true } : user
              )
            );
          }
        }
      ).catch(
        error => {
          alert(`error: ${error.message}`);
        }
      );
    };

    return (
        <Background>
            <Container id="user_scrollable_container">
                <Search>
                  <Searchbar>
                    <SearchInput type="text" value={key} onChange={(e)=>{setKey(e.target.value);}} onKeyDown={
                      (event)=>{
                        if (event.key === "Enter"){
                          setUsers([])
                          getProfessionalUser(key)
                        }
                      }
                    }></SearchInput>
                    <SearchIcon src='/assets/magnifying_glass.svg'></SearchIcon>
                  </Searchbar>
                </Search>
                <ListContainer>
                  <InfiniteScroll
                    dataLength={users.length}
                    next={() => { setPage(prevPage => prevPage + 1); }}
                    hasMore={hasMore}
                    loader={hasMore ? <h4>Loading...</h4> : null}
                    scrollThreshold={0.9}
                    scrollableTarget="user_scrollable_container"
                  >
                    {users.length !== 0 &&
                      users.map((user, index1) => (
                        <UserContainer key={index1}>
                            <TitleContainer>
                                <AvaterContainer>
                                {/* {user.avatar && Array.isArray(user.avatar) ? (
                                  <img
                                    src={`data:image/jpeg;base64,${user.avatar}`}
                                    alt={`${user.firstname} ${user.lastname}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <span>No Image</span>
                                )} */}
                                </AvaterContainer>
                                <NameContainer onClick={()=>{
                                  navigate(`/profile/professional/${user.id}`, { state: { from: pathname } });
                                }}>{user.firstname} {user.lastname}</NameContainer>
                            </TitleContainer>
                            <SkillContainer>
                              {user.skill.map((tag) => (
                                <Tag key={tag}>
                                  {tag}
                                </Tag>
                              ))}
                            </SkillContainer>
                            <InviteButton
                              disabled={user.invited}
                              invited={user.invited}
                              onClick={() => handleInvite(user.id, user.firstname, user.lastname, index1)}
                            >
                              {user.invited ? 'Invited' : 'Invite'}
                            </InviteButton>                        
                        </UserContainer>
                      ))
                    }
                  </InfiniteScroll>
                </ListContainer>
                <CloseButton onClick={handleClose}>Close</CloseButton>
            </Container>
        </Background>
    );
};

export default InviteModule;

