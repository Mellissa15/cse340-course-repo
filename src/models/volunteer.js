import db from './db.js';

export async function addVolunteer(userId, projectId) {
    return db.query(
        `INSERT INTO volunteer (user_id, project_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
        [userId, projectId]
    );
}

export async function removeVolunteer(userId, projectId) {
    return db.query(
        `DELETE FROM volunteer
     WHERE user_id = $1 AND project_id = $2`,
        [userId, projectId]
    );
}

export async function isVolunteer(userId, projectId) {
    const result = await db.query(
        `SELECT 1 FROM volunteer
     WHERE user_id = $1 AND project_id = $2`,
        [userId, projectId]
    );

    return result.rowCount > 0;
}

export async function getUserVolunteerProjects(userId) {
    const result = await db.query(
        `SELECT sp.*
     FROM service_project sp
     JOIN volunteer v ON sp.project_id = v.project_id
     WHERE v.user_id = $1`,
        [userId]
    );

    return result.rows;
}