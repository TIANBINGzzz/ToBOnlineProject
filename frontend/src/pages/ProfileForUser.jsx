import React, { useCallback, useEffect, useRef, useState, forwardRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Image, Form, Select, Input, Space, Button, Upload, Col, Tag, message } from "antd";
import { PlusOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import Leftlist from "../components/common/Leftlist.jsx";
import HeaderModule from "../components/common/Header.jsx";
import NotificationDialog from "../components/common/NotificationInput.jsx";
import DeleteDialog from "../components/common/DeleteButton.jsx";
import UpdateIcon from '@mui/icons-material/Update';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Myproject from "./MyProject_professional1.jsx";
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Button1 from '@mui/material/Button';

import { getCompanyInfo, getProfessionalUserInfo, updateCompanyInfo, updateProfessionalUserInfo } from "../services/userInfo.js";

const BackgroundContainer = styled.div`
`;

const Tag1 = styled.span`
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

const Background = styled.div`
  width: calc(100vw - 270px);
  height: calc(100vh - 80px);
  position: absolute;
  left: 250px;
  top: 75px;
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
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  &.update {
    align-items: center;
  }
`;

const EditContainer = styled.div`
  display: flex;
  width: calc(100vw - 500px);
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
`;

const AvatarArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2vh 0;
`;

const flowColors = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

const SubmitBtn = styled.button`
  all: unset;
  text-align: center;
  font-size: 30px;
  font-family: system-ui;
  font-weight: bold;
  height: 60px;
  width: 200px;
  border-radius: 10px;
  background-color: #007fff;
  transition: background-position 0.5s, transform 0.3s ease;
  color: white;
  & + & {
    margin-left: 20px;
  }

  &:hover {
    animation: ${flowColors} 1s infinite linear;
    transform: scale(1.1);
  }
`;

const ApplyButton = styled.button`
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

  & + & {
    margin-left: 20px;
  }
`;

const SubmitBtnContainer = styled.div`
  width: auto;
`;

const CompanyFormContainer = styled.div`
  width: 500px;
`;

const InfoView = styled.div`
  background-color: #ffffff;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 3%;
  padding-bottom: 3%;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: "center";
  align-items: center;
`;

const InfoViewLeft = styled.div``;
const InfoViewRight = styled.div`
  flex: 1;
  box-sizing: border-box;
  padding-left: 10%;
`;

const Icon = styled.div`
  position: absolute;
  left: 78px;
  top: 270px;
`

const ProjectContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Details = styled.p`
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
  &.Certificate{
    padding-left: 20px;
  }
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const DetailContainer = styled.div`
  display: flex;
  gap: 60px;
`

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const CertificationContainer = styled.div`
  flex: 1;
  min-width: 230px;
`

const ProfissionForm = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const initialSkills = form.getFieldValue("skill") || [];

    setSkills(initialSkills);
  }, [form.getFieldsValue()]);

  const handleSkillAdd = () => {
    if (inputValue && !skills.includes(inputValue.trim())) {
      const updatedSkills = [...skills, inputValue.trim().toLowerCase()];
      setSkills(updatedSkills);

      form.setFieldsValue({ skill: updatedSkills });
      setInputValue("");
    }
  };

  const onSkillChange = (skill) => {
    const updatedSkills = JSON.parse(JSON.stringify(skills.filter((s) => s !== skill)));
    form.setFieldsValue({ skill: updatedSkills });
    setSkills(updatedSkills);
  };

  return (
    <Form wrapperCol={{ span: 24 }} layout="vertical" form={form} size="large" ref={ref}>
      <Form.Item label="Email" name="email" required>
        <Input placeholder="email" />
      </Form.Item>

      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Name</span>} required>
        <Space.Compact>
          <Form.Item name="firstname">
            <Input placeholder="firstname" />
          </Form.Item>
          <Form.Item name="lastname">
            <Input placeholder="lastname" />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Age</span>} name="age" required>
        <Input />
      </Form.Item>

      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Address</span>}>
        <Space.Compact>
          <Form.Item name="addressStreet">
            <Input placeholder="addressStreet" />
          </Form.Item>
          <Form.Item name="addressCity">
            <Input placeholder="addressCity" />
          </Form.Item>
        </Space.Compact>

        <Space.Compact>
          <Form.Item name="addressSuburb">
            <Input placeholder="addressSuburb" />
          </Form.Item>
          <Form.Item name="addressPostCode">
            <Input placeholder="addressPostCode" />
          </Form.Item>

          <Form.Item name="addressCountry">
            <Input placeholder="addressCountry" />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Profess</span>} name="profess">
        <Input />
      </Form.Item>

      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Telephone</span>} name="telephone" required>
        <Input />
      </Form.Item>
      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Company or organization name</span>} name="company" required>
        <Input placeholder="company" />
      </Form.Item>

      <Form.Item label="Experience Year" name="experienceYear">
        <Select>
          <Select.Option value={0}>No experience</Select.Option>
          <Select.Option value={1}>Less than 1 year</Select.Option>
          <Select.Option value={2}>1-3 years</Select.Option>
          <Select.Option value={3}>Senior</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Education</span>} name="education">
        <Select>
          <Select.Option value="middle school">middle school</Select.Option>
          <Select.Option value="high school">high school</Select.Option>
          <Select.Option value="undergraduate">undergraduate</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Skill</span>} name="skill">
        <div style={{ marginBottom: 10 }}>
          {skills.map((item) => {
            return (
              <Tag color="blue">
                <span> {item}</span>
                <span style={{ marginLeft: 5, color: "red" }} onClick={() => onSkillChange(item)}>
                  <DeleteOutlined />
                </span>
              </Tag>
            );
          })}
        </div>
        <Input placeholder="Add a skill..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <Button onClick={handleSkillAdd} disabled={!inputValue.trim()} style={{ marginTop: 10 }}>
          Add Skill
        </Button>
      </Form.Item>

      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Professional Certification</span>} name="professionalCertificate">
        <Input.TextArea />
      </Form.Item>
    </Form>
  );
});

export default function UserProfile() {
  const [profileDetails, setProfileDetails] = useState(null);
  const param = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [notification, setNotification] = useState({
    userId: sessionStorage.getItem("id"),
    userName: sessionStorage.getItem("userName"),
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]); // avatar
  const [back, setBack] = useState(null);
  const location = useLocation();
  const permission = sessionStorage.getItem('permission');

  useEffect(() => {
    if (location.state) {
      setBack(location.state.from);
    }
  }, [back]);

  const BackPage = () => {
    if (back) {
      navigate(`${back}`, { state: { from: location.pathname } });
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = async (file) => setFileList(file.fileList);

  const handleFormSubmit = async () => {
    const val = await formRef.current.validateFields();

    const avatarObject = fileList[0] || {};

    if (avatarObject.hasOwnProperty("originFileObj")) {
      const avatar = await getBase64(avatarObject.originFileObj);
      val.avatar = avatar.split(",")[1];
    } else {
      val.avatar = avatarObject.url ? avatarObject.url.split(",")[1] : "";
    }

    if (val.skill === null) {
      val.skill = [];
    }

    const res = await updateProfessionalUserInfo(val, sessionStorage.getItem("id"));
    if (res.code == 200) {
      sessionStorage.setItem("token", res.token);
      setProfileDetails(val);
      message.success("Update Success");
      setEditing(false);
    }
  };

  const getProjects = useCallback(
    (update) => {
      if (!sessionStorage.getItem("token")) {
        navigate("/");
      }
      const token = sessionStorage.getItem("token");
      fetch(`http://localhost:8080/professional/${param.id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `${token}`,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          if (response.code === 200) {
            if (update === true) {
              setProfileDetails(response.data);
              if (response.data.avatar) {
                setFileList([{ url: `data:image/jpeg;base64,${response.data.avatar}` }]);
              }
              // set notification
              if (response.data.id === sessionStorage.getItem("id")) {
                // self -- appeal
                setNotification({
                  ...notification,
                  status: 11,
                });
              } else {
                // other user -- report
                setNotification({
                  ...notification,
                  companyId: response.data.id,
                  companyName: response.data.name,
                  status: 10,
                });
              }
            }
          }
        });
    },
    [navigate, param.id]
  );

  const handleEditMode = () => {
    const id = sessionStorage.getItem("id");
    if (param.id === id || permission.includes(1)) {
      return setIsEdit(true);
    }
    return setIsEdit(false);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  useEffect(() => {
    if (formRef.current) {
      const { avatar, ...rest } = profileDetails;
      if (avatar) {
        setFileList([{ url: `data:image/jpeg;base64,${avatar}` }]);
      }
      formRef.current.setFieldsValue(rest);
    }
  }, [editing]);

  useEffect(() => {
    getProjects(true);
  }, [getProjects]);

  useEffect(() => {
    handleEditMode();
  }, []);

  if (!profileDetails) {
    return <div>Loading...</div>;
  }

  return (
    <BackgroundContainer>
      <HeaderModule handleClick={BackPage}></HeaderModule>
      <div>
        <Leftlist></Leftlist>
        <Background>
          {isEdit && <DeleteDialog />}
          {editing ? (
            <EditContainer>
              <DetailsContainer>
                <AvatarArea>
                  <>
                    <Upload action="" listType="picture-circle" fileList={fileList} maxCount={1} onPreview={handlePreview} onChange={handleChange} beforeUpload={() => false}>
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    {previewImage && (
                      <Image
                        wrapperStyle={{ display: "none" }}
                        preview={{
                          visible: previewOpen,
                          onVisibleChange: (visible) => setPreviewOpen(visible),
                          afterOpenChange: (visible) => !visible && setPreviewImage(""),
                        }}
                        src={previewImage}
                      />
                    )}
                  </>
                </AvatarArea>
              </DetailsContainer>

              <DetailsContainer className="update">
                <CompanyFormContainer>
                  <ProfissionForm ref={formRef} />
                </CompanyFormContainer>

                <SubmitBtnContainer>
                  <SubmitBtn onClick={() => {
                    handleFormSubmit();
                    // setEditing(false)
                  }}>Save</SubmitBtn>
                  {/* <SubmitBtn onClick={() => handleFormReset()}>Reset</SubmitBtn> */}
                  <SubmitBtn onClick={() => setEditing(false)}>Back</SubmitBtn>
                </SubmitBtnContainer>
              </DetailsContainer>
            </EditContainer>
          ) : (
            <>
              <div>
                <InfoView>
                  <Flex>
                    <InfoViewLeft>
                      <>
                        <Upload
                          disabled={true}
                          action=""
                          listType="picture-circle"
                          fileList={fileList}
                          maxCount={1}
                          onPreview={handlePreview}
                          onChange={handleChange}
                          beforeUpload={() => false}
                          showUploadList={{ showRemoveIcon: false }}
                        >
                          {fileList.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <UserOutlined style={{ fontSize: '32px', color: '#aaa' }} />
                            </div>
                          ) : null}
                        </Upload>
                        {previewImage && (
                          <Image
                            wrapperStyle={{ display: "none" }}
                            preview={{
                              visible: previewOpen,
                              onVisibleChange: (visible) => setPreviewOpen(visible),
                              afterOpenChange: (visible) => !visible && setPreviewImage(""),
                            }}
                            src={previewImage}
                          />
                        )}
                      </>
                    </InfoViewLeft>
                    <InfoViewRight>
                      <TextContainer>
                        <h2 style={{ display: "flex" }}>
                          <span>{profileDetails.firstname} {profileDetails.lastname}</span>
                          {isEdit ? !sessionStorage.getItem("enable") && <Tag>enable</Tag> && <NotificationDialog type="Appeal" info={notification} /> : <NotificationDialog type="Report" info={notification} />}
                        </h2>
                        <DetailContainer>
                          <LeftContainer>
                            <Details><EmailIcon />{profileDetails.email}</Details>
                            <Details><LocalPhoneIcon />{profileDetails.telephone}</Details>
                            <Details><b>Age</b>: {profileDetails.age}</Details>
                            {profileDetails.addressCountry && <Details><LocationOnIcon />{[profileDetails.addressStreet, profileDetails.addressSuburb, profileDetails.addressCity, profileDetails.addressPostcode, profileDetails.addressCountry].filter(Boolean).join(", ")}</Details>}
                          </LeftContainer>
                          <RightContainer>
                            <Details><b>Experience Year</b>: {profileDetails.experienceYear}</Details>
                            <Details><b>Graduate School</b>: {profileDetails.education}</Details>
                            <Details><b>Company</b>: {profileDetails.company}</Details>
                            <Details><b>Skills</b>: {profileDetails.skill &&
                              profileDetails.skill.map((skill, index) => {
                                return <Tag1 key={index}>
                                  {skill}
                                </Tag1>
                              })}</Details>
                          </RightContainer>
                          <CertificationContainer>
                            <Details><b>Certificate</b>:</Details>
                            <Details className="Certificate">
                              {profileDetails.professionalCertificate ? profileDetails.professionalCertificate : "no certificate"}
                            </Details>
                          </CertificationContainer>
                        </DetailContainer>
                      </TextContainer>
                      {isEdit && (
                        <Icon>
                          <Tooltip title="Update">
                            <Button1 variant="contained" onClick={() => setEditing(true)}>Update</Button1>
                          </Tooltip>
                        </Icon>
                      )}
                    </InfoViewRight>
                  </Flex>
                </InfoView>
                <ProjectContainer>
                  <Myproject></Myproject>
                </ProjectContainer>
              </div>
            </>
          )}
        </Background>
      </div>
    </BackgroundContainer>
  );
}
