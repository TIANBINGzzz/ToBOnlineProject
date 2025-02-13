import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Leftlist from '../components/common/Leftlist.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import HeaderModule from '../components/common/Header.jsx';
import Notification from '../components/common/notification.jsx';
import ScrollToTop from '../components/common/ToTop.jsx';

const BigDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`

const Myproject = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`

const Switch = styled.div`
    display:flex;
    justify-content:space-around;
    width: calc(100vw - 100px);
    height: 80px;
    position: absolute;
    top:70px;
    left:170px;
    background-color:white;
`

const Switchbtn = styled.button`
    width: 20%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 0px;
    padding:0px;
    background-color:white;
    &:hover {
      background-color: #e0e0e0;
    }
`

const ProjectOverview = styled.div`
  width:calc(100vw - 100px);
  height:calc(100vh - 180px);
  margin-top:70px;
  margin-left:70px;
  overflow-y: scroll;
  padding-top: 100px;
  display:flex;
  flex-direction:column;
  align-items:center;
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

const Colorband = styled.div`
    width: 100%;
    height: 6px;
    margin-bottom:10px;
`

const ProjectType = styled.div`
    font-family: system-ui;
    font-size: 20px;
    font-weight: bold;
    color: #515c6d;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom:10px;
  width: 50%;
  height: auto;
  padding: 20px 30px 20px 30px;
  border-style:solid;
  border-color:#F0F3F5;
  border-width:2px;
  border-radius: 10px;
  gap:10px;
  &:hover {
    cursor: pointer;
    background-color: #e0e0e0;
  }
`

const ProjectTitle = styled.div`
  font-family: system-ui;
  font-size: 20px;
  font-weight: bold;
  width: auto;
  height: auto;
  margin-bottom:10px;
`

const ProjectDate = styled.div`
  font-family: "Times New Roman", Times, serif;
  font-size: 16px;
  height: auto;
  width: auto;
`

const CompanyName = styled.div`
  width: auto;
  height: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
`

const ApplyResult = styled.div`
  border-radius: 20px;
  padding: 7px 12px 7px 12px;
  font-family: system-ui;
  font-size: 16px;
  width: auto;
  height: 30px;
  margin-right: 10px;
  box-sizing: border-box;
  line-height: 16px;
`

const Score = styled.div`
  display: flex;
  justify-content: space-between;
  width: auto;
  height: auto;
`

const Rating = styled.div`
  color: #515c6d;
  font-size: 14px;
  margin-right: 5px;
  line-height:30px;
`

const StarFill = styled.img`
  width:auto;
  height:auto;
`

const StarEmpty = styled.img`
  width:auto;
  height:auto;
`

const Unrated = styled.div`
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 7px 12px 7px 12px;
  font-family: system-ui;
  font-size: 16px;
  width: auto;
  height: 30px;
  color: #515c6d;
  margin-right: 10px;
  box-sizing: border-box;
  line-height: 16px;
`

const InfiniteScrollWrapper = styled.div`
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

function MyProjectProfessional() {
  const userType = sessionStorage.getItem("userType");
  const userId = sessionStorage.getItem("id");
  const navigate = useNavigate();
  const projectOverviewRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [projectType, setProjectType] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [isSamepage, setIsSamepage] = useState(true);
  const location = useLocation();
  const [back, setBack] = useState(null);


  useEffect(() => {
    getProjects(projectType, isSamepage);
  }, [page, projectType]);

  useEffect(() => {
    if (location.state.from) {
      setBack(location.state.from);
    }
  }, [back]);

  const BackPage = () => {
    if (back) {
      navigate(`${back}`, { state: { from: location.pathname } })
    }
  }

  function getProjects(projectType, isSamepage) {
    const body = {
      id: userId,
      role: userType,
      status: projectType,
      start: page,
      size: 5
    };
    const queryParams = new URLSearchParams(body).toString();
    if (!sessionStorage.getItem("token")) {
      navigate('/');
    }
    const token = sessionStorage.getItem("token");
    return fetch(`http://localhost:8080/application/list?${queryParams}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `${token}`
      }
    }).then(
      response => {
        return response.json();
      }
    ).then(
      response => {
        if (response.code === 200) {
          if (response.data.records.length > 0) {
            if (isSamepage) {
              setProjects(prevProjects => [...prevProjects, ...response.data.records]);
            } else {
              setProjects(response.data.records);
            }
          } else {
            setHasMore(false); // If no more projects are returned, stop fetching
          }
        } else {
          throw new Error(response.msg);
        }
      }
    )
  }

  const handlePageChange = (newType) => {
    if (newType !== projectType) {
      setProjectType(newType);
      setPage(1);
      setProjects([]);
      setHasMore(true);
      setIsSamepage(false);
    }
  };

  return (
    <BigDiv>
      <Myproject>
        <HeaderModule handleClick={BackPage} />
        <Leftlist />
        <Switch>
          <Switchbtn onClick={
            () => {
              handlePageChange(0);
            }
          }>
            <Colorband style={{ backgroundColor: "#b8b8b8" }} />
            <ProjectType>applying</ProjectType>
          </Switchbtn>
          <Switchbtn onClick={
            () => {
              handlePageChange(2);
            }
          }>
            <Colorband style={{ backgroundColor: "#ffd200" }} />
            <ProjectType>in progress</ProjectType>
          </Switchbtn>
          <Switchbtn onClick={
            () => {
              handlePageChange(1);
            }
          }>
            <Colorband style={{ backgroundColor: "#27c93f" }} />
            <ProjectType>completed</ProjectType>
          </Switchbtn>
        </Switch>
        <ProjectOverview ref={projectOverviewRef} id='scrollable_container'>
          <InfiniteScrollWrapper>
            <InfiniteScroll
              dataLength={projects.length} // Length of the current project list
              next={() => { setPage(prevPage => prevPage + 1); }} // Function to fetch more data
              hasMore={hasMore} // Boolean flag for fetching more data
              loader={<h4>Loading...</h4>} // Show loader when fetching more data
              endMessage={<p>You have reached the bottom.</p>} // Message when no more data
              scrollThreshold={0.9}
              scrollableTarget="scrollable_container"
            >
              {projects.length !== 0 &&
                projects.map((project, index1) => (
                  <Card key={index1} onClick={() => {
                    if (userType === "professional") {
                      navigate(`/project/${project.projectId}`);
                    }
                  }}>
                    <ProjectTitle>{project.projectTitle}</ProjectTitle>
                    <CompanyName>{project.companyName}</CompanyName>
                    <ProjectDate>{project.updateTime}</ProjectDate>
                    {(project.status === 0 || project.status === 1) &&
                      <Score>
                        <Rating>STATUS</Rating>
                        {project.status === 0 && <ApplyResult style={{ color: "#3fc171", backgroundColor: "#d2ecdd" }}>Applying</ApplyResult>}
                        {project.status === 1 && <ApplyResult style={{ color: "#dc5541", backgroundColor: "#f8c2c2" }}>Rejected</ApplyResult>}
                      </Score>
                    }
                    <Score>
                      <Rating>RATING</Rating>
                      {project.companyFeedback === -1 ? <Unrated>Unrated</Unrated> : <Unrated>{project.companyFeedback}/5.0</Unrated>}
                    </Score>
                  </Card>
                ))
              }
            </InfiniteScroll>
          </InfiniteScrollWrapper>
        </ProjectOverview>
        <ScrollToTop moduleRef={projectOverviewRef} />
      </Myproject>
    </BigDiv>
  )
}

export default MyProjectProfessional;