import db from './db.js';

/* --------------------------------------
   GET ALL PROJECTS (existing)
-------------------------------------- */
export const getAllProjects = async () => {
  const query = `
    SELECT
      sp.project_id,
      sp.title,
      sp.description,
      sp.location,
      sp.project_date,
      o.name AS organization_name
    FROM public.service_project sp
    JOIN public.organization o
      ON sp.organization_id = o.organization_id
    ORDER BY sp.project_date;
  `;

  const result = await db.query(query);
  return result.rows;
};

/* --------------------------------------
   GET PROJECTS BY ORGANIZATION (existing)
-------------------------------------- */
export const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      sp.project_id,
      sp.organization_id,
      sp.title,
      sp.description,
      sp.location,
      sp.project_date,
      o.name AS organization_name
    FROM public.service_project sp
    JOIN public.organization o
      ON sp.organization_id = o.organization_id
    WHERE sp.organization_id = $1
    ORDER BY sp.project_date;
  `;

  const result = await db.query(query, [organizationId]);
  return result.rows;
};

/* --------------------------------------
   GET UPCOMING PROJECTS (NEW)
-------------------------------------- */
export const getUpcomingProjects = async (limit) => {
  const query = `
    SELECT
      sp.project_id,
      sp.title,
      sp.description,
      sp.location,
      sp.project_date,
      sp.organization_id,
      o.name AS organization_name
    FROM public.service_project sp
    JOIN public.organization o
      ON sp.organization_id = o.organization_id
    WHERE sp.project_date >= CURRENT_DATE
    ORDER BY sp.project_date ASC
    LIMIT $1;
  `;

  const result = await db.query(query, [limit]);
  return result.rows;
};

/* --------------------------------------
   GET SINGLE PROJECT DETAILS (NEW)
-------------------------------------- */
export const getProjectDetails = async (id) => {
  const query = `
    SELECT
      sp.project_id,
      sp.title,
      sp.description,
      sp.location,
      sp.project_date,
      sp.organization_id,
      o.name AS organization_name
    FROM public.service_project sp
    JOIN public.organization o
      ON sp.organization_id = o.organization_id
    WHERE sp.project_id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};

export const getCategoriesForProject = async (projectId) => {
  const query = `
    SELECT
      c.category_id,
      c.name
    FROM public.category c
    JOIN public.project_category pc
      ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name;
  `;

  const result = await db.query(query, [projectId]);
  return result.rows;
};