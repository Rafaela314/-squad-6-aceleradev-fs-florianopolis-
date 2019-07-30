import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// const data = [
//   {
//     month: "JAN",
//     range: [68000, 21000],
//     mean: 22000
//   },
//   {
//     month: "FEV",
//     range: [58000, 23000],
//     mean: 27000
//   },
//   {
//     month: "MAR",
//     range: [72000, 22000],
//     mean: 29000
//   },
//   {
//     month: "ABR",
//     range: [71000, 20000],
//     mean: 23000
//   },
//   {
//     month: "MAI",
//     range: [82000, 20000],
//     mean: 29000
//   },
//   {
//     month: "JUN",
//     range: [79000, 22000],
//     mean: 25000
//   },
//   {
//     month: "JUL",
//     range: [86000, 22500],
//     mean: 22000
//   }
// ];

const RangeWage = props => {
  const stat = [];

  if (props.data) {
    for (let i = 0; i < props.data.length; i++) {
      stat.push({
        month: props.data[i].month,
        range: [props.data[i].maxSalProsp, props.data[i].minSalProsp],
        mean: props.data[i].medSalProsp
      });
    }
  }

  console.log("props", props);
  console.log(stat);

  return (
    <ComposedChart
      width={650}
      height={300}
      data={stat}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />

      <Bar dataKey="range" fill="#6bd2c9" />
      <Line dataKey="mean" stroke="#ff7300" />
    </ComposedChart>
  );
};

export default RangeWage;
