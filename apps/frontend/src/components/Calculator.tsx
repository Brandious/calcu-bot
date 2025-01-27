import React, { useState } from 'react';
import { useConnection } from '../context/ConnectionContext';
import { Button, Flex, Input, message, theme, Typography } from 'antd';
import ResultsOverview from './ResultsOverview';


const { Title } = Typography;

const Calculator: React.FC = () => {
    const [expression, setExpression] = useState('');
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

                    style={{
                        marginBottom: '20px'
                    }}
                />

                <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}

                >
                    Calculate
                </Button>
            </Flex>
        </Flex>
    );
};

export default Calculator;