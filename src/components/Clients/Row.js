import React from "react";

const Row = (props, id) => {
  return (
    <tr>
      <td>{props.client.name}</td>
      <td>{props.client.place}</td>
      <td>{props.client.position}</td>
      <td>{props.client.salary}</td>
      <td>{props.client.id}</td>
      {/* <td>{props.id}</td> */}
    </tr>
  );
};

export default Row;
