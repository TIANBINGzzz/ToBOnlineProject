import React, { useCallback, useEffect, useRef, useState, forwardRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
    Card,
    Image,
    Tag,
    Form,
    Select,
    Input,
    Space,
    Button,
    Upload,
    Checkbox,
    message,
    Divider,
    Row,
    Col,
    Avatar,
    Typography,
} from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    UserOutlined,
    BankOutlined,
    ReadOutlined,
    CalendarOutlined,
    EditOutlined,
} from "@ant-design/icons";
import Leftlist from "../components/common/Leftlist.jsx";
import HeaderModule from "../components/common/Header.jsx";
import ScrollToTop from "../components/common/ToTop.jsx";
import NotificationDialog from "../components/common/NotificationInput.jsx";
import DeleteDialog from "../components/common/DeleteButton.jsx";
import MyProjectProfessional from "../pages/MyProject_professional1.jsx";

import {
    getCompanyInfo,
    getProfessionalUserInfo,
    updateCompanyInfo,
    updateProfessionalUserInfo,
} from "../services/userInfo.js";

const { Title, Text } = Typography;

const BigDiv = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const ProfileContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const ContentWrapper = styled.div`
  width: calc(100vw - 100px);
  height: calc(100vh - 180px);
  margin-top: 70px;
  margin-left: 70px;
  overflow-y: auto;
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

const StyledCard = styled(Card)`
  width: 50%;
  border-radius: 10px;
  box-shadow: none;
  margin-bottom: 2rem;
  border: 2px solid #f0f3f5;
`;

const CustomTag = styled(Tag)`
  font-size: 12px;
  padding: 2px 10px;
  margin-right: 5px;
  margin-bottom: 4px;
`;

const EditButtonContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const flowColors = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
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

const ProfissionForm = forwardRef((props, ref) => {
    const [form] = Form.useForm();
    const [skills, setSkills] = useState([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const initialSkills = form.getFieldValue("skill") || [];
        setSkills(initialSkills);
    }, [form]);

    const handleSkillAdd = () => {
        if (inputValue && !skills.includes(inputValue.trim())) {
            const updatedSkills = [...skills, inputValue.trim().toLowerCase()];
            setSkills(updatedSkills);
            form.setFieldsValue({ skill: updatedSkills });
            setInputValue("");
        }
    };

    const onSkillChange = (skill) => {
        const updatedSkills = skills.filter((s) => s !== skill);
        form.setFieldsValue({ skill: updatedSkills });
        setSkills(updatedSkills);
    };

    return (
        <Form
            wrapperCol={{ span: 24 }}
            layout="vertical"
            form={form}
            size="large"
            ref={ref}
        >
            {/* Form items remain unchanged */}
            {/* ... */}
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
    const permission = sessionStorage.getItem("permission");
    const pageId = window.location.pathname.split("/").pop();

    useEffect(() => {
        if (location.state) {
            setBack(location.state.from);
        }
    }, [location.state]);

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
        if (res.code === 200) {
            sessionStorage.setItem("token", res.token);
            setProfileDetails(val);
            message.success("Update Success");
            setEditing(false);
        }
    };

    const handleFormReset = () => {
        formRef.current.resetFields();
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
                            if (response.data.logo) {
                                setFileList([
                                    { url: `data:image/jpeg;base64,${response.data.logo}` },
                                ]);
                            }
                            if (response.data.id === sessionStorage.getItem("id")) {
                                setNotification({
                                    ...notification,
                                    status: 11,
                                });
                            } else {
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
        [navigate, param.id, notification]
    );

    const handleEditMode = useCallback(() => {
        const id = sessionStorage.getItem("id");
        if (param.id === id || permission.includes(1)) {
            setIsEdit(true);
        } else {
            setIsEdit(false);
        }
    }, [param.id, permission]);

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    useEffect(() => {
        if (formRef.current && profileDetails) {
            const { avatar, ...rest } = profileDetails;
            if (avatar) {
                setFileList([{ url: `data:image/jpeg;base64,${avatar}`, name: "avatar" }]);
            }
            formRef.current.setFieldsValue(rest);
        }
    }, [editing, profileDetails]);

    useEffect(() => {
        getProjects(true);
    }, [getProjects]);

    useEffect(() => {
        handleEditMode();
    }, [handleEditMode]);

    if (!profileDetails) {
        return <div>Loading...</div>;
    }

    return (
        <BigDiv>
            <ProfileContainer>
                <HeaderModule handleClick={BackPage} />
                <Leftlist />
                {isEdit && <DeleteDialog />}
                {editing ? (
                    <ContentWrapper>
                        <StyledCard>
                            <Form
                                wrapperCol={{ span: 24 }}
                                layout="vertical"
                                form={formRef.current}
                                size="large"
                                ref={formRef}
                            >
                                <Row align="middle" gutter={[16, 16]}>
                                    <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                                        <Upload
                                            action=""
                                            listType="picture-circle"
                                            fileList={fileList}
                                            maxCount={1}
                                            onPreview={handlePreview}
                                            onChange={handleChange}
                                            beforeUpload={() => false}
                                        >
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
                                    </Col>
                                    <Col xs={24} sm={16}>
                                        <ProfissionForm ref={formRef} />
                                    </Col>
                                </Row>
                                <EditButtonContainer>
                                    <Button
                                        type="primary"
                                        onClick={handleFormSubmit}
                                        style={{ marginRight: "10px" }}
                                    >
                                        Save
                                    </Button>
                                    <Button onClick={() => setEditing(false)}>Back</Button>
                                </EditButtonContainer>
                            </Form>
                        </StyledCard>
                    </ContentWrapper>
                ) : (
                    <>
                        <ContentWrapper>
                            <StyledCard>
                                <Row align="middle" gutter={[16, 16]}>
                                    <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                                        <Avatar
                                            size={180}
                                            src={
                                                fileList[0]
                                                    ? fileList[0].url || fileList[0].thumbUrl
                                                    : null
                                            }
                                        />
                                        {isEdit ? (
                                            !sessionStorage.getItem("enable") && (
                                                <Tag>enable</Tag>
                                            ) && (
                                                <NotificationDialog type="Appeal" info={notification} />
                                            )
                                        ) : (
                                            <NotificationDialog type="Report" info={notification} />
                                        )}
                                        {isEdit && (
                                            <EditButtonContainer>
                                                <Button
                                                    type="primary"
                                                    icon={<EditOutlined />}
                                                    onClick={() => setEditing(true)}
                                                >
                                                    Edit Profile
                                                </Button>
                                            </EditButtonContainer>
                                        )}
                                    </Col>
                                    <Col xs={24} sm={16}>
                                        <Space direction="vertical" size="middle">
                                            <Title level={3}>
                                                {profileDetails.firstname} {profileDetails.lastname}
                                            </Title>
                                            <Text>
                                                Telephone: {profileDetails.telephone} | Email:{" "}
                                                {profileDetails.email}
                                            </Text>
                                            <Text type="secondary">
                                                Address:{" "}
                                                {[
                                                    profileDetails.addressStreet,
                                                    profileDetails.addressSuburb,
                                                    profileDetails.addressCity,
                                                    profileDetails.addressPostcode,
                                                    profileDetails.addressCountry,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </Text>
                                            <Space size="small">
                                                <CustomTag icon={<UserOutlined />}>
                                                    Age {profileDetails.age}
                                                </CustomTag>
                                                <CustomTag icon={<ReadOutlined />}>
                                                    {profileDetails.education}
                                                </CustomTag>
                                                <CustomTag icon={<BankOutlined />}>
                                                    {profileDetails.company}
                                                </CustomTag>
                                                <CustomTag icon={<CalendarOutlined />}>
                                                    {profileDetails.experienceYear} Years Experience
                                                </CustomTag>
                                            </Space>

                                            <div>
                                                <Text strong style={{ marginRight: "12px" }}>
                                                    Skills:
                                                </Text>
                                                <Space size="small">
                                                    {profileDetails.skill &&
                                                        profileDetails.skill.map((skill, index) => (
                                                            <CustomTag key={index}>{skill}</CustomTag>
                                                        ))}
                                                </Space>
                                            </div>
                                        </Space>
                                    </Col>
                                </Row>
                            </StyledCard>
                            <Divider>Projects</Divider>
                            <MyProjectProfessional />
                        </ContentWrapper>
                    </>
                )}
            </ProfileContainer>
        </BigDiv>
    );
}
