import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';
/* --------------------------------------
   CONSTANT
-------------------------------------- */
const NUMBER_OF_UPCOMING_PROJECTS = 5;

/* --------------------------------------
   PROJECT LIST PAGE
   /projects
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
   PROJECT DETAILS PAGE
   /project/:id
-------------------------------------- */
export const showProjectDetailsPage = async (req, res) => {
    console.log("STEP 1: controller hit");

    const projectId = req.params.id;
    console.log("STEP 2: ID =", projectId);

    const project = await getProjectDetails(projectId);
    console.log("STEP 3: project =", project);

    res.send("TEST: controller finished successfully");
};

