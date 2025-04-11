import { useState } from "react";
import { Meeting } from "../types";

export const initialMeetings: Meeting[] = [
  {
    id: 1,
    title: "Backend Architecture Discussion",
    date: "2023-06-15",
    startTime: "10:00",
    endTime: "11:30",
    timezone: "EDT",
    partnerTimezone: "CEST",
    languages: ["JavaScript", "Python"],
    levels: ["Advanced", "Intermediate"],
    partnerId: 1,
    partnerName: "Miguel Rodriguez"
  },
  {
    id: 2,
    title: "Microservices Implementation Review",
    date: "2023-06-18",
    startTime: "18:00",
    endTime: "19:30",
    timezone: "EDT",
    partnerTimezone: "JST",
    languages: ["Go", "Rust", "TypeScript"],
    levels: ["Advanced", "Expert"],
    partnerId: 2,
    partnerName: "Yuki Tanaka"
  },
  {
    id: 3,
    title: "Scalability Solutions Workshop",
    date: "2023-06-20",
    startTime: "14:00",
    endTime: "16:00",
    timezone: "EDT",
    partnerTimezone: "CET",
    languages: ["Java", "Kotlin"],
    levels: ["Intermediate", "Advanced"],
    partnerId: 3,
    partnerName: "Marie Dubois"
  }
];

export default function useMeetings() {
  const [meetings] = useState<Meeting[]>(initialMeetings);
  
  return {
    meetings
  };
}