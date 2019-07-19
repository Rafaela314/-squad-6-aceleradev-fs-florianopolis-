import React from "react";

const Row = (props, id) => {
  return (
    <tr>
      <td>{props.notification.name}</td>
      <td>{props.notification.email}</td>
      <td>{props.notification.type}</td>
      <td>{props.notification.time}</td>
      <td>{props.notification.date}</td>
    </tr>
  );
};

export default Row;
