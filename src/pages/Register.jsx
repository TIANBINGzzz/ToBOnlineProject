import React, { useState } from "react";
import { Button, Form, Input, Select, Upload, Space, Checkbox, message, Radio } from "antd";
import { PlusOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { register } from "../services/registry.js"; 
import { useNavigate } from "react-router-dom";
import styled from "styled-components";



const RegisterBtn = styled.button`
  font-size: 30px;
  font-family: system-ui;
  font-weight: bold;
  height: 60px;
  width: 200px;
  border-radius: 10px;
  border-style: solid;
  border-color: #007fff;
  background-color: #007fff;
  color: #ffffff;
  border-width: 3px;
  padding: 0px;
`;

const Link=styled.a`
  font-family: sans-serif;
  font-weight: bold;
  font-size: 20px;
  color:#007fff;
  &:hover {
  cursor: pointer;
  }
`

const Bigdiv=styled.div`
  background-color: #f5f5f5;
  width: 100vw;
  height: 100vh;
`

const Register_screen=styled.div`
  display: flex;
  justify-content: center;
  background-color: #f5f5f5;
  align-items: center;
  position: relative;
  width: 100vw;
  height: 100vh;
`
const RegisterInfo=styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: #ffffff;
  align-items: center;
  position: relative;
  width: 50%;
  height: 96%;
  border-radius: 20px;
  z-index: 2;
  opacity: 0.8;

  @media (max-width: 768px) {
    height: 100%;
    width: 100%;
  }
`

const Form_title=styled.div`
  font-family: 'Oleo Script Swash Caps', cursive;
  font-size: 36px;
  font-weight: bold;
  color: #0077ef;
`

const RegisterButton=styled.div`
display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
`

const Circle1=styled.div`
  width: 380px;
  height: 380px;
  border-radius: 95px;
  border-top: 30px solid #007fff;
  border-right: 15px solid #007fff;
  border-bottom: 1px solid #007fff;
  border-left: 15px solid #007fff;
  transform: rotate(240deg);
  box-sizing: border-box;
  background-color: transparent;
  position: fixed;
  bottom: 60px;
  left: 0;
  z-index: 3;

  @media (max-width: 768px) {
    display: none;
  }
`

const Circle2=styled.div`
  width: 200px;
  height: 200px;
  border-radius:50px;
  border-top: 20px solid #007fff;
  border-right: 2px solid #007fff;
  border-bottom: 20px solid #007fff;
  border-left: 3px solid #007fff;
  transform: rotate(60deg);
  box-sizing: border-box;
  background-color: transparent;
  position: absolute;
  top: 270px;
  right: 250px;
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
`
const Circle3=styled.div`
  width: 300px;
  height: 300px;
  border-radius:75px;
  border-top: 15px solid #007fff;
  border-right: 10px solid #007fff;
  border-bottom: 3px solid #007fff;
  border-left: 20px solid #007fff;
  transform: rotate(25deg);
  box-sizing: border-box;
  background-color: transparent;
  position: absolute;
  top: 15px;
  right: 50px;
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
`

export default function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [isShowPsd, setIsShowPsd] = useState(false);


  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { password1, ...restValues } = values;

      const response = await register(restValues);
      if (response.code === 200) {
        sessionStorage.setItem("id", response.data.id);
        sessionStorage.setItem("token",response.token);
        sessionStorage.setItem("userType",response.data.userType);
        sessionStorage.setItem("permission", response.data.permission);
        sessionStorage.setItem("enable",response.data.enable);
        sessionStorage.setItem("userName", response.data.name);
        navigate("/dashboard");
      }
    } catch (error) {
      message.error("Please fill in all required fields.");
    }
  };

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password1") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match."));
    },
  });

  return (
    <Bigdiv>
      <Circle1></Circle1>
      <Circle2></Circle2>
      <Circle3></Circle3>
      <Register_screen>
        <RegisterInfo>
          <Form_title>Bridges</Form_title>
          <Form labelCol={{ span: 16 }} wrapperCol={{ span: 30 }} layout="vertical" form={form} size="large">
            <Form.Item style={{ width: '500px'}} label={<span style={{ color: '#007FFF', fontSize: '18px', fontWeight: 'bold' }}>email</span>} name="email" required rules={[{ required: true, message: "Please enter email!" }]}>
              <Input placeholder="email" />
            </Form.Item>

            <Form.Item style={{ width: '500px'}} label={<span style={{ color: '#007FFF', fontSize: '18px', fontWeight: 'bold' }}>password</span>} name="password1" required rules={[{ required: true, message: "Please enter password!" }]}>
              <Input type={isShowPsd ? "text" : "password"} placeholder="password" addonAfter={isShowPsd ? <EyeOutlined onClick={() => setIsShowPsd(false)} /> : <EyeInvisibleOutlined onClick={() => setIsShowPsd(true)} />}></Input>
            </Form.Item>

            <Form.Item style={{ width: '500px'}} label={<span style={{ color: '#007FFF', fontSize: '18px', fontWeight: 'bold' }}>confirm password</span>} name="password" rules={[{ required: true, message: "Please enter the confirmed password!" }, validateConfirmPassword]}>
              <Input type="password" placeholder="password" />
            </Form.Item>

            <Form.Item style={{ width: '500px'}} label={<span style={{ color: '#007FFF', fontSize: '18px', fontWeight: 'bold' }}>telephone</span>} name="telephone" rules={[{ required: true, message: "Please enter mobile number!" }]}>
              <Input />
            </Form.Item>

            <Form.Item label={<span style={{ color: '#007FFF', fontSize: '18px', fontWeight: 'bold' }}>user type</span>} name="userType" rules={[{ required: true, message: "Please select your registration identity!" }]}>
              <Radio.Group
                options={[
                  { label: "professional user", value: "professional" },
                  { label: "company user", value: "company" },
                ]}
              ></Radio.Group>
            </Form.Item>
            <RegisterButton>
              <Form.Item>
                <div style={{ display: "flex", justifyContent: "center", marginTop: '20px' }} >
                  <RegisterBtn onClick={onSubmit}>register</RegisterBtn>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: '10px'}}>
                  <Link onClick={()=>{navigate('/');}}>back to login</Link>
                </div>
              </Form.Item>
            </RegisterButton>
          </Form>
        </RegisterInfo>
      </Register_screen> 
    </Bigdiv>
  );
}







