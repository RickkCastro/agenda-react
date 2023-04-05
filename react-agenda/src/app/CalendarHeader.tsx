import { Icon, IconButton, Box } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { addMonths, formatMonth } from './dateFunctions';
import UserMenu from './UserMenu';

interface ICalendarHeaderProps {
  month: string;
}

export const CalendarHeader = React.memo(function (props: ICalendarHeaderProps) {
  const { month } = props;

  return (
    <Box className="flex items-center p-2">
      <Box className="flex-1">
        <IconButton
          aria-label="Mês anterios"
          component={Link}
          to={'/calendar/' + addMonths(month, -1)}
        >
          <Icon>chevron_left</Icon>
        </IconButton>
        <IconButton
          aria-label="Proxímo mês"
          component={Link}
          to={'/calendar/' + addMonths(month, +1)}
        >
          <Icon>chevron_right</Icon>
        </IconButton>
        <strong className="mr-4 text-md">{formatMonth(month)}</strong>
      </Box>

      <UserMenu />
    </Box>
  );
});
