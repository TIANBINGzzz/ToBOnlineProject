import React, {useState,useEffect,useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollToTop from '../common/ToTop.jsx';

const Background = styled.div`
  width:calc(100vw - 230px);
  height:calc(100vh - 20px);
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: #ffffff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.19);
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
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
  width: 60%;
  min-height: 100px;
  border-style:solid;
  border-color:#F0F3F5;
  background-color: #FFF;
  border-width:2px;
  border-radius: 10px;
  padding-left: 5%;
  padding-right: 5%;
  position: relative;
`

const Project_title=styled.div`
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

const Project_date=styled.div`
  font-family: "Times New Roman", Times, serif;
  font-size: 14px;
  height: auto;
  width: auto;
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

const PublisherDateContainer = styled.div`
  display: flex;
  gap: 40px;
`

const Publisher = styled.div`
  font-family: "Times New Roman", Times, serif;
  font-size: 14px;
  height: auto;
  width: auto;
`

const TitleContainer = styled.div`
  display: flex;
`

const Button = styled.button`
  all: unset;
  position: absolute;
  right: 20px;
  background-color: #006fdd;
  color: white;
  padding: 7px;
  border-radius: 5px;

  &:hover{
    cursor: pointer;
  }
`

function ProjectManagement () {
  const navigate=useNavigate();
  const projectOverviewRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation()
  
  useEffect(() => { 
    getProjects(true);
  }, [page]);

  function getProjects(update){
    const body = {
      start: page,
      size: 20,
      acs: true,
      sort: 'startTime',
    };
    const queryParams = new URLSearchParams(body).toString();
    if (!sessionStorage.getItem("token")) {
      navigate('/');
    }
    const token=sessionStorage.getItem("token");
    return fetch(`http://localhost:8080/project/list?${queryParams}`,{
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
              if (projects.length < 1){
                setProjects(response.data.records);
              } else{
                setProjects(prevProjects => [...prevProjects, ...response.data.records]);
              }
            } else {
              setHasMore(false);
            }
          } else{
            return response.data.records;
          }
        }
      }
    )
  }
  
  return (
    <Background ref={projectOverviewRef} id='scrollable_container'>
      <InfiniteScroll_wrapper>
        <InfiniteScroll
          dataLength={projects.length} // Length of the current project list
          next={()=>{setPage(prevPage => prevPage + 1);}} // Function to fetch more data
          hasMore={hasMore} // Boolean flag for fetching more data
          loader={<h4>Loading...</h4>} // Show loader when fetching more data
          endMessage={<p>You have reached the bottom.</p>} // Message when no more data
          scrollableTarget="scrollable_container"
        >
          {projects.length !== 0 &&
            projects.map((project, index1) => (
              <Card key={index1}>
                <TitleContainer>
                  <Project_title>{project.name}</Project_title>
                  <Project_title className='id'>{project.id}</Project_title>
                </TitleContainer>
                <PublisherDateContainer>
                  <Publisher>Publisher: {project.companyName}</Publisher>
                  <Project_date>Create Date: {project.createTime}</Project_date>
                </PublisherDateContainer>
                <Button onClick={()=>{navigate(`/project/${project.id}`, {state: { from: location.pathname }});}}>Manage</Button>
              </Card>
            ))
          }
        </InfiniteScroll>
      </InfiniteScroll_wrapper>
      <ScrollToTop moduleRef={projectOverviewRef}/>
    </Background>
  )
}

export default ProjectManagement;
