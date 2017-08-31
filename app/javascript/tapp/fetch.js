import React from 'react';
import { appState } from './appState.js';

/* General helpers */

function defaultFailure(text) {
    appState.alert('<b>Action Failed:</b> ' + text);
    return Promise.reject();
}

// extract and display a message which is sent in the (JSON) body of a response
function showMessageInJsonBody(resp) {
    if (resp.message != null) {
        appState.notify(resp.message);
    } else {
        resp.json().then(res => {
            appState.alert(res.message);
        });
    }
}

function fetchHelper(URL, init) {
    return fetch(URL, init)
        .then(function(resp) {
            if (resp.ok) {
                return Promise.resolve(resp);
            }
            return Promise.reject(resp);
        }, function(error) {
            appState.alert('<b>' + init.method + ' error</b> ' + URL + ': ' + error.message);
            return Promise.reject(error);
        });
}

function getHelper(URL) {
    return fetchHelper(URL, {
        headers: {
            Accept: 'application/json',
        },
        method: 'GET',
    });
}

function postHelper(URL, body) {
    return fetchHelper(URL, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        body: JSON.stringify(body),
    });
}

function deleteHelper(URL) {
    return fetchHelper(URL, { method: 'DELETE' });
}

function putHelper(URL, body) {
    return fetchHelper(URL, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

/* Resource GETters */

const getApplicants = () =>
    getHelper('/applicants')
        .then(resp => resp.json())
        .then(onFetchApplicantsSuccess)
        .catch(defaultFailure);

const getApplications = () =>
    getHelper('/applications')
        .then(resp => resp.json())
        .then(onFetchApplicationsSuccess)
        .catch(defaultFailure);

const getCourses = () =>
    getHelper('/positions')
        .then(resp => resp.json())
        .then(onFetchCoursesSuccess)
        .catch(defaultFailure);

const getAssignments = () =>
    getHelper('/assignments')
        .then(resp => resp.json())
        .then(onFetchAssignmentsSuccess)
        .catch(defaultFailure);

const getInstructors = () =>
    getHelper('/instructors')
        .then(resp => resp.json())
        .then(onFetchInstructorsSuccess)
        .catch(defaultFailure);

/* Success callbacks for resource GETters */

function onFetchApplicantsSuccess(resp) {
    let applicants = {};

    resp.forEach(app => {
        applicants[app.id] = {
            lastName: app.last_name,
            firstName: app.first_name,
            utorid: app.utorid,
            email: app.email,
            phone: app.phone,
            studentNumber: app.student_number,
            address: app.address,
            dept: app.dept,
            program: (function(id) {
                switch (id) {
                    case '1PHD':
                        return 'PhD';
                    case '2Msc':
                        return 'MSc';
                    case '3MScAC':
                        return 'MScAC';
                    case '4MASc':
                        return 'MASc';
                    case '5MEng':
                        return 'MEng';
                    case '6Other':
                        return 'OG';
                    case '7PDF':
                        return 'PostDoc';
                    case '8UG':
                        return 'UG';
                    default:
                        return 'Other';
                }
            })(app.program_id),
            year: app.yip,
            notes: app.commentary,
            fullTime: app.full_time == 'Y',
        };
    });

    return applicants;
}

function onFetchApplicationsSuccess(resp) {
    let applications = {},
        newApp;

    resp.forEach(app => {
        newApp = {
            taTraining: app.ta_training == 'Y',
            academicAccess: app.access_acad_history == 'Y',
            prefs: (function(prefs) {
                return prefs.map(pref => ({
                    positionId: pref.position_id,
                    preferred: pref.rank == 1,
                }));
            })(app.preferences),
            rawPrefs: app.raw_prefs,
            exp: app.ta_experience,
            qual: app.academic_qualifications,
            skills: app.technical_skills,
            avail: app.availability,
            other: app.other_info,
            specialNeeds: app.special_needs,
        };

        if (applications[app.applicant_id]) {
            applications[app.applicant_id].push(newApp);
        } else {
            applications[app.applicant_id] = [newApp];
        }
    });

    return applications;
}

function onFetchCoursesSuccess(resp) {
    let courses = {};

    resp.forEach(course => {
        courses[course.id] = {
            round: course.round_id,
            name: course.course_name,
            code: course.position,
            campus: (function(code) {
                switch (code) {
                    case 1:
                        return 'St. George';
                    case 3:
                        return 'Scarborough';
                    case 5:
                        return 'Mississauga';
                    default:
                        return 'Other';
                }
            })(course.campus_code),
            instructors: course.instructors.map(instr => instr.id),
            estimatedPositions: course.estimated_count,
            estimatedEnrol: course.current_enrollment,
            positionHours: course.hours,
            cap: course.cap_enrollment,
            waitlist: course.num_waitlisted,
            qual: course.qualifications,
            resp: course.duties,
            startDate: course.start_date,
            endDate: course.end_date,
        };
    });

    return courses;
}

function onFetchAssignmentsSuccess(resp) {
    let assignments = {},
        assignmentCounts = {},
        count,
        newAss;

    resp.forEach(ass => {
        newAss = {
            id: ass.id,
            positionId: ass.position_id,
            hours: ass.hours,
            locked: ass.export_date != null,
        };

        if (assignments[ass.applicant_id]) {
            assignments[ass.applicant_id].push(newAss);
        } else {
            assignments[ass.applicant_id] = [newAss];
        }
    });

    return assignments;
}

function onFetchInstructorsSuccess(resp) {
    let instructors = {};

    resp.forEach(instr => {
        instructors[instr.id] = instr.name;
    });

    return instructors;
}

/* Function to GET all resources */

function fetchAll() {
    appState.setFetchingApplicantsList(true);
    appState.setFetchingApplicationsList(true);
    appState.setFetchingCoursesList(true);
    appState.setFetchingAssignmentsList(true);
    appState.setFetchingInstructorsList(true);

    let applicantsPromise = getApplicants();
    let applicationsPromise = getApplications();
    let coursesPromise = getCourses();
    let assignmentsPromise = getAssignments();
    let instructorsPromise = getInstructors();

    // when applicants are successfully fetched, update the applicants list; set fetching flag to false either way
    applicantsPromise
        .then(applicants => {
            appState.setApplicantsList(applicants);
            appState.setFetchingApplicantsList(false, true);
        })
        .catch(() => appState.setFetchingApplicantsList(false));

    // when applications are successfully fetched, update the applications list; set fetching flag to false either way
    applicationsPromise
        .then(applications => {
            appState.setApplicationsList(applications);
            appState.setFetchingApplicationsList(false, true);
        })
        .catch(() => appState.setFetchingApplicationsList(false));

    // when assignments are successfully fetched, update the assignments list; set fetching flag to false either way
    assignmentsPromise
        .then(assignments => {
            appState.setAssignmentsList(assignments);
            appState.setFetchingAssignmentsList(false, true);
        })
        .catch(() => appState.setFetchingAssignmentsList(false));

    // when courses are successfully fetched, update the courses list; set fetching flag to false either way
    coursesPromise
        .then(courses => {
            appState.setCoursesList(courses);
            appState.setFetchingCoursesList(false, true);
        })
        .catch(() => appState.setFetchingCoursesList(false));

    // when instructors are successfully fetched, update the instructors list; set fetching flag to false either way
    instructorsPromise
        .then(instructors => {
            appState.setInstructorsList(instructors);
            appState.setFetchingInstructorsList(false, true);
        })
        .catch(() => appState.setFetchingInstructorsList(false));
}

/* Task-specific resource modifiers */

// create a new assignment
function postAssignment(applicant, course, hours) {
    postHelper('/applicants/' + applicant + '/assignments', {
        position_id: course,
        hours: hours,
    }).then(() => {
        appState.setFetchingAssignmentsList(true);
        getAssignments()
            .then(assignments => {
                appState.setAssignmentsList(assignments);
                appState.setFetchingAssignmentsList(false, true);
            })
            .catch(() => appState.setFetchingAssignmentsList(false));
    });
}

// remove an assignment
function deleteAssignment(applicant, assignment) {
    deleteHelper('/applicants/' + applicant + '/assignments/' + assignment).then(() => {
        appState.setFetchingAssignmentsList(true);
        getAssignments()
            .then(assignments => {
                appState.setAssignmentsList(assignments);
                appState.setFetchingAssignmentsList(false, true);
            })
            .catch(() => appState.setFetchingAssignmentsList(false));
    });
}

// add/update the notes for an applicant
function noteApplicant(applicant, notes) {
    putHelper('/applicants/' + applicant, { commentary: notes }).then(() => {
        appState.setFetchingApplicantsList(true);
        getApplicants()
            .then(applicants => {
                appState.setApplicantsList(applicants);
                appState.setFetchingApplicantsList(false, true);
            })
            .catch(() => appState.setFetchingApplicantsList(false));
    });
}

// update the number of hours for an assignment
function updateAssignmentHours(applicant, assignment, hours) {
    putHelper('/applicants/' + applicant + '/assignments/' + assignment, {
        hours: hours,
    }).then(() => {
        appState.setFetchingAssignmentsList(true);
        getAssignments()
            .then(assignments => {
                appState.setAssignmentsList(assignments);
                appState.setFetchingAssignmentsList(false, true);
            })
            .catch(() => appState.setFetchingAssignmentsList(false));
    });
}

// update attribute(s) of a course
function updateCourse(courseId, data) {
    putHelper('/positions/' + courseId, data).then(() => {
        appState.setFetchingCoursesList(true);
        getCourses()
            .then(courses => {
                appState.setCoursesList(courses);
                appState.setFetchingCoursesList(false, true);
            })
            .catch(() => appState.setFetchingCoursesList(false));
    });
}

// send CHASS data
function importChass(data, year, semester) {
    appState.setImporting(true);

    postHelper('/import/chass', { chass_json: data, year: year, semester: semester }).then(
        () => {
            appState.setImporting(false, true);
            fetchAll();
        },
        resp => {
            appState.setImporting(false);
            showMessageInJsonBody(resp);
        }
    );
}

// send enrolment data
function importEnrolment(data) {
    appState.setImporting(true);

    postHelper('/import/enrollment', { enrollment_data: data }).then(
        () => {
            appState.setImporting(false, true);

            appState.setFetchingCoursesList(true);
            getCourses()
                .then(courses => {
                    appState.setCoursesList(courses);
                    appState.setFetchingCoursesList(false, true);
                })
                .catch(() => appState.setFetchingCoursesList(false));
        },
        resp => {
            appState.setImporting(false);
            showMessageInJsonBody(resp);
        }
    );
}

// unlock a single assignment
function unlockAssignment(applicant, assignment) {
    putHelper('/applicants/' + applicant + '/assignments/' + assignment, {
        export_date: null,
    }).then(() => {
        appState.setFetchingAssignmentsList(true);
        getAssignments()
            .then(assignments => {
                appState.setAssignmentsList(assignments);
                appState.setFetchingAssignmentsList(false, true);
            })
            .catch(() => appState.setFetchingAssignmentsList(false));
    });
}

// export offers from CHASS (locking the corresponding assignments)
function exportOffers(round) {
    let exportPromise = fetchHelper('/export/chass/' + round, {}).catch(defaultFailure);

    let filename;
    exportPromise
        .then(resp => {
            // extract the filename from the response headers
            filename = resp.headers.get('Content-Disposition').match(/filename="(.*)"/)[1];
            // parse the response body as a blob
            return resp.blob();
        })
        // create a URL for the object body of the response
        .then(blob => URL.createObjectURL(blob))
        .then(url => {
            // associate the download with an anchor tag
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            // trigger a click -> download
            a.click();
            URL.revokeObjectURL(url);
        });

    exportPromise.then(() => {
        appState.setFetchingAssignmentsList(true);
        getAssignments()
            .then(assignments => {
                appState.setAssignmentsList(assignments);
                appState.setFetchingAssignmentsList(false, true);
            })
            .catch(() => appState.setFetchingAssignmentsList(false));
    });
}

export {
    fetchAll,
    postAssignment,
    deleteAssignment,
    updateAssignmentHours,
    updateCourse,
    noteApplicant,
    importChass,
    importEnrolment,
    unlockAssignment,
    exportOffers,
};
