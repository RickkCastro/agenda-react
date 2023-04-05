import { useContext, useState } from 'react';
import { Icon, IconButton, Avatar, Menu, MenuItem } from '@material-ui/core';
import { singOutEndPoint } from './backend';
import { authContext } from './authContext';

export default function UserMenu() {
  const { user, onSingOut } = useContext(authContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function singOut() {
    singOutEndPoint();
    onSingOut();
  }

  return (
    <div>
      <IconButton
        aria-label="perfil"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar>
          <Icon>person</Icon>
        </Avatar>
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <div className="p-4 text-center border-b flex justify-center items-center flex-col">
          <Avatar className="m-2">
            <Icon>person</Icon>
          </Avatar>
          <p>{user.name}</p>
          <small>{user.email}</small>
        </div>

        <MenuItem onClick={singOut}>Sair</MenuItem>
      </Menu>
    </div>
  );
}
