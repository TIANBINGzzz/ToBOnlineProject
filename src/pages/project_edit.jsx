import Leftlist from "../components/common/Leftlist";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import HeaderModule from "../components/common/Header";
import EditModule from "../components/project_edit/EditModule";
import { useLocation, useNavigate } from "react-router-dom";

const BackgroundContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Background = styled.div`
  position: relative;
`

function ProjectEdit () {
  const location = useLocation();
  const [ back, setBack ] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state.from) {
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
        <HeaderModule handleClick={BackPage}></HeaderModule>
        <Leftlist></Leftlist>
        <EditModule></EditModule>
      </Background>
    </BackgroundContainer>
  )
}
  
export default ProjectEdit;
