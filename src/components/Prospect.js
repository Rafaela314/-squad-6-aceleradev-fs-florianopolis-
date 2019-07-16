import React from 'react';

const Prospect = ({prospect}) => {
    return(
        <tr key={prospect.id}>
            <td>{prospect.id}</td>
            <td>{prospect.name}</td>
            <td>{prospect.position}</td>
            <td>{prospect.salary}</td>
            <td>{prospect.isclient}</td>
        </tr>
        
    );
}

export default Prospect;