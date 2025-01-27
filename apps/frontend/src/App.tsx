import './App.css'
import { Button, ConfigProvider, theme } from 'antd';
import { ConnectionProvider } from './context/ConnectionContext';
import { useState } from 'react';
import Calculator from './components/Calculator';

function App() {
  const [showCalc, setShowCalc] = useState(false)

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1668dc',
          borderRadius: 6,
        },
      }}
    >
      <ConnectionProvider>
        {!showCalc ? <Button type="primary" onClick={() => setShowCalc(true)}>Start Calculating</Button> : <Calculator />}
      </ConnectionProvider>
    </ConfigProvider>
  )
}

export default App
