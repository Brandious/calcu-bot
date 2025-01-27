// apps/frontend/src/components/ResultsOverview.tsx
import { Flex, Typography, theme } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { Evaluation } from '../types';

const { Text } = Typography;

interface ResultsOverviewProps {
    results: Array<Evaluation>

}

const ResultsOverview: React.FC<ResultsOverviewProps> = ({ results }) => {
    const { token } = theme.useToken();

    const containerRef = useRef<HTMLDivElement>(null);
    // Sort results by timestamp
    const sortedResults = useMemo(() => {
        return [...results]
    }, [results]);

    // Auto-scroll to bottom when new results are added
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [results]);

    return (
        <Flex
            vertical
            ref={containerRef}
            style={{
                height: '300px',
                backgroundColor: token.colorBgContainer,
                padding: '16px',
                overflow: 'auto',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column-reverse',
            }}
        >
            {/* Results List */}
            <Flex
                vertical
                gap="small"
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {sortedResults.map((item, index) => {
                    return (
                        <Flex
                            key={index}
                            justify={item.isHistory ? "flex-start" : "flex-end"}
                            style={{
                                padding: '8px',
                                backgroundColor: 'transparent',

                            }}
                        >
                            <Flex
                                vertical
                                gap="small"
                                style={{
                                    flex: 1
                                }}
                            >
                                <Text
                                    style={{
                                        color: item.isHistory ? token.colorTextSecondary : token.colorTextBase,
                                        fontSize: '14px',
                                        textAlign: item.isHistory ? 'left' : 'right',
                                        flex: 1
                                    }}
                                >
                                    {item.expression} = {item.result}
                                </Text>
                            </Flex>
                        </Flex>
                    );
                })}
            </Flex>
        </Flex>
    );
};

export default ResultsOverview;