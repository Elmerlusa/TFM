import { Navigate, Route, Routes } from 'react-router';
import MyNavbar from './components/MyNavbar';
import MyHeader from './components/MyHeader';
import Cyberattacks from './pages/Cyberattacks';
import CyberattackDetails from './pages/CyberattackDetails';
import Cybercriminals from './pages/Cybercriminals';
import CybercriminalDetails from './pages/CybercriminalDetails';
import GlobalStats from './pages/GlobalStats';
import ErrorDetails from './pages/ErrorDetails';
import MyFooter from './components/MyFooter';

const App = () => {
  return (
    <div className='min-vh-100 d-flex flex-column text-white'>
      <MyHeader />
      <MyNavbar />
      <main className="flex-grow-1 p-5" style={{ backgroundColor: '#0d1117' }}>  
        <Routes>
          <Route index element={<Navigate to="/ciberataques" replace/>} />
          <Route path="ciberataques" element={<Cyberattacks />}>
            <Route path=":id" element={<CyberattackDetails />} />
          </Route>
          <Route path="cibercriminales" element={<Cybercriminals />}>
            <Route path=":name" element={<CybercriminalDetails />} />
          </Route>
          <Route path="estadisticas" element={<GlobalStats />} />
          <Route path="*" element={<ErrorDetails />} />
        </Routes>
      </main>
      <MyFooter />
    </div>
  );
}

export default App;
