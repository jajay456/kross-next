import {Router, Route, Routes, Navigate} from 'react-router-dom'
import Players from './pages/Players'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/players" replace />} />
        <Route path="/players" element={<Players />} />
        <Route path="/players/:id" element={<Players />} />
        <Route path="*" element={<Navigate to="/players" replace />} />
      </Routes>
    </>
  )
}

export default App
