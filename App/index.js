// Filename: index.js
// Combined code from all files

import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

const CELL_SIZE = 20;
const BOARD_SIZE = 15 * CELL_SIZE;

const SnakeGame = () => {
    const [gameOver, setGameOver] = useState(false);
    const [direction, setDirection] = useState('RIGHT');
    const [snake, setSnake] = useState([
        { x: 0, y: 0 },
        { x: CELL_SIZE, y: 0 },
    ]);
    const [food, setFood] = useState(generateFood());

    const gameInterval = useRef(null);

    useEffect(() => {
        if (!gameOver) {
            gameInterval.current = setInterval(moveSnake, 200);
            return () => clearInterval(gameInterval.current);
        }
    }, [snake, gameOver]);

    const moveSnake = () => {
        let newSnake = [...snake];
        let head = { ...newSnake[newSnake.length - 1] };

        switch (direction) {
            case 'UP':
                head.y -= CELL_SIZE;
                break;
            case 'DOWN':
                head.y += CELL_SIZE;
                break;
            case 'LEFT':
                head.x -= CELL_SIZE;
                break;
            case 'RIGHT':
                head.x += CELL_SIZE;
                break;
        }

        if (head.x >= BOARD_SIZE || head.y >= BOARD_SIZE || head.x < 0 || head.y < 0 || checkCollision(head)) {
            setGameOver(true);
            return;
        }

        if (head.x === food.x && head.y === food.y) {
            newSnake.push(head);
            setFood(generateFood());
        } else {
            newSnake.shift();
            newSnake.push(head);
        }
        setSnake(newSnake);
    };

    const checkCollision = (head) => {
        return snake.some(segment => segment.x === head.x && segment.y === head.y);
    };

    const generateFood = () => {
        const x = Math.floor(Math.random() * BOARD_SIZE / CELL_SIZE) * CELL_SIZE;
        const y = Math.floor(Math.random() * BOARD_SIZE / CELL_SIZE) * CELL_SIZE;
        return { x, y };
    };

    const handleDirectionChange = (newDirection) => {
        const validDirectionChange = 
            (direction === 'UP' && newDirection !== 'DOWN') ||
            (direction === 'DOWN' && newDirection !== 'UP') ||
            (direction === 'LEFT' && newDirection !== 'RIGHT') ||
            (direction === 'RIGHT' && newDirection !== 'LEFT');

        if (validDirectionChange) {
            setDirection(newDirection);
        }
    };

    const handleRestart = () => {
        setSnake([
            { x: 0, y: 0 },
            { x: CELL_SIZE, y: 0 },
        ]);
        setDirection('RIGHT');
        setFood(generateFood());
        setGameOver(false);
    };

    return (
        <View style={styles.gameContainer}>
            {snake.map((segment, index) => (
                <View key={index} style={[styles.snakeSegment, { left: segment.x, top: segment.y }]} />
            ))}
            <View style={[styles.food, { left: food.x, top: food.y }]} />
            {gameOver && (
                <View style={styles.gameOver}>
                    <Text style={styles.gameOverText}>Game Over</Text>
                    <Button title="Restart" onPress={handleRestart} />
                </View>
            )}
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => handleDirectionChange('UP')} style={styles.controlButton}>
                    <Text style={styles.controlButtonText}>↑</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDirectionChange('LEFT')} style={styles.controlButton}>
                    <Text style={styles.controlButtonText}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDirectionChange('DOWN')} style={styles.controlButton}>
                    <Text style={styles.controlButtonText}>↓</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDirectionChange('RIGHT')} style={styles.controlButton}>
                    <Text style={styles.controlButtonText}>→</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    gameContainer: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        backgroundColor: '#000000',
        position: 'relative',
        alignSelf: 'center',
        marginTop: 20,
    },
    snakeSegment: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: '#00FF00',
        position: 'absolute',
    },
    food: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: '#FF0000',
        position: 'absolute',
    },
    gameOver: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        borderRadius: 10,
    },
    gameOverText: {
        color: '#FFFFFF',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    controlButton: {
        padding: 10,
        backgroundColor: '#000000',
        borderRadius: 5,
    },
    controlButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
    },
});

export default function App() {
    return (
        <SafeAreaView style={appStyles.container}>
            <Text style={appStyles.title}>Snake Game</Text>
            <SnakeGame />
        </SafeAreaView>
    );
}

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
    },
});