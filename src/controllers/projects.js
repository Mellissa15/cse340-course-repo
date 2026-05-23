import {
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesForProject
} from '../models/projects.js';

/* --------------------------------------
   CONSTANT
-------------------------------------- */
const NUMBER_OF_UPCOMING_PROJECTS = 5;

/* --------------------------------------
   PROJECTS LIST PAGE (/projects)
-------------------------------------- */
export const showProjectsPage = async (req, res) => {
    console.log("🔥 PROJECT CONTROLLER ACTIVE FILE");
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

    // THIS is what was missing before
    const categories = await getCategoriesForProject(projectId);

    res.render('project', {
        title: project.title,
        project,
        categories
    });
};


