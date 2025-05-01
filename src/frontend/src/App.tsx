import { Navigate, Route, Routes } from 'react-router';
import CyberattackList from './components/CyberattackList';
import CyberattackDetails from './components/CyberattackDetails';
import CybercriminalList from './components/CybercriminalList';
import CybercriminalDetails from './components/CybercriminalDetails';
import Statistics from './components/Statistics';
import ErrorDetails from './components/ErrorDetails';
import CyberattackNavbar from './components/Navbar';

const App = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
        integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7"
        crossOrigin="anonymous"
      />
      <CyberattackNavbar />
      <Routes>
        <Route index element={<Navigate to="/ciberataques" replace/>} />
        <Route path="ciberataques" element={<CyberattackList />} />
        <Route path="ciberataques/:id" element={<CyberattackDetails />} />
        <Route path="cibercriminales" element={<CybercriminalList />} />
        <Route path="cibercriminales/:name" element={<CybercriminalDetails />} />
        <Route path="estadisticas" element={<Statistics />} />
        <Route path="*" element={<ErrorDetails />} />
      </Routes>
    </>
  );
}

export default App;
