import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useController } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';

export interface WebPlantingFormData {
  location: string;
  expectedHarvestDate: Date;
}

export interface WebPlantingModalProps {
  open: boolean;
  productName: string;
  onClose: () => void;
  onConfirm: (data: WebPlantingFormData) => void;
  loading?: boolean;
}

// Date picker component that integrates with react-hook-form
interface DatePickerFieldProps {
  name: string;
  label: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Dayjs;
}

function DatePickerField({
  name,
  label,
  helperText,
  required,
  disabled,
  minDate,
}: DatePickerFieldProps) {
  const { field, fieldState } = useController({
    name,
    rules: {
      required: required ? `${label} is required` : false,
      validate: value => {
        if (value && minDate && dayjs(value).isBefore(minDate)) {
          return `${label} must be after ${minDate.format('MM/DD/YYYY')}`;
        }
        return true;
      },
    },
  });

  return (
    <DatePicker
      label={label}
      value={field.value ? dayjs(field.value) : null}
      onChange={newValue => {
        field.onChange(newValue ? newValue.toDate() : null);
      }}
      disabled={disabled}
      minDate={minDate}
      slotProps={{
        textField: {
          fullWidth: true,
          error: !!fieldState.error,
          helperText: fieldState.error?.message || helperText,
        },
      }}
    />
  );
}

export function WebPlantingModal({
  open,
  productName,
  onClose,
  onConfirm,
  loading = false,
}: WebPlantingModalProps) {
  const defaultValues: WebPlantingFormData = {
    location: '',
    expectedHarvestDate: dayjs().add(1, 'month').toDate(),
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (data: WebPlantingFormData) => {
    onConfirm(data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={loading}
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Plant {productName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please provide planting details
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
                name="location"
                label="Location"
                placeholder="e.g., Field A, Greenhouse 1, Plot 23"
                helperText="Where will this product be planted?"
                fullWidth
                disabled={loading}
                required
                rules={{
                  required: 'Location is required',
                }}
              />

              <DatePickerField
                name="expectedHarvestDate"
                label="Expected Harvest Date"
                helperText="When do you expect to harvest this product?"
                disabled={loading}
                required
                minDate={dayjs().add(1, 'day')}
              />

              <Box
                sx={{
                  bgcolor: 'info.main',
                  color: 'info.contrastText',
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">
                  <strong>Note:</strong> The planted date will be set to today (
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
              {loading ? 'Planting...' : 'Plant Product'}
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
    </LocalizationProvider>
  );
}
