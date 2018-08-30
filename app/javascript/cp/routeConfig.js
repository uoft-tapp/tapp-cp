/*** Route configuration ***/

const routeConfig = {
    // For admin router
    controlPanel: {
        label: 'Control Panel',
        route: '/controlpanel',
        id: 'controlpanel',
    },
    ddahs: {
        label: 'DDAH Forms',
        route: '/ddahs',
        id: 'ddahs',
    },
    // For applicant router
    contracts: {
        label: 'Contracts and Forms',
        route: '/contracts',
        id: 'contracts',
    },
    history: {
        label: 'History',
        route: '/history',
        id: 'history',
    },
    sheet: {
        label: 'DDAH Spreadsheet and Form',
        route: '/sheet',
        id: 'sheet',
    },
};

export { routeConfig };
