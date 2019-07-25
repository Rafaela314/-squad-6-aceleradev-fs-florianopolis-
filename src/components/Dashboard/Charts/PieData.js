import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell } from "recharts";
import styled from "styled-components";

const data = [
  { name: "Total", value: 400 },
  { name: "Clients", value: 100 }
];

const COLORS = ["#0099bf", "#a8eeff", "#00ccff", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Wrapper = styled.div`
  display: inline;
`;

const PieData = () => (
  <Wrapper>
    <div
      className="recharts-wrapper"
      position={"relative"}
      width={400}
      height={400}
    >
      <PieChart width={400} height={400} display={"inline"}>
        <Pie
          data={data}
          cx={150}
          cy={150}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  </Wrapper>
);

export default PieData;
