import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <h1 className="text-4xl text-center pt-20">Debug App</h1>
        <Routes>
          <Route path="/" element={<div className="text-center mt-10 text-2xl">Landing Page Works!</div>} />
          <Route path="/test" element={<div className="text-center mt-10 text-2xl">Test Route Works!</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App