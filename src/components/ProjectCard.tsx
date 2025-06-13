import React from 'react';

interface ProjectCardProps {
  title: string;
  image: string;
  description?: string;
  link?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, image, description, link }) => {
  return (
    <div className="project-card">
      <h4 className="project-card-title">
        {title}
        {link && <span className="external-link-icon" title="Opens project webpage">↗</span>}
      </h4>
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