CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(10) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'lecturer'))
);

CREATE TABLE majors (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE students (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id),
    nim VARCHAR(10) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    enrollment_year SMALLINT NOT NULL,
    phone VARCHAR(13) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    major_id INT REFERENCES majors(id)
);

CREATE TABLE lecturers (
   id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   user_id INT NOT NULL UNIQUE REFERENCES users(id),
   lecturer_number VARCHAR(30) NOT NULL UNIQUE,
   full_name VARCHAR(150) NOT NULL
);

CREATE TABLE courses (
     id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     course_code VARCHAR(20) NOT NULL UNIQUE,
     name VARCHAR(150) NOT NULL
);

CREATE TABLE assignments (
     id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     course_id INT NOT NULL REFERENCES courses(id),
     lecturer_id INT NOT NULL REFERENCES lecturers(id),

     title VARCHAR(200) NOT NULL,
     description TEXT,

     opens_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     deadline_at TIMESTAMPTZ NOT NULL,

     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

     CHECK (deadline_at >= opens_at)
);

CREATE TABLE uploaded_files (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    assignment_id BIGINT NOT NULL
        REFERENCES assignments(id) ON DELETE CASCADE,

    uploaded_by BIGINT NOT NULL
        REFERENCES users(id),

    file_type VARCHAR(20) NOT NULL
        CHECK (file_type IN ('question', 'submission')),

    original_filename TEXT NOT NULL,
    storage_key TEXT NOT NULL UNIQUE,
    mime_type VARCHAR(100),
    size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);