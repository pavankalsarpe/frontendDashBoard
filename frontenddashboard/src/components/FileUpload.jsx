import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';

function UploadIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
    </SvgIcon>
  );
}
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useUploadFileMutation } from '../store/salesApi';

const ACCEPTED_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function FileUpload({ onSuccess }) {
  const [uploadFile, { isLoading, error, isSuccess }] = useUploadFileMutation();
  const [validationError, setValidationError] = useState('');

  const validateFile = (file) => {
    setValidationError('');
    if (!file) {
      setValidationError('Please select a file.');
      return false;
    }
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    const isExcel =
      file.name.toLowerCase().endsWith('.xlsx') ||
      file.name.toLowerCase().endsWith('.xls');
    if (!isCsv && !isExcel) {
      setValidationError('Only CSV and Excel (.xlsx, .xls) files are allowed.');
      return false;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setValidationError(`File size must be under ${MAX_SIZE_MB} MB.`);
      return false;
    }
    return true;
  };

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!validateFile(file)) return;
    try {
      await uploadFile(file).unwrap();
      onSuccess?.();
      e.target.value = '';
    } catch (err) {
      // Error is shown via RTK Query error state
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload Sales Data
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload a CSV or Excel file to process sales data. Max size: {MAX_SIZE_MB} MB.
      </Typography>
      {validationError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.data?.message || error?.error || 'Upload failed. Please try again.'}
        </Alert>
      )}
      {isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          File uploaded and processed successfully.
        </Alert>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          component="label"
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
          disabled={isLoading}
        >
          {isLoading ? 'Uploading…' : 'Choose file'}
          <input
            type="file"
            hidden
            accept=".csv,.xlsx,.xls"
            onChange={handleChange}
          />
        </Button>
      </Box>
    </Paper>
  );
}
