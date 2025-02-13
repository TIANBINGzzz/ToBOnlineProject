import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styled from "styled-components";

const NotificationButton=styled.div`
  font-family: sans-serif;
  font-weight: bold;
  color:#007fff;
  margin-top: -3px;
  margin-left: 8px;
  &:hover {
  cursor: pointer;
  }
`

export default function NotificationDialog({ type, info={} }) {
  // set tip text
  let title;
  let text;
  switch (type) {
    case 'need help':
      title = 'Reset Password';
      text = 'Please describe your request and the reason you need help. You can also leave your current contact information so that the administrator can contact you later.';
      break;
    case 'Report':
      title = 'Report';
      text = 'Please fill in your reason for reporting and we will handle it as soon as possible.';
      break;
    case 'Appeal':
      title = 'Account Appeal';
      text = 'Please describe the reason for your appeal and we will handle it for you as soon as possible.';
      break;
  }

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <NotificationButton
        onClick={handleClickOpen}
      >
        {type}
      </NotificationButton>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const requestBody = {
              ...info,
              feedback: formJson.message
            };
            fetch(`http://localhost:8080/notification`, {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                'Authorization': `${sessionStorage.getItem("token")}`
              },
              body: JSON.stringify(requestBody)
            })
            handleClose();
          },
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {text}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="outlined-multiline-static"
            name="message"
            label="Message"
            multiline
            rows={4}
            fullWidth
            placeholder="Write your message here."
            style={{ marginTop:'30px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Send</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}