import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enCA from 'date-fns/locale/en-CA';
import format from 'date-fns/format';
import add from 'date-fns/add';

export default function OwnerCalendar({ slots, setSlots }) {
  const handleSelect = ({ start, end }) => {
    const slotLength = 30; //TODO, change to retrieve from BE

    let startTime = start;
    let endTime = end;
    const newSlots = [];

    while (startTime < endTime) {
      const finTime = add(startTime, { minutes: slotLength });
      //keys needed to match, {startTime}==={startTime:startTime} is true
      const newSlot = { title: 'Empty slot', start: startTime, end: finTime };
      newSlots.push(newSlot);
      startTime = finTime;
    }
    //setState causes a rerender of component so call it after the loop to avoid unnecessary rerenders
    setSlots([...slots, ...newSlots]);
  };

  const locales = {
    'en-CA': enCA,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  return (
    <Calendar
      localizer={localizer}
      events={slots}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      //Does sx prop even exist for this component? It's not an MUI component?
      sx={{ margin: 2 }}
      selectable
      onSelectSlot={handleSelect}
    />
  );
}
