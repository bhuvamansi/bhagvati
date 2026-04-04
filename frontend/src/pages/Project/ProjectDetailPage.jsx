import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProjectById } from '../../utils/api';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getProjectById(id).then((res)=>setProject(res?.data?.project || null)).catch((err)=>setError(err.message));
  }, [id]);

  if (error) return <div className="pt-32 px-8 text-red-600">{error}</div>;
  if (!project) return <div className="pt-32 px-8 text-stone">Loading project...</div>;

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-screen-xl px-8 lg:px-16">
        <Link to="/project" className="text-xs uppercase tracking-[0.24em] text-stone underline-link">Back to projects</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] bg-cream"><img src={project.coverImage || project.images?.[0]?.url} alt={project.title} className="h-full w-full object-cover" /></div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-stone">{project.category}</p>
            <h1 className="mt-4 font-serif-display text-6xl text-charcoal">{project.title}</h1>
            <p className="mt-4 text-sm leading-7 text-stone">{project.description}</p>
            <div className="mt-8 rounded-[1.5rem] bg-cream p-5 text-sm text-charcoal">
              <div><strong>Location:</strong> {project.location}</div>
              <div className="mt-2"><strong>Year:</strong> {project.year}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
