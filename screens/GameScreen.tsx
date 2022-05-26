import { useCallback, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Modal from 'react-native-modalbox';

import { Text, View } from '../components/Themed';
import Copyright from '../components/Copyright'
import SquareBtn from '../components/SquareBtn'
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { getUniqueRndIntegers } from '../utils/helpers'
import { RootStackScreenProps } from '../types';

const TOTAL_NUMBER_SQUARES = 80
const NUMBER_PICK_LIMIT = 5

interface NumberObject {
  index: number;
  text: string;
  isSelected: boolean;
}

interface Bet {
  text: string;
  value: number;
}

const initialNumbers = {} as { [key: number]: NumberObject }
[...Array(TOTAL_NUMBER_SQUARES)].forEach((_, i) => {
  initialNumbers[i] = {
    index: i,
    text: (i + 1).toString(),
    isSelected: false
  }
})

const bets = [
  { value: 1, text: '1$' },
  { value: 2, text: '2$' },
  { value: 3, text: '3$' },
  { value: 5, text: '5$' },
  { value: 10, text: '10$' },
  { value: 20, text: '20$' },
]

export default function GameScreen({ navigation }: RootStackScreenProps<'Game'>) {

  const colorScheme = useColorScheme();
  const [numbers, setNumbers] = useState(initialNumbers)
  const [selected, setSelected] = useState(0)
  const [bet, onChangeBet] = useState<null | string>(null);
  const modal = useRef<Modal>(null)
  const [isValidAmount, setIsValidAmount] = useState(true)
  const [isValidPick, setIsValidPick] = useState(true)

  const onNumberPress = useCallback((item: NumberObject) => {

    if (!isValidPick) {
      setIsValidPick(true)
    }
    const index = item.index
    const { isSelected } = numbers[index]
    const wantToSelect = !isSelected
    if (wantToSelect && selected >= NUMBER_PICK_LIMIT) {
      return
    }

    const copy = { ...numbers[index], isSelected: wantToSelect }
    const copyAll = { ...numbers }
    copyAll[index] = copy

    setNumbers(copyAll)
    setSelected(selected + (wantToSelect ? 1 : -1))
  }, [numbers, isValidPick])


  const onQuickPickPress = useCallback(() => {
    const copyAll = { ...initialNumbers }
    const generated = getUniqueRndIntegers(0, TOTAL_NUMBER_SQUARES - 1, NUMBER_PICK_LIMIT)
    generated.forEach(num => {
      const randomPicked = {
        index: num,
        text: (num + 1).toString(),
        isSelected: true,
      }
      copyAll[num] = randomPicked
    })

    setNumbers(copyAll)
    setSelected(NUMBER_PICK_LIMIT)
  }, [])


  const numbersValues = Object.values(numbers)

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background, }}
    >
      <View style={{ marginHorizontal: 4, marginTop: 16, flex: 1, }}>
        <Text>1. Pick {NUMBER_PICK_LIMIT} numbers </Text>
        <View style={{ flex: 1, flexDirection: 'row', marginVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            style={{ height: 36, borderWidth: 1, borderColor: 'green', padding: 8, minWidth: 120 }}
            onPress={onQuickPickPress}
          >
            <Text style={{ textAlign: 'center' }}>Quick Pick</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 8 }}>
          <Text style={{ textAlign: 'center' }}>Or</Text>
        </View>
      </View>

      {
        /* Generate numbers rows */
        numbersValues.map((item, index) => {
          const numColumns = 8
          if (index % numColumns != 0) return null
          let row: JSX.Element[] = []
          for (let i = index; i < index + numColumns; i++) {
            if (numbersValues.length > i) {
              row.push(
                <SquareBtn<NumberObject>
                  key={numbersValues[i].index}
                  size={32}
                  item={numbersValues[i]}
                  isSelected={numbersValues[i].isSelected}
                  onPress={onNumberPress}
                  text={item.text}
                />
              )
            }
          }
          return (
            <View key={index} style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
              {row}
            </View>
          )
        })
      }


      <View style={{ marginHorizontal: 4, marginTop: 8, }}>
        <Text>2. How much do you want to play per draw ?</Text>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 }}>
          {
            bets.map(item => (
              <SquareBtn<Bet>
                key={item.value}
                size={32}
                item={item}
                isSelected={bet === item.value.toString()}
                onPress={() => {
                  if (!isValidAmount) {
                    setIsValidAmount(true)
                  }
                  onChangeBet(item.value.toString())
                }}
                text={item.text}
              />
            ))
          }
        </View>


        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 }}>
          <TextInput
            style={[styles.input, { color: Colors[colorScheme].text }]}
            onChangeText={(text) => {
              if (!isValidAmount) {
                setIsValidAmount(true)
              }
              onChangeBet(text)
            }}
            defaultValue={bet?.toString()}
            placeholder="Enter amount"
            placeholderTextColor={Colors[colorScheme].text}
            keyboardType="numeric"
          />
        </View>

        {
          !isValidPick && <Text
            style={{ color: 'red' }} >
            Please select {NUMBER_PICK_LIMIT} numbers
          </Text>
        }
        {
          !isValidAmount && <Text
            style={{ color: 'red' }}>
            Please set a valid bet
          </Text>
        }

        <TouchableOpacity
          style={{ height: 40, borderWidth: 1, borderColor: 'green', padding: 8, margin: 12 }}
          onPress={() => {
            const isNumeric = !isNaN(Number(bet))
            if (!isNumeric || Number(bet) < 1) {
              setIsValidAmount(false)
            }
            if (selected < NUMBER_PICK_LIMIT) {
              setIsValidPick(false)
            }
            if (isNumeric && Number(bet) > 0 && selected === NUMBER_PICK_LIMIT) {
              setIsValidAmount(true)
              setIsValidPick(true)
              modal.current?.open()
            }
          }}
        >
          <Text style={{ textAlign: 'center' }}>Place bet</Text>
        </TouchableOpacity>


        <Copyright />

      </View>

      <Modal
        style={[styles.modal]}
        ref={modal}
        swipeToClose={true}
        position='center'
      >
        <Text style={styles.text}>Success</Text>
      </Modal>

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#ccc',
    flex: 1
  },
  text: {
    color: "black",
    fontSize: 22
  },
  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    width: 150,
    borderRadius: 15
  },
});
