import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import TicketsList from './pages/admin/TicketsList';
import ProtectedRoute from './components/ProtectedRoute';
import AgentDashboard from './pages/agent/AgentDashboard';
import ResolvedTickets from './pages/agent/ResolvedTickets';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import SearchTickets from './pages/customer/SearchTickets';
import AssignTicketsPage from './pages/admin/AssignTicketsPage';
import TicketCommentsPage from './pages/customer/TicketCommentsPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/tickets"
            element={<ProtectedRoute role="Admin"><TicketsList /></ProtectedRoute>}
          />
          <Route
            path="/agent/dashboard"
            element={<ProtectedRoute role="Agent"><AgentDashboard /></ProtectedRoute>}
          />
          <Route
            path="/agent/resolved"
            element={<ProtectedRoute role="Agent"><ResolvedTickets /></ProtectedRoute>}
          />
          <Route
            path="/customer/dashboard"
            element={<ProtectedRoute role="Customer"><CustomerDashboard /></ProtectedRoute>}
          />
          <Route
            path="/customer/search"
            element={<ProtectedRoute role="Customer"><SearchTickets /></ProtectedRoute>}
          />
          <Route 
            path="/admin/dashboard" 
            element={<AdminDashboard />} 
          />
          <Route 
            path="/admin/assign/:agentId" 
            element={<AssignTicketsPage />} 
          />
          <Route 
            path="/customer/tickets/:ticketId/comments" 
            element={<TicketCommentsPage />} 
            />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
