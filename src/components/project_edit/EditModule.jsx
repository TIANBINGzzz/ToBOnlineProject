import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import ErrorMessage from './ErrorMessage';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ScrollToTop from '../common/ToTop';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Background = styled.div`
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
const Container = styled.div`
 position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 30px;
`
const Details = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 30px;
  padding-top: 2%;
`
const Create = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`
const flowColors = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`
const CreateBtn = styled.button`
  border: none;
  cursor: pointer;
  background-size: 200%; 
  background-color: #007FFF;
  transition: background-position 0.5s, transform 0.3s ease;
  color: white;
  border-radius: 8px;
  height: 50px;
  width: 180px;
  font-size: 120%;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;

  &:hover {
    animation: ${flowColors} 1s infinite linear; 
    transform: scale(1.1);
  }
`
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 86%;
  gap: 15px;

  &.special{
    width: 60%;
  }
`;

const Label = styled.label`
  margin-right: 10px;
  font-size: 130%;

  @media (max-width: 768px) {
    font-size: 100%;
  }
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
  outline: none;
  width: 100%;
  height: 30px;
  font-size: 130%;

  @media (max-width: 768px) {
    font-size: 100%;
  }

  &:focus {
    border-color: #2464db;
  }
  &.flex-grow {
    width: 80%;
  }
  &.location{

  }
  &.checkbox{
    width: 20px;
  }
`;

const Textarea = styled.textarea`
  all: unset;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
  outline: none;
  width: 100%;
  word-wrap: normal;
  height: 120px;
  font-size: 130%;

  @media (max-width: 768px) {
    font-size: 100%;
  }

  &:focus {
    border-color: #007bff;
  }
`

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 10px;
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

const Button = styled.button`
    height: 46px;
    width: 15%;
    font-size: 16px;
    color: white;
    border: none;
    border-radius: 4px;
    margin-left: 2%;
    background-size: 200%; 
    background-color: #007FFF;
    transition: background-position 0.5s, transform 0.3s ease;
  
    &:hover {
      animation: ${flowColors} 1s infinite linear; 
      transform: scale(1.1);
    }
`
const RemoveButton = styled.button`
    background-color: transparent;
    border: none;
    color: #999;
    font-size: 14px;
    margin-left: 4px;
    cursor: pointer;
`
const TagInputContainer = styled.div`
  width: 100%;
  height: 30px;
  display: flex;

`
const Tags = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 27px;
`
const Group = styled.div`
  display: flex;
  justify-content: space-evenly;

`
const CustomStyledDatePicker = styled(DatePicker)`
  width: 85%;
  height: 12%;
  font-size: 120%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color:#f5f5f5;

  @media (max-width: 768px) {
    width: 70%;
    font-size:80% ;
  }

  &:focus,
  &.react-datepicker-ignore-onclickoutside {
    border-color: #007FFF; 
    outline: none; 
  }
`;

const OnlineLabel = styled.div`
  font-size: 120%;

  @media (max-width: 768px) {
    font-size:100% ;
  }
`

const DatePickerContainer = styled.div`
  position: relative;
  margin-left: 14%;
  
  .react-datepicker-popper {
    position: absolute !important;
    z-index: 2;
  }
`;

const OfflineContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;

  @media (max-width: 863px) {
    flex-direction: column;
    width: 60%;
  }
`

const OnlineContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

function UpdateModule() {
  // update
  const location = useLocation();
  const initialFormData = location.state.projectName
    ? {
      name: location.state.projectName || '',
      online: location.state.projectOnline || false,
      addressCountry: location.state.projectCountry || '',
      addressCity: location.state.projectCity || '',
      skill: location.state.projectSkill || [],
      introduction: location.state.projectIntroduction || '',
      requirements: location.state.projectRequirement || '',
      rolesAndResponsibilities: location.state.projectRoles || '',
      workAndTime: location.state.projectArrangement || '',
      teamInformation: location.state.projectInformation || '',
      startTime: location.state.projectStartdate || '',
      endTime: location.state.projectEnddate || '',
      resource: location.state.resource || '',
      pid: location.state.pid
    }
    : {
      name: '',
      online: false,
      addressCountry: '',
      addressCity: '',
      skill: [],
      introduction: '',
      requirements: '',
      rolesAndResponsibilities: '',
      workAndTime: '',
      teamInformation: '',
      startTime: '',
      endTime: '',
      resource: '',
    };
  const initialUrl = location.state.projectName ? `/update/${location.state.pid}` : '';

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({ name: '', skill: '', online: '', addressCountry: '', addressCity: '', introduction: '', requirements: '', rolesAndResponsibilities: '', workAndTime: '', teamInformation: '', resource: '' });
  const [skills, setSkills] = useState(formData.skill);
  const [inputValue, setInputValue] = useState("");
  const [showError, setShowError] = useState(false);
  const [url, setUrl] = useState(initialUrl);
  const moduleRef = useRef(null);
  const [offline, setOffline] = useState(!initialFormData.online)

  const navigate = useNavigate()
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim() !== "") {
        e.preventDefault();
        addTag(inputValue.trim());
      }
    }
  };

  const addTag = (tag) => {
    const lowerTag = tag.toLowerCase()
    if (!skills.includes(lowerTag)) {
      setSkills([...skills, lowerTag])
      setInputValue("")
      setFormData((prevData) => ({ ...prevData, skill: [...skills, lowerTag] }));
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = skills.filter((tag) => tag !== tagToRemove)
    setSkills(newTags);
    setFormData((prevData) => ({ ...prevData, skill: newTags }));
  };

  const handleErrorClose = () => {
    setShowError(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleOnline = (e) => {
    setFormData((prevData) => ({ ...prevData, online: e.target.checked }));
    if (e.target.checked == false) {
      setOffline(true)
    }
    else {
      setFormData((prevData) => ({ ...prevData, addressCountry: '', addressCity: '' }));
      setOffline(false)
    }
  }

  const handleDateChange = (date, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: date
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.name) {
      newErrors.name = 'Project name is required';
      setShowError(true);
    }
    else if (!formData.introduction) {
      newErrors.introduction = 'Project introduction is required';
      setShowError(true);
    }
    else if (formData.online == false && !formData.addressCountry) {
      newErrors.addressCountry = 'The project country is required';
      setShowError(true);
    }
    else if (formData.online == false && !formData.addressCity) {
      newErrors.addressCity = 'The project city is required';
      setShowError(true);
    }
    else if (!formData.startTime) {
      newErrors.startTime = 'Start date is required';
      setShowError(true);
    }
    else if (!formData.endTime) {
      newErrors.endTime = 'End date is required';
      setShowError(true);
    }
    else if (formData.skill.length === 0) {
      newErrors.tags = 'Tag is required';
      setShowError(true);
    }
    else if (!formData.requirements) {
      newErrors.requirements = 'Project requirements are required';
      setShowError(true);
    }
    else if (!formData.workAndTime) {
      newErrors.arrangements = 'Work arrangements and time requirements are required';
      setShowError(true);
    }
    else if (!formData.rolesAndResponsibilities) {
      newErrors.projectname = 'Project roles and responsibilities are required';
      setShowError(true);
    }
    else if (!formData.teamInformation) {
      newErrors.information = 'Team information are required';
      setShowError(true);
    }
    else if (formData.startTime < today) {
      newErrors.startTime = 'Start date cannot be earlier than today';
      setShowError(true);
    }
    else if (formData.endTime < formData.startTime) {
      newErrors.endTime = 'End date cannot be earlier than start date';
      setShowError(true);
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const token = sessionStorage.getItem("token");
      formData.online = `${formData.online}`
      fetch(`http://localhost:8080/project${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(formData),
      }).then((response) => {
          return response.json();
      }).then((response) => {
        if (response.code == 200) {
          if (response.data !== null) {
            navigate(`/project/${response.data.id}`, { state: { from: '/dashboard' } });
          }
          else {
            navigate(`/project/${location.state.pid}`, { state: { from: '/dashboard' } });
          }
        }
      });
    }
  };

  return (
    <Background ref={moduleRef}>
      <Container>
        <Details>
          <FormContainer onSubmit={handleSubmit}>
            <Group>
              <FormGroup>
                <Label htmlFor="name" style={{ marginTop: '5%' }}>Project Name:</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Please enter your project name'
                />
              </FormGroup>
              {showError && errors.name && <ErrorMessage errormessage={errors.name} onClose={handleErrorClose} />}
            </Group>
            <Group>
              <FormGroup>
                <Label htmlFor="introduction">Project Introduction:</Label>
                <Textarea
                  type="textarea"
                  id="introduction"
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleChange}
                  placeholder='Please enter your project introduction'
                />
              </FormGroup>
              {showError && errors.introduction && <ErrorMessage errormessage={errors.introduction} onClose={handleErrorClose} />}
            </Group>
            <Group>
              <FormGroup>
                <Label htmlFor="skills">Required skills</Label>
                <Tags>
                  <TagInputContainer>
                    <Input
                      type="text"
                      placeholder="Please add some skill tags"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleInputKeyDown}
                      className="flex-grow"
                    />
                    <Button type='button' onClick={() => addTag(inputValue.trim())} disabled={!inputValue.trim()}>
                      Add
                    </Button>
                  </TagInputContainer>
                  <TagContainer>
                    {skills.map((tag) => (
                      <Tag key={tag}>
                        {tag}
                        <RemoveButton
                          onClick={() => removeTag(tag)}
                          aria-label={`Remove ${tag}`}
                        >
                          x
                        </RemoveButton>
                      </Tag>
                    ))}
                  </TagContainer>
                </Tags>
              </FormGroup>
              {showError && errors.skill && <ErrorMessage errormessage={errors.skill} onClose={handleErrorClose} />}
            </Group>
            <Group>
              <FormGroup>
                <Label htmlFor="online">Location:</Label>
                <OnlineContainer>
                  <Input
                    className='checkbox'
                    type="checkbox"
                    id="online"
                    name="online"
                    checked={formData.online}
                    onChange={handleOnline}
                    placeholder='Please enter your project location'
                  />
                  <OnlineLabel>Online</OnlineLabel>
                </OnlineContainer>
                {offline && (
                  <OfflineContainer>
                    <Input
                      type="text"
                      id="addressCity"
                      name="addressCity"
                      value={formData.addressCity}
                      onChange={handleChange}
                      placeholder="Please enter the city"
                    />
                    {showError && errors.addressCity && <ErrorMessage errormessage={errors.addressCity} onClose={handleErrorClose} />}
                    <Input
                      className='location'
                      type="text"
                      id="addressCountry"
                      name="addressCountry"
                      value={formData.addressCountry}
                      onChange={handleChange}
                      placeholder="Please enter the country"
                    />
                    {showError && errors.addressCountry && <ErrorMessage errormessage={errors.addressCountry} onClose={handleErrorClose} />}
                  </OfflineContainer>
                )}
              </FormGroup>

            </Group>
            <Group>
              <FormGroup>
                <Label htmlFor="teamInformation">Team Information:</Label>
                <Textarea
                  type="text"
                  id="teamInformation"
                  name="teamInformation"
                  value={formData.teamInformation}
                  onChange={handleChange}
                  placeholder='Please enter your team information'
                />
              </FormGroup>
              {showError && errors.teamInformation && <ErrorMessage errormessage={errors.teamInformation} onClose={handleErrorClose} />}
            </Group>
            <Group>
              <FormGroup>
                <Label htmlFor="requirements">Project Requirements:</Label>
                <Textarea
                  type="text"
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder='Please enter your project requirements'
                />
              </FormGroup>
              {showError && errors.requirements && <ErrorMessage errormessage={errors.requirements} onClose={handleErrorClose} />}
            </Group>
            <Group>
              <FormGroup>
                <Label htmlFor="workAndTime">Work Arrangements and Time Requirements:</Label>
                <Textarea
                  type="text"
                  id="workAndTime"
                  name="workAndTime"
                  value={formData.workAndTime}
                  onChange={handleChange}
                  placeholder='Please enter your work arrangements and time requirements'
                />
              </FormGroup>
              {showError && errors.workAndTime && <ErrorMessage errormessage={errors.workAndTime} onClose={handleErrorClose} />}
            </Group>
            <Group>
              <FormGroup>
                <Label htmlFor="rolesAndResponsibilities">Project Roles and Responsibilities:</Label>
                <Textarea
                  type="text"
                  id="rolesAndResponsibilities"
                  name="rolesAndResponsibilities"
                  value={formData.rolesAndResponsibilities}
                  onChange={handleChange}
                  placeholder='Please enter your project roles and responsibilities'
                />
              </FormGroup>
              {showError && errors.rolesAndResponsibilities && <ErrorMessage errormessage={errors.rolesAndResponsibilities} onClose={handleErrorClose} />}
            </Group>
            <Group>
              <FormGroup className='special'>
                <Label htmlFor="startTime" style={{ marginLeft: '14%' }}>Project start date:</Label>
                <DatePickerContainer>
                  <CustomStyledDatePicker
                    selected={formData.startTime}
                    onChange={(date) => handleDateChange(date, 'startTime')}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                  />
                </DatePickerContainer>
              </FormGroup>
              {showError && errors.startTime && <ErrorMessage errormessage={errors.startTime} onClose={handleErrorClose} />}
              <FormGroup className='special'>
                <Label htmlFor="endTime" style={{ marginLeft: '14%' }}>Project end date:</Label>
                <DatePickerContainer>
                  <CustomStyledDatePicker
                    selected={formData.endTime}
                    onChange={(date) => handleDateChange(date, 'endTime')}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                  />
                </DatePickerContainer>
              </FormGroup>
              {showError && errors.endTime && <ErrorMessage errormessage={errors.endTime} onClose={handleErrorClose} />}
            </Group>
            <Group>
              <FormGroup>
                <Label htmlFor="resource">Project resource:</Label>
                <Textarea
                  type="textarea"
                  id="resource"
                  name="resource"
                  value={formData.resource}
                  onChange={handleChange}
                  placeholder='Please enter your project resource'
                />
              </FormGroup>
              {showError && errors.resource && <ErrorMessage errormessage={errors.resource} onClose={handleErrorClose} />}
            </Group>
            <Create>
              <CreateBtn type='submit'>{location.state === null ? 'Create' : 'Save'}</CreateBtn>
            </Create>
          </FormContainer>
        </Details>
        <ScrollToTop moduleRef={moduleRef}></ScrollToTop>
      </Container>
    </Background>
  )
}


export default UpdateModule;