import Leftlist from "../components/common/Leftlist";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import HeaderModule from "../components/common/Header";
import DetailModule from "../components/project_detail/DetailModule";
import Notification from "../components/common/notification";
import { useLocation, useNavigate } from "react-router-dom";

const BackgroundContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Background = styled.div`
  position: relative;
  width:calc(100vw - 270px);
  height:calc(100vh - 80px);
`

function ProjectDetail () {
  const location = useLocation();
  const [ back, setBack ] = useState(null);
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    if (location.state) {
      setBack(location.state.from);
    }
  }, [back]);

  const BackPage = () => {
    if (back) {
        navigate(`${back}`, {state: {from: location.pathname}})
    }
  }

  return (
    <BackgroundContainer>
      <Background>
        <HeaderModule handleClick={BackPage} projectName={projectName}></HeaderModule>
        <Leftlist></Leftlist>
        <DetailModule setProjectName={setProjectName}></DetailModule>
        {/* <Notification></Notification> */}
      </Background>
    </BackgroundContainer>

  )
}
  
export default ProjectDetail;