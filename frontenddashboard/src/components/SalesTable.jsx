import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useGetSalesQuery } from '../store/salesApi';
import { normalizeSalesData } from '../utils/dataNormalizer';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

export default function SalesTable() {
  const { data: rawData, isLoading, error } = useGetSalesQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [reviewFilter, setReviewFilter] = useState('');

  const normalized = useMemo(() => normalizeSalesData(Array.isArray(rawData) ? rawData : rawData?.data ?? []), [rawData]);

  const categories = useMemo(() => {
    const set = new Set(normalized.map((r) => r.category).filter(Boolean));
    return Array.from(set).sort();
  }, [normalized]);

  const filtered = useMemo(() => {
    let list = normalized;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => String(r.productName).toLowerCase().includes(q));
    }
    if (categoryFilter) {
      list = list.filter((r) => r.category === categoryFilter);
    }
    if (reviewFilter === 'has_reviews') {
      list = list.filter((r) => r.reviewCount != null && r.reviewCount > 0);
    } else if (reviewFilter === 'no_reviews') {
      list = list.filter((r) => r.reviewCount == null || r.reviewCount === 0);
    }
    return list;
  }, [normalized, search, categoryFilter, reviewFilter]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Paper sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 2 }}>
        <Alert severity="error">
          {error?.data?.message || error?.error || 'Failed to load sales data.'}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <Typography variant="h6">Sales Data</Typography>
        <TextField
          size="small"
          label="Search by product name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Review</InputLabel>
          <Select
            value={reviewFilter}
            label="Review"
            onChange={(e) => {
              setReviewFilter(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="has_reviews">Has reviews</MenuItem>
            <MenuItem value="no_reviews">No reviews</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="right">Reviews</TableCell>
              <TableCell align="right">Discount (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No rows to display.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell align="right">{row.rating ?? '—'}</TableCell>
                  <TableCell align="right">{row.reviewCount ?? '—'}</TableCell>
                  <TableCell align="right">{row.discount ?? '—'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
