import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { ICalendar } from './backend';

interface ICalendarViewProps {
  calendars: ICalendar[];
  toggleCalendar: (i: number) => void;
  calendarsSelected: boolean[];
}

export const CalendarsView = React.memo(function (props: ICalendarViewProps) {
  const { calendars, calendarsSelected, toggleCalendar } = props;

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
                  onChange={() => toggleCalendar(i)}
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
