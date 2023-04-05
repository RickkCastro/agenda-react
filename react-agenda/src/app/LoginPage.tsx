import { Button, Container, TextField } from '@material-ui/core';
import { useState } from 'react';
import { IUser, singInEndPoint } from './backend';

interface ILoginPageProps {
  onSingIn: (user: IUser) => void;
}

export default function LoginPage(props: ILoginPageProps) {
  const [email, setEmail] = useState('teste@email.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');

  function singIn(evt: React.FormEvent) {
    evt.preventDefault();
    singInEndPoint(email, password).then(props.onSingIn, () => {
      setError('Email não encontrado ou senha incorreta');
    });
  }

  return (
    <Container maxWidth="sm">
      <h1 className="text-3xl font-semibold my-4">Agenda React</h1>
      <p>
        Digite e-mail e senha para entrar no sistea. Para testar, use e-mail{' '}
        <kbd>danilo@email.com</kbd> e senha <kbd>1234</kbd>
      </p>
      <form onSubmit={singIn}>
        <TextField
          margin="normal"
          label="E-mail"
          fullWidth
          variant="outlined"
          value={email}
          onChange={evt => setEmail(evt.target.value)}
        />
        <TextField
          margin="normal"
          label="Senha"
          fullWidth
          type="password"
          variant="outlined"
          value={password}
          onChange={evt => setPassword(evt.target.value)}
        />
        {error && (
          <div className="flex justify-center bg-red-200 text-red-500 mb-2 p-1 rounded-md">
            {error}
          </div>
        )}
        <Button color="primary" variant="contained" fullWidth type="submit">
          Entrar
        </Button>
      </form>
    </Container>
  );
}
