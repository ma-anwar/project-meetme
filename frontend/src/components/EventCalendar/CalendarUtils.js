import { fromUnixTime, getUnixTime } from 'date-fns';
export const handleSubUpdate = (prev, { subscriptionData }) => {
  const { type, slot } = subscriptionData.data.slotUpdated;

  if (type === 'CREATE') {
    return { getSlotsBetween: [...prev.getSlotsBetween, slot] };
  }

  const filtered = prev.getSlotsBetween.filter(
    (timeSlot) => timeSlot._id !== slot._id
  );

  if (type === 'UPDATE') {
    return { getSlotsBetween: [...filtered, slot] };
  }
  if (type === 'DELETE') {
    return { getSlotsBetween: [...filtered] };
  }
  return prev;
};

export const applyToEpoch = (fn, epochTime) => {
  const date = fromUnixTime(epochTime);
  const applied = fn(date);
  const epoch = getUnixTime(applied);
  return epoch.toString();
};
