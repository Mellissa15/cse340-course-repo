import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

/* --------------------------------------
   CATEGORIES LIST PAGE (/categories)
-------------------------------------- */
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

/* --------------------------------------
   CATEGORY DETAILS PAGE (/category/:id)
-------------------------------------- */
const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    res.render('category', {
        title: category.name,
        category,
        projects
    });
};

/* --------------------------------------
   EXPORTS
-------------------------------------- */
export {
    showCategoriesPage,
    showCategoryDetailsPage
};