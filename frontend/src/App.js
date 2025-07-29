import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobList from './pages/JobList';
// We will add Apply and Admin pages later

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobList />} />
      </Routes>
    </Router>
  );
}

export default App;
