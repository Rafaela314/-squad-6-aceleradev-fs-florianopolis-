import React from "react";

const Row = (props, id) => {
  return (
    <tr>
      <td>{props.client.name}</td>
      <td>{props.id}</td>
    </tr>
  );
};

export default Row;
