import React from "react";

const Row = (props, id) => {
  return (
    <tr>
      <td>{props.user.name}</td>
      <td>{props.user.email}</td>
      <td>{props.user.position}</td>
      <td>{props.id}</td>
    </tr>
  );
};

export default Row;
