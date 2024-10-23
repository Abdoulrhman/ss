import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Dashboard from './pages/dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default App;
