import React, { useState } from 'react';
import projects from '../projects.json';
import ProjectCard from './ProjectCard';

interface SidebarProps {
  selectedCity?: string | null;
  onClearCity?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCity, onClearCity }) => {
  // Collect all unique tech stacks
  const allTechStacks = Array.from(
    new Set(
      projects.flatMap((p) => (Array.isArray(p.tech_stack) ? p.tech_stack : []))
    )
  ).sort();

  const [selectedTech, setSelectedTech] = useState<string>('');

  // Filter by city first
  const filteredProjects = selectedCity
    ? projects.filter((p) => {
        if (Array.isArray(p.city)) {
          return p.city.map((c) => c.trim().toLowerCase()).includes(selectedCity.trim().toLowerCase());
        } else {
          return p.city.trim().toLowerCase() === selectedCity.trim().toLowerCase();
        }
      })
    : projects;

  // Then filter by tech stack
  const techFilteredProjects = selectedTech
    ? filteredProjects.filter((p) => Array.isArray(p.tech_stack) && p.tech_stack.includes(selectedTech))
    : filteredProjects;

  let spotlightProjects: typeof projects = [];
  let otherProjects: typeof projects = [];

  if (!selectedCity) {
    spotlightProjects = techFilteredProjects.filter((p) => p.spotlight);
    otherProjects = techFilteredProjects.filter((p) => !p.spotlight);
  } else {
    otherProjects = techFilteredProjects;
  }

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title" style={{ marginBottom: '0px' }}>My Work Across Cities</h3>
      <p className="sidebar-subtitle">Tap a city on the globe or topic below to filter and explore.</p>
      {/* Tech stack dropdown */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', verticalAlign: 'middle' }}>
          <button
            type="button"
            onClick={() => setSelectedTech('')}
            style={{
              background: selectedTech === '' ? '#f5f5e6' : '#000',
              color: selectedTech === '' ? '#000' : '#f5f5e6',
              border: '1.5px solid #444',
              borderRadius: 8,
              padding: '1px 8px',
              fontSize: '0.92rem',
              fontStyle: 'italic',
              minHeight: 18,
              cursor: 'pointer',
              fontWeight: selectedTech === '' ? 700 : 400,
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            All
          </button>
          {allTechStacks.map((stack) => (
            <button
              key={stack}
              type="button"
              onClick={() => setSelectedTech(stack)}
              style={{
                background: selectedTech === stack ? '#f5f5e6' : '#000',
                color: selectedTech === stack ? '#000' : '#f5f5e6',
                border: '1.5px solid #444',
                borderRadius: 8,
                padding: '1px 8px',
                fontSize: '0.92rem',
                fontStyle: 'italic',
                minHeight: 18,
                cursor: 'pointer',
                fontWeight: selectedTech === stack ? 700 : 400,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {stack}
            </button>
          ))}
        </div>
      </div>
      {selectedCity && (
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedCity}</span>
          <button className="show-all-btn" onClick={onClearCity} style={{ marginLeft: 12 }}>Show All</button>
        </div>
      )}
      <div className="sidebar-project-list">
        {(!selectedCity && spotlightProjects.length > 0) && (
          <div className="spotlight-section">
            <div className="spotlight-heading">Spotlight Projects</div>
            <div className="sidebar-project-list">
              {spotlightProjects.map((project) => (
                <div key={project.id} className="sidebar-project-card-wrapper">
                  <ProjectCard
                    title={project.title}
                    image={project.image}
                    description={project.description || undefined}
                    link={project.link || undefined}
                    spotlight={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {otherProjects.length === 0 && selectedCity && (
          <div style={{ color: '#bbb', fontStyle: 'italic', marginTop: 12, marginBottom: 12 }}>
            No projects here yet.
          </div>
        )}
        {otherProjects.map((project) => (
          <div key={project.id} className="sidebar-project-card-wrapper">
            <ProjectCard
              title={project.title}
              image={project.image}
              description={project.description || undefined}
              link={project.link || undefined}
              spotlight={project.spotlight}
            />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar; 