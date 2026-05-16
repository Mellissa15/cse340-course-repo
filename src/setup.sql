-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);
-- ========================================
-- Insert Sample Organization Data
-- ========================================

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

-- ========================================
-- Verify Inserted Data
-- ========================================

SELECT * FROM organization; 

-- ========================================
-- Service Project Table
-- ========================================

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
); 

-- ========================================
-- Insert sample data: Service Projects
-- ========================================

INSERT INTO service_project
(organization_id, title, description, location, project_date)
VALUES

-- BrightFuture Builders (organization_id = 1)
(1, 'Community Playground Renovation',
'Renovating playground equipment for local children.',
'Cape Town', '2026-06-10'),

(1, 'Affordable Housing Build',
'Building sustainable homes for low-income families.',
'Johannesburg', '2026-07-15'),

(1, 'School Repair Initiative',
'Repairing classrooms and facilities in rural schools.',
'Durban', '2026-08-05'),

(1, 'Clean Water Project',
'Installing clean water systems in communities.',
'Pretoria', '2026-09-12'),

(1, 'Bridge Restoration',
'Restoring damaged community bridges.',
'Port Elizabeth', '2026-10-20'),

-- GreenHarvest Growers (organization_id = 2)
(2, 'Urban Garden Workshop',
'Teaching urban gardening techniques.',
'Cape Town', '2026-06-18'),

(2, 'Community Farm Expansion',
'Expanding local farming spaces.',
'Johannesburg', '2026-07-22'),

(2, 'Food Sustainability Fair',
'Promoting sustainable food practices.',
'Durban', '2026-08-14'),

(2, 'Youth Farming Program',
'Training youth in agriculture skills.',
'Pretoria', '2026-09-09'),

(2, 'Neighborhood Compost Drive',
'Encouraging composting and recycling.',
'Bloemfontein', '2026-10-02'),

-- UnityServe Volunteers (organization_id = 3)
(3, 'Charity Food Drive',
'Collecting food donations for shelters.',
'Cape Town', '2026-06-25'),

(3, 'Volunteer Training Camp',
'Training volunteers for community outreach.',
'Johannesburg', '2026-07-30'),

(3, 'School Supplies Donation',
'Providing school supplies to children.',
'Durban', '2026-08-21'),

(3, 'Senior Care Visits',
'Organizing visits to elderly care homes.',
'Pretoria', '2026-09-17'),

(3, 'Beach Cleanup Day',
'Community beach cleaning initiative.',
'Port Elizabeth', '2026-10-11');   

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Insert Categories
INSERT INTO category (name)
VALUES
('Environment'),
('Education'),
('Community Development');

CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
); 

INSERT INTO project_category (project_id, category_id)
VALUES
(1, 3),
(2, 3),
(3, 2),
(4, 1),
(5, 1),

(6, 1),
(7, 1),
(8, 1),
(9, 2),
(10, 1),

(11, 3),
(12, 3),
(13, 2),
(14, 3),
(15, 1);