import { Navigate, Route, Routes } from 'react-router';
import CyberattackList from './components/CyberattackList';
import CyberattackDetails from './components/CyberattackDetails';
import CybercriminalList from './components/CybercriminalList';
import CybercriminalDetails from './components/CybercriminalDetails';
import Statistics from './components/Statistics';
import ErrorDetails from './components/ErrorDetails';
import MyNavbar from './components/base/MyNavbar';
import MyHeader from './components/base/MyHeader';

const App = () => {
  return (
    <>
      <MyHeader />
      <MyNavbar />
      <main className="p-5">  
        <Routes>
          <Route index element={<Navigate to="/ciberataques" replace/>} />
          <Route path="ciberataques" element={<CyberattackList />}>
            <Route path=":id" element={<CyberattackDetails />} />
          </Route>
          <Route path="cibercriminales" element={<CybercriminalList />}>
            <Route path=":name" element={<CybercriminalDetails />} />
          </Route>
          <Route path="estadisticas" element={<Statistics />} />
          <Route path="*" element={<ErrorDetails />} />
        </Routes> 
      </main>
    </>
  );
}

export default App;
