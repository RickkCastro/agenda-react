import { Icon, IconButton, Box, Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { addMonths, formatMonth } from './dateFunctions';

interface ICalendarHeaderProps {
  month: string;
}

export default function CalendarHeader(props: ICalendarHeaderProps) {
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

      <IconButton aria-label="perfil">
        <Avatar>
          <Icon>person</Icon>
        </Avatar>
      </IconButton>
    </Box>
  );
}
