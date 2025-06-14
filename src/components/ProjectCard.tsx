import React from 'react';

interface ProjectCardProps {
  title: string;
  image: string;
  description?: string;
  link?: string;
  spotlight?: boolean;
  role?: string;
  date?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, image, description, link, spotlight, role, date }) => {
  return (
    <div className={`project-card${spotlight ? ' spotlight-card' : ''}`}>
      {spotlight && (
        <div className="spotlight-badge" title="Spotlight Project">★</div>
      )}
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="project-title-link">
          <h4 className="project-card-title">{title} <span className="external-link-icon">↗</span></h4>
        </a>
      ) : (
        <h4 className="project-card-title">{title}</h4>
      )}
      <div className="project-card-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
        <div className="project-card-image-col" style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="project-image-link">
              <img src={`/assets/${image}`} alt={title} className="project-card-image-large" />
            </a>
          ) : (
            <img src={`/assets/${image}`} alt={title} className="project-card-image-large" />
          )}
          {role && (
            <div style={{ width: '100%', textAlign: 'left', marginTop: '6px' }}>
              <div className="project-role" style={{
                fontSize: '0.95rem',
                color: '#f5f5e6',
                fontWeight: 'bold',
                fontStyle: 'normal',
              }}>
                {role}
              </div>
              {date && (
                <div className="project-date" style={{
                  fontSize: '0.85rem',
                  color: '#e0e0e0',
                  marginTop: '2px',
                  fontWeight: 400,
                  fontStyle: 'italic',
                }}>
                  {date}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="project-card-description-col" style={{ flex: '1 1 0', display: 'flex' }}>
          {description && <p className="project-card-description" style={{ margin: 0 }}>{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 