import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useState, Fragment } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useForm, useFieldArray } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export interface WebSaleProduct {
  id: string;
  name: string;
  unit: string;
  quantity: number;
}

export interface WebWebSaleItemFormData {
  productId: string;
  quantity: string;
  pricePerUnit: string;
}

export interface WebSaleFormData {
  client: string;
  items: WebWebSaleItemFormData[];
}

export interface WebSaleFormProps {
  products: WebSaleProduct[];
  onSubmitSale: (data: WebSaleFormData) => Promise<boolean>;
  loadData: () => Promise<void>;
}

const steps = ['Client', 'Products', 'Checkout', 'Success'];

export function WebSaleForm({
  products,
  onSubmitSale,
  loadData,
}: WebSaleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const formContext = useForm<WebSaleFormData>({
    defaultValues: {
      client: '',
      items: [],
    },
    mode: 'onChange',
  });
  const { control, watch, reset, trigger, formState } = formContext;
  const { append, remove } = useFieldArray({ control, name: 'items' });
  const items = watch('items');
  const client = watch('client');
  const totalSaleAmount = items.reduce((sum, item) => {
    const qty = Number(item.quantity);
    const price = Number(item.pricePerUnit);
    if (!isNaN(qty) && !isNaN(price)) {
      return sum + qty * price;
    }
    return sum;
  }, 0);

  const handleNext = async () => {
    let valid = false;
    if (activeStep === 0) valid = await trigger('client');
    else if (activeStep === 1) valid = await trigger('items');
    else valid = true;
    if (valid && activeStep < steps.length - 1) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await onSubmitSale(formContext.getValues());
      if (result) {
        setActiveStep(3);
      }
    } catch (error) {
      console.error('Failed to submit sale:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNewSale = async () => {
    setIsRefreshing(true);
    try {
      await loadData();
      reset();
      setActiveStep(0);
    } finally {
      setIsRefreshing(false);
    }
  };

  const isProductsStepValid =
    items.length > 0 &&
    items.every(
      item =>
        item.productId &&
        item.quantity !== '' &&
        item.pricePerUnit !== '' &&
        Number(item.quantity) > 0 &&
        Number(item.pricePerUnit) > 0
    );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
      >
        {steps.map(label => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  fontWeight: 600,
                  fontSize: '1rem',
                },
                '& .MuiStepLabel-label.Mui-active': {
                  fontWeight: 600,
                  fontSize: '1rem',
                },
                '& .MuiStepLabel-label.Mui-completed': {
                  fontWeight: 600,
                  fontSize: '1rem',
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box display="flex" justifyContent="center" alignItems="flex-start">
        <Paper elevation={3} sx={{ p: 4, maxWidth: 700, width: '100%' }}>
          {(activeStep === 0 || activeStep === 1) && (
            <FormContainer formContext={formContext} onSuccess={() => {}}>
              <Stack spacing={4}>
                {activeStep === 0 && (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Enter Client Information
                    </Typography>
                    <TextFieldElement
                      name="client"
                      control={control}
                      label="Client name"
                      fullWidth
                      required
                      rules={{ required: 'Client name is required' }}
                      autoFocus
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: '1rem',
                        },
                      }}
                    />
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Select Products
                    </Typography>
                    {products.length === 0 ? (
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        No products are available for sale at this time.
                      </Typography>
                    ) : (
                      <>
                        <Grid container spacing={2}>
                          {products.map(product => {
                            const isSelected = items.some(
                              item => item.productId === product.id
                            );
                            return (
                              <Grid
                                key={product.id}
                                size={{ xs: 12, sm: 6, md: 4 }}
                              >
                                <Card
                                  variant="outlined"
                                  sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    ...(isSelected && {
                                      borderColor: 'primary.main',
                                      bgcolor: 'primary.lighter',
                                    }),
                                  }}
                                >
                                  <CardContent>
                                    <Typography
                                      variant="h6"
                                      gutterBottom
                                      sx={{
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        mb: 1,
                                      }}
                                    >
                                      {product.name}
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      color="text.secondary"
                                      sx={{ fontSize: '0.95rem' }}
                                    >
                                      <b>Available:</b> {product.quantity} (
                                      {product.unit})
                                    </Typography>
                                  </CardContent>
                                  <CardActions>
                                    <Button
                                      startIcon={
                                        isSelected ? (
                                          <DeleteIcon />
                                        ) : (
                                          <AddIcon />
                                        )
                                      }
                                      color={isSelected ? 'error' : 'primary'}
                                      onClick={() => {
                                        if (isSelected) {
                                          const index = items.findIndex(
                                            item =>
                                              item.productId === product.id
                                          );
                                          if (index !== -1) remove(index);
                                        } else {
                                          append({
                                            productId: product.id,
                                            quantity: '',
                                            pricePerUnit: '',
                                          });
                                        }
                                      }}
                                      disabled={
                                        !isSelected && product.quantity === 0
                                      }
                                      sx={{ fontSize: '0.9rem' }}
                                    >
                                      {isSelected ? 'Remove' : 'Add to Sale'}
                                    </Button>
                                  </CardActions>
                                  {isSelected && (
                                    <CheckCircleOutlineIcon
                                      color="primary"
                                      sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        fontSize: '1.5rem',
                                      }}
                                    />
                                  )}
                                </Card>
                              </Grid>
                            );
                          })}
                        </Grid>
                        {items.length > 0 && (
                          <>
                            <Divider sx={{ my: 3 }} />
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{
                                fontWeight: 600,
                                mb: 2,
                              }}
                            >
                              Selected Products
                            </Typography>
                            {items.map((item, index) => {
                              const product = products.find(
                                p => p.id === item.productId
                              );
                              if (!product) return null;
                              return (
                                <Fragment key={item.productId}>
                                  <Stack
                                    direction={{ xs: 'column', md: 'row' }}
                                    spacing={{ xs: 2 }}
                                    alignItems={{
                                      xs: 'flex-start',
                                      md: 'center',
                                    }}
                                    justifyContent={{
                                      xs: 'flex-start',
                                      md: 'space-between',
                                    }}
                                    sx={{ width: '100%' }}
                                  >
                                    <Typography
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: { xs: '1.1rem', md: '1rem' },
                                        alignSelf: 'start',
                                      }}
                                      variant="subtitle1"
                                    >
                                      {product.name}
                                    </Typography>
                                    <Stack
                                      direction={{ xs: 'row' }}
                                      spacing={2}
                                      alignItems="flex-start"
                                      sx={{
                                        width: { xs: '100%', md: 'auto' },
                                        flexWrap: { xs: 'wrap', md: 'nowrap' },
                                      }}
                                    >
                                      <TextFieldElement
                                        name={`items.${index}.quantity`}
                                        control={control}
                                        label="Quantity"
                                        type="number"
                                        required
                                        sx={{
                                          width: {
                                            xs: 'calc(50% - 8px)',
                                            md: 150,
                                          },
                                        }}
                                        rules={{
                                          required: 'Quantity is required',
                                          min: {
                                            value: 1,
                                            message: 'Must be at least 1',
                                          },
                                          validate: value => {
                                            if (!product) return true;
                                            if (
                                              value === '' ||
                                              isNaN(Number(value))
                                            )
                                              return 'Enter a valid number';
                                            if (
                                              Number(value) > product.quantity
                                            ) {
                                              return `Cannot sell more than available (${product.quantity})`;
                                            }
                                            return true;
                                          },
                                        }}
                                        FormHelperTextProps={{
                                          sx: {
                                            minHeight: 22,
                                            fontSize: '0.8rem',
                                          },
                                        }}
                                      />
                                      <TextFieldElement
                                        name={`items.${index}.pricePerUnit`}
                                        control={control}
                                        label={`Price per ${product.unit} ($)`}
                                        type="number"
                                        required
                                        sx={{
                                          width: {
                                            xs: 'calc(50% - 8px)',
                                            md: 180,
                                          },
                                        }}
                                        rules={{
                                          required: 'Price is required',
                                          min: {
                                            value: 0.01,
                                            message: 'Must be at least $0.01',
                                          },
                                          validate: value => {
                                            if (
                                              value === '' ||
                                              isNaN(Number(value))
                                            )
                                              return 'Enter a valid price';
                                            return true;
                                          },
                                        }}
                                        FormHelperTextProps={{
                                          sx: {
                                            minHeight: 22,
                                            fontSize: '0.8rem',
                                          },
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          justifyContent: 'flex-end',
                                          width: { xs: '100%', md: 'auto' },
                                          mt: { xs: 3, md: 0 },
                                        }}
                                      >
                                        <IconButton
                                          aria-label="Remove product"
                                          onClick={() => remove(index)}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Box>
                                    </Stack>
                                  </Stack>
                                  <Divider sx={{ my: 2 }} />
                                </Fragment>
                              );
                            })}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    sx={{ fontSize: '0.95rem' }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 &&
                        (!client || !!formState.errors.client)) ||
                      (activeStep === 1 && !isProductsStepValid)
                    }
                    sx={{ fontSize: '0.95rem' }}
                  >
                    Next
                  </Button>
                </Box>
              </Stack>
            </FormContainer>
          )}
          {activeStep === 2 && (
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Review Order
              </Typography>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}
                >
                  Client
                </Typography>
                <Typography variant="body1" sx={{ ml: 2, fontSize: '1rem' }}>
                  {client}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}
                >
                  Products
                </Typography>
                <Box component="ul" sx={{ mt: 0, mb: 0, pl: 3 }}>
                  {items.map((item, idx) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <li key={idx}>
                        <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                          <b>{product?.name || 'Unknown'}</b> — {item.quantity}{' '}
                          {product?.unit || ''} x ${item.pricePerUnit}
                        </Typography>
                      </li>
                    );
                  })}
                </Box>
              </Box>
              <Box display="flex" justifyContent="flex-end" alignItems="center">
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    textAlign: 'right',
                    fontSize: '1.5rem',
                  }}
                >
                  Total: ${totalSaleAmount.toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button
                  onClick={handleBack}
                  variant="outlined"
                  sx={{ fontSize: '0.95rem' }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={formContext.handleSubmit(onSubmit)}
                  disabled={
                    isSubmitting ||
                    items.length === 0 ||
                    !!formState.errors.items ||
                    items.some(
                      item =>
                        !item.productId ||
                        !item.quantity ||
                        !item.pricePerUnit ||
                        Number(item.quantity) <= 0 ||
                        Number(item.pricePerUnit) <= 0
                    )
                  }
                  sx={{ fontSize: '0.95rem' }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Register Sale'
                  )}
                </Button>
              </Box>
            </Stack>
          )}
          {activeStep === 3 && (
            <Stack spacing={3} alignItems="center" textAlign="center">
              <CheckCircleOutlineIcon
                color="success"
                sx={{ fontSize: '3rem' }}
              />
              <Typography
                variant="h5"
                color="success.main"
                sx={{
                  fontWeight: 600,
                  fontSize: '1.5rem',
                }}
              >
                Sale Registered Successfully!
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                The sale for <b>{client}</b> was successfully registered.
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1.3rem',
                }}
              >
                Total Amount: ${totalSaleAmount.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                onClick={handleStartNewSale}
                disabled={isRefreshing}
                sx={{ mt: 2, fontSize: '0.95rem' }}
              >
                {isRefreshing ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={20} color="inherit" />
                    <span>Updating inventory...</span>
                  </Stack>
                ) : (
                  'Register Another Sale'
                )}
              </Button>
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
