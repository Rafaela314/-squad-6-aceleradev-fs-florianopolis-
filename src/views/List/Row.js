import React from "react";

const Row = (props, id) => {
  console.log(props);

  return (
    <tr>
      <td>{props.props.name}</td>
      <td>{props.props.email}</td>
      <td>{props.id}</td>
      <td>icon</td>
    </tr>
  );
};

export default Row;
