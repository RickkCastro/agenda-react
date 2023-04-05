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

export interface IUser {
  name: string;
  email: string;
}

export interface IEvent extends IEditingEvent {
  id: number;
}

const BASE_URL = 'http://localhost:8080';

export function getCalendarsEndPoint(): Promise<ICalendar[]> {
  return fetch(`${BASE_URL}/calendars`, { credentials: 'include' }).then(handleResponse);
}

export function getEventsEndPoint(from: string, to: string): Promise<IEvent[]> {
  return fetch(`${BASE_URL}/events?date_gte=${from}&date_lte${to}&_sort=date,time`, {
    credentials: 'include',
  }).then(handleResponse);
}

export function createEventEndPoint(event: IEditingEvent): Promise<IEvent> {
  return fetch(`${BASE_URL}/events`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then(handleResponse);
}

export function updateEventEndPoint(event: IEditingEvent): Promise<IEvent> {
  return fetch(`${BASE_URL}/events/${event.id}`, {
    credentials: 'include',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then(handleResponse);
}

export function deleteEventEndPoint(eventId: number): Promise<void> {
  return fetch(`${BASE_URL}/events/${eventId}`, {
    credentials: 'include',
    method: 'DELETE',
  }).then(handleResponse);
}

export function getUserEndPoint(): Promise<IUser> {
  return fetch(`${BASE_URL}/auth/user`, {
    credentials: 'include',
  }).then(handleResponse);
}

export function singInEndPoint(email: string, password: string): Promise<IUser> {
  return fetch(`${BASE_URL}/auth/login`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
}

export function singOutEndPoint(): Promise<IUser> {
  return fetch(`${BASE_URL}/auth/logout`, {
    credentials: 'include',
    method: 'POST',
  }).then(handleResponse);
}

function handleResponse(resp: Response) {
  if (resp.ok) {
    return resp.json();
  } else {
    throw new Error(resp.statusText);
  }
}
