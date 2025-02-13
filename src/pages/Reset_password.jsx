import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ErrorMessage from '../components/project_edit/ErrorMessage.jsx';
import NotificationDialog from "../components/common/NotificationInput.jsx";

const Bigdiv=styled.div`
  background-color: #f5f5f5;
  width: 100vw;
  height: 100vh;
`

const Login_screen=styled.div`
  display: flex;
  justify-content: center;
  background-color: #f5f5f5;
  align-items: center;
  position: relative;
  width: 100vw;
  height: 100vh;
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
`

const Login_button=styled.button`
  font-size: 30px;
  font-family: system-ui;
  font-weight: bold;
  color:#ffffff;
  height: 50px;
  width: 100%;
  border-radius: 10px;
  border-style: solid;
  border-color: #007fff;
  border-width: 3px;
  padding: 0px;
  background: #007fff;
`
const Login_form=styled.form`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  width: 50%;
  height: 80%;
  justify-content: space-evenly;
  align-items: center;
  opacity: 0.8;
  border-radius:20px;
  z-index: 2;
`
const Button_field=styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 63%;
  height: 15%;
  margin-top: 25px;
  padding-top: 20px;
`
const Form_title=styled.div`
  font-family: 'Oleo Script Swash Caps', cursive;
  font-size: 36px;
  font-weight: bold;
  color: #0077ef;
  margin-bottom: 10px;
`

const Tip_text=styled.div`
  width: 100%;
  font-family: Arial;
  font-size: 15px;
  color: #0077ef;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
`

const Tip_link=styled.div`
  font-family: sans-serif;
  font-weight: bold;
  color:#007fff;
  margin-top: -3px;
  margin-left: 8px;
  &:hover {
  cursor: pointer;
  }
`

const Form_input=styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 60%;
  height: 45%;
`

const Input_field=styled.input`
  padding: 0px;
  width: 100%;
  border-width: 2px;
  border-radius: 8px;
  font-size: 28px;
  padding: 5px;
  border-color:#007fff;
`
const Input_text=styled.div`
  font-size: 18px;
  font-family: system-ui;
  margin-bottom: 5px;
  color: #0077ef;
`

const SampleInput=styled.div`
  width: 100%;
  padding-top: 10px;
`

const PasswordInput=styled.div`
  width: 100%;
  padding-top: 10px;
`

const Password_container=styled.div`
  width: 100%;
  height: auto;
  position: relative;
`

const Eye_icon=styled.img`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  &:hover {
    cursor: pointer;
  }
`

const Link=styled.a`
  font-family: sans-serif;
  font-weight: bold;
  font-size: 20px;
  color:#007fff;
  &:hover {
  cursor: pointer;
  }
`

export default function ResetPassword() {
  const navigate = useNavigate();
  const [resetForm, setResetForm] = useState({
    email:'',
    password:'',
    confirm: '',
    telephone: '',
  });
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [color, setColor] = useState("rgba(255, 0, 0, 0.8)");
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [notification, setNotification] = useState({
    status: 12,
  });
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleErrorClose = () => {
    setShowError(false);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  function resetHandler(event){
    event.preventDefault();
    //we have to prevent default because form will try to submit data for us when submit event is triggered but we want to customize the authentication function
    if (!resetForm.email || !resetForm.password){
      setError("Input field cannot be empty!");
      setColor("rgba(255, 0, 0, 0.8)");
      setShowError(true);
      return;
    }
    if (!emailRegex.test(resetForm.email)){
      setError("Please enter a valid email address!");
      setColor("rgba(255, 0, 0, 0.8)");
      setShowError(true);
      return;
    }
    if (resetForm.password != resetForm.confirm){
      setError("The password you entered do not match!");
      setColor("rgba(255, 0, 0, 0.8)");
      setShowError(true);
      return;
    }
    const body={
      email: resetForm.email,
      telephone: resetForm.telephone,
      password: resetForm.password
    };
    fetch('http://localhost:8080/user/reset',{
      method:'POST',
      headers:{'Content-type': 'application/json'},
      body: JSON.stringify(body)
    }).then(
        response=>{
          return response.json();
        }
    ).then(
        response=>{
          if (response.code==200){
            setError("The password has been reset successfully. Please return to the login page to log in.");
            setColor("rgba(0, 119, 239, 0.8)");
            setShowError(true);
          }else{
            setError("Password reset failed, please contact the administrator.");
            setColor("rgba(255, 0, 0, 0.8)");
            setShowError(true);
          }
        }
    ).catch(
        error=>{
          alert(`error: ${error.message}`);
        }
    );
  }

  return (
    <Bigdiv>
      <Circle1></Circle1>
      <Circle2></Circle2>
      <Circle3></Circle3>
      <Login_screen>
        <Login_form onSubmit={(e)=>{resetHandler(e)}}>
          <Form_title>Bridges</Form_title>
          <Form_input>
            <SampleInput>
              <Input_text>email: </Input_text>
              <Input_field sytle={{height: '50%'}} type="text" value={resetForm.email} onChange={e=>setResetForm({...resetForm,email:e.target.value})}/>
            </SampleInput>
            <SampleInput>
              <Input_text>telephone: </Input_text>
              <Input_field sytle={{height: '50%'}} type="text" value={resetForm.telephone} onChange={e=>setResetForm({...resetForm,telephone:e.target.value})}/>
            </SampleInput>
            <PasswordInput>
              <Input_text>password: </Input_text>
              <Password_container>
                <Input_field sytle={{height: '100%'}} type={isVisible? "text":"password"} value={resetForm.password} onChange={e=>setResetForm({...resetForm,password:e.target.value})}/>
                <Eye_icon src={isVisible? 'assets/eye_open.svg' : 'assets/eye_close.svg'} onClick={()=>{isVisible? setIsVisible(false):setIsVisible(true)}}/>
              </Password_container>
            </PasswordInput>
            <PasswordInput>
              <Input_text>confirm password: </Input_text>
              <Password_container>
                <Input_field sytle={{height: '100%'}} type={isConfirmVisible? "text":"password"} value={resetForm.confirm} onChange={e=>setResetForm({...resetForm,confirm:e.target.value})}/>
                <Eye_icon src={isVisible? 'assets/eye_open.svg' : 'assets/eye_close.svg'} onClick={()=>{isConfirmVisible? setIsConfirmVisible(false):setIsConfirmVisible(true)}}/>
              </Password_container>
            </PasswordInput>
            <Tip_text><NotificationDialog type="need help" info={notification}/></Tip_text>
          </Form_input>
          {showError && <ErrorMessage errormessage={error} color={color} onClose={handleErrorClose} />}
          <Button_field>
            <Login_button type="submit">reset</Login_button>
            <Link onClick={()=>{navigate('/');}}>login</Link>
          </Button_field>
        </Login_form>
      </Login_screen> 
    </Bigdiv>
  );
}