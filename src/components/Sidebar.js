import React from "react";
// import { slide as Menu } from 'react-burger-menu';

export default props => {
  return (
    // <Menu>
    <div>
      <a className="menu-item" href="/dashboard">
        Dashboard
      </a>
      <a className="menu-item" href="/register">
        Register
      </a>
      <a className="menu-item" href="/upload">
        Upload
      </a>
      <a className="menu-item" href="/notifications">
        Notifications
      </a>
    </div>

    // </Menu>
  );
};
