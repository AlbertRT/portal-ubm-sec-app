export type StudentProfile = {
    nim: string;
    fullName: string;
};

export type LecturerProfile = {
    lecturerNumber: string;
    fullName: string;
};

export type StudentSession = {
    id: number;
    username: string;
    role: "student";
    profile: StudentProfile;
};

export type LecturerSession = {
    id: number;
    username: string;
    role: "lecturer";
    profile: LecturerProfile;
};

export type Session = StudentSession | LecturerSession;

export type StudentDetail = {
    id: number;
    nim: string;
    fullName: string;
    enrollmentYear: number;
    phone: string;
    email: string;
    major: {
        id: number;
        code: string;
        name: string;
    } | null;
};

export type LecturerDetail = {
    id: number;
    lecturerNumber: string;
    fullName: string;
};

export type UserDetail =
    | {
          role: "student";
          detail: StudentDetail;
      }
    | {
          role: "lecturer";
          detail: LecturerDetail;
      };

export type Assignment = {
    id: number;
    title: string;
    description: string | null;

    course: {
        code: string;
        name: string;
    };

    major: {
        code: string;
        name: string;
    };

    lecturer: {
        name: string;
    };

    opensAt: Date;
    deadlineAt: Date;
};

