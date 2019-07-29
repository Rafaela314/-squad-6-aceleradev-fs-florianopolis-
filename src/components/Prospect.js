import React from "react";
import styled from "styled-components";

const Td = styled.td`
  border-bottom: 2px solid #ddd;
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  &:hover {
    background-color: #ddd;
  }
`;

const Prospect = ({ prospect }) => {
  return (
    <tr key={prospect.id_lote}>
      <Td>{prospect.name}</Td>
      <Td>{prospect.position}</Td>
      <Td>{prospect.place}</Td>
      <Td>{prospect.salary}</Td>
    </tr>
  );
};

export default Prospect;
