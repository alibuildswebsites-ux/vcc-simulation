import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SimulationState } from '../types/api';

export const LoadChart = ({ state }: { state: SimulationState | null }) => {
  const history = state?.load_history ?? [];
  const preds = state?.prediction ?? [];
  const sliced = history.slice(-60);
  const predOffset = sliced.length - preds.length;
  const data = sliced.map(([timestamp, load], index) => ({
    index,
    time: new Date(timestamp).toLocaleTimeString(),
    load,
    prediction: index >= predOffset && index < sliced.length ? preds[index - predOffset] : null,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white tracking-tight">Load Forecast</h3>
        <p className="text-xs text-[#525252] mt-0.5">Actual users vs predicted demand</p>
      </div>
      <div className="h-72 rounded-xl border border-[#1e1e1e] bg-[#0f0f0f] p-4">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -18, right: 8, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="index" tick={{ fill: '#525252', fontSize: 10, fontFamily: 'Geist Mono, monospace' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#525252', fontSize: 10, fontFamily: 'Geist Mono, monospace' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#111111', border: '1px solid #222222', borderRadius: 8 }} labelStyle={{ color: '#737373' }} />
              <Area type="monotone" dataKey="load" stroke="#ffffff" strokeWidth={2} fill="url(#loadGrad)" />
              <Area type="monotone" dataKey="prediction" stroke="#737373" strokeWidth={1.5} fill="transparent" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-[#525252]">Waiting for simulation data.</div>
        )}
      </div>
    </div>
  );
};

export default LoadChart;
