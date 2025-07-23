import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

export interface WebHarvestFormData {
  yieldAmount: number;
}

export interface WebHarvestModalProps {
  open: boolean;
  productName: string;
  onClose: () => void;
  onConfirm: (data: WebHarvestFormData) => void;
  loading?: boolean;
}

export function WebHarvestModal({
  open,
  productName,
  onClose,
  onConfirm,
  loading = false,
}: WebHarvestModalProps) {
  const defaultValues: WebHarvestFormData = {
    yieldAmount: 150,
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (data: WebHarvestFormData) => {
    onConfirm(data);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          Harvest {productName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please enter the harvest yield
        </Typography>
      </DialogTitle>

      <FormContainer defaultValues={defaultValues} onSuccess={handleSubmit}>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              pt: 1,
            }}
          >
            <TextFieldElement
              name="yieldAmount"
              label="Yield Amount"
              type="number"
              placeholder="e.g., 150"
              helperText="How many units were harvested?"
              fullWidth
              disabled={loading}
              required
              rules={{
                required: 'Yield amount is required',
                min: {
                  value: 1,
                  message: 'Yield amount must be greater than 0',
                },
                validate: value => {
                  const num = Number(value);
                  if (isNaN(num)) {
                    return 'Please enter a valid number';
                  }
                  if (num <= 0) {
                    return 'Yield amount must be positive';
                  }
                  return true;
                },
              }}
            />

            <Box
              sx={{
                bgcolor: 'success.main',
                color: 'success.contrastText',
                p: 2,
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">
                <strong>Note:</strong> The harvest date will be set to today (
                {new Date().toLocaleDateString()}).
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} disabled={loading} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Harvesting...' : 'Complete Harvest'}
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  );
}
