import React, { PureComponent } from 'react';
import {
  ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend,
} from 'recharts';


const data = [
  {
    name: 'Banco do Brasil', total: 590, cliente: 500,
  },
  {
    name: 'Caixa', total: 490, cliente: 400,
  },
  {
    name: 'INSS',  total: 390, cliente: 300,
  },
  {
    name: 'RECEITA FEDERAL', total: 370, cliente: 302,
  },
  {
    name: 'STF', total: 330, cliente: 303,
  },
  {
    name: 'STJ', total: 290, cliente: 200,
  },
  {
    name: 'Instituto X', total: 250, cliente: 30,
  },
  {
    name: 'Procuradoria', total: 220, cliente: 150,
  },
  {
    name: 'Instituto Y', total: 200, cliente: 140,
  },
  {
    name: 'Inst z', total: 190, cliente: 148,
  },

];
const Top10N = () => (
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
        
        <Bar dataKey="total" barSize={30} fill="#0099bf" />
        <Line dataKey="cliente" stroke="#ff7300" />
       
      </ComposedChart>
    );

export default Top10N;