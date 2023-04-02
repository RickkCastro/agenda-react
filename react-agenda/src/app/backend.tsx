export interface ICalendar {
  id: number;
  name: string;
  color: string;
}

export interface IEditingEvent {
  id?: number;
  date: string;
  time?: string; //Campo opcional (?:)
  desc: string;
  calendarId: number;
}

export interface IEvent extends IEditingEvent {
  id: number;
}

const BASE_URL = 'http://localhost:8080';

export function getCalendarsEndPoint(): Promise<ICalendar[]> {
  return fetch(`${BASE_URL}/calendars`).then(resp => {
    return resp.json();
  });
}

export function getEventsEndPoint(from: string, to: string): Promise<IEvent[]> {
  return fetch(`${BASE_URL}/events?date_gte=${from}&date_lte${to}&_sort=date,time`).then(resp => {
    return resp.json();
  });
}

export function createEventEndPoint(event: IEditingEvent): Promise<IEvent> {
  return fetch(`${BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then(resp => {
    return resp.json();
  });
}

export function updateEventEndPoint(event: IEditingEvent): Promise<IEvent> {
  return fetch(`${BASE_URL}/events/${event.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then(resp => {
    return resp.json();
  });
}

export function deleteEventEndPoint(eventId: number): Promise<void> {
  return fetch(`${BASE_URL}/events/${eventId}`, {
    method: 'DELETE',
  }).then(resp => {
    return resp.json();
  });
}
