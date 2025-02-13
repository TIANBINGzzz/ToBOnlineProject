import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login_Page';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/project_detail';
import Register from './pages/Register';
import ProjectEdit from './pages/project_edit';
import CompanyProfile from './pages/ProfileForCompany';
import UserProfile from './pages/ProfileForUser';
import MyProjectProfessional from './pages/MyProject_professional';
import MyProjectCompany from './pages/MyProject_company';
import ResetPassword from './pages/Reset_password';
import AdminWorkPage from './pages/admin';
import AdminRole from './pages/AdminRole';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Project/edit" element={<ProjectEdit />} />
        <Route path="/project/:pid" element={<ProjectDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/company/:id" element={<CompanyProfile />} />
        <Route path="/profile/professional/:id" element={<UserProfile />} />
        <Route path="/Myproject/professional/" element={<MyProjectProfessional />} />
        <Route path="/Myproject/company/" element={<MyProjectCompany />} />
        <Route path='/admin' element={<AdminWorkPage />} />
        <Route path='/test' element={<AdminRole />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
