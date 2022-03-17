import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import NavigationBar from './NavigationBar';
import { CREATE_EVENT } from '../../graphql/mutations';
import { GET_ME } from '../../graphql/queries';
import { useMutation } from '@apollo/client';
import { pick } from 'lodash';
import { useNavigate } from 'react-router-dom';

//TODO: Implement better validation, error states, disable continue until error resolution
export default function CreateEvent() {
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    dateRange: [new Date(), new Date()],
    location: '',
    timeslotLength: 30,
  });
  const [formStep, setFormStep] = useState(0);
  const navigate = useNavigate();
  const [createEvent, { data, loading, error }] = useMutation(CREATE_EVENT, {
    refetchQueries: [GET_ME],
    onCompleted: ({ createEvent }) => {
      navigate(`/cal/${createEvent._id}`);
    },
  });

  // Leaving these in for debug as we're building
  useEffect(() => {
    console.log(data);
    console.log(error);
  }, [data, error]);

  const isValid = () => {
    return (
      newEvent.title.length &&
      newEvent.description &&
      newEvent.location &&
      newEvent.timeslotLength
    );
  };

  const getCreateEventInput = () => {
    const CreateEventInput = pick(newEvent, [
      'title',
      'description',
      'timeslotLength',
      'location',
    ]);
    CreateEventInput.timeslotLength = parseInt(CreateEventInput.timeslotLength);
    CreateEventInput.startDate = newEvent.dateRange[0];
    CreateEventInput.endDate = newEvent.dateRange[1];
    return CreateEventInput;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedEvent = { ...newEvent };
    updatedEvent[name] = value;
    setNewEvent(updatedEvent);
  };

  const submit = (e) => {
    e.preventDefault();
    createEvent({ variables: { input: getCreateEventInput() } });
  };

  return (
    <form onSubmit={submit}>
      <Box display="flex" flexDirection="column" alignItems="center" m={4}>
        <Step0
          formStep={formStep}
          newEvent={newEvent}
          handleChange={handleChange}
        />
        <Step1
          formStep={formStep}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
        />
        <Step2
          formStep={formStep}
          newEvent={newEvent}
          handleChange={handleChange}
        />
        <NavigationBar
          formStep={formStep}
          setFormStep={setFormStep}
          isValid={isValid}
        />
      </Box>
    </form>
  );
}
