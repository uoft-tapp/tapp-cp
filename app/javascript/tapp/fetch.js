import React from 'react';
import { appState } from './appState.js';

/* General helpers */

// display a general error text
function msgFailure(text) {
    appState.alert('<b>Action Failed:</b> ' + text);
    return Promise.reject();
}

// parse a response into an error message
function respFailure(resp) {
    appState.alert('<b>Action Failed</b> ' + resp.url + ': ' + resp.statusText);
    return Promise.reject();
}

function fetchHelper(URL, init) {
    return fetch(URL, init).catch(function(error) {
        appState.alert('<b>' + init.method + ' ' + URL + '</b> Network error: ' + error);
        return Promise.reject(error);
    });
}

function getHelper(URL) {
    return fetchHelper(URL, {
        headers: {
            Accept: 'application/json',
        },
        method: 'GET',
        credentials: 'include', // This line is crucial in any fetch because it is needed to work with Shibboleth in production
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
        credentials: 'include',
    });
}

function deleteHelper(URL) {
    return fetchHelper(URL, {
        method: 'DELETE',
        credentials: 'include',
    });
}

function putHelper(URL, body) {
    return fetchHelper(URL, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'PUT',
        body: JSON.stringify(body),
        credentials: 'include',
    });
}

/* Resource GETters */

const getResource = (route, onSuccess) =>
  getHelper(route)
      .then(resp => (resp.ok ? resp.json().catch(msgFailure) : respFailure))
      .then(onSuccess);

const getSessions = () => getResource('/sessions', onFetchSessionsSuccess);
const getApplicants = () => getResource('/applicants', onFetchApplicantsSuccess);
const getApplications = () => getResource('/applications', onFetchApplicationsSuccess);
const getCourses = () => getResource('/positions', onFetchCoursesSuccess);
const getAssignments = () => getResource('/assignments', onFetchAssignmentsSuccess);
const getInstructors = () => getResource('/instructors', onFetchInstructorsSuccess);

/* Success callbacks for resource GETters */
function onFetchSessionsSuccess(resp) {
    let sessions = {};

    resp.forEach(session => {
        sessions[session.id] = {
            year: session.year,
            semester: session.semester,
            pay: session.pay,
        };
    });

    return sessions;
}

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
            estimatedEnrol: course.current_enrolment,
            positionHours: course.hours,
            cap: course.cap_enrolment,
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

const processFetch = (getData, setData, dataName) =>{
  // when the data is successfully fetched, update the data list; set fetching flag to false either way
  appState.setFetchingDataList(dataName, true);
  getData()
      .then(data => {
          setData(data);
          appState.setFetchingDataList(dataName, false, true);
      })
      .catch(() => appState.setFetchingDataList(dataName, false));
}

function fetchAll() {
    processFetch(getApplicants, appState.setApplicantsList, 'applicants');
    processFetch(getApplications, appState.setApplicationsList, 'applications');
    processFetch(getAssignments, appState.setAssignmentsList, 'assignments');
    processFetch(getCourses, appState.setCoursesList, 'courses');
    processFetch(getInstructors, appState.setInstructorsList, 'instructors');
}

/* Task-specific resource modifiers */

// create a new assignment
function postAssignment(applicant, course, hours) {
    postHelper('/applicants/' + applicant + '/assignments', {
        position_id: course,
        hours: hours,
    })
        .then(resp => (resp.ok ? resp : respFailure))
        .then(() => {
          processFetch(getAssignments, appState.setAssignmentsList, 'assignments');
        });
}

// remove an assignment
function deleteAssignment(applicant, assignment) {
    deleteHelper('/applicants/' + applicant + '/assignments/' + assignment)
        .then(resp => (resp.ok ? resp : respFailure))
        .then(() => {
          processFetch(getAssignments, appState.setAssignmentsList, 'assignments');
        });
}

// add/update the notes for an applicant
function noteApplicant(applicant, notes) {
    putHelper('/applicants/' + applicant, { commentary: notes })
        .then(resp => (resp.ok ? resp : respFailure))
        .then(() => {
          processFetch(getApplicants, appState.setApplicantsList, 'applicants');
        });
}

// update the number of hours for an assignment
function updateAssignmentHours(applicant, assignment, hours) {
    putHelper('/applicants/' + applicant + '/assignments/' + assignment, {
        hours: hours,
    })
        .then(resp => (resp.ok ? resp : respFailure))
        .then(() => {
          processFetch(getAssignments, appState.setAssignmentsList, 'assignments');
        });
}

// update attribute(s) of a course
function updateCourse(courseId, data) {
    putHelper('/positions/' + courseId, data)
        .then(resp => (resp.ok ? resp : respFailure))
        .then(() => {
          processFetch(getCourses, appState.setCoursesList, 'courses');
        });
}

// send CHASS data
function importChass(data, year, semester) {
    appState.setImporting(true);

    postHelper('/import/chass', {
        chass_json: data,
        year: year,
        semester: semester,
    })
        .then(resp => {
            // import succeeded
            if (resp.ok) {
                return resp.json().then(resp => {
                    // import succeeded with errors
                    if (resp.errors) {
                        return resp.message.forEach(message => appState.alert(message));
                    }
                    return Promise.resolve();
                });
            }
            // import failed with errors
            if (resp.status == 404) {
                return resp
                    .json()
                    .then(resp => resp.message.forEach(message => appState.alert(message)))
                    .then(Promise.reject);
            }
            return respFailure(resp);
        })
        .then(
            () => {
                appState.setImporting(false, true);
                fetchAll();
            },
            () => appState.setImporting(false)
        );
}

// send enrolment data
function importInstructors(data) {
    appState.setImporting(true);

    postHelper('/import/instructors', { instructor_data: data })
        .then(resp => (resp.ok ? resp : Promise.reject(resp)))
        .then(
            () => {
                appState.setImporting(false, true);

                appState.setFetchingDataList('instructors', true);
                getInstructors()
                    .then(instructors => {
                        appState.setInstructorsList(instructors);
                        appState.setFetchingDataList('instructors', false, true);
                    })
                    .catch(() => appState.setFetchingDataList('instructors', false));
            },
            resp => {
                appState.setImporting(false);
                resp.json().then(resp => appState.alert(resp.message)); // IS THIS REALLY WHAT WE EXPECT?
            }
        );
}

// send enrolment data
function importEnrolment(data) {
    appState.setImporting(true);

    postHelper('/import/enrolment', { enrolment_data: data })
        .then(resp => (resp.ok ? resp : Promise.reject(resp)))
        .then(
            () => {
                appState.setImporting(false, true);

                appState.setFetchingDataList('courses', true);
                getCourses()
                    .then(courses => {
                        appState.setCoursesList(courses);
                        appState.setFetchingDataList('courses', false, true);
                    })
                    .catch(() => appState.setFetchingDataList('courses', false));
            },
            resp => {
                appState.setImporting(false);
                resp.json().then(resp => appState.alert(resp.message)); // IS THIS REALLY WHAT WE EXPECT?
            }
        );
}

// unlock a single assignment
function unlockAssignment(applicant, assignment) {
    putHelper('/applicants/' + applicant + '/assignments/' + assignment, {
        export_date: null,
    })
        .then(resp => (resp.ok ? resp : respFailure))
        .then(() => {
          processFetch(getAssignments, appState.setAssignmentsList, 'assignments');
        });
}

// export offers from CHASS (locking the corresponding assignments)
function exportOffers(round) {
    let filename;
    let exportPromise = getHelper('/export/chass/' + round).then(
        resp => (resp.ok ? resp : respFailure)
    );

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
      processFetch(getAssignments, appState.setAssignmentsList, 'assignments');

    });
}

// get current user role and username
// if we are in development, set the current user name to a special value
function fetchAuth() {
    getHelper('/roles')
        .then(resp => (resp.ok ? resp.json().catch(msgFailure) : respFailure))
        .then(resp => {
            if (resp.development) {
                appState.setCurrentUserRoles(['tapp_admin', 'instructor']);
                // default to tapp_admin as selected user role
                appState.selectUserRole('tapp_admin');
                appState.setCurrentUserName('DEV');
            } else {
                // filter out roles not relevant to this application
                let roles = resp.roles.filter(role => ['tapp_admin', 'instructor'].includes(role));
                appState.setCurrentUserRoles(roles);
                appState.selectUserRole(roles[0]);
                appState.setCurrentUserName(resp.utorid);
            }
        });
}

function emailAssignments(code, round, key){
    postHelper('/email-assignments', {
        position: code,
        round_id: round,
    }).then(resp => {
      if (resp.ok) {
        return resp.json()
            .then(resp => (appState.stopEmailSpinner(key)));
      }
      else if (resp.status == 404) {
          return resp.json()
            .then(resp => {
                appState.alert(resp.message);
                appState.stopEmailSpinner(key);
            });
      }
      else{
          appState.stopEmailSpinner(key);
          return respFailure(resp);
      }
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
    importInstructors,
    unlockAssignment,
    exportOffers,
    fetchAuth,
    emailAssignments,
};
