import {
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesForProject,
    createProject,
    updateProject
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';
/* ------------------------------------
   CONSTANT
-------------------------------------- */
const NUMBER_OF_UPCOMING_PROJECTS = 5;

/* --------------------------------------
   PROJECT VALIDATION
-------------------------------------- */
export const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),

    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

/* --------------------------------------
   PROJECTS LIST PAGE (/projects)
-------------------------------------- */
export const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', {
        title,
        projects
    });
};

/* --------------------------------------
   PROJECT DETAILS PAGE (/project/:id)
-------------------------------------- */
export const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesForProject(projectId);

    res.render('project', {
        title: project.title,
        project,
        categories
    });
};

/* --------------------------------------
   SHOW NEW PROJECT FORM
-------------------------------------- */
export const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', {
        title,
        organizations
    });
};

/* --------------------------------------
   PROCESS NEW PROJECT FORM
-------------------------------------- */
export const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { organizationId, title, description, location, date } = req.body;

    try {
        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);

        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

/* --------------------------------------
   SHOW EDIT PROJECT FORM
-------------------------------------- */
export const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    res.render('edit-project', {
        title: 'Edit Service Project',
        project,
        organizations
    });
};

/* --------------------------------------
   PROCESS EDIT PROJECT FORM
-------------------------------------- */
export const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const { title, description, location, date, organizationId } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-project/${projectId}`);
    }

    try {
        await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);

        req.flash('error', 'Failed to update project.');
        res.redirect(`/edit-project/${projectId}`);
    }
};




