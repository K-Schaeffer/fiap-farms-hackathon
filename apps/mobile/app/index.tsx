import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../components/button';
import { Avatar, Card, IconButton } from 'react-native-paper';

export default function Native() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mobile</Text>
      <Button
        onClick={() => {
          console.log('Pressed!');
          alert('Pressed!');
        }}
        text="Boop"
      />
      <Card.Title
        title="Card Title"
        subtitle="Card Subtitle"
        left={props => <Avatar.Icon {...props} icon="folder" />}
        right={props => (
          <IconButton {...props} icon="dots-vertical" onPress={() => {}} />
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 36,
  },
});
