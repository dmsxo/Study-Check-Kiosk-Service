import MainLayout from './Mainlayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AcademicCalendar from './product/AcademicCalendar/AcademicCalendar';
import Analytics from './product/Analytics/Analytics';
import Dashboard from './product/Dashboard';
import PosterList from './product/PosterList';
import TeacherList from './product/TeacherList';
import SelfStudyScheduleManager from './TESTVIEW';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/calendar" element={<AcademicCalendar />} />
          <Route path="/posters" element={<PosterList />} />
          <Route path="/teachers" element={<SelfStudyScheduleManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
