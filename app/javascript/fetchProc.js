import { fromJS } from 'immutable';
/*
  fetch core functions
*/
export const msgFailure = (text, appState) => {
    appState.alert('<b>Action Failed:</b> ' + text);
    return Promise.reject();
}
export const respFailure = (resp, appState) => {
  // parse a response into an error message
    appState.alert('<b>Action Failed</b> ' + resp.url + ': ' + resp.statusText);
    return Promise.reject();
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
    var token = document.getElementsByName('csrf-token')[0].content;
    return fetchHelper(URL, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'X-CSRF-Token': token
        },
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
    }, appState);
}
export const deleteHelper = (URL, appState) => {
    var token = document.getElementsByName('csrf-token')[0].content;
    return fetchHelper(URL, {
        headers: {
            'X-CSRF-Token': token,
        },
        method: 'DELETE',
        credentials: 'include',
    }, appState);
}
export const putHelper = (URL, body, appState) => {
    var token = document.getElementsByName('csrf-token')[0].content;
    return fetchHelper(URL, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-CSRF-Token': token,
        },
        method: 'PUT',
        body: JSON.stringify(body),
        credentials: 'include',
    }, appState);
}
export const getResource = (route, onSuccess, dataName, setData, mince, state) =>{
    let appState = state;
    if(mince){
        let session = setData?
        appState.getSelectedSession():appState.get('selectedSession');
        if(session&&session!='N/A'){
            route = '/sessions/'+session+route;
            console.log("getResource: " + route);
            return getResHelper(route, onSuccess, dataName, setData, appState);
        }
        else{
            setData? setData([]): appState.set(dataName+'.list', fromJS([]));
            return appState.setFetchingDataList(dataName, false, true);
        };
    }
    else{
        return getResHelper(route, onSuccess, dataName, setData, appState);
    }
}
function getResHelper(route, onSuccess, dataName, setData, appState){
    return getHelper(route)
        .then(resp => (resp.ok ? resp.json().catch(msgFailure) : respFailure))
        .then(onSuccess)
        .then(data => {
            setData? setData(data): appState.set(dataName+'.list', fromJS(data));
            appState.setFetchingDataList(dataName, false, true);
        })
        .catch((error) => //appState.setFetchingDataList(dataName, false)
            console.error(error));
}

/*
  On Fetch Success functions
*/
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
                    applicationId: pref.application_id,
                    preferred: pref.rank == 1,
                    instructorPref: pref.instructor_pref,
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
        instructors[instr.id] = {
          name: instr.name,
          utorid: instr.utorid,
          email: instr.email,
        };
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
/*
  common fetch helper functions
*/
function responseDealer(resp, data, appState, okay, error){
  if(resp.ok){
    if(resp.status == 204){
      return (okay)?okay():resp;
    }
    else{
      if(data.blob)
        return (okay)?resp.blob().then(res=>okay(res)):resp;
      else
        return (okay)?resp.json().then(res=>okay(res)):resp;
    }
  }
  else if(resp.status == 404){
    return (error)?
      resp.json().then(res=>error(res)):
      respFailure(resp, appState);
  }
  else {
    return respFailure(resp, appState);
  }
}
export const putData = (route, data, fetch, appState, okay = null, error = null) => {
  return putHelper(route, data, appState)
    .then(resp => responseDealer(resp, data, appState, okay, error))
    .then(res => {
      if (fetch)
        return fetch(res);
    });
}
export const postData = (route, data, fetch, appState, okay = null, error = null) => {
  return postHelper(route, data, appState)
    .then(resp => responseDealer(resp, data, appState, okay, error))
    .then(() => {
      if (fetch)
        return fetch();
    });
}
export const deleteData = (route, fetch, appState, okay = null, error = null) =>{
  return deleteHelper(route, appState)
    .then(resp => responseDealer(resp, {}, appState, okay, error))
    .then(() => {
      fetch();
    });
}
export const downloadFile = (route, appState) =>{
  let download = false;
  let filename = '';
  return getHelper(route, appState)
  .then(resp=>{
    if(resp.ok){
      download = true;
      filename = resp.headers.get('Content-Disposition').match(/filename="(.*)"/)[1];
      return resp.blob();
    }
    else{
      return resp.json();
    }
  })
  .then(resp => {
    if(download){
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(resp, filename); //special case for Edge & IE
      }
      else{
        let url = URL.createObjectURL(resp);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.target="_self" ; //required in FF
        a.style.display = 'none';
        document.body.appendChild(a); //required in FF
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a); //required in FF
      }
    }
    else{
      appState.alert(resp.message);
    }
  });
}

export const importData = (route, data, fetch, appState) =>{
  appState.setImporting(true);
  let imported = true;
  return postHelper(route, data, appState)
    .then(resp => {
        if (resp.ok)
            return resp.json();
        else if (resp.status == 404) {
            imported = false;
            return resp.json();
        }
        else return respFailure(resp, appState);
    })
    .then(resp =>{
        if(!imported || resp.errors)
            resp.message.forEach(message => appState.alert(message));
    })
    .then(() => {
        if(imported){
            fetch();
            appState.setImporting(false, true);
        }
        else appState.setImporting(false);
    });
}
export const setRole = (cp, appState)=>{
  return getHelper('/roles', appState)
      .then(resp => (resp.ok ? resp.json().catch(msgFailure) : respFailure))
      .then(resp => {
          console.log(resp.roles);
          appState.setCurrentUserRoles(resp.roles);
          if (cp && resp.roles.length > 1) { // cp_admin
              appState.selectUserRole(resp.roles[1]); // set to cp_admin
          } else {
              appState.selectUserRole(resp.roles[0]);
          }
          appState.setCurrentUserName(resp.utorid);
          console.log("utorid set to:" + resp.utorid);
          appState.setIsDevelopment(resp.development === true);
          if(cp) appState.setTaCoordinator(resp.ta_coord);
    });
}
export const batchOfferAction = (canRoute, actionRoute, data, msg, fetch, extra, put, state) =>{
  data = toInt(data);
  return batchAction(true, canRoute, actionRoute, data, msg, fetch, extra, put, state);
}
export const batchDdahAction = (canRoute, actionRoute, data, msg, fetch, extra, put, state) =>{
  data = toInt(data);
  return batchAction(false, canRoute, actionRoute, data, msg, fetch, extra, put, state);
}
/*
  non-export functions
*/
function toInt(data){
  return data.map((item)=>parseInt(item));
}
function mergeJson(json1, json2){
  let keys = Object.keys(json2);
  for(let i =0; i < keys.length; i++)
    json1[keys[i]] = json2[keys[i]];
  return json1;
}
function fetchHelper(URL, init, appState) {
    return fetch(URL, init).catch(function(error) {
        appState.alert('<b>' + init.method + ' ' + URL + '</b> Network error: ' + error);
        return Promise.reject(error);
    });
}
function batchAction(offer, canRoute, actionRoute, data, msg, fetch, extra, put, state){
  let appState = state;
  let valid = data;
  let postedData = offer?{offers: data}:{ddahs: data};
  return postData(canRoute, postedData, null, state,
    ()=>{
      data = getActionData(offer, null, data, msg, appState);
      return setBatchData(actionRoute, data, appState,
        fetch, resp=>appState.alert("<b>Error</b>: "+resp.message), extra, put);
    },
    resp=>{
      data = getActionData(offer, resp, data, msg, appState);
      if(valid.length >0){
        return setBatchData(actionRoute, data, appState,
          fetch, resp=>appState.alert("<b>Error</b>: "+resp.message), extra, put);
      }
  });
}
function getActionData(offer, resp, data, msg, appState){
  if(offer){
    if(resp) filterOffer(resp, data, msg, appState);
    return {offers: data};
  }
  else{
    if(resp) filterDdah(resp, data, msg, appState);
    return {ddahs: data};
  }
}
function setBatchData(route, data, appState, succ, fail, extra, put){
  data = (extra!=null)?mergeJson(data,extra):data;
  if(put){
    return putData(route, data, succ, appState);
  }
  else{
    return postData(route,data, null, appState, succ, fail);
  }
}
function filterOffer(res, validOffers, msg, appState){
  let offersList = appState.getOffersList();
  res.invalid_offers.forEach(offer => {
      appState.alert(
          '<b>Error</b>: Cannot '+msg.start+' ' +
          offersList.getIn([offer.toString(), 'lastName']) +
          ', ' +
          offersList.getIn([offer.toString(), 'firstName']) +
          ' for ' +
          offersList.getIn([offer.toString(), 'course']) +
          ' '+(!msg.end?'':msg.end)
      );
      validOffers.splice(validOffers.indexOf(offer), 1);
  });
}
function filterDdah(res, validDdahs, msg, appState){
  let ddahsList = appState.getDdahsList();
  let offersList = appState.getOffersList();
  res.invalid_offers.forEach(ddah => {
      var offer = ddahsList.getIn([ddah.toString(), 'offer']).toString();
      appState.alert(
          '<b>Error</b>: Cannot '+msg.start+' ' +
              offersList.getIn([offer, 'lastName']) +
              ', ' +
              offersList.getIn([offer, 'firstName']) +
              ' for ' +
              offersList.getIn([offer, 'course']) +
              ' '+((!msg.end)?'':msg.end)
      );
      validDdahs.splice(validDdahs.indexOf(ddah), 1);
  });
}
