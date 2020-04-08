import * as vscode from 'vscode';

export type Schedule = {
  hour: number;
  minute: number;
  showMessage: string;
  notified: boolean;
};

type configScheduleStyle = string[];

export const getSchedules = (
  config: vscode.WorkspaceConfiguration
): Schedule[] => {
  const schedules = config.get<configScheduleStyle>("schedules");
  if (!schedules) {
    return [makeSchedule("18:00")];
  }
  const validated = schedules.filter((item) => validateTime(item));
  return validated.map(makeSchedule);
};

export const isTimePassed = (schedule: Schedule, now: Date) => {
  return now.getTime() >= toTime(schedule);
};

const toTime = (schedule: Schedule, now?: Date) => {
  const targetDate = now || new Date();
  targetDate.setHours(schedule.hour);
  targetDate.setMinutes(schedule.minute);
  return targetDate.getTime();
};

const makeSchedule = (time: string) => {
  const [hour, minute] = time.split(":");
  return {
    hour: parseInt(hour),
    minute: parseInt(minute),
    showMessage: "It's Time!",
    notified: false,
  };
};

const validateTime = (time: string): boolean => {
  const pattern = /^\d{1,2}:\d{1,2}$/;
  // format invalid
  if (!pattern.test(time)) {
    return false;
  }
  const [hour, minute] = time.split(":");
  // time invalid
  if (parseInt(hour) > 23 || parseInt(minute) > 59) {
    return false;
  }
  return true;
};
