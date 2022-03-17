import { Typography, TextField } from '@mui/material';
import * as React from 'react';
export default function Step0({ formStep, newEvent, handleChange }) {
  if (formStep !== 0) {
    return null;
  }

  return (
    <React.Fragment>
      <Typography variant="p">Well what should we call your event?</Typography>
      <TextField
        id="name-input"
        name="title"
        type="text"
        variant="standard"
        label="Title"
        value={newEvent.title}
        onChange={handleChange}
      />
      <Typography variant="p" m={3}>
        Aaand can you give us some extra deets?
      </Typography>
      <TextField
        name="description"
        label="Description"
        multiline
        maxRows={3}
        variant="standard"
        value={newEvent.description}
        onChange={handleChange}
      />
    </React.Fragment>
  );
}
