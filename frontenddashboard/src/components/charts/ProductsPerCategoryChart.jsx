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

export default function ProductsPerCategoryChart({ rawData }) {
  const data = useMemo(() => {
    const normalized = normalizeSalesData(Array.isArray(rawData) ? rawData : rawData?.data ?? []);
    const byCategory = {};
    normalized.forEach((r) => {
      const cat = r.category || 'Unknown';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });
    return Object.entries(byCategory)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [rawData]);

  return (
    <Paper sx={{ p: 2, height: 320 }}>
      <Typography variant="h6" gutterBottom>
        Products per Category
      </Typography>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ left: 80, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#1976d2" name="Products" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
