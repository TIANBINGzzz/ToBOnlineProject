import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import ErrorMessage from '../components/project_edit/ErrorMessage.jsx';


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
  height: 75%;
  justify-content: space-evenly;
  align-items: center;
  opacity: 0.8;
  border-radius:20px;
  z-index: 2;
  @media (max-width: 768px) {
    height: 100%;
    width: 100%;
  }
`
const Button_field=styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 63%;
  height: 20%;
  margin-top: 15%;
`
const Form_title=styled.div`
  font-family: 'Oleo Script Swash Caps', cursive;
  font-size: 36px;
  font-weight: bold;
  color: #0077ef;
  margin-bottom: 30px;
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

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
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
  height: 15%;
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
  font-size: 30px;
  font-family: system-ui;
  margin-bottom: 10px;
  color: #0077ef;
`

const EmailInput=styled.div`
  width: 100%;
`

const PasswordInput=styled.div`
  width: 100%;
  padding-top: 20px;
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

function Login_Page(){
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({email:'',password:''});
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
  const handleErrorClose = () => {
    setShowError(false);
  };

  function loginHandler(event){
    event.preventDefault();
    if (!loginForm.email || !loginForm.password){
      setError("Input field cannot be empty!");
      setShowError(true);
      return;
    }
    if (!emailRegex.test(loginForm.email)){
      setError("Please enter a valid email address!");
      setShowError(true);
      return;
    }
    const body={email: loginForm.email, password: loginForm.password};
    fetch('http://localhost:8080/user/login',{
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
            // store id
            sessionStorage.setItem("id", response.data.id);
            sessionStorage.setItem("token",response.token);
            
            sessionStorage.setItem("enable",response.data.enable);
            sessionStorage.setItem("userName", response.data.name);
            if (response.data.userType === "super") {
              sessionStorage.setItem("userType", "admin");
              sessionStorage.setItem("permission", [0,1,2,3,4,5,6]);
              navigate('/admin');
            } else if (response.data.userType === "admin") {
              sessionStorage.setItem("userType", response.data.userType);
              sessionStorage.setItem("permission", response.data.permission);
              navigate('/admin');
            } else {
              sessionStorage.setItem("userType", response.data.userType);
              sessionStorage.setItem("permission", []);
              navigate('/dashboard');
            }
          }else if (response.code==403){
            setError("Invalid email or incorrect password!");
            setShowError(true);
          }else{
            throw new Error(response.status);
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
        <Login_form onSubmit={(e)=>{loginHandler(e)}}>
          <Form_title>Bridges</Form_title>
          <Form_input>
            <EmailInput>
              <Input_text>email: </Input_text>
              <Input_field sytle={{height: '50%'}} type="text" value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})}/>
            </EmailInput>
            <PasswordInput>
              <Input_text>password: </Input_text>
              <Password_container>
                <Input_field sytle={{height: '100%'}} type={isVisible? "text":"password"} value={loginForm.password} onChange={e=>setLoginForm({...loginForm,password:e.target.value})}/>
                <Eye_icon src={isVisible? 'assets/eye_open.svg' : 'assets/eye_close.svg'} onClick={()=>{isVisible? setIsVisible(false):setIsVisible(true)}}/>
              </Password_container>
            </PasswordInput>
            <Tip_text>forget your password?<Tip_link onClick={()=>{navigate('/resetPassword');}}>reset now</Tip_link></Tip_text>
          </Form_input>
          {showError && <ErrorMessage errormessage={error} onClose={handleErrorClose} />}
          <Button_field>
            <Login_button type="submit">login</Login_button>
            <Link onClick={()=>{navigate('/register');}}>register now</Link>
          </Button_field>
        </Login_form>
      </Login_screen> 
    </Bigdiv>
  )

}

export default Login_Page;
