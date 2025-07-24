import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Text,
  TextInput,
  Button,
  Card,
  Snackbar,
  ProgressBar,
  IconButton,
  Divider,
  Surface,
  SegmentedButtons,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export interface MobileSaleProduct {
  id: string;
  name: string;
  unit: string;
  quantity: number;
}

export interface MobileSaleItemFormData {
  productId: string;
  quantity: string;
  pricePerUnit: string;
}

export interface MobileSaleFormData {
  client: string;
  items: MobileSaleItemFormData[];
}

export interface MobileSaleFormProps {
  products: MobileSaleProduct[];
  onSubmitSale?: (data: MobileSaleFormData) => Promise<boolean>;
  onBack?: () => void;
  onRefreshData?: () => Promise<void>;
}

const steps = ['Client', 'Products', 'Review', 'Success'];

export function MobileSaleForm({
  products,
  onSubmitSale,
  onBack,
  onRefreshData,
}: MobileSaleFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [productView, setProductView] = useState<'available' | 'selected'>(
    'available'
  );

  const {
    control,
    watch,
    reset,
    trigger,
    formState: { errors },
    getValues,
  } = useForm<MobileSaleFormData>({
    mode: 'onChange',
    defaultValues: {
      client: '',
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const client = watch('client');

  // Calculate total sale amount
  const totalSaleAmount = items.reduce((sum, item) => {
    const qty = Number(item.quantity);
    const price = Number(item.pricePerUnit);
    if (!isNaN(qty) && !isNaN(price)) {
      return sum + qty * price;
    }
    return sum;
  }, 0);

  const handleNext = async () => {
    Keyboard.dismiss();
    let valid = false;

    if (activeStep === 0) {
      valid = await trigger('client');
    } else if (activeStep === 1) {
      valid = await trigger('items');
      // Additional validation for products step
      valid =
        valid &&
        items.length > 0 &&
        items.every(
          item =>
            item.productId &&
            item.quantity !== '' &&
            item.pricePerUnit !== '' &&
            Number(item.quantity) > 0 &&
            Number(item.pricePerUnit) > 0
        );
    } else {
      valid = true;
    }

    if (valid && activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0 && onBack) {
      onBack();
    } else {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!onSubmitSale) {
      // Mock submission for demo
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setActiveStep(3);
      }, 2000);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmitSale(getValues());
      if (result) {
        setActiveStep(3);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register sale');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNewSale = async () => {
    if (!onRefreshData) {
      // Fallback if no refresh function provided
      reset();
      setActiveStep(0);
      setProductView('available');
      setError(null);
      return;
    }

    setIsRefreshing(true);
    try {
      await onRefreshData();
      reset();
      setActiveStep(0);
      setProductView('available');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
      setShowError(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleProductToggle = (product: MobileSaleProduct) => {
    const existingIndex = fields.findIndex(
      field => field.productId === product.id
    );

    if (existingIndex !== -1) {
      remove(existingIndex);
    } else {
      append({
        productId: product.id,
        quantity: '',
        pricePerUnit: '',
      });
    }
  };

  const isProductSelected = (productId: string) => {
    return fields.some(field => field.productId === productId);
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <Text variant="labelLarge" style={styles.stepTitle}>
        Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
      </Text>
      <ProgressBar
        progress={(activeStep + 1) / steps.length}
        style={styles.progressBar}
      />
    </View>
  );

  const renderClientStep = () => (
    <View style={styles.stepContent}>
      <Text variant="headlineSmall" style={styles.stepHeading}>
        Enter Client Information
      </Text>
      <Controller
        control={control}
        name="client"
        rules={{ required: 'Client name is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Client Name"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mode="outlined"
            error={!!errors.client}
            autoCapitalize="words"
            style={styles.input}
            disabled={isSubmitting}
          />
        )}
      />
      {errors.client && (
        <Text variant="bodySmall" style={styles.errorText}>
          {errors.client.message}
        </Text>
      )}
    </View>
  );

  const renderProductsStep = () => (
    <View style={styles.stepContent}>
      <Text variant="headlineSmall" style={styles.stepHeading}>
        Select Products
      </Text>
      <Text variant="bodyMedium" style={styles.stepDescription}>
        Choose products to include in this sale
      </Text>

      {/* View Toggle */}
      <SegmentedButtons
        value={productView}
        onValueChange={value =>
          setProductView(value as 'available' | 'selected')
        }
        buttons={[
          {
            value: 'available',
            label: 'Available Products',
            icon: 'package-variant',
          },
          {
            value: 'selected',
            label: `Selected (${fields.length})`,
            icon: 'cart',
            disabled: fields.length === 0,
          },
        ]}
        style={styles.viewToggle}
      />

      {/* Available Products View */}
      {productView === 'available' && (
        <View style={styles.productsGrid}>
          {products.map(product => {
            const selected = isProductSelected(product.id);
            return (
              <Card
                key={product.id}
                style={[
                  styles.productCard,
                  selected && styles.productCardSelected,
                ]}
                mode="outlined"
              >
                <Card.Content style={styles.productCardContent}>
                  <View style={styles.productHeader}>
                    <Text variant="titleMedium" style={styles.productName}>
                      {product.name}
                    </Text>
                  </View>
                  <Text variant="bodyMedium" style={styles.productStock}>
                    Stock: {product.quantity} ({product.unit})
                  </Text>
                  <Button
                    mode={selected ? 'contained' : 'outlined'}
                    onPress={() => handleProductToggle(product)}
                    icon={selected ? 'minus' : 'plus'}
                    style={styles.productButton}
                    disabled={!selected && product.quantity === 0}
                  >
                    {selected ? 'Remove' : 'Add to Sale'}
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </View>
      )}

      {/* Selected Products View */}
      {productView === 'selected' && (
        <View style={styles.selectedProductsContainer}>
          {fields.length === 0 ? (
            <View style={styles.emptySelectedState}>
              <Text variant="bodyLarge" style={styles.emptyStateText}>
                No products selected yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptyStateSubtext}>
                Switch to "Available Products" to add items to your sale
              </Text>
            </View>
          ) : (
            <>
              <Text variant="titleMedium" style={styles.selectedProductsTitle}>
                Configure Selected Products
              </Text>
              {fields.map((field, index) => {
                const product = getProductById(field.productId);
                if (!product) return null;

                return (
                  <Surface key={field.id} style={styles.selectedProductItem}>
                    <View style={styles.selectedProductHeader}>
                      <Text variant="titleSmall">{product.name}</Text>
                      <IconButton
                        icon="close"
                        size={20}
                        onPress={() => remove(index)}
                      />
                    </View>

                    <View style={styles.selectedProductInputs}>
                      <Controller
                        control={control}
                        name={`items.${index}.quantity`}
                        rules={{
                          required: 'Quantity is required',
                          min: { value: 1, message: 'Must be at least 1' },
                          validate: value => {
                            if (!value || isNaN(Number(value))) {
                              return 'Enter a valid number';
                            }
                            if (Number(value) > product.quantity) {
                              return `Cannot exceed stock (${product.quantity})`;
                            }
                            return true;
                          },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            label="Quantity"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.quantityInput}
                            error={!!errors.items?.[index]?.quantity}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name={`items.${index}.pricePerUnit`}
                        rules={{
                          required: 'Price is required',
                          min: {
                            value: 0.01,
                            message: 'Must be at least $0.01',
                          },
                          validate: value => {
                            if (!value || isNaN(Number(value))) {
                              return 'Enter a valid price';
                            }
                            return true;
                          },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            label={`Price per ${product.unit} ($)`}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.priceInput}
                            error={!!errors.items?.[index]?.pricePerUnit}
                          />
                        )}
                      />
                    </View>

                    {(errors.items?.[index]?.quantity ||
                      errors.items?.[index]?.pricePerUnit) && (
                      <View style={styles.fieldErrors}>
                        {errors.items?.[index]?.quantity && (
                          <Text variant="bodySmall" style={styles.errorText}>
                            {errors.items[index]?.quantity?.message}
                          </Text>
                        )}
                        {errors.items?.[index]?.pricePerUnit && (
                          <Text variant="bodySmall" style={styles.errorText}>
                            {errors.items[index]?.pricePerUnit?.message}
                          </Text>
                        )}
                      </View>
                    )}
                  </Surface>
                );
              })}
            </>
          )}
        </View>
      )}
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.stepContent}>
      <Text variant="headlineSmall" style={styles.stepHeading}>
        Review Order
      </Text>

      <Card style={styles.reviewCard} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.reviewSectionTitle}>
            Client
          </Text>
          <Text variant="bodyLarge" style={styles.reviewValue}>
            {client}
          </Text>

          <Divider style={styles.reviewDivider} />

          <Text variant="titleMedium" style={styles.reviewSectionTitle}>
            Products
          </Text>
          {items.map((item, index) => {
            const product = getProductById(item.productId);
            return (
              <View key={index} style={styles.reviewProductItem}>
                <Text variant="bodyLarge">
                  <Text style={styles.reviewProductName}>
                    {product?.name || 'Unknown'}
                  </Text>
                  {' — '}
                  {item.quantity} {product?.unit || ''} × ${item.pricePerUnit}
                </Text>
                <Text variant="bodyMedium" style={styles.reviewProductTotal}>
                  $
                  {(Number(item.quantity) * Number(item.pricePerUnit)).toFixed(
                    2
                  )}
                </Text>
              </View>
            );
          })}

          <Divider style={styles.reviewDivider} />

          <View style={styles.totalContainer}>
            <Text variant="headlineSmall" style={styles.totalText}>
              Total: ${totalSaleAmount.toFixed(2)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderSuccessStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.successContainer}>
        <MaterialIcons name="check-circle" size={64} color="#4caf50" />
        <Text variant="headlineSmall" style={styles.successTitle}>
          Sale Registered Successfully!
        </Text>
        <Text variant="bodyLarge" style={styles.successMessage}>
          The sale for <Text style={styles.successClient}>{client}</Text> was
          successfully registered.
        </Text>
        <Text variant="titleLarge" style={styles.successTotal}>
          Total Amount: ${totalSaleAmount.toFixed(2)}
        </Text>
        <Button
          mode="contained"
          onPress={handleStartNewSale}
          loading={isRefreshing}
          disabled={isRefreshing}
          style={styles.newSaleButton}
          icon={isRefreshing ? undefined : 'plus'}
        >
          Register Another Sale
        </Button>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderClientStep();
      case 1:
        return renderProductsStep();
      case 2:
        return renderReviewStep();
      case 3:
        return renderSuccessStep();
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (activeStep === 0) {
      return !client || !!errors.client;
    }
    if (activeStep === 1) {
      return (
        items.length === 0 ||
        items.some(
          item =>
            !item.productId ||
            !item.quantity ||
            !item.pricePerUnit ||
            Number(item.quantity) <= 0 ||
            Number(item.pricePerUnit) <= 0
        )
      );
    }
    return false;
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {activeStep < 3 && renderStepIndicator()}
          {renderStepContent()}

          {activeStep < 3 && (
            <View style={styles.navigation}>
              <Button
                mode="outlined"
                onPress={handleBack}
                style={styles.backButton}
                disabled={isSubmitting}
              >
                {activeStep === 0 ? 'Cancel' : 'Back'}
              </Button>

              {activeStep === 2 ? (
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  style={styles.nextButton}
                >
                  Register Sale
                </Button>
              ) : (
                <Button
                  mode="contained"
                  onPress={handleNext}
                  disabled={isNextDisabled()}
                  style={styles.nextButton}
                >
                  Next
                </Button>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={4000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  stepIndicator: {
    marginBottom: 24,
  },
  stepTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepHeading: {
    marginBottom: 8,
    fontWeight: '600',
  },
  stepDescription: {
    marginBottom: 16,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 8,
  },
  viewToggle: {
    marginBottom: 16,
  },
  productsGrid: {
    gap: 12,
  },
  productCard: {
    backgroundColor: '#fff',
  },
  productCardSelected: {
    borderColor: '#ab47bc',
    borderWidth: 2,
  },
  productCardContent: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    flex: 1,
    fontWeight: '600',
  },
  unitText: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  productStock: {
    color: '#666',
    marginBottom: 12,
  },
  productButton: {
    alignSelf: 'flex-end',
  },
  selectedProductsContainer: {
    flex: 1,
  },
  emptySelectedState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 200,
  },
  emptyStateText: {
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#999',
    textAlign: 'center',
  },
  selectedProductsTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  selectedProductItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  selectedProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedProductInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  quantityInput: {
    flex: 1,
    backgroundColor: '#fff',
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fieldErrors: {
    marginTop: 8,
  },
  reviewCard: {
    backgroundColor: '#fff',
  },
  reviewSectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewValue: {
    marginBottom: 16,
  },
  reviewDivider: {
    marginVertical: 16,
  },
  reviewProductItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewProductName: {
    fontWeight: '600',
  },
  reviewProductTotal: {
    fontWeight: '700',
    color: '#000',
  },
  totalContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  totalText: {
    fontWeight: '700',
    color: '#000',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 24,
  },
  successTitle: {
    fontWeight: '600',
    color: '#4caf50',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  successClient: {
    fontWeight: '600',
    color: '#333',
  },
  successTotal: {
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
  },
  newSaleButton: {
    paddingHorizontal: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
  snackbar: {
    backgroundColor: '#d32f2f',
  },
});
