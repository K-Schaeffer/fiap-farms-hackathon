import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  List,
  Text,
  Divider,
  Surface,
  IconButton,
  Portal,
  Modal,
} from 'react-native-paper';

export interface MobileNotificationData {
  id: string;
  title: string;
  isRead?: boolean;
}

export interface MobileNotificationMenuProps {
  visible: boolean;
  onDismiss: () => void;
  notifications?: MobileNotificationData[];
  onNotificationPress?: (notificationId: string) => void;
}

export function MobileNotificationMenu({
  visible,
  onDismiss,
  notifications = [],
  onNotificationPress,
}: MobileNotificationMenuProps) {
  const handleNotificationPress = (notification: MobileNotificationData) => {
    if (onNotificationPress && !notification.isRead) {
      onNotificationPress(notification.id);
    }
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
        style={styles.modal}
      >
        <Surface style={styles.surface}>
          <View style={styles.header}>
            <Text variant="titleLarge" style={styles.headerText}>
              Notifications
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={onDismiss}
              style={styles.closeButton}
            />
          </View>

          <Divider />

          {notifications.length > 0 ? (
            <ScrollView style={styles.notificationsList}>
              {notifications.map((notification, index) => (
                <View key={notification.id}>
                  <List.Item
                    title={notification.title}
                    onPress={() => handleNotificationPress(notification)}
                    titleStyle={[
                      styles.notificationTitle,
                      {
                        fontWeight: notification.isRead ? 'normal' : 'bold',
                        opacity: notification.isRead ? 0.7 : 1,
                      },
                    ]}
                    style={styles.notificationItem}
                    left={() => (
                      <List.Icon
                        icon={notification.isRead ? 'check-circle' : 'circle'}
                        color={notification.isRead ? '#4caf50' : '#2196f3'}
                      />
                    )}
                  />
                  {index < notifications.length - 1 && <Divider />}
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <List.Icon icon="bell-off" color="#9e9e9e" />
              <Text variant="bodyLarge" style={styles.emptyText}>
                No new notifications
              </Text>
              <Text variant="bodySmall" style={styles.emptySubtext}>
                You're all caught up!
              </Text>
            </View>
          )}
        </Surface>
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
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  surface: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    maxWidth: 400,
    width: '100%',
    maxHeight: '90%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  headerText: {
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    margin: 0,
  },
  notificationsList: {
    minHeight: 150,
    maxHeight: 200,
  },
  notificationItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notificationTitle: {
    fontSize: 14,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  emptyContainer: {
    paddingTop: 16,
    padding: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
    color: '#757575',
  },
  emptySubtext: {
    textAlign: 'center',
    marginTop: 4,
    color: '#9e9e9e',
  },
});
