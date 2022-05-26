import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

const rules = [
  'Select 5 spots (numbers) you would like to play.',
  'Choose your own spots (numbers) from (1 through 80) or use the Quik Pik option and let the computer select for you.',
  'Choose your play amount. You can play for $1 up to $5.'
]

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>

      {rules.map((text, index) => (
        <View key={text} style={styles.paragraph}>
          <Text>{`${index + 1}. ${text}`}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paragraph: {
    marginTop: 16,
    marginHorizontal: 16,
  },
});
