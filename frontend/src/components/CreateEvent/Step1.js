import * as React from 'react';
import { TextField, Typography } from '@mui/material';
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';

export default function Step1({ formStep, newEvent, setNewEvent }) {
  const handleDateChange = (newValue) => {
    const updatedEvent = { ...newEvent };
    updatedEvent.dateRange = newValue;
    setNewEvent(updatedEvent);
  };

  if (formStep !== 1) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Typography variant="p">
        When is this event going to take place?
      </Typography>
      <StaticDateRangePicker
        disablePast
        displayStaticWrapperAs="desktop"
        value={newEvent.dateRange}
        onChange={(newValue) => {
          handleDateChange(newValue);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
  );
}
