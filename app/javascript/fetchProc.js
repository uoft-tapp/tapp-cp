export const msgFailure = (text, appState) => {
    appState.alert('<b>Action Failed:</b> ' + text);
    return Promise.reject();
}

// parse a response into an error message
export const respFailure = (resp, appState) => {
    appState.alert('<b>Action Failed</b> ' + resp.url + ': ' + resp.statusText);
    return Promise.reject();
}

function fetchHelper(URL, init, appState) {
    return fetch(URL, init).catch(function(error) {
        appState.alert('<b>' + init.method + ' ' + URL + '</b> Network error: ' + error);
        return Promise.reject(error);
    });
}

export const getHelper = (URL, appState) => {
    return fetchHelper(URL, {
        headers: {
            Accept: 'application/json',
        },
        method: 'GET',
        credentials: 'include', // This line is crucial in any fetch because it is needed to work with Shibboleth in production
    }, appState);
}

export const postHelper = (URL, body, appState) => {
    return fetchHelper(URL, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
    }, appState);
}

export const deleteHelper = (URL, appState) => {
    return fetchHelper(URL, {
        method: 'DELETE',
        credentials: 'include',
    }, appState);
}

export const putHelper = (URL, body, appState) => {
    return fetchHelper(URL, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'PUT',
        body: JSON.stringify(body),
        credentials: 'include',
    }, appState);
}

export const onFetchApplicantsSuccess = (resp) => {
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

export const onFetchApplicationsSuccess = (resp) => {
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

export const onFetchTappCoursesSuccess = (resp) => {
    let courses = {};
    resp.forEach(course => {
        courses[course.id] = getCourse(course, true);
    });
    return courses;
}

export const onFetchCpCoursesSuccess = (resp) => {
    let courses = {};
    resp.forEach(course => {
        courses[course.id] = getCourse(course, false);
    });
    return courses;
}

function getCourse(course, tapp){
  let data = {
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
    estimatedEnrol: course.current_enrolment,
    cap: course.cap_enrolment,
    waitlist: course.num_waitlisted,
  }
  let extra = tapp?{
    round: course.round_id,
    instructors: course.instructors.map(instr => instr.id),
    estimatedPositions: course.estimated_count,
    positionHours: course.hours,
    qual: course.qualifications,
    resp: course.duties,
    startDate: course.start_date,
    endDate: course.end_date,
  }:{
    session: course.session_id,
    instructors: course.instructors,
  };
  return mergeJson(data, extra);
}

function mergeJson(json1, json2){
  let keys = Object.keys(json2);
  for(let i =0; i < keys.length; i++)
    json1[keys[i]] = json2[keys[i]];
  return json1;
}

export const onFetchAssignmentsSuccess = (resp) => {
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

export const onFetchInstructorsSuccess = (resp) => {
    let instructors = {};

    resp.forEach(instr => {
        instructors[instr.id] = instr.name;
    });

    return instructors;
}




export const onFetchCategoriesSuccess = (resp)=>{
    let categories = {};

    resp.forEach(category => {
        categories[category.id] = category.name;
    });

    return categories;
}

export const onFetchDdahsSuccess = (resp) => {
    let ddahs = {};

    resp.forEach(ddah => {
        ddahs[ddah.id] = {
            offer: ddah.offer_id,
            position: ddah.position.id,
            department: ddah.department,
            supervisor: ddah.supervisor,
            supervisorId: ddah.instructor_id,
            tutCategory: ddah.tutorial_category,
            optional: ddah.optional,
            requiresTraining: ddah.scaling_learning,
            allocations: ddah.allocations.map(allocation => ({
                id: allocation.id,
                units: allocation.num_unit,
                duty: allocation.duty_id,
                type: allocation.unit_name,
                time: allocation.minutes,
            })),
            trainings: ddah.trainings,
            categories: ddah.categories,
            superSignature: ddah.supervisor_signature,
            superSignDate: ddah.supervisor_sign_date,
            authSignature: ddah.ta_coord_signature,
            authSignDate: ddah.ta_coord_sign_date,
            studentSignature: ddah.student_signature,
            studentSignDate: ddah.student_sign_date,
            link: ddah.link,
        };
    });

    return ddahs;
}

export const onFetchDutiesSuccess = (resp)=>{
    let duties = {};

    resp.forEach(duty => {
        duties[duty.id] = duty.name;
    });

    return duties;
}

export const onFetchOffersSuccess = (resp) => {
    let offers = {};

    resp.forEach(offer => {
        offers[offer.id] = {
            applicantId: offer.applicant_id,
            firstName: offer.applicant.first_name,
            lastName: offer.applicant.last_name,
            studentNumber: offer.applicant.student_number,
            email: offer.applicant.email,
            utorid: offer.applicant.utorid,
            course: offer.position,
            position: offer.position_id,
            session: offer.session ? offer.session.id : undefined,
            hours: offer.hours,
            nagCount: offer.nag_count,
            InstructorNagCount: offer.ddah_nag_count,
            ddahNagCount: offer.ddah_applicant_nag_count,
            status: offer.status,
            hrStatus: offer.hr_status,
            ddahStatus: offer.ddah_status,
            sentAt: offer.send_date,
            printedAt: offer.print_time,
            link: offer.link,
            note: offer.commentary,
            ddahSendDate: offer.ddah_send_date,
        };
    });

    return offers;
}

export const onFetchSessionsSuccess = (resp)=>{
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

export const onFetchTemplatesSuccess = (resp)=> {
    let templates = {};

    resp.forEach(template => {
        templates[template.id] = {
            name: template.name,
            optional: template.optional,
            requiresTraining: template.scaling_learning,
            allocations: template.allocations.map(allocation => ({
                id: allocation.id,
                units: allocation.num_unit,
                duty: allocation.duty_id,
                type: allocation.unit_name,
                time: allocation.minutes,
            })),
            trainings: template.trainings,
            categories: template.trainings,
        };
    });

    return templates;
}

export const onFetchTrainingsSuccess = (resp)=>{
    let trainings = {};

    resp.forEach(training => {
        trainings[training.id] = training.name;
    });

    return trainings;
}
