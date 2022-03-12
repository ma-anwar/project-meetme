import './CreateEvent.css';
import { useRef, useState } from "react";
import { Container, Typography, Button, Grid, TextField} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import DurationPicker from 'react-duration-picker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export function CreateEvent() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [slotLen, setSlotLen] = useState(null);
    const [location, setLocation] = useState("");


    const titleRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const slotLengthRef = useRef(null);
    const locationRef = useRef(null);
    const descriptionRef = useRef(null);
  
    const handleSubmit = (e) => {
        e.preventDefault();
        //e.target.reset();
    };

    const changeDuration = duration => {
        const { hours, minutes, seconds } = duration;
        setSlotLen({ hours, minutes, seconds });
    };

    const changeLocation = (e) => {
        setLocation(e.target.value);
      };
  
    return (
    <Container className="CreateEvent__container">
        <Grid>
            <Typography className="CreateEvent__title">Create an Event</Typography>
            <form className="CreateEvent" onSubmit={handleSubmit}>
                <TextField className="CreateEvent__item-content" placeholder="Title" name="event_title" required ref={titleRef}/>
                <LocalizationProvider dateAdapter={DateAdapter}>
                    <DesktopDatePicker
                        label="Start Date"
                        inputFormat="MM/dd/yyyy"
                        required
                        value={startDate}
                        onChange={(newStartDate) => {setStartDate(newStartDate);}}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DesktopDatePicker
                        label="End Date"
                        inputFormat="MM/dd/yyyy"
                        required
                        value={endDate}
                        onChange={(newEndDate) => {setEndDate(newEndDate);}}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <Typography>Slot Length</Typography>
                <DurationPicker
                    onChange={(slotLen) => changeDuration}
                    initialDuration={{ hours: 0, minutes: 0, seconds: 0 }}
                    maxHours={24}
                />
                <FormControl fullWidth>
                    <InputLabel id="select-location">Location</InputLabel>
                    <Select labelId="select-location" value={location} label="Location" onChange={changeLocation}>
                        <MenuItem value={0}>Virtual</MenuItem>
                        <MenuItem value={1}>In-Person</MenuItem>
                    </Select>
                </FormControl>
                <TextField className="CreateEvent__item-content" placeholder="Description" name="event_desc" multiline rows={5} ref={descriptionRef}/>
                <Button className="CreateEvent_btn" type="submit" variant="contained">Create</Button>
                <Button className="CreateEvent_btn" type="button" variant="outlined">Cancel</Button>
            </form>
        </Grid>
    </Container>
  );
}