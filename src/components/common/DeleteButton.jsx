import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styled from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteButton = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
`

export default function DeleteDialog() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function deleteHandler() {
    fetch(`http://localhost:8080/user/delete/${sessionStorage.getItem("id")}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'Authorization': `${sessionStorage.getItem("token")}`
      }
    }).then(
      response => response.json()
    ).then(
      response => {
        if (response.code != 200) {
          alert(`Error: ${response.msg}`);
        }
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userType');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('permission');
        sessionStorage.removeItem('enable');
        sessionStorage.removeItem('userName');
        navigate('/');
      }
    ).catch(
      error => {
        alert(`Error: ${error.message}`);
      }
    )
  }

  return (
    <DeleteButton>
      <Button size="small" onClick={handleClickOpen}>
        <DeleteIcon sx={{ color: 'black' }} />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Account?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account?
            None of your information and records will be retained.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CANCLE</Button>
          <Button onClick={deleteHandler} autoFocus>
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </DeleteButton>
  );
}