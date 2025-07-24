import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  Card,
  Divider,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';

export interface MobileHarvestFormData {
  yieldAmount: number;
}

export interface MobileHarvestModalProps {
  visible: boolean;
  productName: string;
  onDismiss: () => void;
  onConfirm: (data: MobileHarvestFormData) => Promise<void>;
  loading?: boolean;
}

interface FormData {
  yieldAmount: string;
}

export function MobileHarvestModal({
  visible,
  productName,
  onDismiss,
  onConfirm,
  loading = false,
}: MobileHarvestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      yieldAmount: '150',
    },
  });

  const handleClose = () => {
    if (!isSubmitting && !loading) {
      reset();
      onDismiss();
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    if (isSubmitting || loading) return;

    setIsSubmitting(true);
    try {
      const formattedData: MobileHarvestFormData = {
        yieldAmount: Number(data.yieldAmount),
      };
      await onConfirm(formattedData);
      reset();
      onDismiss();
    } catch (error) {
      console.error('Error harvesting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalContainer}
        style={styles.modal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Card style={styles.modalCard}>
              <Card.Content style={styles.cardContent}>
                <Text variant="headlineSmall" style={styles.title}>
                  Harvest {productName}
                </Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                  Please enter the harvest yield
                </Text>

                <Divider style={styles.divider} />

                <View style={styles.form}>
                  <Controller
                    control={control}
                    name="yieldAmount"
                    rules={{
                      required: 'Yield amount is required',
                      validate: value => {
                        const numValue = Number(value);
                        if (isNaN(numValue) || numValue <= 0) {
                          return 'Please enter a valid positive number';
                        }
                        return true;
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Yield Amount"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        mode="outlined"
                        error={!!errors.yieldAmount}
                        placeholder="e.g., 150"
                        keyboardType="numeric"
                        style={styles.input}
                        disabled={isSubmitting || loading}
                        left={<TextInput.Icon icon="tractor" />}
                      />
                    )}
                  />
                  {errors.yieldAmount && (
                    <Text variant="bodySmall" style={styles.errorText}>
                      {errors.yieldAmount.message}
                    </Text>
                  )}

                  <Text variant="bodySmall" style={styles.helpText}>
                    How many units were harvested?
                  </Text>

                  <View style={styles.infoBox}>
                    <Text variant="bodySmall" style={styles.infoText}>
                      <Text style={styles.infoBold}>Note:</Text> The harvest
                      date will be set to today (
                      {new Date().toLocaleDateString('en-US')}).
                    </Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  <Button
                    mode="outlined"
                    onPress={handleClose}
                    style={styles.cancelButton}
                    disabled={isSubmitting || loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSubmit(handleFormSubmit)}
                    loading={isSubmitting || loading}
                    disabled={isSubmitting || loading || !!errors.yieldAmount}
                    style={styles.confirmButton}
                    icon="tractor"
                  >
                    {isSubmitting || loading
                      ? 'Harvesting...'
                      : 'Complete Harvest'}
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
  modalCard: {
    backgroundColor: '#fff',
    width: '100%',
  },
  cardContent: {
    padding: 24,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 20,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: '#d32f2f',
    marginTop: -12,
    marginBottom: 8,
  },
  helpText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    minWidth: 100,
  },
  confirmButton: {
    flex: 1,
    minWidth: 140,
  },
  infoBox: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    color: '#2e7d32',
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '600',
    color: '#2e7d32',
  },
});
