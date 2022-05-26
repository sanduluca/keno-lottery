import { TouchableOpacity } from 'react-native';
import { Text } from '../components/Themed';

interface SquareBtnProps<T> {
    size?: number;
    item: T;
    onPress: (i: T) => any;
    isSelected: boolean;
    text: string;
}

const SquareBtn = <T extends unknown>({
    size = 30,
    item,
    onPress,
    isSelected,
    text,
}: SquareBtnProps<T>) => {
    return (
        <TouchableOpacity style={{
            height: size,
            width: size,
            backgroundColor: isSelected ? 'green' : '#ccc',
            marginVertical: 4,
            marginHorizontal: 4,
        }}
            onPress={() => onPress(item)}
        >
            <Text style={{ textAlign: 'center', flex: 1, textAlignVertical: 'center' }}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}

export default SquareBtn