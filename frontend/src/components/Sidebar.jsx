import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        LogiEdge
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/master"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Master
        </NavLink>
        <NavLink
          to="/billing"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Billing
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;