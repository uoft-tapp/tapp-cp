/*** Route configuration ***/

const routeConfig = {
    courses: {
        label: 'Courses',
        route: '/courses',
        id: 'courses',
    },
    abc: {
        label: 'Applicants by Course',
        route: '/applicantsbycourse',
        id: 'abc',
    },
    assigned: {
        label: 'All Assigned',
        route: '/assigned',
        id: 'assigned',
    },
    unassigned: {
        label: 'All Unassigned',
        route: '/unassigned',
        id: 'unassigned',
    },
    summary: {
        label: 'Summary',
        route: '/summary',
        id: 'summary',
    },
    logout: {
        route: '/bye',
        id: 'logout',
    },
};

export { routeConfig };
