import React from 'react';
import projects from '../projects.json';
import ProjectCard from './ProjectCard';

interface SidebarProps {
  selectedCity?: string | null;
  onClearCity?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCity, onClearCity }) => {
  const filteredProjects = selectedCity
    ? projects.filter((p) => p.city.trim().toLowerCase() === selectedCity.trim().toLowerCase())
    : projects;

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title" style={{ marginBottom: '0px' }}>My Work Across Cities</h3>
      <p className="sidebar-subtitle">Select a city to see projects connected to that place.</p>
      {selectedCity && (
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>{selectedCity}</span>
          <button className="sidebar-clear-btn" onClick={onClearCity} style={{ marginLeft: 12, fontSize: '0.9rem', background: 'none', color: '#e0e0e0', border: 'none', cursor: 'pointer', textDecoration: 'underline dotted' }}>Show All</button>
        </div>
      )}
      <div className="sidebar-project-list">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="sidebar-project-card-wrapper"
            style={{ cursor: 'default' }}
          >
            <ProjectCard
              title={project.title}
              image={project.image}
              description={project.description || undefined}
              link={project.link || undefined}
              github={project.github || undefined}
            />
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <div style={{ color: '#aaa', fontStyle: 'italic', marginTop: 16 }}>No projects for this city.</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 