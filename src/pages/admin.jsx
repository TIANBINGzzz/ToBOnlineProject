import Leftlist from "../components/admin/Leftlist";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Charts from '../components/admin/Charts';
import ProjectManagement from "../components/admin/ProjectManagement";
import UserManagement from "../components/admin/UserManagement";
import AdminRole from "./AdminRole";


const BackgroundContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Background = styled.div`
  position: relative;
`

function AdminWorkPage () {
    const [showWorkModule, setShowWorkModule] = useState(-1)
    const [showRequest, setShowRequest] = useState(-1)

  return (
    <BackgroundContainer>
      <Background>
        <Leftlist setShowWorkModule={setShowWorkModule} setShowRequest={setShowRequest}></Leftlist>
        {showWorkModule == 4 && (<AdminRole></AdminRole>)}
        {showWorkModule == 1 && (<Charts></Charts>)}
        {showWorkModule == 2 && (<ProjectManagement></ProjectManagement>)}
        {showWorkModule == 3 && (<UserManagement showRequest={showRequest}></UserManagement>)}
      </Background>
    </BackgroundContainer>
  )
}
  
export default AdminWorkPage;