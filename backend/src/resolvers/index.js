import { merge } from "lodash";
import userResolvers from "./user";
import eventResolvers from "./event";
import timeslotResolvers from "./timeslot";

export default merge(userResolvers, eventResolvers, timeslotResolvers);
