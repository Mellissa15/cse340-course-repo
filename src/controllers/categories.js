import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

/* --------------------------------------
   CATEGORY VALIDATION
-------------------------------------- */
export const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

/* --------------------------------------
   CATEGORIES LIST PAGE (/categories)
-------------------------------------- */
export const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', {
        title,
        categories
    });
};

/* --------------------------------------
   CATEGORY DETAILS PAGE (/category/:id)
-------------------------------------- */
export const showCategoryDetailsPage = async (req, res) => {
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
   SHOW NEW CATEGORY FORM
-------------------------------------- */
export const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'Add New Category'
    });
};

/* --------------------------------------
   PROCESS NEW CATEGORY FORM
-------------------------------------- */
export const processNewCategoryForm = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    const { name } = req.body;

    try {

        const categoryId = await createCategory(name);

        req.flash('success', 'Category created successfully');

        res.redirect(`/category/${categoryId}`);

    } catch (error) {

        console.error(error);

        req.flash('error', 'Failed to create category');

        res.redirect('/new-category');
    }
};

/* --------------------------------------
   SHOW EDIT CATEGORY FORM
-------------------------------------- */
export const showEditCategoryForm = async (req, res) => {

    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    res.render('edit-category', {
        title: 'Edit Category',
        category
    });
};

/* --------------------------------------
   PROCESS EDIT CATEGORY FORM
-------------------------------------- */
export const processEditCategoryForm = async (req, res) => {

    const categoryId = req.params.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { name } = req.body;

    try {

        await updateCategory(
            categoryId,
            name
        );

        req.flash('success', 'Category updated successfully');

        res.redirect(`/category/${categoryId}`);

    } catch (error) {

        console.error(error);

        req.flash('error', 'Failed to update category');

        res.redirect(`/edit-category/${categoryId}`);
    }
};

/* --------------------------------------
   SHOW ASSIGN CATEGORIES FORM
-------------------------------------- */
export const showAssignCategoriesForm = async (req, res) => {

    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    res.render('assign-categories', {
        title: 'Assign Categories to Project',
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

/* --------------------------------------
   PROCESS ASSIGN CATEGORIES FORM
-------------------------------------- */
export const processAssignCategoriesForm = async (req, res) => {

    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    await updateCategoryAssignments(
        projectId,
        categoryIdsArray
    );

    req.flash('success', 'Categories updated successfully.');

    res.redirect(`/project/${projectId}`);
};

