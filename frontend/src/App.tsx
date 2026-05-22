import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const TaskDetail = lazy(() => import('./pages/TaskDetail'));
const Teams = lazy(() => import('./pages/Teams'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Monitoring = lazy(() => import('./pages/Monitoring'));

const MainLayout = lazy(() => import('./components/layout/MainLayout'));
const AuthLayout = lazy(() => import('./components/layout/AuthLayout'));

const Loading = () => <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
