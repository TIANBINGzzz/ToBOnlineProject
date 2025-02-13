import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Leftlist from "../components/common/Leftlist.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import HeaderModule from "../components/common/Header.jsx";
import ScrollToTop from "../components/common/ToTop.jsx";

const BigDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const Myproject = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const Switch = styled.div`
  display: flex;
  justify-content: space-around;
  width: calc(100vw - 100px);
  height: 80px;
  position: absolute;
  top:70px;
  left:170px;
  background-color:white;
`;

const Switchbtn = styled.button`
  width: 20%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 0px;
  padding: 0px;
  background-color: white;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ProjectOverview = styled.div`
  width: calc(100vw - 100px);
  height: calc(100vh - 180px);
  margin-top: 70px;
  margin-left: 70px;
  overflow-y: scroll;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Colorband = styled.div`
  width: 100%;
  height: 6px;
  margin-bottom: 10px;
`;

const ProjectType = styled.div`
  font-family: system-ui;
  font-size: 20px;
  font-weight: bold;
  color: #515c6d;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
  width: 50%;
  height: auto;
  padding: 20px 30px 20px 30px;
  border-style: solid;
  border-color: #f0f3f5;
  border-width: 2px;
  border-radius: 10px;
  gap: 10px;
  &:hover {
    cursor: pointer;
    background-color: #e0e0e0;
  }
`;

const ProjectSkills = styled.div`
  display: flex;
  gap: 10px;
  width: auto;
  height: auto;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background-color: #d9def8;
  border-radius: 20px;
  padding: 10px 12px 10px 12px;
  font-family: system-ui;
  font-size: 16px;
  width: auto;
  height: 36px;
  color: #3d58db;
  margin-right: 10px;
  box-sizing: border-box;
  line-height: 16px;
`;

const ProjectTitle = styled.div`
  font-family: system-ui;
  font-size: 20px;
  font-weight: bold;
  width: auto;
  height: auto;
  margin-bottom: 10px;
`;

const ProjectDate = styled.div`
  font-family: "Times New Roman", Times, serif;
  font-size: 16px;
  height: auto;
  width: auto;
`;

const Score = styled.div`
  display: flex;
  justify-content: space-between;
  width: auto;
  height: auto;
`;

const Rating = styled.div`
  color: #515c6d;
  font-size: 14px;
  margin-right: 5px;
  line-height: 30px;
`;

const StarFill = styled.img`
  width: auto;
  height: auto;
`;

const StarEmpty = styled.img`
  width: auto;
  height: auto;
`;

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
`;

const InfiniteScrollWrapper = styled.div`
  width: 100%;
  & > div {
    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
  }
`;
const flowColors = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

const Button = styled.button`
  border: none;
  cursor: pointer;
  background-size: 200%;
  background-color: #007fff;
  transition: background-position 0.5s, transform 0.3s ease;
  color: white;
  border-radius: 10px;
  height: 50px;
  width: 180px;
  font-size: 120%;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;

  &:hover {
    animation: ${flowColors} 1s infinite linear;
    transform: scale(1.1);
  }
`;

function MyProjectCompany() {
  const userType = sessionStorage.getItem("userType");
  const userId = sessionStorage.getItem("id");
  const navigate = useNavigate();
  const projectOverviewRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [projectType, setProjectType] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isSamepage, setIsSamepage] = useState(true);
  const location = useLocation();
  const [back, setBack] = useState(null);
  const pageId = window.location.pathname.split('/').pop();

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
      navigate(`${back}`, { state: { from: location.pathname } });
    }
  };

  function getProjects(projectType, isSamepage) {
    const body = {
      status: projectType,
      start: page,
      size: 5,
      sort: "name",
      acs: true,
    };
    const queryParams = new URLSearchParams(body).toString();
    if (!sessionStorage.getItem("token")) {
      navigate("/");
    }
    const token = sessionStorage.getItem("token");
    return fetch(`http://localhost:8080/project/profile/${userId}?${queryParams}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.code === 200) {
          if (response.data.records.length > 0) {
            if (isSamepage) {
              setProjects((prevProjects) => [...prevProjects, ...response.data.records]);
            } else {
              setProjects(response.data.records);
            }
          } else {
            setHasMore(false);
          }
        } else {
          throw new Error(response.msg);
        }
      });
  }
  const handlePageChange = (newType) => {
    if (newType !== projectType) {
      setProjectType(newType);
      setPage(0);
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
          <Switchbtn
            onClick={() => {
              handlePageChange(0);
            }}
          >
            <Colorband style={{ backgroundColor: "#b8b8b8" }} />
            <ProjectType>recruiting</ProjectType>
          </Switchbtn>
          <Switchbtn
            onClick={() => {
              handlePageChange(1);
            }}
          >
            <Colorband style={{ backgroundColor: "#ffd200" }} />
            <ProjectType>in progress</ProjectType>
          </Switchbtn>
          <Switchbtn
            onClick={() => {
              handlePageChange(2);
            }}
          >
            <Colorband style={{ backgroundColor: "#27c93f" }} />
            <ProjectType>completed</ProjectType>
          </Switchbtn>
        </Switch>
        <ProjectOverview ref={projectOverviewRef} id="scrollable_container">
          <InfiniteScrollWrapper>
            <InfiniteScroll
              dataLength={projects.length} // Length of the current project list
              next={() => {
                setPage((prevPage) => prevPage + 1);
              }} // Function to fetch more data
              hasMore={hasMore} // Boolean flag for fetching more data
              loader={<h4>Loading...</h4>} // Show loader when fetching more data
              endMessage={<p>You have reached the bottom.</p>} // Message when no more data
              scrollThreshold={0.9}
              scrollableTarget="scrollable_container"
            >
              {projects.length !== 0 &&
                projects.map((project, index1) => (
                  <Card
                    key={index1}
                    onClick={() => {
                      if (userType === "company") {
                        navigate(`/project/${project.id}`);
                      }
                    }}
                  >
                    <ProjectTitle>{project.name}</ProjectTitle>
                    <ProjectSkills>{project.skill && project.skill.map((skill_name, index2) => <Tag key={index2}>{skill_name}</Tag>)}</ProjectSkills>
                    <ProjectDate>{project.updateTime}</ProjectDate>
                    <Score>
                      <Rating>RATING</Rating>
                      {project.score === -1 ? <Unrated>Unrated</Unrated> : [0, 1, 2, 3, 4].map((_, index3) => (index3 < project.score ? <StarFill src="/assets/star_fill.svg" key={index3} /> : <StarEmpty src="/assets/star_empty.svg" key={index3} />))}
                    </Score>
                  </Card>
                ))}
            </InfiniteScroll>
          </InfiniteScrollWrapper>
        </ProjectOverview>
        <ScrollToTop moduleRef={projectOverviewRef} />
      </Myproject>
    </BigDiv>
  );
}

export default MyProjectCompany;
