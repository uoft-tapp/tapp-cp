import React from 'react';
import { appState } from './appState.js';

/* General helpers */

function defaultFailure(resp) {
    appState.notify('<b>Action Failed:</b> ' + resp.statusText);
    return Promise.reject(resp);
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

function fetchHelper(URL, init, success, failure = defaultFailure) {
    return fetch(URL, init)
        .then(function(response) {
            if (response.ok) {
                // parse the body of the response as JSON
                if (['GET', 'POST'].includes(init.method)) {
                    return response.json().then(resp => success(resp));
                }

                return success(response);
            }

            return failure(response);
        })
        .catch(function(error) {
            appState.notify('<b>Error:</b> ' + URL + ' ' + error.message);
            return Promise.reject(error);
        });
}

function getHelper(URL, success, failure) {
    let init = {
        headers: {
            Accept: 'application/json',
        },
        method: 'GET',
    };

    return fetchHelper(URL, init, success, failure);
}

function postHelper(URL, body, success, failure) {
    let init = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        body: JSON.stringify(body),
    };

    return fetchHelper(URL, init, success, failure);
}

function deleteHelper(URL, success, failure) {
    return fetchHelper(URL, { method: 'DELETE' }, success, failure);
}

function putHelper(URL, body, success, failure) {
    let init = {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'PUT',
        body: JSON.stringify(body),
    };

    return fetchHelper(URL, init, success, failure);
}

/* Resource GETters */

const getApplicants = () => getHelper('/applicants', onFetchApplicantsSuccess);

const getApplications = () => getHelper('/applications', onFetchApplicationsSuccess);

const getCourses = () => getHelper('/positions', onFetchCoursesSuccess);

const getAssignments = () => getHelper('/assignments', onFetchAssignmentsSuccess);

const getInstructors = () => getHelper('/instructors', onFetchInstructorsSuccess);

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
    appState.setFetchingAssignmentsList(true);

    return postHelper(
        '/applicants/' + applicant + '/assignments',
        { position_id: course, hours: hours },
        getAssignments
    )
        .then(assignments => {
            appState.setAssignmentsList(assignments);
            appState.setFetchingAssignmentsList(false, true);
        })
        .catch(() => appState.setFetchingAssignmentsList(false));
}

// remove an assignment
function deleteAssignment(applicant, assignment) {
    appState.setFetchingAssignmentsList(true);

    return deleteHelper('/applicants/' + applicant + '/assignments/' + assignment, getAssignments)
        .then(assignments => {
            appState.setAssignmentsList(assignments);
            appState.setFetchingAssignmentsList(false, true);
        })
        .catch(() => appState.setFetchingAssignmentsList(false));
}

// add/update the notes for an applicant
function noteApplicant(applicant, notes) {
    appState.setFetchingApplicantsList(true);

    return putHelper('/applicants/' + applicant, { commentary: notes }, getApplicants)
        .then(applicants => {
            appState.setApplicantsList(applicants);
            appState.setFetchingApplicantsList(false, true);
        })
        .catch(() => appState.setFetchingApplicantsList(false));
}

// update the number of hours for an assignment
function updateAssignmentHours(applicant, assignment, hours) {
    appState.setFetchingAssignmentsList(true);

    return putHelper(
        '/applicants/' + applicant + '/assignments/' + assignment,
        { hours: hours },
        getAssignments
    )
        .then(assignments => {
            appState.setAssignmentsList(assignments);
            appState.setFetchingAssignmentsList(false, true);
        })
        .catch(() => appState.setFetchingAssignmentsList(false));
}

// update attribute(s) of a course
function updateCourse(courseId, data, attr) {
    appState.setFetchingCoursesList(true);

    return putHelper('/positions/' + courseId, data, getCourses)
        .then(courses => {
            appState.setCoursesList(courses);
            appState.setFetchingCoursesList(false, true);
        })
        .catch(() => appState.setFetchingCoursesList(false));
}

// send CHASS data
function importChass(data) {
    return postHelper(
        '/import/chass',
        { chass_json: data },
        data,
        () => {
            appState.setImporting(false, true);
            fetchAll();
        },
        showMessageInJsonBody
    ).catch(() => appState.setImporting(false));
}

// send enrolment data
function importEnrolment(data) {
    appState.setFetchingCoursesList(true);

    return postHelper(
        '/import/enrollment',
        { enrollment_data: data },
        showMessageInJsonBody,
        showMessageInJsonBody
    )
        .then(getCourses)
        .then(courses => {
            appState.setCoursesList(courses);
            appState.successFetchingCoursesList();
        })
        .catch(() => appState.setFetchingCoursesList(false));
}

// unlock a single assignment
function unlockAssignment(applicant, assignment) {
    appState.setFetchingAssignmentsList(true);

    return putHelper(
        '/applicants/' + applicant + '/assignments/' + assignment,
        { export_date: null },
        getAssignments
    )
        .then(assignments => {
            appState.setAssignmentsList(assignments);
            appState.setFetchingAssignmentsList(false, true);
        })
        .catch(() => appState.setFetchingAssignmentsList(false));
}

// export offers from CHASS (locking the corresponding assignments)
function exportOffers(round) {
    appState.setFetchingAssignmentsList(true);

    let filename;
    return (
        fetchHelper('/export/chass/' + round, {}, response => {
            // extract the filename from the response headers
            filename = response.headers.get('Content-Disposition').match(/filename="(.*)"/)[1];
            // parse the response body as a blob
            return response.blob();
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
            })
            .then(getAssignments)
            .then(assignments => {
                appState.setAssignmentsList(assignments);
                appState.setFetchingAssignmentsList(false, true);
            })
            .catch(() => appState.setFetchingAssignmentsList(false))
    );
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
