import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useGetSalesQuery } from '../store/salesApi';
import ProductsPerCategoryChart from './charts/ProductsPerCategoryChart';
import TopReviewedProductsChart from './charts/TopReviewedProductsChart';
import DiscountDistributionChart from './charts/DiscountDistributionChart';
import CategoryAverageRatingChart from './charts/CategoryAverageRatingChart';

export default function ChartsSection() {
  const { data, isLoading, error } = useGetSalesQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error?.data?.message || error?.error || 'Failed to load chart data.'}
      </Alert>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ProductsPerCategoryChart rawData={data} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TopReviewedProductsChart rawData={data} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <DiscountDistributionChart rawData={data} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CategoryAverageRatingChart rawData={data} />
      </Grid>
    </Grid>
  );
}
