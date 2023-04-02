import React, { useState, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Select, FormControl, InputLabel, MenuItem, Box } from '@material-ui/core';
import {
  createEventEndPoint,
  deleteEventEndPoint,
  ICalendar,
  IEditingEvent,
  updateEventEndPoint,
} from './backend';

interface IEventFormDialogProps {
  event: IEditingEvent | null;
  calendars: ICalendar[];
  onCancel: () => void;
  onSave: () => void;
}

interface IValidationsError {
  [field: string]: string;
}

export function EventFormDialog(props: IEventFormDialogProps) {
  const [event, setEvent] = useState<IEditingEvent | null>(props.event);
  const [errors, setErrors] = useState<IValidationsError>({});

  const inputDate = useRef<HTMLInputElement | null>();
  const inputDesc = useRef<HTMLInputElement | null>();

  useEffect(() => {
    setEvent(props.event);
    setErrors({});
  }, [props.event]);

  const isNewEvent = !event?.id;

  function validateForm(): boolean {
    if (event) {
      const currentErrors: IValidationsError = {};

      if (!event.date) {
        currentErrors['date'] = 'A data deve ser preenchida';
        inputDate.current?.focus();
      }
      if (!event.desc) {
        currentErrors['desc'] = 'A descrição deve ser preenchida';
        inputDesc.current?.focus();
      }

      setErrors(currentErrors);
      return Object.keys(currentErrors).length === 0;
    }

    return false;
  }

  function handleSaveEvent(evt: React.FormEvent) {
    evt.preventDefault();
    if (event) {
      if (validateForm()) {
        if (isNewEvent) {
          createEventEndPoint(event).then(props.onSave);
        } else {
          updateEventEndPoint(event).then(props.onSave);
        }
      }
    }
  }

  function handleDeleteEvent() {
    if (event) {
      deleteEventEndPoint(event.id!).then(props.onSave);
    }
  }

  return (
    <div>
      <Dialog open={!!event} onClose={props.onCancel} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSaveEvent}>
          <DialogTitle id="form-dialog-title">
            {isNewEvent ? 'Criar Evento' : 'Editar Evento'}
          </DialogTitle>
          <DialogContent>
            {event && (
              <>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                  type="date"
                  margin="normal"
                  label="Data"
                  fullWidth
                  value={event.date}
                  onChange={evt => setEvent({ ...event, date: evt.target.value })}
                  error={!!errors.date}
                  helperText={errors.date}
                  inputRef={inputDate}
                />

                <TextField
                  autoFocus
                  margin="normal"
                  label="Descrição"
                  fullWidth
                  value={event.desc}
                  onChange={evt => setEvent({ ...event, desc: evt.target.value })}
                  error={!!errors.desc}
                  helperText={errors.desc}
                  inputRef={inputDesc}
                />

                <TextField
                  type="time"
                  margin="normal"
                  label="Hora (opcinal)"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={event.time ?? ''}
                  onChange={evt => setEvent({ ...event, time: evt.target.value })}
                />

                <FormControl margin="normal" fullWidth>
                  <InputLabel id="select-calendar">Agenda</InputLabel>

                  <Select
                    labelId="select-calendar"
                    value={event.calendarId}
                    onChange={evt => setEvent({ ...event, calendarId: evt.target.value as number })}
                  >
                    {props.calendars.map(calendar => (
                      <MenuItem value={calendar.id} key={calendar.id}>
                        {calendar.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </DialogContent>

          <DialogActions>
            {!isNewEvent && (
              <Button color="primary" type="button" onClick={handleDeleteEvent}>
                Excluir
              </Button>
            )}
            <Box flex={1}></Box>
            <Button onClick={props.onCancel} type="button">
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
