import { Box, Button } from '@material-ui/core';
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  getCalendarsEndPoint,
  getEventsEndPoint,
  ICalendar,
  IEditingEvent,
  IEvent,
} from './backend';
import { useParams } from 'react-router-dom';
import { CalendarsView } from './CalendarsView';
import { CalendarHeader } from './CalendarHeader';
import { ICalendarCell, IEventWithCalendar, CalendarTable } from './CalendarTable';
import { EventFormDialog } from './EventFormDialog';
import { getToday } from './dateFunctions';

export default function CalendarPage() {
  const { month } = useParams<{ month: string }>();

  const [events, setEvents] = useState<IEvent[]>([]);
  const [calendars, setCalendars] = useState<ICalendar[]>([]);
  const [calendarsSelected, setCalendarsSelected] = useState<boolean[]>([]);

  const [editingEvent, setEditingEvent] = useState<IEditingEvent | null>(null);

  const weeks = useMemo(() => {
    return generateCalendar(month + '-01', events, calendars, calendarsSelected);
  }, [month, calendars, events, calendarsSelected]);

  const firsDate = weeks[0][0].date;
  const lastDate = weeks[weeks.length - 1][6].date;

  useEffect(() => {
    Promise.all([getCalendarsEndPoint(), getEventsEndPoint(firsDate, lastDate)]).then(
      ([calendars, events]) => {
        setEvents(events);
        setCalendarsSelected(calendars.map(() => true));
        setCalendars(calendars);
      }
    );
  }, [firsDate, lastDate]);

  function refreshEvents() {
    getEventsEndPoint(firsDate, lastDate).then(setEvents);
  }

  const toggleCalendar = useCallback(
    (i: number) => {
      const newValue = [...calendarsSelected];
      newValue[i] = !newValue[i];
      setCalendarsSelected(newValue);
    },
    [calendarsSelected]
  );

  const handlenOpenNewEvent = useCallback(
    (date: string) => {
      setEditingEvent({
        date,
        desc: '',
        calendarId: calendars[0].id,
      });
    },
    [calendars]
  );

  const handleUpdateEvent = useCallback((event: IEvent) => {
    setEditingEvent(event);
  }, []);

  return (
    <Box display="flex" height={'100%'} alignItems="stretch">
      <Box className="border-r px-4 py-2 w-64">
        <h2 className="font-semibold text-2xl my-4">Agenda React</h2>
        <Button variant="contained" color="primary" onClick={() => handlenOpenNewEvent(getToday())}>
          Novo evento
        </Button>
        <CalendarsView
          calendars={calendars}
          toggleCalendar={toggleCalendar}
          calendarsSelected={calendarsSelected}
        />
      </Box>

      <Box className="flex flex-1 flex-col">
        <CalendarHeader month={month} />

        <CalendarTable
          weeks={weeks}
          onClickDay={handlenOpenNewEvent}
          onClickEvent={handleUpdateEvent}
        />

        <EventFormDialog
          event={editingEvent}
          onCancel={() => setEditingEvent(null)}
          calendars={calendars}
          onSave={() => {
            setEditingEvent(null);
            refreshEvents();
          }}
        />
      </Box>
    </Box>
  );
}

function generateCalendar(
  date: string,
  allEvents: IEvent[],
  calendars: ICalendar[],
  calendarsSelected: boolean[]
): ICalendarCell[][] {
  console.log('generating calendar');
  const weeks: ICalendarCell[][] = [];
  const jsDate = new Date(date + 'T12:00:00');
  const currentMonth = jsDate.getMonth();

  const currentDay = new Date(jsDate.valueOf());

  currentDay.setDate(1);

  const dayOfWeek = currentDay.getDay();

  currentDay.setDate(1 - dayOfWeek);

  do {
    const week: ICalendarCell[] = [];

    for (let i = 0; i < 7; i++) {
      const monthStr = (currentDay.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = currentDay.getDate().toString().padStart(2, '0');

      const isoDate = `${currentDay.getFullYear()}-${monthStr}-${dayStr}`;

      const events: IEventWithCalendar[] = [];
      for (const event of allEvents) {
        if (event.date === isoDate) {
          const calIndex = calendars.findIndex(cal => cal.id === event.calendarId);
          if (calendarsSelected[calIndex]) {
            events.push({ ...event, calendar: calendars[calIndex] });
          }
        }
      }

      week.push({
        dayOfMonth: currentDay.getDate(),
        date: isoDate,
        events,
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }

    weeks.push(week);
  } while (currentDay.getMonth() === currentMonth);

  return weeks;
}
