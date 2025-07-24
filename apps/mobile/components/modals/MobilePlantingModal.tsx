import React, { useState, useEffect } from 'react';
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
import { DatePickerModal } from 'react-native-paper-dates';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';

export interface MobilePlantingFormData {
  location: string;
  expectedHarvestDate: Date;
}

export interface MobilePlantingModalProps {
  visible: boolean;
  productName: string;
  onDismiss: () => void;
  onConfirm: (data: MobilePlantingFormData) => Promise<void>;
  loading?: boolean;
}

export function MobilePlantingModal({
  visible,
  productName,
  onDismiss,
  onConfirm,
  loading = false,
}: MobilePlantingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().add(1, 'month').format('YYYY-MM-DD')
  );
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ location: string }>({
    mode: 'onChange',
    defaultValues: {
      location: '',
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      reset({ location: '' });
      setSelectedDate(dayjs().add(1, 'month').format('YYYY-MM-DD'));
    }
  }, [visible, reset]);

  const handleClose = () => {
    if (!isSubmitting && !loading) {
      reset();
      onDismiss();
    }
  };

  const handleFormSubmit = async (data: { location: string }) => {
    if (isSubmitting || loading) return;

    setIsSubmitting(true);
    try {
      // Parse date in local timezone to avoid timezone conversion issues
      const dateParts = selectedDate.split('-');
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[2], 10);
      const formattedData: MobilePlantingFormData = {
        location: data.location,
        expectedHarvestDate: new Date(year, month, day),
      };
      await onConfirm(formattedData);
      reset();
      onDismiss();
    } catch (error) {
      console.error('Error planting product:', error);
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
                  Plant {productName}
                </Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                  Please provide planting details
                </Text>

                <Divider style={styles.divider} />

                <View style={styles.form}>
                  <Controller
                    control={control}
                    name="location"
                    rules={{
                      required: 'Location is required',
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Location"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        mode="outlined"
                        error={!!errors.location}
                        placeholder="e.g., Field A, Greenhouse 1, Plot 23"
                        style={styles.input}
                        disabled={isSubmitting || loading}
                      />
                    )}
                  />
                  {errors.location && (
                    <Text variant="bodySmall" style={styles.errorText}>
                      {errors.location.message}
                    </Text>
                  )}

                  <Text variant="bodySmall" style={styles.helpText}>
                    Where will this product be planted?
                  </Text>

                  <View style={styles.dateInputContainer}>
                    <Text variant="bodySmall" style={styles.dateInputLabel}>
                      Expected Harvest Date
                    </Text>
                    <Button
                      mode="outlined"
                      onPress={() => setDatePickerVisible(true)}
                      disabled={isSubmitting || loading}
                      style={styles.dateButton}
                      labelStyle={styles.dateButtonLabel}
                      icon="calendar"
                      contentStyle={styles.dateButtonContent}
                    >
                      {selectedDate
                        ? dayjs(selectedDate).format('MM/DD/YYYY')
                        : 'Select date'}
                    </Button>
                  </View>

                  <Text variant="bodySmall" style={styles.helpText}>
                    When do you expect to harvest this product?
                  </Text>

                  <View style={styles.infoBox}>
                    <Text variant="bodySmall" style={styles.infoText}>
                      <Text style={styles.infoBold}>Note:</Text> The planted
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
                    disabled={isSubmitting || loading || !!errors.location}
                    style={styles.confirmButton}
                    icon="spa"
                    labelStyle={styles.confirmButtonLabel}
                  >
                    {isSubmitting || loading ? 'Planting...' : 'Plant Product'}
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <DatePickerModal
        visible={datePickerVisible}
        onDismiss={() => setDatePickerVisible(false)}
        date={dayjs(selectedDate).toDate()}
        onConfirm={({ date }) => {
          setSelectedDate(dayjs(date).format('YYYY-MM-DD'));
          setDatePickerVisible(false);
        }}
        locale="en"
        mode="single"
        label="Expected Harvest Date"
        validRange={{
          startDate: dayjs().add(1, 'day').toDate(),
          endDate: undefined,
          disabledDates: undefined,
        }}
      />
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
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  confirmButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    color: '#1976d2',
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '600',
    color: '#1976d2',
  },
  dateButton: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 2,
    margin: 0,
    borderWidth: 1,
    borderColor: '#757575',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 48,
  },
  dateButtonError: {
    borderColor: '#d32f2f',
    borderWidth: 2,
  },
  dateButtonLabel: {
    fontSize: 16,
    fontWeight: '100',
    textAlign: 'left',
    flex: 1,
  },
  dateButtonContent: {
    paddingVertical: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  dateInputContainer: {
    marginTop: 8,
  },
  dateInputLabel: {
    color: '#666',
    marginBottom: 4,
    textAlign: 'left',
  },
});
