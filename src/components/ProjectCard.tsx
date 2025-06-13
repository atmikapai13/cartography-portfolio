import React from 'react';

interface ProjectCardProps {
  title: string;
  image: string;
  description?: string;
  link?: string;
  spotlight?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, image, description, link, spotlight }) => {
  return (
    <div className={`project-card${spotlight ? ' spotlight-card' : ''}`}>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="project-title-link">
          <h4 className="project-card-title">{title} <span className="external-link-icon">↗</span></h4>
        </a>
      ) : (
        <h4 className="project-card-title">{title}</h4>
      )}
      <div className="project-card-row">
        <div className="project-card-image-col">
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="project-image-link">
              <img src={`/assets/${image}`} alt={title} className="project-card-image-large" />
            </a>
          ) : (
            <img src={`/assets/${image}`} alt={title} className="project-card-image-large" />
          )}
        </div>
        {description && <p className="project-card-description">{description}</p>}
      </div>
    </div>
  );
};

export default ProjectCard; 