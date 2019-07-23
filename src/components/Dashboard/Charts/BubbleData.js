import React, { PureComponent } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip,
  Legend,
} from 'recharts';


const data01 = [
    { place: 'Receita Federal', index: 1, value: 17 },
    { place: 'INSS', index: 1, value: 20 },
    { place: 'STF', index: 1, value: 15 },
    { place: 'COAF', index: 1, value: 49 },
    { place: 'BB', index: 1, value: 37 },
    { place: 'CAIXA', index: 1, value: 28 },
    
  ];

  const parseDomain = () => [
    0,
    Math.max(
      Math.max.apply(null, data01.map(entry => entry.value)),
    ),
  ];
  
  export default class BubbleData extends PureComponent {
  
    renderTooltip = (props) => {
      const { active, payload } = props;
  
      if (active && payload && payload.length) {
        const data = payload[0] && payload[0].payload;
  
        return (
          <div style={{
            backgroundColor: '#fff', border: '1px solid #999', margin: 0, padding: 10,
          }}
          >
            <p>{data.place}</p>
            <p>
              <span>value: </span>
              {data.value}
            </p>
          </div>
        );
      }
  
      return null;
    }
  
    render() {
      const domain = parseDomain();
      const range = [16, 225];
  
      return (
        <div>
          <ScatterChart
            width={800}
            height={60}
            margin={{
              top: 10, right: 0, bottom: 0, left: 0,
            }}
          >
            <XAxis type="category" dataKey="place" interval={0} tick={{ fontSize: 0 }} tickLine={{ transform: 'translate(0, -6)' }} />
            <YAxis type="number" dataKey="index" name="sunday" height={10} width={80} tick={false} tickLine={false} axisLine={false} label={{ value: 'Sunday', position: 'insideRight' }} />
            <ZAxis type="number" dataKey="value" domain={domain} range={range} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
            <Scatter data={data01} fill="#8884d8" />
          </ScatterChart>
        </div>
      );
    }
  }
  
 