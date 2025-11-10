import MainLayout from './pages/Mainlayout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* <Route path="/"/> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
