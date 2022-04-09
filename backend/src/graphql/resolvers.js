import { merge } from "lodash";
import userResolvers from "../user/userResolvers";
import eventResolvers from "../event/eventResolvers";
import timeslotResolvers from "../timeslot/timeslotResolvers";

export default merge(userResolvers, eventResolvers, timeslotResolvers);
