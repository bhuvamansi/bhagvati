import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../../utils/api';

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    getProjects({ limit: 100 }).then((res) => setProjects(res?.data?.projects || [])).catch(() => {});
  }, []);

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-screen-xl px-8 lg:px-16">
        <p className="tracking-label text-stone">Portfolio</p>
        <h1 className="mt-4 font-serif-display text-6xl text-charcoal">Projects</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project._id} to={`/project/${project.slug || project._id}`} className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1">
              <div className="h-72 overflow-hidden"><img src={project.coverImage || project.images?.[0]?.url} alt={project.title} className="h-full w-full object-cover" /></div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-stone">{project.category}</p>
                <h2 className="mt-2 font-serif-display text-4xl text-charcoal">{project.title}</h2>
                <p className="mt-3 text-sm leading-7 text-stone">{project.summary}</p>
                <p className="mt-4 text-sm text-stone">{project.location} • {project.year}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
