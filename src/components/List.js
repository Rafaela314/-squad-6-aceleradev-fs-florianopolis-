import React from "react";
import styled from "styled-components";

const Notifications = () => (
  <div className="container">
    <h1>Notifications</h1>
    <table>
      <tr>
        <th>nome</th>
        <th>email</th>
        <th>ID</th>
        <th>DELETE</th>
      </tr>
      <tr>
        <td>Peter</td>
        <td>Griffin@gmail.com</td>
        <td>1</td>
        <td>icon</td>
      </tr>
      <tr>
        <td>Louis</td>
        <td>Louis@gmail.com</td>
        <td>2</td>
        <td>icon</td>
      </tr>
      <tr>
        <td>Anna</td>
        <td>Banana@gmail.com</td>
        <td>3</td>
        <td>icon</td>
      </tr>
      <tr>
        <td>Joana</td>
        <td>lima@gmail.com</td>
        <td>4</td>
        <td>icon</td>
      </tr>
    </table>
  </div>
);

export default Notifications;
