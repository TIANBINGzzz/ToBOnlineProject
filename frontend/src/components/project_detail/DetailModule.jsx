import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import ScrollToTop from '../common/ToTop';
import GETerror from './ErrorWindow';
import SuccessMessage from './SuccessWindow';
import InviteModule from './Invite';
import FeedbackModule from './Feedback';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import MenuIcon from '@mui/icons-material/Menu';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import RemoveModule from './Remove';

const Background = styled.div`
  min-width: 314px;
  width:calc(100vw - 270px);
  height:calc(100vh - 80px);
  left: 250px;
  top: 75px;
  position: absolute;
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
const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height: auto;
  width: 90%;
  gap: 40px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 3%;
  padding-bottom: 3%;
`

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 80px;
`
const TextContainer = styled.div``

const InviteModalWrapper = styled.div`
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

const FloatContainer = styled.div`
  position: fixed;
  bottom: 100px;
  right: 40px;
  z-index: 1;
`;

function DetailModule({ setProjectName }) {
  const navigate = useNavigate();
  const param = useParams();
  const userType = sessionStorage.getItem("userType");
  const userId = sessionStorage.getItem("id");
  const [projectDetails, setProjectDetails] = useState(null);
  const moduleRef = useRef(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const location = useLocation();
  const [invite, setInvite] = useState(false);
  const [trueStatus, setTrueStatus] = useState(-1);
  const token = sessionStorage.getItem("token");
  const userName = sessionStorage.getItem("userName");
  const permission = sessionStorage.getItem("permission");
  const [remove, setRemove] = useState(false)
  const enable = sessionStorage.getItem("enable")

  function getStatus() {
    if (userType === "professional") {
      const body = {
        userId: userId,
        projectId: param.pid,
      };
      const queryParams = new URLSearchParams(body).toString();
      fetch(`http://localhost:8080/application/check?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `${token}`
        }
      }).then(
        response => {
          return response.json();
        }
      ).then((response) => {
        if (response.code === 200) {
          setTrueStatus(response.data.status);
          setApplicationId(response.data.applicationId);
        }
      }
      )
    }
  }

  const getProjects = useCallback((update) => {
    fetch(`http://localhost:8080/project/${param.pid}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `${token}`
      }
    }).then(
      response => {
        return response.json();
      }
    ).then((response) => {
      if (response.code === 200) {
        setError(0)
        if (update === true) {
          setProjectDetails(response.data);
          setProjectName(response.data.name);
          if (userType === "company") {
            const endDate = new Date(response.data.endTime);
            const today = new Date();
            if (today > endDate) {
              setTrueStatus(2);
            } else {
              setTrueStatus(0);
            }
          }
        }
      }
      else {
        setError(response.code);
        setMsg(response.msg);
      }
    }
    )
  }, [navigate, param.pid]);

  useEffect(() => {
    getProjects(true);
    getStatus();
  }, [getProjects]);

  const handleApplication = () => {
    fetch(`http://localhost:8080/application/apply/${param.pid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    }).then((response) => {
      return response.json();
    }).then((response) => {
      if (response.code !== 200) {
        setError(response.code);
        setMsg(response.msg);
      }
      else {
        setError(0)
        setSuccess(true)
      }
    });
  }

  if (error === '' && !projectDetails) {
    return <div>Loading...</div>;
  }

  const handleDelete = () => {
    fetch(`http://localhost:8080/project/delete/${param.pid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    }).then((response) => {
      return response.json();
    }).then((response) => {
      if (response.code !== 200) {
        setError(response.code);
        setMsg(response.msg);
      }
    });
    navigate('/dashboard');
  }

  const handleInvite = () => {
    setInvite(true);
  }

  const onClose = () => setError(0);

  const goToProfile = () => {
    setError(0);
    navigate('/profile', { state: { from: location.pathname } });
  }
  const goToDashboard = () => {
    setError(0);
    navigate('/dashboard');
  }
  const disappear = () => setSuccess(false);

  const handleQuit = () => {
    fetch(`http://localhost:8080/notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
      body: JSON.stringify({
        applicationId: applicationId,
        userId: userId,
        userName: userName,
        projectId: projectDetails.id,
        projectTitle: projectDetails.name,
        companyId: projectDetails.companyId,
        companyName: projectDetails.companyName,
        status: 5
      })
    }).then((response) => {
      return response.json();
    }).then((response) => {
      if (response.code !== 200) {
        setError(response.code);
        setMsg(response.msg);
      }
    });

    fetch(`http://localhost:8080/application/process/${applicationId}?status=4`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    }).then((response) => {
      return response.json();
    });
    setTrueStatus(4)
  }

  const handleRemove = () => {
    setRemove(true)
  }

  const getActions = () => {
    const actions = [];

    if (trueStatus === 0 && userType === 'professional') {
      actions.push({ icon: <AddCircleIcon />, name: 'Apply', onClick: handleApplication });
    }

    if (trueStatus === 1 && userType === 'professional') {
      actions.push({ icon: <ExitToAppIcon />, name: 'Quit', onClick: handleQuit });
    }

    if (permission.includes(4) || userId === projectDetails.companyId) {
      actions.push(
        {
          icon: <EditIcon />,
          name: 'Edit',
          onClick: () => {
            navigate(`/project/edit`, {
              state: {
                projectName: projectDetails.name,
                projectIntroduction: projectDetails.introduction,
                projectOnline: projectDetails.online,
                projectCountry: projectDetails.addressCountry,
                projectCity: projectDetails.addressCity,
                projectSkill: projectDetails.skill,
                projectRequirement: projectDetails.requirements,
                projectRoles: projectDetails.rolesAndResponsibilities,
                projectArrangement: projectDetails.workAndTime,
                projectInformation: projectDetails.teamInformation,
                projectStartdate: projectDetails.startTime,
                projectEnddate: projectDetails.endTime,
                resource: projectDetails.resource,
                pid: param.pid,
                from: location.pathname,
              },
            });
          }
        },
      );
    };
    if (permission.includes(5) || userId === projectDetails.companyId) {
      actions.push(
        { icon: <DeleteIcon />, name: 'Delete', onClick: () => handleDelete() },
      );
    };

    if (userId === projectDetails.companyId) {
      actions.push(
        { icon: <PersonAddAlt1Icon />, name: 'Invite', onClick: () => handleInvite() },
        { icon: <PersonRemoveIcon />, name: 'Remove', onClick: () => handleRemove() },
      );
    }
    return actions;
  };

  return (
    <Background ref={moduleRef}>
      {enable && <FloatContainer>
        <Box sx={{ position: 'relative', transform: 'translateZ(0px)', flexGrow: 1 }}>
          <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            sx={{ position: 'absolute', top: 16, right: 16 }}
            icon={<MenuIcon />}
            direction='left'
          >
            {getActions().map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={(e) => {
                  e.preventDefault();
                  action.onClick();
                }}
              />
            ))}
          </SpeedDial>
        </Box>
      </FloatContainer>}
      {error !== 0 && (<GETerror code={error} errorMessage={msg} goToProfile={goToProfile} goToDashboard={goToDashboard} onClose={onClose} />)}
      {success && (<SuccessMessage onClose={disappear} />)}
      <Container>
        <DetailsContainer>
          <TextContainer>
            <h2>Introduction</h2>
            <p>{projectDetails.introduction}</p>
          </TextContainer>
          <TextContainer>
            <h2>Location</h2>
            <p>{projectDetails.online ? 'Online' : `${projectDetails.addressCity}, ${projectDetails.addressCountry}`}</p>
          </TextContainer>
          <TextContainer>
            <h2>Company</h2>
            <Link to={`/profile/company/${projectDetails.companyId}`} state={{ from: location.pathname }}>{projectDetails.companyName}</Link>
          </TextContainer>
          <TextContainer>
            <h2>Skill requirements</h2>
            {
              projectDetails.skill && projectDetails.skill.map((skill, index) => {
                return <div key={index}>- {skill}</div>
              })
            }
          </TextContainer>
          <TextContainer>
            <h2>Other requirements</h2>
            <p>{projectDetails.requirements}</p>
          </TextContainer>
          <TextContainer>
            <h2>Roles</h2>
            <p>{projectDetails.rolesAndResponsibilities}</p>
          </TextContainer>
          <TextContainer>
            <h2>Arrangement</h2>
            <p>{projectDetails.workAndTime}</p>
          </TextContainer>
          <TextContainer>
            <h2>Information</h2>
            <p>{projectDetails.teamInformation}</p>
          </TextContainer>
          <TextContainer>
            <h2>Duration</h2>
            <p>From {projectDetails.startTime} To {projectDetails.endTime}</p>
          </TextContainer>
          {(trueStatus == 1 || trueStatus == 2 || userId === projectDetails.companyId) && projectDetails.resource && <TextContainer>
            <h2>Resource</h2>
            <p>{projectDetails.resource}</p>
          </TextContainer>}
          {trueStatus == 2 && (<TextContainer>
            <h2>Rating</h2>
            <FeedbackModule companyName={projectDetails.companyName} companyId={projectDetails.companyId} applicationId={applicationId} />
          </TextContainer>)}
        </DetailsContainer>
      </Container>
      {invite &&
        <InviteModalWrapper>
          <InviteModule setInvite={setInvite} projectId={param.pid} projectTitle={projectDetails.name} companyName={projectDetails.companyName} skills={projectDetails.skill} pathname={location.pathname}></InviteModule>
        </InviteModalWrapper>
      }
      {remove &&
        <InviteModalWrapper>
          <RemoveModule setRemove={setRemove} projectId={param.pid} projectTitle={projectDetails.name} companyName={projectDetails.companyName} skills={projectDetails.skill} pathname={location.pathname}></RemoveModule>
        </InviteModalWrapper>
      }
      <ScrollToTop moduleRef={moduleRef} right='64px' bottom='100px'></ScrollToTop>
    </Background>
  )
}

export default DetailModule;
