import * as React from 'react';
import { Typography, TextField } from '@mui/material';

export default function Step2({ formStep, newEvent, handleChange }) {
  if (formStep !== 2) {
    return null;
  }

  return (
    <React.Fragment>
      <Typography variant="h5" m={2}>
        Just a few more questions!
      </Typography>
      <Typography variant="p" m={2}>
        How long do you want your meetings/appointments to be?
      </Typography>
      <TextField
        id="standard-number"
        label="Minutes"
        name="timeslotLength"
        type="number"
        value={newEvent.slotLength}
        onChange={(e) => {
          handleChange(e);
        }}
        InputLabelProps={{
          shrink: true,
        }}
        variant="standard"
      />
    </React.Fragment>
  );
}
