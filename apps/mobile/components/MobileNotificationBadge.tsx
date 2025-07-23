import React from 'react';
import { View } from 'react-native';
import { IconButton, Badge } from 'react-native-paper';

interface MobileNotificationBadgeProps {
  onPress: () => void;
  showBadge?: boolean;
  icon?: string;
  disabled?: boolean;
}

export function MobileNotificationBadge({
  onPress,
  showBadge = false,
  icon = 'bell',
  disabled = false,
}: MobileNotificationBadgeProps) {
  const handlePress = () => {
    console.log('Badge pressed! ShowBadge:', showBadge);
    onPress();
  };

  return (
    <View style={{ position: 'relative' }}>
      {showBadge && (
        <Badge
          visible={showBadge}
          size={8}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1,
            backgroundColor: '#f44336',
          }}
        />
      )}
      <IconButton
        icon={icon}
        size={24}
        onPress={handlePress}
        disabled={disabled}
        style={{
          margin: 0,
        }}
      />
    </View>
  );
} 