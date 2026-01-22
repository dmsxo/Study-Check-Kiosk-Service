import MainLayout from './Mainlayout';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import AcademicCalendar from './product/AcademicCalendar/AcademicCalendar';
import Analytics from './product/Analytics/Analytics';
import Dashboard from './product/Dashboard';
import PosterList from './product/PosterList';
import TeacherList from './product/TeacherList';
import StudentList from './product/StudentList';
import Settings from './product/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/calendar" element={<AcademicCalendar />} />
          <Route path="/posters" element={<PosterList />} />
          <Route path="/teachers" element={<TeacherList />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
