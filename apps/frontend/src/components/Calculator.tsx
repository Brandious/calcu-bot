import React, { useState } from 'react';
import { useConnection } from '../context/ConnectionContext';
import { Button, Flex, Input, message, theme, Typography } from 'antd';
import ResultsOverview from './ResultsOverview';


const { Title } = Typography;

const Calculator: React.FC = () => {
    const [expression, setExpression] = useState('');
    const [arrowPressCount, setArrowPressCount] = useState(0); // State to track arrow key presses

    const { isConnected, evaluate, getHistory, sessionResults } = useConnection();
    const { token } = theme.useToken();

    const handleInput = (input: string) => {
        setExpression(input);
    };

    const handleSubmit = () => {
        if (!expression.trim()) {
            return;
        }

        const normalizedInput = expression.trim().toLowerCase();
        setExpression("")
        setArrowPressCount(0)
        // Check if input is a history command
        if (normalizedInput === 'history' || normalizedInput === 'show history') {
            getHistory();

            return;
        }

        // Check if input is a valid mathematical expression
        // Basic validation for mathematical expression
        const isValidMathExpression = /^[0-9+\-*/(). ]+$/.test(normalizedInput);

        if (isValidMathExpression) {
            evaluate(normalizedInput);

        } else {
            message.error('Invalid input. Please enter a valid mathematical expression or "history"');
        }



    };


    const handleArrowUp = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowUp') {

            if (sessionResults.length - arrowPressCount - 1 < 0) { setArrowPressCount(0); return; }

            const latestEntry = sessionResults[sessionResults.length - arrowPressCount - 1]; // Get the latest entry
            setArrowPressCount(arrowPressCount + 1)

            if (latestEntry) {
                setExpression(latestEntry.expression)
                return;
            }


        }
        return null; // Return null if no valid entry is found
    };

    return (
        <Flex
            vertical
            style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: token.padding,
                boxSizing: 'border-box'
            }}
            className="calculator-container"
        >
            <Title level={2}>CalcuBot</Title>

            <div style={{
                marginBottom: '40px',
                color: isConnected ? '#52c41a' : '#ff4d4f'
            }}>
                {isConnected ? 'Connected' : 'Disconnected'}
            </div>

            <Flex vertical style={{
                marginBottom: '20px'
            }}>
                {/* Results Overview Component */}
                <ResultsOverview
                    results={sessionResults}
                />

                <Input
                    size="large"
                    value={expression}
                    onChange={(e) => handleInput(e.target.value)}
                    placeholder="Enter your mathematical expression..."
                    onPressEnter={handleSubmit}
                    onKeyDown={handleArrowUp}
                    style={{
                        marginBottom: '20px'
                    }}
                    disabled={!isConnected}
                />

                <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    disabled={!isConnected}

                >
                    Calculate
                </Button>
            </Flex>
        </Flex>
    );
};

export default Calculator;