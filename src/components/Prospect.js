import React from 'react';
import styled from "styled-components";

const Td = styled.td`
  border-bottom: 2px solid #ddd;;
    &:nth-child(even){ 
        background-color: #f2f2f2;;
    }
    &:hover {
        background-color: #ddd;
    }

`;

const Prospect = ({prospect}) => {
    return(
        <tr key={prospect.id}>
            <Td>{prospect.id}</Td>
            <Td>{prospect.name}</Td>
            <Td>{prospect.position}</Td>
            <Td>{prospect.salary}</Td>
            <Td>{prospect.isclient}</Td>
        </tr>
        
    );
}

export default Prospect;