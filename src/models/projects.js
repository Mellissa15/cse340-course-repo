import db from './db.js';

/* --------------------------------------
   GET PROJECTS BY ORGANIZATION
-------------------------------------- */
export const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      project_id,
      title,
      description,
      location,
      project_date,
      organization_id
    FROM public.service_project
    WHERE organization_id = $1
    ORDER BY project_date ASC;
  `;

  const result = await db.query(query, [organizationId]);
  return result.rows;
};

/* --------------------------------------
   GET UPCOMING PROJECTS
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
   GET SINGLE PROJECT DETAILS
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

/* --------------------------------------
   GET CATEGORIES FOR A PROJECT
-------------------------------------- */
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

/* --------------------------------------
   CREATE NEW PROJECT
-------------------------------------- */
export const createProject = async (
  title,
  description,
  location,
  date,
  organizationId
) => {
  const query = `
    INSERT INTO public.service_project
      (title, description, location, project_date, organization_id)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const result = await db.query(query, [
    title,
    description,
    location,
    date,
    organizationId
  ]);

  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new project with ID:', result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

export const updateProject = async (
  projectId,
  title,
  description,
  location,
  date,
  organizationId
) => {
  const query = `
    UPDATE public.service_project
    SET
      title = $1,
      description = $2,
      location = $3,
      project_date = $4,
      organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const result = await db.query(query, [
    title,
    description,
    location,
    date,
    organizationId,
    projectId
  ]);

  if (result.rows.length === 0) {
    throw new Error('Project not found or update failed');
  }

  return result.rows[0].project_id;
};