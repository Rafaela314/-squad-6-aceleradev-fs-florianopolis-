import React from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  {
    month: "JAN",
    total: 4000,
    clients: 2400,
    prospects: 1600
  },
  {
    month: "FEV",
    total: 4000,
    clients: 2000,
    prospects: 2000
  },
  {
    month: "MAR",
    total: 4000,
    clients: 1800,
    prospects: 200
  },
  {
    month: "ABR",
    total: 5000,
    clients: 2000,
    prospects: 3000
  },
  {
    month: "MAI",
    total: 7000,
    clients: 2400,
    prospects: 4600
  },
  {
    month: "JUN",
    total: 9000,
    clients: 4400,
    prospects: 4600
  },
  {
    month: "JUL",
    total: 3000,
    clients: 1000,
    prospects: 2000
  }
];


const AreaDataRS = () => (
  <div style={{padding:'10px'}}>
    <AreaChart
      width={500}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="1 1" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend verticalAlign='top' align='right'
      iconType='circle'iconSize='10' height='25' />
       <Area name='Total 20K+(R$)' dataKey='total' stackId='1' stroke='#a8eeff' fill='#a8eeff' />
       <Area name='Clients' dataKey='clients' stackId='1' stroke='#00ccff' fill='#00ccff' />
       <Area name='Prospects' dataKey='prospects' stackId='1' stroke='#0099bf' fill='#0099bf' />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </AreaChart>
  </div>
);

export default AreaDataRS;
