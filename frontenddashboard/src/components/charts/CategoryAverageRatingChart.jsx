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
} from 'recharts';
import { useMemo } from 'react';
import { normalizeSalesData } from '../../utils/dataNormalizer';

export default function CategoryAverageRatingChart({ rawData }) {
  const data = useMemo(() => {
    const normalized = normalizeSalesData(Array.isArray(rawData) ? rawData : rawData?.data ?? []);
    const byCategory = {};
    normalized.forEach((r) => {
      const cat = r.category || 'Unknown';
      if (r.rating != null && !Number.isNaN(r.rating)) {
        if (!byCategory[cat]) byCategory[cat] = { sum: 0, count: 0 };
        byCategory[cat].sum += r.rating;
        byCategory[cat].count += 1;
      }
    });
    return Object.entries(byCategory)
      .map(([name, { sum, count }]) => ({ name, avgRating: count ? (sum / count).toFixed(2) : 0 }))
      .map((r) => ({ ...r, avgRating: parseFloat(r.avgRating) }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 12);
  }, [rawData]);

  return (
    <Paper sx={{ p: 2, height: 320 }}>
      <Typography variant="h6" gutterBottom>
        Category-wise Average Rating
      </Typography>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: 20, right: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-35} textAnchor="end" height={70} tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Bar dataKey="avgRating" fill="#ed6c02" name="Avg Rating" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
