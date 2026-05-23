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
   EXPORT FUNCTIONS
-------------------------------------- */
export {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId
};