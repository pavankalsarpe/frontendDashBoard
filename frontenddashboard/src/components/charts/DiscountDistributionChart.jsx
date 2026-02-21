import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useMemo } from 'react';
import { normalizeSalesData } from '../../utils/dataNormalizer';

const BUCKET_SIZE = 10;
const COLORS = ['#0288d1', '#039be5', '#03a9f4', '#29b6f6', '#4fc3f7', '#81d4fa', '#b3e5fc'];

export default function DiscountDistributionChart({ rawData }) {
  const data = useMemo(() => {
    const normalized = normalizeSalesData(Array.isArray(rawData) ? rawData : rawData?.data ?? []);
    const discounts = normalized
      .map((r) => r.discount)
      .filter((d) => d != null && !Number.isNaN(d));
    const buckets = {};
    discounts.forEach((d) => {
      const bucket = Math.min(Math.floor(d / BUCKET_SIZE) * BUCKET_SIZE, 60);
      const key = `${bucket}-${bucket + BUCKET_SIZE}`;
      buckets[key] = (buckets[key] || 0) + 1;
    });
    return Object.entries(buckets)
      .map(([range, count]) => ({
        range,
        count,
        min: parseInt(range.split('-')[0], 10),
      }))
      .sort((a, b) => a.min - b.min);
  }, [rawData]);

  return (
    <Paper sx={{ p: 2, height: 320 }}>
      <Typography variant="h6" gutterBottom>
        Discount Distribution (%)
      </Typography>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" label={{ value: 'Discount %', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
