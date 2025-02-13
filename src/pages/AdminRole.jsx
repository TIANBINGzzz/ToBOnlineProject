import React, { useCallback, useEffect, useRef, useState, forwardRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Table, Image, Popconfirm, Form, Select, Input, Space, Button, Upload, Checkbox, Tag, message } from "antd";
import CreateAdminDialog from "../components/admin/PermissionButton.jsx"

import { getAdminList, updateAdmin, createAdmin, deleteAdmin } from "../services/admin.js";

const Background = styled.div`
  width: calc(100vw - 230px);
  height: calc(100vh - 40px);
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  right: 10px;
  top: 10px;
  padding-top: 20px;
  background-color: #ffffff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.19);
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`

const TableContainer = styled(Table)``;


export default function AdminRole() {
  const [form] = Form.useForm();

  const roleFields = ["platform data monitoring", "professional management", "company management", "project management", "request processing"];
  const generateCheckboxOptions = roleFields.map((role, idx) => ({ label: role, value: idx }));

  const [editRowIdx, setEditRowIdx] = useState(null);
  const [editRecord, setEditRecord] = useState(null);

  const [page, setPage] = useState({
    start: 1,
    size: 5,
    total: 0,
  });

  const [back, setBack] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [tableDataSource, setTableDataSource] = useState([]);

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

  const handleChange = (e) => {
    setEditRecord((prevRecord) => ({
      ...prevRecord,
      permission: e,
    }));
  }

  const columns = [
    {
      title: "adminId",
      dataIndex: "id",
      key: "id",
      width: 200,
    },
    {
      title: "permission",
      dataIndex: "permission",
      key: "permission",
      width: "50%",
      render(_, record, idx) {
        if (idx === editRowIdx) {
          return <Checkbox.Group
            options={generateCheckboxOptions}
            defaultValue={_}
            onChange={handleChange}
            style={{ 
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              overflowX: "auto",
              whiteSpace: "nowrap",
              }}
          />;
        }
        return _.map((f) => <Tag color="blue">{roleFields[f]}</Tag>);
      },
    },
    {
      title: "operation",
      key: "operation",
      width: "15%",
      render(_, record, idx) {
        return (
          <Space style={{ 
            display: "flex",
            flexWrap: "wrap",
           }}>
            {editRowIdx != idx ? (
              <Button
                variant="text"
                color="primary"
                onClick={() => {
                  setEditRowIdx(idx);
                  setEditRecord(record);
                }}
                style={{ width: "70px" }}
              >
                Update
              </Button>
            ) : (
              <>
                <Button variant="text" color="primary" onClick={() => {
                  handleSave(editRecord);
                }} style={{ width: "70px" }}>
                  Save
                </Button>
              </>
            )}
            <Popconfirm title="Delete the admin" description="Are you sure to delete this admin?" onConfirm={() => handleDelete(record)} okText="Yes" cancelText="No">
              <Button variant="text" color="danger" style={{ width: "70px" }}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // query list
  const getDataList = async () => {
    const res = await getAdminList({
      start: page.start,
      size: page.size,
    });
    if (res.code == 200) {
      if (res.data.records.length) {
        setTableDataSource(res.data.records);
        setPage({ ...page, total: res.data.total });
      }
    }
  };

  const handleCreate = async () => {
    const values = await form.validateFields();
    const res = await createAdmin(values);
    if (res.code == 200) {
      message.success("updated successfully");
      getAdminList();
    }
  };

  const handleSave = async (row) => {
    const res = await updateAdmin(row);
    if (res.code == 200) {
      message.success("updated successfully");
      setTableDataSource((prevData) =>
        prevData.map((item) =>
          item.id === row.id ? { ...item, permission: row.permission } : item
        )
      );
      getAdminList({
        start: page.start,
        size: page.size,
      });
      setEditRowIdx(null);
      setEditRecord(null);
    }
  };

  const handleDelete = async (row) => {
    if (!row.id) return;
    const res = await deleteAdmin(row.id);
    if (res.code == 200) {
      setTableDataSource((prevData) => prevData.filter((item) => item.id !== row.id));
      message.success("deleted successfully");
      getAdminList({
        start: page.start,
        size: page.size,
      });
    }
  };

  const refreshData = async () => {
    await getAdminList({
      start: page.start,
      size: page.size,
    });
  };

  // init
  useEffect(() => {
    getDataList();
  }, []);

  useEffect(() => {
    getDataList();
  }, [page.start, page.size]);

  return (
    <Background>
      <CreateAdminDialog refreshData={refreshData}/>
      <TableContainer bordered dataSource={tableDataSource} columns={columns} size="large" pagination={{ total: page.total, onChange: (page, size) => setPage({ ...page, start: page, size }) }} />
    </Background>
  );
}
