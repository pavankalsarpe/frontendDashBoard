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

export default function TopReviewedProductsChart({ rawData }) {
  const data = useMemo(() => {
    const normalized = normalizeSalesData(Array.isArray(rawData) ? rawData : rawData?.data ?? []);
    return normalized
      .filter((r) => r.reviewCount != null && r.reviewCount > 0)
      .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      .slice(0, 10)
      .map((r) => ({
        name: r.productName?.length > 20 ? r.productName.slice(0, 20) + '…' : r.productName,
        reviews: r.reviewCount,
      }));
  }, [rawData]);

  return (
    <Paper sx={{ p: 2, height: 320 }}>
      <Typography variant="h6" gutterBottom>
        Top Reviewed Products
      </Typography>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: 20, right: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-35} textAnchor="end" height={70} tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="reviews" fill="#2e7d32" name="Reviews" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
