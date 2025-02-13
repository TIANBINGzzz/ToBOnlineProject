import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Leftlist from '../components/common/Leftlist.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollToTop from '../components/common/ToTop.jsx';
import HeaderModule from '../components/common/Header.jsx';

const BigDiv = styled.div`
  display: flex;
  flex-direction: column;
`

const Dashboard_screen = styled.div`
  position: relative;
`

const Create = styled.img``
const CreateContainer = styled.div`
  display: flex;
  height: 50px;
  width: 50px;
  position: fixed;
  bottom: 100px;
  left: 260px;
  background-color: #3299ff;
  border-radius: 50%;
  z-index: 1000;
  &:hover {
    cursor: pointer;
  }
  @media (max-width: 768px) {
    left: 7px;
    height: 37px;
     width: 37px;
  }
`

const Project_overview = styled.div`
  min-width: 314px;
  width:calc(100vw - 270px);
  height:calc(100vh - 80px);
  position: absolute;
  left: 250px;
  top: 75px;
  background-color: #ffffff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.19);
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  overflow: hidden;
  overflow-y: auto;

  @media (max-width: 768px) {
    height:calc(100vh - 43px);
    width: 100%;
    top: 43px;
    left: 0px;
    border-radius: 0px;
  }

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

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap:20px;
  padding-top:20px;
  padding-bottom:20px;
  width: 60%;
  height: auto;
  border-style:solid;
  border-color:#F0F3F5;
  background-color: #FFF;
  border-width:2px;
  border-radius: 10px;
  padding-left: 10%;
  padding-right: 10%;
  &:hover {
    cursor: pointer;
    background-color: #e0e0e0;
  }
`

const Tag = styled.span`
  background-color: #d9def8;
  border-radius: 20px;
  padding: 10px 12px;
  height: 36px;
  color: #3d58db;
  margin-right: 10px;
  box-sizing: border-box;
  display: flex;
  align-items:center;
  img {
    margin-left:5px;
  }
  span {
    font-family: system-ui;
    font-size: 16px;
    height:auto;
    width:auto;
  }
`

const Project_title = styled.div`
  font-family: system-ui;
  font-size: 20px;
  font-weight: bold;
  width: auto;
  height: auto;
  margin-top: 10px;
`

const Project_description = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;     
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis; 
  font-family: Georgia, serif;
  font-size: 16px;
  width: 100%;
  height: 60px;
  margin-top:10px;
  margin-bottom:10px;
  line-height: 20px;
`

const Project_skills = styled.div`
  display: flex;
  gap: 10px;
  width: auto;
  height: auto;
  flex-wrap:wrap;
`

const Project_date = styled.div`
  font-family: "Times New Roman", Times, serif;
  height: 20px;
  width: auto;
  display: flex;
  align-items: center;
`

const Project_location = styled.div`
  width: auto;
  height: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
`

const Location = styled.span`
  font-family: system-ui;
  font-size: 20px;
  margin-left: 10px;
`

const Time = styled.span`
  font-size: 16px;
  margin-left: 10px;
  line-height: 16px;
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

const Searchbar = styled.div`
  position: relative;
  width: 40%;
  height: 36px;
  min-width: 400px;
  border: 2px solid #ccc;
  border-radius: 20px;
  margin-top:10px;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    min-width: unset;
    width: 70%;
  }
`

const Divider = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 50%;
  right: 42px;
  background-color: #a5a5a5;
`

const SearchIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
`

const Filter = styled.button`
  position: absolute;
  right: 0px;
  height: 100%;
  width: 36px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background-color: white;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  margin-right: 6px;
`

const SearchInput = styled.input`
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

const FilterMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  width: 60%;
  height: auto;
  border-style:solid;
  border-color:#F0F3F5;
  background-color: #FFF;
  border-width:2px;
  border-radius: 10px;
  padding-left: 10%;
  padding-right: 10%;
  margin-bottom:10px;
`

const Search = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
`
const FilterContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const TextBox = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  margin-right: 10px;
  cursor: pointer;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;


const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
`;

const StyledInput = styled.input`
  padding: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 200px;
`;

const SkillContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProjectSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ApplyButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const ApplyButton = styled.button`
  background-color: #007FFF;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3d58db;
  }

  &:active {
    background-color: #d9def8;
  }
`;

function Dashboard() {
  const navigate = useNavigate();
  const projectOverviewRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation()
  const [openFilter, setOpenFilter] = useState(false);
  const [key, setKey] = useState("");
  const [reload, setReload] = useState(true);
  const [skillList, setSkillList] = useState([]);
  const [inputSkill, setInputSkill] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [startTime, setStartTime] = useState("2024-01-01");
  const [endTime, setEndTime] = useState("2077-01-01");
  const [order, setOrder] = useState(true);
  const [sort, setSort] = useState("startTime");
  //i'm using two useEffect to cope with re-render caused by different variables. the first useEffect is triggered on change of reload which
  //is the result of applying filter, the second useEffect is triggered on change of page which is the result of scrolling. the only 
  //disadvantage of this method is that when the dashboard is first mounted, it will get data from backend twice.
  useEffect(() => {
    if (reload == true) {
      setProjects([]);
      getProjects(true);
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    getProjects(true);
  }, [page]);

  const applyFilter = () => {
    setOpenFilter(false);
    setPage(0);
    setHasMore(true);
    setReload(true);
  };

  function getProjects(update) {
    const body = {
      start: page,
      size: 5,
      acs: order,
      sort: sort,
      key: key,
      skill: skillList,
      online: isOnline,
      addressCity: city,
      addressCountry: country,
      startTime: startTime,
      endTime: endTime
    };
    const queryParams = new URLSearchParams(body).toString();
    if (!sessionStorage.getItem("token")) {
      navigate('/');
    }
    const token = sessionStorage.getItem("token");
    return fetch(`http://localhost:8080/project/list?${queryParams}`, {
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
          if (update === true) {
            if (response.data.records.length > 0) {
              if (projects.length < 1) {
                setProjects(response.data.records);
              }
              else {
                setProjects(prevProjects => [...prevProjects, ...response.data.records]);
              }
            } else {
              setHasMore(false);
            }
          } else {
            return response.data.records;
          }
        }
      }
    )
  }

  return (
    <BigDiv>
      <Dashboard_screen>
        {sessionStorage.getItem('userType') === 'company' &&
          <CreateContainer>
            <Create src='/assets/plus.svg' onClick={() => { navigate('/project/edit', { state: { from: location.pathname } }); }} />
          </CreateContainer>
        }
        <HeaderModule />
        <Leftlist />
        <Project_overview ref={projectOverviewRef} id='scrollable_container'>
          <Search>
            <Searchbar>
              <SearchInput type="text" value={key} onChange={(e) => { setKey(e.target.value); }} onKeyDown={
                (event) => {
                  if (event.key === "Enter") {
                    setPage(0);
                    setReload(true);
                  }
                }
              }></SearchInput>
              <Divider></Divider>
              <Filter type="button" onClick={
                () => {
                  if (openFilter === true) {
                    setOpenFilter(false);
                  } else {
                    setOpenFilter(true);
                  }
                }
              }
              >
                <img src='/assets/filter.svg'></img>
              </Filter>
              <SearchIcon src='/assets/magnifying_glass.svg'></SearchIcon>
            </Searchbar>
            {openFilter && <FilterMenu>
              <FilterContainer>
                <TextBox>Filter by skill</TextBox>
                <SkillContainer>
                  <StyledInput
                    type="text"
                    value={inputSkill}
                    onChange={(e) => setInputSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSkillList(prevSkillList => [...prevSkillList, inputSkill]);
                        setInputSkill("");
                      }
                    }}
                  />
                </SkillContainer>
                <ProjectSkills>
                  {skillList && skillList.map((skill_name, i) => (
                    <Tag key={i}>
                      <span>{skill_name}</span>
                      <img src='./assets/close.svg' onClick={() => { setSkillList((prevSkillList) => prevSkillList.filter((_, index) => index !== i)); }} />
                    </Tag>
                  ))}
                </ProjectSkills>
              </FilterContainer>
              <FilterContainer>
                <TextBox>Filter by online availability</TextBox>
                <RadioGroup>
                  <Label>
                    <InputField
                      type="radio"
                      value="online"
                      checked={isOnline === true}
                      onChange={() => {
                        setIsOnline(true);
                      }}
                    />
                    Online only
                  </Label>

                  <Label>
                    <InputField
                      type="radio"
                      value="offline"
                      checked={isOnline === false}
                      onChange={() => {
                        setIsOnline(false);
                      }}
                    />
                    Offline only
                  </Label>
                </RadioGroup>
              </FilterContainer>
              <FilterContainer>
                <TextBox>Filter by address</TextBox>

                <StyledInput
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />

                <StyledInput
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </FilterContainer>
              <FilterContainer>
                <TextBox>Filter by time</TextBox>
                <StyledInput
                  type="date"
                  value={startTime}
                  placeholder="Start Date"
                  onChange={(e) => {
                    setStartTime(e.target.value);
                  }}
                />
                <StyledInput
                  type="date"
                  value={endTime}
                  placeholder="End Date"
                  onChange={(e) => {
                    setEndTime(e.target.value);
                  }}
                />
              </FilterContainer>
              <FilterContainer>
                <TextBox>Sort By</TextBox>
                <ButtonWrapper>
                  <Label>
                    <InputField
                      type="radio"
                      name="sort"
                      checked={sort === "startTime"}
                      onChange={() => {
                        setSort("startTime");
                      }}
                    />
                    Start Time
                  </Label>
                  <Label>
                    <InputField
                      type="radio"
                      name="sort"
                      checked={sort === "endTime"}
                      onChange={() => {
                        setSort("endTime");
                      }}
                    />
                    End Time
                  </Label>
                </ButtonWrapper>
              </FilterContainer>
              <FilterContainer>
                <TextBox>Sort order</TextBox>
                <ButtonWrapper>
                  <Label>
                    <InputField
                      type="radio"
                      name="order"
                      checked={order}
                      onChange={() => {
                        setOrder(true);
                      }}
                    />
                    Ascending
                  </Label>
                  <Label>
                    <InputField
                      type="radio"
                      name="order"
                      checked={!order}
                      onChange={() => {
                        setOrder(false);
                      }}
                    />
                    Descending
                  </Label>
                </ButtonWrapper>
              </FilterContainer>
              <ApplyButtonContainer>
                <ApplyButton onClick={()=>applyFilter()}>Apply Filters</ApplyButton>
              </ApplyButtonContainer>
            </FilterMenu>}
          </Search>
          <InfiniteScroll_wrapper>
            <InfiniteScroll
              dataLength={projects.length} // Length of the current project list
              next={() => { setPage(prevPage => prevPage + 1); }} // Function to fetch more data
              hasMore={hasMore} // Boolean flag for fetching more data
              loader={<h4>Loading...</h4>} // Show loader when fetching more data
              endMessage={<p>You have reached the bottom.</p>} // Message when no more data
              scrollableTarget="scrollable_container"
            >
              {projects.length !== 0 &&
                projects.map((project, index1) => (
                  <Card key={index1} onClick={() => { navigate(`/project/${project.id}`, { state: { from: location.pathname } }); }}>
                    <Project_title>{project.name}</Project_title>
                    <Project_description>{project.introduction}</Project_description>
                    <Project_skills>
                      {project.skill && project.skill.map((skill_name, index2) => (
                        <Tag key={index2}>
                          {skill_name}
                        </Tag>
                      ))}
                    </Project_skills>
                    <Project_location>
                      <img src='assets/location.svg'></img>
                      <Location>
                        {project.online ? 'Online' : `${project.addressCity}, ${project.addressCountry}`}
                      </Location>
                    </Project_location>
                    <Project_date>
                      <img src='assets/timer.svg'></img>
                      <Time>{project.startTime.replace(/-/g, '/')} - {project.endTime.replace(/-/g, '/')}</Time>
                    </Project_date>
                  </Card>
                ))
              }
            </InfiniteScroll>
          </InfiniteScroll_wrapper>
        </Project_overview>
      </Dashboard_screen>
      <ScrollToTop moduleRef={projectOverviewRef} />
    </BigDiv>
  )
}

export default Dashboard;