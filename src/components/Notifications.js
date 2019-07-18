import React from "react";
import styled from "styled-components";

const Notifications = () => (
  <div className="container">
    <h1>Notifications</h1>
    <table>
      <tr>
        <th>nome</th>
        <th>email</th>
        <th>type</th>
        <th>hora</th>
        <th>data</th>
      </tr>
      <tr>
        <td>Peter</td>
        <td>Griffin@gmail.com</td>
        <td>email</td>
        <td>12:30</td>
        <td>12/01/2019</td>
      </tr>
      <tr>
        <td>Louis</td>
        <td>Louis@gmail.com</td>
        <td>email</td>
        <td>12:30</td>
        <td>12/01/2019</td>
      </tr>
      <tr>
        <td>Anna</td>
        <td>Banana@gmail.com</td>
        <td>email</td>
        <td>12:30</td>
        <td>12/01/2019</td>
      </tr>
      <tr>
        <td>Joana</td>
        <td>lima@gmail.com</td>
        <td>email</td>
        <td>12:30</td>
        <td>12/01/2019</td>
      </tr>
    </table>
  </div>
);

export default Notifications;
