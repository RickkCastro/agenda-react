import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Icon } from '@material-ui/core';
import { ICalendar, IEvent } from './backend';
import { getToday } from './dateFunctions';
import { ICalendarPageAction } from './calendarScreenReducer';

const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

const useStyles = makeStyles({
  table: {
    borderTop: '1px solid rgb(224, 224, 224)',
    minHeight: '100%',
    tableLayout: 'fixed',
    '& td ~ td, & th ~ th': {
      borderLeft: '1px solid rgb(224, 224, 224)',
    },
    '& td': {
      verticalAlign: 'top',
      overflow: 'hidden',
      padding: '8px ',
    },
  },
});

export type IEventWithCalendar = IEvent & { calendar: ICalendar };

export interface ICalendarCell {
  date: string;
  dayOfMonth: number;
  events: IEventWithCalendar[];
}

interface ICalendarTableProps {
  weeks: ICalendarCell[][];
  dispatch: React.Dispatch<ICalendarPageAction>;
}

export const CalendarTable = React.memo(function (props: ICalendarTableProps) {
  const { weeks } = props;
  const classes = useStyles();

  function handleClick(evt: React.MouseEvent, date: string) {
    if (evt.target === evt.currentTarget) {
      props.dispatch({ type: 'new', payload: date });
    }
  }

  return (
    <TableContainer component={'div'} className="flex-1">
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {DAYS_OF_WEEK.map(day => {
              return (
                <TableCell align="center" key={day}>
                  {day}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {weeks.map((week, i) => (
            <TableRow key={i}>
              {week.map(cell => {
                return (
                  <TableCell
                    align="center"
                    key={cell.date}
                    onClick={me => handleClick(me, cell.date)}
                  >
                    <div
                      className={`font-semibold mb-1 ${
                        cell.date === getToday() &&
                        'bg-blue-500 text-white rounded-lg inline-block p-1 w-6 h-6'
                      }`}
                    >
                      {cell.dayOfMonth}
                    </div>
                    {cell.events.map(event => {
                      const color = event.calendar ? event.calendar.color : '#000';

                      return (
                        <button
                          key={event.id}
                          className="cursor-pointer text-left w-full my-1 whitespace-nowrap"
                          onClick={() => props.dispatch({ type: 'edit', payload: event })}
                        >
                          {event.time ? (
                            <div className="flex items-center space-x-1">
                              <Icon fontSize="inherit" style={{ color }}>
                                watch_later
                              </Icon>{' '}
                              <span>{event.time}</span>
                              <span>{event.desc}</span>
                            </div>
                          ) : (
                            <div
                              style={{ backgroundColor: color }}
                              className={`text-white p-1 rounded-md`}
                            >
                              {event.desc}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});
