import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { ICalendar } from './backend';
import { ICalendarPageAction } from './calendarScreenReducer';

interface ICalendarViewProps {
  calendars: ICalendar[];
  dispatch: React.Dispatch<ICalendarPageAction>;
  calendarsSelected: boolean[];
}

export const CalendarsView = React.memo(function (props: ICalendarViewProps) {
  const { calendars, calendarsSelected } = props;

  return (
    <>
      <h3 className={'font-semibold text-lg mt-16 my-4'}>Agendas</h3>
      {calendars.map((calendar, i) => {
        return (
          <div key={calendar.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={calendarsSelected[i]}
                  onChange={() => props.dispatch({ type: 'toggleCalendar', payload: i })}
                  style={{ color: calendar.color }}
                />
              }
              label={calendar.name}
            />
          </div>
        );
      })}
    </>
  );
});
