import React from 'react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend,
} from 'recharts';


const data = [
  {
    name: 'Banco do Brasil', total: 1100000, client: 920000,
  },
  {
    name: 'Caixa', total: 920000, client: 820000,
  },
  {
    name: 'INSS',  total: 890000, client: 700000,
  },
  {
    name: 'RECEITA FEDERAL', total: 720000, client: 700000,
  },
  {
    name: 'STF', total: 620000, client: 590000,
  },
  {
    name: 'STJ', total: 520000, client: 450000,
  },
  {
    name: 'Instituto X', total: 420000, client: 210000,
  },
  {
    name: 'Procuradoria', total: 320000, client: 130000,
  },
  {
    name: 'Instituto Y', total: 205000, client: 83000,
  },
  {
    name: 'Inst z', total: 150000, client: 90000,
  },

];
const Top10RS = () => (
      <ComposedChart
        layout="vertical"
        width={500}
        height={600}
        data={data}
        margin={{
          top: 20, right: 20, bottom: 20, left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" barSize={30} fill="#a8eeff" />
        <Line dataKey="client" stroke="#ff7300" />
       
      </ComposedChart>
    );

export default Top10RS;