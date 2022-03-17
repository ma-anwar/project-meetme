import * as React from 'react';
import { Typography, Button, Grid, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Step2({ formStep, newEvent, handleChange }) {
  //TODO: Maybe a bettter duration component
  if (formStep !== 2) {
    return null;
  }

  return (
    <React.Fragment>
      <Typography variant="h5" m={2}>
        Just a few more questions!
      </Typography>
      <Typography variant="p" m={2}>
        How long do you want your meetings to be?
      </Typography>
      <TextField
        id="standard-number"
        label="Number"
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
      <FormControl>
        <Typography variant="p" m={4}>
          And where will your event take place??
        </Typography>
        <Select
          value={newEvent.location}
          name="location"
          label="Location"
          onChange={handleChange}
        >
          <MenuItem value={'virtual'}>Virtual</MenuItem>
          <MenuItem value={'inPerson'}>In-Person</MenuItem>
        </Select>
      </FormControl>
    </React.Fragment>
  );
}
