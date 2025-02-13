import React, { useCallback, useEffect, useRef, useState, forwardRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Image, Form, Select, Input, Space, Upload, message, Col } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import Leftlist from "../components/common/Leftlist.jsx";
import HeaderModule from "../components/common/Header.jsx";
import NotificationDialog from "../components/common/NotificationInput.jsx";
import DeleteDialog from "../components/common/DeleteButton.jsx";
import UpdateIcon from '@mui/icons-material/Update';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EmailIcon from '@mui/icons-material/Email';
import Myproject from './Myproject_company1.jsx'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Button1 from '@mui/material/Button';
import GroupIcon from '@mui/icons-material/Group';

import { getCompanyInfo, getProfessionalUserInfo, updateCompanyInfo, updateProfessionalUserInfo } from "../services/userInfo.js";


const BackgroundContainer = styled.div``;

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

const EditContainer = styled.div`
  width: calc(100vw - 500px);
  box-sizing: border-box;
`;
const AvatarArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2vh 0;
`;

const EditFormArea = styled.div`
  display: flex;
  justify-content: center;
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
const ApplyButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const CompanyFormContainer = styled.div`
  width: 500px;
`;

const Tag = styled.div`
  font-size: 15px;
  color: #d1d1d1;
  margin-left: 20px;
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
  gap: 70px;
`;

const InfoViewLeft = styled.div``;
const InfoViewRight = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
`;

const scaleField = [
  {
    label: "0-100",
    value: 0,
  },
  {
    label: "100-500",
    value: 1,
  },
  {
    label: "500+",
    value: 1,
  },
];

const Icon = styled.div`
  position: absolute;
  left: 78px;
  top: 270px;
`

const ProjectContainer = styled.div`
  display: flex;
  justify-content: center;
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Details = styled.p`
  display: flex;
  align-items: center;
  gap: 7px;
  &.Introduction{
    padding-left: 20px;
  }
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


const CompanyForm = forwardRef((props, ref) => {
  const [form] = Form.useForm();

  return (
    <Form labelCol={{ span: 7 }} wrapperCol={{ span: 24 }} layout="vertical" form={form} size="large" ref={ref}>
      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Email</span>} name="email" required>
        <Input placeholder="email" />
      </Form.Item>

      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Name</span>} name="name" required>
        <Input placeholder="name" />
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

      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Telephone</span>} name="telephone" required>
        <Input type="number" />
      </Form.Item>

      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Scale</span>} name="scale" required>
        <Select>
          {scaleField.map((item) => {
            return <Select.Option value={item.value}>{item.label}</Select.Option>;
          })}
        </Select>
      </Form.Item>

      <Form.Item label={<span style={{ color: "#007FFF", fontSize: "18px", fontWeight: "bold" }}>Introduction</span>} name="introduction" required>
        <Input.TextArea rows={8} />
      </Form.Item>
    </Form>
  );
});

export default function CompanyProfile() {
  const [profileDetails, setProfileDetails] = useState();
  const [notification, setNotification] = useState({
    userId: sessionStorage.getItem("id"),
    userName: sessionStorage.getItem("userName"),
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]); // avatar
  const param = useParams();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [back, setBack] = useState(null);
  const location = useLocation();
  const permission = sessionStorage.getItem('permission')

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
      val.logo = avatar.split(",")[1];
    } else {
      val.logo = avatarObject.url ? avatarObject.url.split(",")[1] : "";
    }

    const res = await updateCompanyInfo(val, sessionStorage.getItem("id"));
    if (res.code == 200) {
      setProfileDetails(val);
      message.success("Update Success");
      setEditing(false);
      sessionStorage.setItem("token", res.token);
    }
  };

  const getProjects = useCallback(
    (update) => {
      if (!sessionStorage.getItem("token")) {
        navigate("/");
      }
      const token = sessionStorage.getItem("token");
      fetch(`http://localhost:8080/company/${param.id}`, {
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
              if (response.data.logo) {
                setFileList([{ url: `data:image/jpeg;base64,${response.data.logo}` }]);
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
    getProjects(true);
  }, [getProjects]);

  useEffect(() => {
    if (formRef.current) {
      const { logo, ...rest } = profileDetails;
      if (logo) {
        setFileList([{ url: `data:image/jpeg;base64,${logo}` }]);
      }
      formRef.current.setFieldsValue(rest);
    }
  }, [editing]);

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
              <EditFormArea className="update">
                <CompanyFormContainer>
                  <CompanyForm ref={formRef} />
                </CompanyFormContainer>
              </EditFormArea>
              <ApplyButtonContainer>
                <SubmitBtn onClick={() => handleFormSubmit()}>Save</SubmitBtn>
                <SubmitBtn onClick={() => setEditing(false)}>Back</SubmitBtn>
              </ApplyButtonContainer>
            </EditContainer>
          ) : (
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
                        style={{ backgroundColor: '#fff', borderRadius: '50%', padding: '10px' }}
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
                        <span>{profileDetails.name}</span>
                        {isEdit ? !sessionStorage.getItem("enable") && <Tag>enable</Tag> && <NotificationDialog type="Appeal" info={notification} /> : <NotificationDialog type="Report" info={notification} />}
                      </h2>

                      <DetailContainer>
                        <LeftContainer>
                          <Details><EmailIcon />{profileDetails.email}</Details>
                          <Details><LocalPhoneIcon />{profileDetails.telephone}</Details>
                          <Details><LocationOnIcon />{[profileDetails.addressStreet, profileDetails.addressSuburb, profileDetails.addressCity, profileDetails.addressPostcode, profileDetails.addressCountry].filter(Boolean).join(", ")}</Details>
                          <Details><GroupIcon />{scaleField.find((scale) => scale.value === profileDetails.scale) ? scaleField.find((scale) => scale.value === profileDetails.scale).label : "Unknow"}</Details>
                        </LeftContainer>
                        <RightContainer>
                          <Details><b>Introduction</b>:</Details>
                          <Details className="Introduction">
                            {profileDetails.introduction ? profileDetails.introduction : "no introduction"}
                          </Details>
                        </RightContainer>
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
          )}
        </Background>
      </div>
    </BackgroundContainer>
  );
}
