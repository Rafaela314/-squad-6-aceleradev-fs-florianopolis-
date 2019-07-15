import React from 'react';
import { slide as Menu } from 'react-burger-menu';

export default props => {
  return (
    <Menu>
      <a className="menu-item" href="/">
       Dashboard
      </a>
      <a className="menu-item" href="/laravel">
        Table
      </a>
      <a className="menu-item" href="/angular">
        Users
      </a>
      <a className="menu-item" href="/react">
        Notifications
      </a>
    </Menu>
  );
};