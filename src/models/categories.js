import db from './db.js';

/* --------------------------------------
   GET ALL CATEGORIES
-------------------------------------- */
const getAllCategories = async () => {
  const query = `
    SELECT category_id, name
    FROM public.category
    ORDER BY name;
  `;

  const result = await db.query(query);
  return result.rows;
};

/* --------------------------------------
   GET CATEGORY BY ID
-------------------------------------- */
const getCategoryById = async (id) => {
  const query = `
    SELECT category_id, name
    FROM public.category
    WHERE category_id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};

/* --------------------------------------
   CREATE CATEGORY
-------------------------------------- */
const createCategory = async (name) => {
  const query = `
    INSERT INTO public.category (name)
    VALUES ($1)
    RETURNING category_id;
  `;

  const result = await db.query(query, [name]);

  if (result.rows.length === 0) {
    throw new Error('Failed to create category');
  }

  return result.rows[0].category_id;
};

/* --------------------------------------
   UPDATE CATEGORY
-------------------------------------- */
const updateCategory = async (categoryId, name) => {
  const query = `
    UPDATE public.category
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id;
  `;

  const result = await db.query(query, [name, categoryId]);

  if (result.rows.length === 0) {
    throw new Error('Failed to update category');
  }

  return result.rows[0];
};

/* --------------------------------------
   GET PROJECTS BY CATEGORY ID
-------------------------------------- */
const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT
      sp.project_id,
      sp.title,
      sp.project_date,
      sp.location
    FROM public.service_project sp
    JOIN public.project_category pc
      ON sp.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY sp.project_date;
  `;

  const result = await db.query(query, [categoryId]);
  return result.rows;
};

/* --------------------------------------
   GET CATEGORIES ASSIGNED TO A PROJECT
-------------------------------------- */
const getCategoriesByServiceProjectId = async (projectId) => {
  const query = `
    SELECT c.category_id, c.name
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
   ASSIGN SINGLE CATEGORY TO PROJECT
-------------------------------------- */
const assignCategoryToProject = async (projectId, categoryId) => {
  const query = `
    INSERT INTO public.project_category (project_id, category_id)
    VALUES ($1, $2);
  `;

  await db.query(query, [projectId, categoryId]);
};

/* --------------------------------------
   UPDATE ALL CATEGORY ASSIGNMENTS FOR A PROJECT
-------------------------------------- */
const updateCategoryAssignments = async (projectId, categoryIds) => {

  const deleteQuery = `
    DELETE FROM public.project_category
    WHERE project_id = $1;
  `;

  await db.query(deleteQuery, [projectId]);

  if (!categoryIds || categoryIds.length === 0) {
    return;
  }

  const ids = Array.isArray(categoryIds)
    ? categoryIds
    : [categoryIds];

  for (const categoryId of ids) {
    await assignCategoryToProject(projectId, categoryId);
  }
};

/* --------------------------------------
   EXPORT FUNCTIONS
-------------------------------------- */
export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  getProjectsByCategoryId,
  getCategoriesByServiceProjectId,
  updateCategoryAssignments
};