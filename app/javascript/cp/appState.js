import React from 'react';
import { fromJS } from 'immutable';

import * as fetch from './fetch.js';

const initialState = {
    roles: [], // array of { 'cp_admin', 'hr_assistant', 'instructor' }
    selectedRole: null,
    user: null,

    // list of unread notifications (string can contain HTML, but be careful because it is not sanitized!)
    notifications: [],

    // list of UI alerts (string can contain HTML, but be careful because it is not sanitized!)
    alerts: [],

    // will be populated with selected sort and filter fields
    selectedSortFields: [],
    selectedFilters: {},

    selectedSession: '',

    ddah: {
        supervisor: null,
        tutCategory: null,
        optional: null,
        requiresTraining: false,
        worksheet: [{ id: null, units: null, duty: null, type: null, time: null }],
        trainings: [],
        categories: [],
        changed: false,
    },

    selectedDdah: null,
    selectedOffer: null,

    /** DB data **/
    categories: { fetching: 0, list: null },
    courses: { fetching: 0, list: null },
    duties: { fetching: 0, list: null },
    offers: { fetching: 0, list: null },
    sessions: { fetching: 0, list: null },
    templates: { fetching: 0, list: null },
    trainings: { fetching: 0, list: null },

    importing: 0,
};

class AppState {
    constructor() {
        // container for application state
        var _data = fromJS(initialState);

        // list of change listeners
        this._listeners = [];
        // notify listeners of change
        var notifyListeners = () => this._listeners.forEach(listener => listener());

        // parses a property path into a list, as expected by Immutable
        var parsePath = path =>
            path
                .split(/(\[.*?\])|\./) // split on brackets and dots
                .filter(key => key) // removed undefined elements
                .map(key => {
                    let ind = key.match(/\[(.*)\]/); // check whether the element is in brackets
                    if (ind) {
                        return eval(ind[1]);
                    }
                    return key;
                });

        // getter for appState object
        this.get = function(property) {
            return _data.getIn(parsePath(property));
        };

        // setter for appState object
        this.set = function(property, value) {
            // as per the Backbone Model set() syntax, we accept a property and value pair, or
            // an object with property and value pairs as keys
            if (arguments.length == 1) {
                _data = _data.withMutations(map => {
                    Object.entries(property).reduce(
                        (result, [prop, val]) => result.setIn(parsePath(prop), val),
                        map
                    );
                });
            } else {
                _data = _data.setIn(parsePath(property), value);
            }

            // notify listener(s) of change
            notifyListeners();
        };
    }

    // subscribe listener to change events on this model
    subscribe(listener) {
        this._listeners.push(listener);
    }

    /************************************
     ** view state getters and setters **
     ************************************/

    // add a row to the ddah form
    addAllocation() {
        let worksheet = this.get('ddah.worksheet');

        // max. 24 rows are supported (this number comes from counting the number of rows generated
        // in the DDAH form PDF)
        if (worksheet.size == 24) {
            this.alert('No more rows can be added.');
        } else {
            this.set(
                'ddah.worksheet',
                worksheet.push(
                    fromJS({ id: null, units: null, duty: null, type: null, time: null })
                )
            );
        }
    }

    // apply a sort to the offers table
    // note that we do not allow multiple sorts on the same field (incl. in different directions)
    addSort(field) {
        let sorts = this.get('selectedSortFields');

        if (!sorts.some(val => val.get(0) == field)) {
            this.set('selectedSortFields', sorts.push(fromJS([field, 1])));
        } else {
            this.alert('<b>Applicant Table</b>&ensp;Cannot apply the same sort more than once.');
        }
    }

    // add an alert to the list of active alerts
    alert(text) {
        let alerts = this.get('alerts');
        // give it an id that is 1 larger than the largest id in the array, or 0 if the array is empty
        this.set(
            'alerts',
            alerts.unshift(
                fromJS({
                    id: alerts.size > 0 ? alerts.first().get('id') + 1 : 0,
                    text: text,
                })
            )
        );
    }

    // check whether the user has made any changes to the current ddah
    anyDdahChanges() {
        return this.get('ddah.changed');
    }

    // check whether any of the given filters in the category are selected on the offers table
    anyFilterSelected(field) {
        return this.get('selectedFilters').has(field);
    }

    clearDdah() {
        if (window.confirm('Are you sure that you want to clear the current form?')) {
            this.set(
                'ddah',
                fromJS({
                    supervisor: null,
                    tutCategory: null,
                    optional: null,
                    requiresTraining: false,
                    worksheet: [{ units: null, duty: null, type: null, time: null }],
                    trainings: [],
                    categories: [],
                    changed: true,
                })
            );
        }
    }

    // remove all selected filters on the offers table
    clearFilters() {
        this.set('selectedFilters', fromJS({}));
    }

    // returns a map of duty ids to totals for each duty
    computeDutiesSummary() {
        let summary = this.getDutiesList().map(_ => 0);

        this.get('ddah.worksheet').forEach(allocation => {
            if (
                allocation.get('duty') &&
                allocation.get('time') != undefined &&
                allocation.get('units') != undefined
            ) {
                summary = summary.update(
                    allocation.get('duty').toString(),
                    time => time + allocation.get('units') * allocation.get('time') / 60
                );
            }
        });

        return summary;
    }

    createTemplate(name) {
        fetch.createTemplate(name, this.get('ddah').toJS());
    }

    dismissAlert(id) {
        let alerts = this.get('alerts');
        let i = alerts.findIndex(alert => alert.get('id') == id);

        if (i != -1) {
            this.set('alerts', alerts.delete(i));
        }
    }

    getAlerts() {
        return this.get('alerts');
    }

    getCurrentUserName() {
        return this.get('user');
    }

    getCurrentUserRoles() {
        return this.get('roles');
    }

    // compute total ddah hours
    getDdahTotal() {
        let total = this.get('ddah.worksheet').reduce(
            (sum, allocation) => sum + allocation.get('units') * allocation.get('time'),
            0
        );
        return isNaN(total) ? 0 : total / 60;
    }

    getDdah() {
        return this.get('ddah');
    }

    getFilters() {
        return this.get('selectedFilters');
    }

    getSelectedDdah() {
        return this.get('selectedDdah');
    }

    getSelectedOffer() {
        return this.get('selectedOffer');
    }

    getSelectedSession() {
        return this.get('selectedSession');
    }

    getSelectedUserRole() {
        return this.get('selectedRole');
    }

    getSorts() {
        return this.get('selectedSortFields');
    }

    getUnreadNotifications() {
        return this.get('notifications');
    }

    // check whether a filter is selected on the offers table
    isFilterSelected(field, category) {
        let filters = this.get('selectedFilters');

        return filters.has(field) && filters.get(field).includes(category);
    }

    // add a notification to the list of unread notifications
    notify(text) {
        let notifications = this.get('notifications');
        this.set('notifications', notifications.push(text));
    }

    // clear the list of unread notifications
    readNotifications() {
        this.set('notifications', fromJS([]));
    }

    // remove a sort from the offers table
    removeSort(field) {
        let sorts = this.get('selectedSortFields');
        let i = sorts.findIndex(f => f.get(0) == field);

        this.set('selectedSortFields', sorts.delete(i));
    }

    selectSession(session) {
        this.set('selectedSession', session);
    }

    selectUserRole(role) {
        this.set('selectedRole', role);
    }

    setCurrentUserName(user) {
        this.set('user', user);
    }

    setCurrentUserRoles(roles) {
        this.set('roles', roles);
    }

    setDdah(ddah) {
        this.set('ddah', fromJS(Object.assign({}, ddah, { changed: true })));
    }

    // toggle a filter on the offers table
    toggleFilter(field, category) {
        let filters = this.get('selectedFilters');

        if (filters.has(field)) {
            let filter = filters.get(field);
            let i = filter.indexOf(category);

            if (i == -1) {
                // filter on this category is not already applied
                this.set('selectedFilters[' + field + ']', filter.push(category));
            } else if (filter.size > 1) {
                // filter on this category is already applied, along with other categories
                this.set('selectedFilters[' + field + ']', filter.delete(i));
            } else {
                // filter is only applied on this category
                this.set('selectedFilters', filters.remove(field));
            }
        } else {
            this.set('selectedFilters[' + field + ']', fromJS([category]));
        }
    }

    // unselect this ddah if it is already selected; otherwise select this ddah
    toggleSelectedDdah(ddah) {
        if (this.get('selectedDdah') == ddah) {
            // this ddah is currently selected
            this.set('selectedDdah', null);
        } else {
            let newDdah;
            if (ddah.startsWith('C')) {
                // ddah form selected

                // ddah does not already exist for this course
                newDdah = fromJS({
                    supervisor: null,
                    tutCategory: null,
                    optional: null,
                    requiresTraining: false,
                    worksheet: [{ units: null, duty: null, type: null, time: null }],
                    trainings: [],
                    categories: [],
                    changed: true,
                });
            } else {
                // template selected
                newDdah = this.get('templates.list.' + ddah.slice(1))
                    .delete('name')
                    .set('changed', false);
            }

            this.set({ selectedDdah: ddah, ddah: newDdah });
        }
    }

    // unselect this offer if it is already selected; otherwise select this offer
    toggleSelectedOffer(offer) {
        if (this.get('selectedOffer') == offer) {
            // this offer is currently selected
            this.set('selectedOffer', null);
        } else {
            this.set('selectedOffer', offer);
        }
    }

    // toggle the sort direction of the sort currently applied to the offers table
    toggleSortDir(field) {
        let sortFields = this.get('selectedSortFields');
        let i = sortFields.findIndex(f => f.get(0) == field);

        if (i != -1) {
            this.set('selectedSortFields[' + i + '][1]', -sortFields.get(i).get(1));
        }
    }

    // update ddah attribute
    updateDdah(attribute, value) {
        // if the attribute is a array of values, toggle the presence of this value in the array
        // (i.e. if the value is absent, add it; otherwise, remove it)
        if (attribute == 'trainings' || attribute == 'categories') {
            let array = this.get('ddah.' + attribute);
            let i = array.indexOf(parseInt(value));

            if (i == -1) {
                // value is not present
                this.set({ ['ddah.' + attribute]: array.push(parseInt(value)), 'ddah.changed': true });
            } else {
                this.set({ ['ddah.' + attribute]: array.delete(i), 'ddah.changed': true });
            }
        } else {
            this.set({ ['ddah.' + attribute]: value, 'ddah.changed': true });
        }
    }

    // update ddah allocation attribute
    updateDdahAllocation(allocation, attribute, value) {
        this.set({
            ['ddah.worksheet[' + allocation + '].' + attribute]: value,
            'ddah.changed': true,
        });
    }

    /******************************
     ** data getters and setters **
     ******************************/

    // check if any data needed by instructors is being fetched
    instrAnyFetching() {
        return [
            this.get('categories.fetching'),
            this.get('courses.fetching'),
            this.get('duties.fetching'),
            this.get('offers.fetching'),
            this.get('templates.fetching'),
            this.get('trainings.fetching'),
        ].some(val => val > 0);
    }

    // check if any data needed by instructors has not yet been fetched
    instrAnyNull() {
        return [
            this.get('categories.list'),
            this.get('courses.list'),
            this.get('duties.list'),
            this.get('offers.list'),
            this.get('templates.list'),
            this.get('trainings.list'),
        ].some(val => val == null);
    }

    clearHrStatus(offers) {
        if (offers.length == 0) {
            this.alert('<b>Error</b>: No offer selected');
            return;
        }

        fetch.clearHrStatus(offers.map(offer => parseInt(offer)));
    }

    // email applicants
    email(offers) {
        let allOffers = this.getOffersList();
        let emails = offers.map(offer => allOffers.getIn([offer, 'email']));

        var a = document.createElement('a');
        a.href =
            emails.length == 1
                ? 'mailto:' + emails[0] // if there is only a single recipient, send normally
                : 'mailto:?bcc=' + emails.join(','); // if there are multiple recipients, bcc all
        a.click();
    }

    // email mangled contract link to a single applicant
    emailContract(offers) {
        if (offers.length == 0) {
            this.alert('<b>Error</b>: No offer selected');
            return;
        }
        if (offers.length != 1) {
            this.alert('<b>Error:</b> Can only email a contract link to a single applicant.');
            return;
        }

        let offer = this.getOffersList().get(offers[0]);
        if (!offer.get('link')) {
            // offers does not have a contract link
            this.alert(
                '<b>Error:</b> Offer to ' +
                    offer.get('lastName') +
                    ', ' +
                    offer.get('firstName') +
                    ' does not have an associated contract'
            );
            return;
        }

        var a = document.createElement('a');
        a.href =
            'mailto:' + offer.get('email') + '?body=Link%20to%20contract:%20' + offer.get('link');
        a.click();
    }

    // export offers to CSV
    exportOffers() {
        let session = this.get('selectedSession');
        if (!session) {
            this.alert(
                '<b>Export offers from all sessions</b> This functionality is not currently supported. Please select a session.'
            );
            return;
        }

        fetch.exportOffers(session);
    }

    fetchAll() {
        let role = this.getSelectedUserRole();
        if (role == 'cp_admin' || role == 'hr_assistant') {
            fetch.adminFetchAll();
        } else if (role == 'instructor') {
            fetch.instructorFetchAll();
        }
    }

    // check if categories are being fetched
    fetchingCategories() {
        return this.get('categories.fetching') > 0;
    }

    // check if courses are being fetched
    fetchingCourses() {
        return this.get('courses.fetching') > 0;
    }

    // check if duties are being fetched
    fetchingDuties() {
        return this.get('duties.fetching') > 0;
    }

    // check if offers are being fetched
    fetchingOffers() {
        return this.get('offers.fetching') > 0;
    }

    // check if sessions are being fetched
    fetchingSessions() {
        return this.get('sessions.fetching') > 0;
    }

    // check if templates are being fetched
    fetchingTemplates() {
        return this.get('templates.fetching') > 0;
    }

    // check if trainings are being fetched
    fetchingTrainings() {
        return this.get('trainings.fetching') > 0;
    }

    getCategoriesList() {
        return this.get('categories.list');
    }

    getCoursesList() {
        return this.get('courses.list');
    }

    getDutiesList() {
        return this.get('duties.list');
    }

    getOffersList() {
        return this.get('offers.list');
    }

    getOffersForCourse(course) {
        return this.get('offers.list').filter(offer => offer.get('position') == course);
    }

    // get a sorted list of the positions in the current offers list as a JS array
    getPositions() {
        let offers = this.getOffersList();

        if (offers) {
            return offers.map(offer => offer.get('course')).flip().keySeq().sort().toJS();
        }
        return [];
    }

    getSessionsList() {
        return this.get('sessions.list');
    }

    getTemplatesList() {
        return this.get('templates.list');
    }

    getTrainingsList() {
        return this.get('trainings.list');
    }

    importAssignments() {
        fetch.importAssignments();
    }

    importOffers(data) {
        fetch.importOffers(data);
    }

    importing() {
        return this.get('importing') > 0;
    }

    isCategoriesListNull() {
        return this.get('categories.list') == null;
    }

    isCoursesListNull() {
        return this.get('courses.list') == null;
    }

    isDutiesListNull() {
        return this.get('duties.list') == null;
    }

    isOffersListNull() {
        return this.get('offers.list') == null;
    }

    isSessionsListNull() {
        return this.get('sessions.list') == null;
    }

    isTemplatesListNull() {
        return this.get('templates.list') == null;
    }

    isTrainingsListNull() {
        return this.get('trainings.list') == null;
    }

    nag(offers) {
        if (offers.length == 0) {
            this.alert('<b>Error</b>: No offer selected');
            return;
        }

        fetch.nag(offers.map(offer => parseInt(offer)));
    }

    // add/update the notes for a withdrawn offer
    noteOffer(offer, note) {
        fetch.noteOffer(offer, note);
    }

    print(offers) {
        if (offers.length == 0) {
            this.alert('<b>Error</b>: No offer selected');
            return;
        }

        fetch.print(offers.map(offer => parseInt(offer)));
    }

    resetOffer(offers) {
        if (offers.length == 0) {
            this.alert('<b>Error</b>: No offer selected');
            return;
        }
        if (offers.length != 1) {
            this.alert(
                '<b>Error:</b> Can only reset offer status for a single applicant at a time.'
            );
            return;
        }

        fetch.resetOffer(offers[0]);
    }

    sendContracts(offers) {
        if (offers.length == 0) {
            this.alert('<b>Error</b>: No offer selected');
            return;
        }

        fetch.sendContracts(offers.map(offer => parseInt(offer)));
    }

    setCategoriesList(list) {
        this.set('categories.list', list);
    }

    setCoursesList(list) {
        this.set('courses.list', list);
    }

    setDdahAccepted(offers) {
        if (offers.length == 0) {
            this.alert('<b>Error</b>: No offer selected');
            return;
        }

        fetch.setDdahAccepted(offers.map(offer => parseInt(offer)));
    }

    setDutiesList(list) {
        this.set('duties.list', list);
    }

    setFetchingCategoriesList(fetching, success) {
        let init = this.get('categories.fetching'),
            notifications = this.get('notifications');
        if (fetching) {
            this.set({
                'categories.fetching': init + 1,
                notifications: notifications.push('<i>Fetching categories...</i>'),
            });
        } else if (success) {
            this.set({
                'categories.fetching': init - 1,
                notifications: notifications.push('Successfully fetched categories.'),
            });
        } else {
            this.set('categories.fetching', init - 1);
        }
    }

    setFetchingCoursesList(fetching, success) {
        let init = this.get('courses.fetching'),
            notifications = this.get('notifications');
        if (fetching) {
            this.set({
                'courses.fetching': init + 1,
                notifications: notifications.push('<i>Fetching courses...</i>'),
            });
        } else if (success) {
            this.set({
                'courses.fetching': init - 1,
                notifications: notifications.push('Successfully fetched courses.'),
            });
        } else {
            this.set('courses.fetching', init - 1);
        }
    }

    setFetchingDutiesList(fetching, success) {
        let init = this.get('duties.fetching'),
            notifications = this.get('notifications');
        if (fetching) {
            this.set({
                'duties.fetching': init + 1,
                notifications: notifications.push('<i>Fetching duties...</i>'),
            });
        } else if (success) {
            this.set({
                'duties.fetching': init - 1,
                notifications: notifications.push('Successfully fetched duties.'),
            });
        } else {
            this.set('duties.fetching', init - 1);
        }
    }

    setFetchingOffersList(fetching, success) {
        let init = this.get('offers.fetching'),
            notifications = this.get('notifications');
        if (fetching) {
            this.set({
                'offers.fetching': init + 1,
                notifications: notifications.push('<i>Fetching offers...</i>'),
            });
        } else if (success) {
            this.set({
                'offers.fetching': init - 1,
                notifications: notifications.push('Successfully fetched offers.'),
            });
        } else {
            this.set('offers.fetching', init - 1);
        }
    }

    setFetchingSessionsList(fetching, success) {
        let init = this.get('sessions.fetching'),
            notifications = this.get('notifications');
        if (fetching) {
            this.set({
                'sessions.fetching': init + 1,
                notifications: notifications.push('<i>Fetching sessions...</i>'),
            });
        } else if (success) {
            this.set({
                'sessions.fetching': init - 1,
                notifications: notifications.push('Successfully fetched sessions.'),
            });
        } else {
            this.set('sessions.fetching', init - 1);
        }
    }

    setFetchingTemplatesList(fetching, success) {
        let init = this.get('templates.fetching'),
            notifications = this.get('notifications');
        if (fetching) {
            this.set({
                'templates.fetching': init + 1,
                notifications: notifications.push('<i>Fetching templates...</i>'),
            });
        } else if (success) {
            this.set({
                'templates.fetching': init - 1,
                notifications: notifications.push('Successfully fetched templates.'),
            });
        } else {
            this.set('templates.fetching', init - 1);
        }
    }

    setFetchingTrainingsList(fetching, success) {
        let init = this.get('trainings.fetching'),
            notifications = this.get('notifications');
        if (fetching) {
            this.set({
                'trainings.fetching': init + 1,
                notifications: notifications.push('<i>Fetching trainings...</i>'),
            });
        } else if (success) {
            this.set({
                'trainings.fetching': init - 1,
                notifications: notifications.push('Successfully fetched trainings.'),
            });
        } else {
            this.set('trainings.fetching', init - 1);
        }
    }

    setHrProcessed(offers) {
        if (offers.length == 0) {
            this.alert('<b>Error</b>: No offer selected');
            return;
        }

        fetch.setHrProcessed(offers.map(offer => parseInt(offer)));
    }

    setImporting(importing, success) {
        let init = this.get('importing'),
            notifications = this.get('notifications');
        if (importing) {
            this.set({
                importing: init + 1,
                notifications: notifications.push('<i>Import in progress...</i>'),
            });
        } else if (success) {
            this.set({
                importing: init - 1,
                notifications: notifications.push('Import completed successfully.'),
            });
        } else {
            this.set('importing', init - 1);
        }
    }

    setOfferAccepted(offers) {
        if (offers.length == 0) {
            this.alert('<b>Error</b>: No offer selected');
            return;
        }
        if (offers.length != 1) {
            this.alert('<b>Error:</b> Can only accept an offer for a single applicant at a time.');
            return;
        }

        fetch.setOfferAccepted(offers[0]);
    }

    setOffersList(list) {
        this.set('offers.list', list);
    }

    setSessionsList(list) {
        let semesterOrder = ['Winter', 'Spring', 'Fall', 'Year'];
        // sort sesions in order of most recent to least recent
        list.sort((sessionA, sessionB) => {
            if (sessionA.get('year') > sessionB.get('year')) {
                return -1;
            }
            if (sessionA.get('year') < sessionB.get('year')) {
                return 1;
            }
            return (
                semesterOrder.indexOf(sessionA.get('semester')) -
                semesterOrder.indexOf(sessionB.get('semester'))
            );
        });

        this.set('sessions.list', list);
    }

    setTemplatesList(list) {
        this.set('templates.list', list);
    }

    setTrainingsList(list) {
        this.set('trainings.list', list);
    }

    showContractApplicant(offer) {
        fetch.showContractApplicant(offer);
    }

    showContractHr(offer) {
        fetch.showContractHr(offer);
    }

    updateSessionPay(session, pay) {
        fetch.updateSessionPay(session, pay);
    }

    updateTemplate(template) {
        // process ddah for format
        let ddah = this.get('ddah');
        let updates = {
            optional: ddah.get('optional'),
            categories: ddah.get('categories').toJS(),
            trainings: ddah.get('trainings').toJS(),
            allocations: ddah.get('worksheet').map(allocation => ({
                id: allocation.get('id'),
                num_unit: allocation.get('units'),
                unit_name: allocation.get('type'),
                minutes: allocation.get('time'),
                duty_id: allocation.get('duty'),
            })).toJS(),
            scaling_learning: ddah.get('requiresTraining'),
        };

        fetch.updateTemplate(template, updates);
    }

    withdrawOffers(offers) {
        if (offers.length == 0) {
            this.alert('<b>Error</b>: No offer selected');
            return;
        }

        fetch.withdrawOffers(offers);
    }
}

let appState = new AppState();
export { appState };
