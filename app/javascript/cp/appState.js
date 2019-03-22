import React from "react";
import { fromJS } from "immutable";

import * as fetch from "./fetch.js";

const initialState = {
    // navbar component
    nav: {
        roles: [], // array of { 'cp_admin', 'hr_assistant', 'instructor' }
        selectedRole: null,
        user: null,

        selectedTab: null,

        // list of unread notifications (string can contain HTML, but be careful because it is not sanitized!)
        notifications: []
    },

    // list of UI alerts (string can contain HTML, but be careful because it is not sanitized!)
    alerts: [],

    // will be populated with selected sort and filter fields
    selectedSortFields: [],
    selectedFilters: {},

    selectedSession: null,

    ddahWorksheet: {
        supervisor: null,
        supervisorId: null,
        optional: null,
        requiresTraining: false,
        allocations: [
            { id: null, units: null, duty: null, type: null, time: null }
        ],
        trainings: [],
        categories: [],

        changed: false // "dirty" bit
    },

    selectedDdahData: { type: null, id: null },

    /** DB data **/
    categories: { fetching: 0, list: null },
    courses: { fetching: 0, list: null },
    ddahs: { fetching: 0, list: null },
    duties: { fetching: 0, list: null },
    offers: { fetching: 0, list: null },
    sessions: { fetching: 0, list: null },
    templates: { fetching: 0, list: null },
    trainings: { fetching: 0, list: null },

    importing: 0
};

class AppState {
    constructor() {
        // container for application state
        var _data = fromJS(initialState);

        // list of change listeners
        this._listeners = [];
        // notify listeners of change
        var notifyListeners = () =>
            this._listeners.forEach(listener => listener());

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
                        (result, [prop, val]) =>
                            result.setIn(parsePath(prop), val),
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

    // add a row to the ddah worksheet
    addAllocation() {
        let allocations = this.get("ddahWorksheet.allocations");

        // max. 24 rows are supported (this number comes from counting the number of rows generated
        // in the DDAH form PDF)
        if (allocations.size == 24) {
            this.alert("No more rows can be added.");
        } else {
            this.set({
                "ddahWorksheet.allocations": allocations.push(
                    fromJS({
                        id: null,
                        units: null,
                        duty: null,
                        type: null,
                        time: null
                    })
                ),
                "ddahWorksheet.changed": true
            });
        }
    }

    // apply a sort to the offers table
    // note that we do not allow multiple sorts on the same field (incl. in different directions)
    addSort(field) {
        let sorts = this.get("selectedSortFields");

        if (!sorts.some(val => val.get(0) == field)) {
            this.set("selectedSortFields", sorts.push(fromJS([field, 1])));
        } else {
            this.alert(
                "<b>Applicant Table</b>&ensp;Cannot apply the same sort more than once."
            );
        }
    }

    // add an alert to the list of active alerts
    alert(text) {
        let alerts = this.get("alerts");
        // give it an id that is 1 larger than the largest id in the array, or 0 if the array is empty
        this.set(
            "alerts",
            alerts.unshift(
                fromJS({
                    id: alerts.size > 0 ? alerts.first().get("id") + 1 : 0,
                    text: text
                })
            )
        );
    }

    // check whether the user has made any changes to the current ddah worksheet
    anyDdahWorksheetChanges() {
        return this.get("ddahWorksheet.changed");
    }

    // check whether any of the given filters in the category are selected on the offers table
    anyFilterSelected(field) {
        return this.get("selectedFilters").has(field);
    }

    applyTemplate(templateId) {
        let template = this.get("templates.list." + templateId);
        template.get("allocations").forEach(function(allocation, key) {
            let allocations = template
                .get("allocations")
                .set(key, allocation.remove("id"));
            template = template.set("allocations", allocations);
        });
        // replace the values in the current ddah with the values in the template
        this.set(
            "ddahWorksheet",
            this.get("ddahWorksheet")
                .merge(this.createDdahWorksheet(template))
                .set("changed", true)
        );
    }

    clearDdah() {
        if (
            window.confirm(
                "Are you sure that you want to clear the current form?"
            )
        ) {
            this.set(
                "ddahWorksheet",
                fromJS(initialState.ddahWorksheet).set("changed", true)
            );
        }
    }

    // remove all selected filters on the offers table
    clearFilters() {
        this.set("selectedFilters", fromJS({}));
    }

    // return ddahData in the ddah worksheet format
    createDdahWorksheet(ddahData) {
        let worksheet = {
            supervisorId: ddahData.get("supervisorId"),
            supervisor: ddahData.get("supervisor"),
            tutCategory: ddahData.get("tutCategory"),
            optional: ddahData.get("optional"),
            requiresTraining: ddahData.get("requiresTraining"),
            allocations: ddahData.get("allocations"),
            trainings: ddahData.get("trainings"),
            categories: ddahData.get("categories")
        };

        return fromJS(worksheet);
    }

    dismissAlert(id) {
        let alerts = this.get("alerts");
        let i = alerts.findIndex(alert => alert.get("id") == id);

        if (i != -1) {
            this.set("alerts", alerts.delete(i));
        }
    }

    getAlerts() {
        return this.get("alerts");
    }

    getCurrentUserName() {
        return this.get("nav.user");
    }

    getCurrentUserRoles() {
        return this.get("nav.roles");
    }

    getTaCoordinator() {
        return this.get("taCoordinator");
    }

    getDdahApprovedSignature(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }
        let ddahs = this.getDdahsFromOffers(offers);
        if (ddahs.length > 0) {
            let signature = window.prompt(
                "Please enter your initial for approving DDAH's:"
            );

            if (signature && signature.trim()) {
                fetch.setDdahApproved(ddahs, signature.trim());
            }
        }
    }

    getDdahsFromOffers(offers) {
        let ddahs = [];
        let allOffers = this.getOffersList();
        offers.forEach(offer => {
            let ddah = this.get("ddahs.list").findKey(
                ddah => ddah.get("offer") == offer
            );
            if (ddah == null) {
                this.alert(
                    "<b>Error</b>: There is no DDAH form of " +
                        allOffers.getIn([offer, "lastName"]) +
                        ", " +
                        allOffers.getIn([offer, "firstName"]) +
                        " for " +
                        allOffers.getIn([offer, "course"])
                );
            } else {
                ddahs.push(ddah);
            }
        });
        return ddahs;
    }

    // compute total ddah hours
    getDdahWorksheetTotal() {
        let total = this.get("ddahWorksheet.allocations").reduce(
            (sum, allocation) =>
                sum + allocation.get("units") * allocation.get("time"),
            0
        );
        return isNaN(total) ? 0 : total / 60;
    }

    getDdahWorksheet() {
        return this.get("ddahWorksheet");
    }

    // returns a map of duty ids to totals for each duty
    getDutiesSummary() {
        let summary = this.getDutiesList().map(_ => 0);

        this.get("ddahWorksheet.allocations").forEach(allocation => {
            if (
                allocation.get("duty") &&
                allocation.get("time") != undefined &&
                allocation.get("units") != undefined
            ) {
                summary = summary.update(
                    allocation.get("duty").toString(),
                    time =>
                        time +
                        (allocation.get("units") * allocation.get("time")) / 60
                );
            }
        });

        return summary;
    }

    getFilters() {
        return this.get("selectedFilters");
    }

    getSelectedDdahId() {
        return this.get("selectedDdahData.id");
    }

    getSelectedOffer() {
        return this.get("selectedOffer");
    }

    getSelectedSession() {
        return this.get("selectedSession");
    }

    getSelectedCourse() {
        return this.get("selectedCourse");
    }

    getSelectedNavTab() {
        return this.get("nav.selectedTab");
    }

    getSelectedUserRole() {
        return this.get("nav.selectedRole");
    }

    getSorts() {
        return this.get("selectedSortFields");
    }

    getUnreadNotifications() {
        return this.get("nav.notifications");
    }

    // check whether a filter is selected on the offers table
    isFilterSelected(field, category) {
        let filters = this.get("selectedFilters");

        return filters.has(field) && filters.get(field).includes(category);
    }

    // check whether the currently-selected ddah data corresponds to an offer
    isOfferSelected() {
        return this.get("selectedDdahData.type") == "offer";
    }

    // check whether the currently-selected ddah data corresponds to a template
    isTemplateSelected() {
        return this.get("selectedDdahData.type") == "template";
    }

    // add a notification to the list of unread notifications
    notify(text) {
        let notifications = this.get("nav.notifications");
        this.set("nav.notifications", notifications.push(text));
    }

    // clear the list of unread notifications
    readNotifications() {
        this.set("nav.notifications", fromJS([]));
    }

    // remove an allocation from the ddah worksheet
    removeAllocation(index) {
        this.set({
            "ddahWorksheet.allocations": this.get(
                "ddahWorksheet.allocations"
            ).delete(index),
            "ddahWorksheet.changed": true
        });
    }

    // remove a sort from the offers table
    removeSort(field) {
        let sorts = this.get("selectedSortFields");
        let i = sorts.findIndex(f => f.get(0) == field);

        this.set("selectedSortFields", sorts.delete(i));
    }

    // cycle through sort+, sort-, no sort
    cycleSort(field) {
        const sorts = this.get("selectedSortFields");
        const i = sorts.findIndex(f => f.get(0) === field);
        if (i === -1) {
            this.addSort(field);
            return;
        }

        const dir = sorts.get(i).get(1);

        if (dir === 1) {
            this.toggleSortDir(field);
        } else {
            this.removeSort(field);
        }
    }

    // select a navbar tab
    selectNavTab(eventKey) {
        this.set("nav.selectedTab", eventKey);
    }

    selectSession(id) {
        this.set("selectedSession", id);
        let role = appState.getSelectedUserRole();
        switch (role) {
            case "cp_admin":
            case "hr_assistant":
                fetch.adminFetchAll();
                break;
            case "instructor":
                fetch.instructorFetchAll();
                break;
        }
    }

    getSessionName(id) {
        let sessions = this.getSessionsList();
        if (sessions.size > 0) {
            let selected = sessions.get(id);
            if (selected)
                return selected.get("semester") + " " + selected.get("year");
        }
        return "";
    }

    getSessionPay(session) {
        return this.get("sessions.list." + session + ".pay");
    }

    selectCourse(course) {
        this.set("selectedCourse", course);
    }

    selectUserRole(role) {
        this.set("nav.selectedRole", role);
    }

    setCurrentUserName(user) {
        this.set("nav.user", user);
    }

    setCurrentUserRoles(roles) {
        this.set("nav.roles", roles);
    }

    setTaCoordinator(coordinator) {
        this.set("taCoordinator", coordinator);
    }

    setDdahWorksheet(ddah) {
        this.set(
            "ddahWorksheet",
            fromJS(Object.assign({}, ddah, { changed: true }))
        );
    }

    // toggle a filter on the offers table
    toggleFilter(field, category) {
        let filters = this.get("selectedFilters");

        if (filters.has(field)) {
            let filter = filters.get(field);
            let i = filter.indexOf(category);

            if (i == -1) {
                // filter on this category is not already applied
                this.set(
                    "selectedFilters[" + field + "]",
                    filter.push(category)
                );
            } else if (filter.size > 1) {
                // filter on this category is already applied, along with other categories
                this.set("selectedFilters[" + field + "]", filter.delete(i));
            } else {
                // filter is only applied on this category
                this.set("selectedFilters", filters.remove(field));
            }
        } else {
            this.set("selectedFilters[" + field + "]", fromJS([category]));
        }
    }

    // unselect this offer if it is already selected; otherwise select this offer
    toggleSelectedOffer(offer) {
        if (this.isOfferSelected() && this.getSelectedDdahId() == offer) {
            // this offer is currently selected
            this.set({
                selectedDdahData: fromJS({ type: null, id: null }),
                ddahWorksheet: fromJS(initialState.ddahWorksheet).set(
                    "changed",
                    false
                )
            });
        } else {
            // this offer is not currently selected

            let newDdahData = this.get("ddahs.list").find(
                ddah => ddah.get("offer") == offer
            );

            if (newDdahData) {
                // ddah found for this offer
                this.set({
                    selectedDdahData: fromJS({ type: "offer", id: offer }),
                    ddahWorksheet: this.createDdahWorksheet(newDdahData).set(
                        "changed",
                        false
                    )
                });
            } else {
                // ddah does not already exist for this offer, so create a new one
                fetch.createDdah(offer).then(newDdah => {
                    // set the ddah worksheet data from the newly-created ddah
                    newDdahData = this.get("ddahs.list." + newDdah);
                    this.set({
                        selectedDdahData: fromJS({ type: "offer", id: offer }),
                        ddahWorksheet: this.createDdahWorksheet(
                            newDdahData
                        ).set("changed", false)
                    });
                });
            }
        }
    }

    // unselect this template if it is already selected; otherwise select this template
    toggleSelectedTemplate(template) {
        let currId = this.getSelectedDdahId();

        if (this.isTemplateSelected() && this.getSelectedDdahId() == template) {
            // this template is currently selected, so unselect it
            this.set({
                selectedDdahData: fromJS({ type: null, id: null }),
                ddahWorksheet: fromJS(initialState.ddahWorksheet).set(
                    "changed",
                    false
                )
            });
        } else {
            let newDdahData = this.get("templates.list." + template);

            // this template is not currently selected, so select it
            this.set({
                selectedDdahData: fromJS({ type: "template", id: template }),
                ddahWorksheet: this.createDdahWorksheet(newDdahData).set(
                    "changed",
                    false
                )
            });
        }
    }

    // toggle the sort direction of the sort currently applied to the offers table
    toggleSortDir(field) {
        let sortFields = this.get("selectedSortFields");
        let i = sortFields.findIndex(f => f.get(0) == field);

        if (i != -1) {
            this.set(
                "selectedSortFields[" + i + "][1]",
                -sortFields.get(i).get(1)
            );
        }
    }

    // update ddah attribute
    updateDdahWorksheet(attribute, value) {
        // if the attribute is a array of values, toggle the presence of this value in the array
        // (i.e. if the value is absent, add it; otherwise, remove it)
        if (attribute == "trainings" || attribute == "categories") {
            let array = this.get("ddahWorksheet." + attribute);
            let i = array.indexOf(parseInt(value));

            if (i == -1) {
                // value is not present
                this.set({
                    ["ddahWorksheet." + attribute]: array.push(parseInt(value)),
                    "ddahWorksheet.changed": true
                });
            } else {
                this.set({
                    ["ddahWorksheet." + attribute]: array.delete(i),
                    "ddahWorksheet.changed": true
                });
            }
        } else {
            this.set({
                ["ddahWorksheet." + attribute]: value,
                "ddahWorksheet.changed": true
            });
        }
    }

    // update ddah allocation attribute
    updateDdahWorksheetAllocation(allocation, attribute, value) {
        this.set({
            ["ddahWorksheet.allocations[" +
            allocation +
            "]." +
            attribute]: value,
            "ddahWorksheet.changed": true
        });
    }

    /******************************
     ** data getters and setters **
     ******************************/

    // check if any data needed by instructors is being fetched
    instrAnyFetching() {
        return [
            this.get("categories.fetching"),
            this.get("courses.fetching"),
            this.get("ddahs.fetching"),
            this.get("duties.fetching"),
            this.get("offers.fetching"),
            this.get("templates.fetching"),
            this.get("trainings.fetching")
        ].some(val => val > 0);
    }

    // check if any data needed by instructors has not yet been fetched
    instrAnyNull() {
        return [
            this.get("categories.list"),
            this.get("courses.list"),
            this.get("ddahs.list"),
            this.get("duties.list"),
            this.get("offers.list"),
            this.get("templates.list"),
            this.get("trainings.list")
        ].some(val => val == null);
    }

    clearHrStatus(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }

        fetch.clearHrStatus(offers);
    }

    createTemplate() {
        let name = window.prompt("Please enter a name for the new template:");

        if (name && name.trim()) {
            // the route to create a new template expects a position with which to associate the template
            // we don't associate templates with positions in the front-end model, so we pick a position id
            // without caring which
            fetch
                .createTemplate(name)
                // when the request succeeds, display the new template
                .then(template => this.toggleSelectedTemplate(template));
        }
    }

    createTemplateFromDdah(offer) {
        let name = window.prompt("Please enter a name for the new template:");

        if (name && name.trim()) {
            let ddahId = this.get("ddahs.list").findKey(
                ddah => ddah.get("offer") == offer
            );
            fetch.createTemplateFromDdah(name, ddahId);
        }
    }

    // email applicants
    email(offers) {
        let allOffers = this.getOffersList();
        let emails = offers.map(offer => allOffers.getIn([offer, "email"]));

        var a = document.createElement("a");
        a.href =
            emails.length == 1
                ? "mailto:" + emails[0] // if there is only a single recipient, send normally
                : "mailto:?bcc=" + emails.join(","); // if there are multiple recipients, bcc all
        a.click();
    }

    // email contract link to a single applicant
    emailContract(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }
        if (offers.length != 1) {
            this.alert(
                "<b>Error:</b> Can only email a contract link to a single applicant."
            );
            return;
        }

        let offer = this.getOffersList().get(offers[0]);
        if (!offer.get("link")) {
            // offer does not have a contract link
            this.alert(
                "<b>Error:</b> Offer to " +
                    offer.get("lastName") +
                    ", " +
                    offer.get("firstName") +
                    " does not have an associated contract"
            );
            return;
        }

        var a = document.createElement("a");
        a.href =
            "mailto:" +
            offer.get("email") +
            "?body=Link%20to%20contract:%20" +
            offer.get("link");
        a.click();
    }

    // email ddah form link to a single applicant
    emailDdah(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }
        if (offers.length != 1) {
            this.alert(
                "<b>Error:</b> Can only email a DDAH form link to a single applicant."
            );
            return;
        }

        let offer = this.getOffersList().get(offers[0]);
        let ddah = this.getDdahsFromOffers(offers);
        if (ddah.length == 1) {
            let allDdahs = this.getDdahsList();
            if (allDdahs.getIn([ddah, "link"]) == null) {
                // ddah does not have a ddah link
                this.alert(
                    "<b>Error:</b> Offer to " +
                        offer.get("lastName") +
                        ", " +
                        offer.get("firstName") +
                        " does not have an associated DDAH form"
                );
                return;
            } else {
                var a = document.createElement("a");
                a.href =
                    "mailto:" +
                    offer.get("email") +
                    "?body=Link%20to%20DDAH%20form:%20" +
                    allDdahs.getIn([ddah, "link"]);
                a.click();
            }
        }
    }

    // export offers to CSV
    exportOffers() {
        let session = this.get("selectedSession");
        if (!session) {
            this.alert(
                "<b>Export offers from all sessions</b> This functionality is not currently supported. Please select a session."
            );
            return;
        }

        fetch.exportOffers(session);
    }

    // export offers to CSV
    exportDdahs() {
        let course = this.getSelectedCourse();
        let selectedSession = this.getSelectedSession();
        if (selectedSession == "N/A") {
            this.alert(
                "<b>Error</b>: You do not have a session in the system. Please import data from TAPP."
            );
            return;
        }
        fetch.exportDdahs(course, selectedSession);
    }

    fetchAll() {
        let role = this.getSelectedUserRole();
        if (role == "cp_admin" || role == "hr_assistant") {
            fetch.adminFetchAll();
        } else if (role == "instructor") {
            fetch.instructorFetchAll();
        }
    }

    // check if categories are being fetched
    fetchingCategories() {
        return this.get("categories.fetching") > 0;
    }

    // check if courses are being fetched
    fetchingCourses() {
        return this.get("courses.fetching") > 0;
    }

    // check if ddahs are being fetched
    fetchingDdahs() {
        return this.get("ddahs.fetching") > 0;
    }

    // check if duties are being fetched
    fetchingDuties() {
        return this.get("duties.fetching") > 0;
    }

    // check if offers are being fetched
    fetchingOffers() {
        return this.get("offers.fetching") > 0;
    }

    // check if sessions are being fetched
    fetchingSessions() {
        return this.get("sessions.fetching") > 0;
    }

    // check if templates are being fetched
    fetchingTemplates() {
        return this.get("templates.fetching") > 0;
    }

    // check if trainings are being fetched
    fetchingTrainings() {
        return this.get("trainings.fetching") > 0;
    }

    getCategoriesList() {
        return this.get("categories.list");
    }

    getCoursesList() {
        return this.get("courses.list");
    }

    getSessionCourse() {
        let session = this.getSelectedSession();
        let courses = this.getCoursesList();
        let selected = [];
        if (session == "") {
            courses.forEach((course, key) => {
                selected.push({
                    id: key,
                    code: course.get("code")
                });
            });
        } else {
            courses.forEach((course, key) => {
                if (course.get("session") == session)
                    selected.push({
                        id: key,
                        code: course.get("code")
                    });
            });
        }
        selected.sort((a, b) => this.compareString(a, b, "code"));
        return selected;
    }

    compareString(a, b, attr) {
        a = a[attr];
        b = b[attr];
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }

    getDdahsList() {
        return this.get("ddahs.list");
    }

    getDutiesList() {
        return this.get("duties.list");
    }

    getOffersList() {
        return this.get("offers.list");
    }

    getOffersForCourse(course) {
        return this.get("offers.list").filter(
            offer => offer.get("position") == course
        );
    }

    // get a sorted list of the positions in the current offers list as a JS array
    getPositions() {
        let offers = this.getOffersList();

        if (offers.size > 0) {
            return offers
                .map(offer => offer.get("course"))
                .flip()
                .keySeq()
                .sort()
                .toJS();
        }
        return [];
    }

    getSessionsList() {
        return this.get("sessions.list");
    }

    getTemplatesList() {
        return this.get("templates.list");
    }

    getTrainingsList() {
        return this.get("trainings.list");
    }

    importAssignments() {
        fetch.importAssignments();
    }

    importOffers(data) {
        fetch.importOffers(data);
    }

    importDdahs(data) {
        fetch.importDdahs(data);
    }

    importing() {
        return this.get("importing") > 0;
    }

    isCategoriesListNull() {
        return this.get("categories.list") == null;
    }

    isCoursesListNull() {
        return this.get("courses.list") == null;
    }

    isDdahsListNull() {
        return this.get("ddahs.list") == null;
    }

    // verify that the current ddah is valid for submission:
    //   'optional' must have a value
    //   at least one tutorial category must be selected
    //   the total number of hours must be equal to the number of hours in the offer
    //   all allocation fields must have non-null values
    isDdahValidForSubmission(ddahId, expectedHours) {
        let ddah = this.get("ddahs.list." + ddahId),
            alerts = [];

        if (ddah.get("optional") !== true && ddah.get("optional") !== false) {
            alerts.push(
                '<b>Error</b>: Must decide whether tutorial is "Optional" or "Mandatory".'
            );
        }

        if (ddah.get("categories").size == 0) {
            alerts.push(
                "<b>Error</b>: Must select at least one tutorial category."
            );
        }

        let totalMin = ddah
            .get("allocations")
            .reduce(
                (sum, allocation) =>
                    sum + allocation.get("units") * allocation.get("time"),
                0.0
            );
        if (isNaN(totalMin)) {
            alerts.push(
                "<b>Error</b>:Total time (NaN) is not equal to the expected number of hours."
            );
        } else {
            //if the calculated total is within a minute of the TA's allocation then close enough
            if (Math.abs(totalMin - expectedHours * 60) < 1.0) {
            } else {
                alerts.push(
                    "<b>Error</b>: Total time is not equal to the expected number of hours."
                );
            }
        }

        let allocations = ddah.get("allocations");
        if (
            allocations.some(
                allocation =>
                    !allocation.get("units") ||
                    (!allocation.get("type") ||
                        !allocation.get("type").trim()) ||
                    !allocation.get("time") ||
                    !allocation.get("duty")
            )
        ) {
            alerts.push(
                "<b>Error</b>: Incomplete field(s) in Allocation of Hours Worksheet."
            );
        }

        alerts.forEach(alert => this.alert(alert));

        return alerts.length == 0;
    }

    isDutiesListNull() {
        return this.get("duties.list") == null;
    }

    isOffersListNull() {
        return this.get("offers.list") == null;
    }

    isSessionsListNull() {
        return this.get("sessions.list") == null;
    }

    isTemplatesListNull() {
        return this.get("templates.list") == null;
    }

    isTrainingsListNull() {
        return this.get("trainings.list") == null;
    }

    nagApplicantDdahs(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }

        let ddahs = this.getDdahsFromOffers(offers);
        if (ddahs.length > 0) {
            fetch.nagApplicantDdahs(ddahs);
        }
    }

    nagInstructors(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }

        fetch.nagInstructors(offers);
    }

    nagOffers(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }

        fetch.nagOffers(offers);
    }

    // add/update the notes for a withdrawn offer
    noteOffer(offer, note) {
        fetch.noteOffer(offer, note);
    }

    previewDdah(offer) {
        let ddahId = this.get("ddahs.list").findKey(
            ddah => ddah.get("offer") == offer
        );

        fetch.previewDdah(ddahId);
    }

    print(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }

        fetch.print(offers);
    }

    resetOffer(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }
        if (offers.length != 1) {
            this.alert(
                "<b>Error:</b> Can only reset offer status for a single applicant at a time."
            );
            return;
        }

        fetch.resetOffer(offers[0]);
    }

    sendContracts(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }

        fetch.sendContracts(offers);
    }

    sendDdahs(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }

        let ddahs = this.getDdahsFromOffers(offers);
        if (ddahs.length > 0) {
            fetch.sendDdahs(ddahs);
        }
    }

    previewDdahs(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }

        let ddahs = this.getDdahsFromOffers(offers);
        if (ddahs.length > 0) {
            fetch.previewDdahs(ddahs);
        }
    }

    setCategoriesList(list) {
        this.set("categories.list", list);
    }

    setCoursesList(list) {
        this.set("courses.list", list);
    }

    setDdahAccepted(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }
        let ddahs = this.getDdahsFromOffers(offers);
        if (ddahs.length > 0) {
            fetch.setDdahAccepted(offers);
        }
    }

    setDdahsList(list) {
        this.set("ddahs.list", list);
    }

    setDutiesList(list) {
        this.set("duties.list", list);
    }

    setFetchingDataList(data, fetching, success) {
        let init = this.get(data + ".fetching"),
            notifications = this.get("nav.notifications");
        if (fetching) {
            this.set({
                [data + ".fetching"]: init + 1,
                "nav.notifications": notifications.push(
                    "<i>Fetching " + data + "...</i>"
                )
            });
        } else if (success) {
            this.set({
                [data + ".fetching"]: init - 1,
                "nav.notifications": notifications.push(
                    "Successfully fetched " + data + "."
                )
            });
        } else {
            this.set(data + ".fetching", init - 1);
        }
    }

    setHrProcessed(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }

        fetch.setHrProcessed(offers);
    }

    setImporting(importing, success) {
        let init = this.get("importing"),
            notifications = this.get("nav.notifications");
        if (importing) {
            this.set({
                importing: init + 1,
                "nav.notifications": notifications.push(
                    "<i>Import in progress...</i>"
                )
            });
        } else if (success) {
            this.set({
                importing: init - 1,
                "nav.notifications": notifications.push(
                    "Import completed successfully."
                )
            });
        } else {
            this.set("importing", init - 1);
        }
    }

    setOfferAccepted(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }
        if (offers.length != 1) {
            this.alert(
                "<b>Error:</b> Can only accept an offer for a single applicant at a time."
            );
            return;
        }

        fetch.setOfferAccepted(offers[0]);
    }

    setOffersList(list) {
        this.set("offers.list", list);
    }

    setSessionsList(list) {
        let semesterOrder = ["Winter", "Spring", "Fall", "Year"];
        // sort sesions in order of most recent to least recent
        list.sort((sessionA, sessionB) => {
            if (sessionA.get("year") > sessionB.get("year")) {
                return -1;
            }
            if (sessionA.get("year") < sessionB.get("year")) {
                return 1;
            }
            return (
                semesterOrder.indexOf(sessionA.get("semester")) -
                semesterOrder.indexOf(sessionB.get("semester"))
            );
        });

        this.set("sessions.list", list);
    }

    getLatestSession() {
        let latest = null;
        this.getSessionsList().forEach((key, id) => {
            if (!latest || id > latest) latest = id;
        });
        return latest ? latest : "N/A";
    }

    setLatestSession() {
        this.set("selectedSession", this.getLatestSession());
    }

    setTemplatesList(list) {
        this.set("templates.list", list);
    }

    setTrainingsList(list) {
        this.set("trainings.list", list);
    }

    showContractApplicant(offer) {
        fetch.showContractApplicant(offer);
    }

    showContractHr(offer) {
        fetch.showContractHr(offer);
    }

    submitDdah(offer) {
        let ddahId = this.get("ddahs.list").findKey(
            ddah => ddah.get("offer") == offer
        );
        let expectedHours = this.get("offers.list." + offer).get("hours");

        if (this.isDdahValidForSubmission(ddahId, expectedHours)) {
            let signature = window.prompt(
                "Please type a signature to complete the submission:"
            );

            if (signature && signature.trim()) {
                fetch.submitDdah(signature, parseInt(ddahId));
            }
        }
    }

    updateDdah(offer) {
        let ddahId = this.get("ddahs.list").findKey(
            ddah => ddah.get("offer") == offer
        );

        // process ddah for format
        let ddah = this.get("ddahWorksheet");
        let updates = {
            instructor_id: ddah.get("supervisorId"),
            optional: ddah.get("optional"),
            categories: ddah.get("categories").toJS(),
            trainings: ddah.get("trainings").toJS(),
            allocations: ddah
                .get("allocations")
                // remove empty rows
                .filter(
                    allocation =>
                        allocation.get("units") ||
                        (allocation.get("type") &&
                            allocation.get("type").trim()) ||
                        allocation.get("time") ||
                        allocation.get("duty")
                )
                .map(allocation => ({
                    id: allocation.get("id"),
                    num_unit: allocation.get("units"),
                    unit_name: allocation.get("type"),
                    minutes: allocation.get("time"),
                    duty_id: allocation.get("duty")
                }))
                .toJS(),
            scaling_learning: ddah.get("requiresTraining")
        };

        fetch
            .updateDdah(ddahId, updates)
            .then(this.set("ddahWorksheet.changed", false));
    }

    updateSessionPay(session, pay, dbUpdate = false) {
        if (dbUpdate) {
            fetch.updateSessionPay(session, pay);
        } else {
            this.set("sessions.list." + session + ".pay", pay);
        }
    }

    updateTemplate(template) {
        // process ddah for format
        let ddah = this.get("ddahWorksheet");
        let updates = {
            optional: ddah.get("optional"),
            categories: ddah.get("categories").toJS(),
            trainings: ddah.get("trainings").toJS(),
            allocations: ddah
                .get("allocations")
                .map(allocation => ({
                    id: allocation.get("id"),
                    num_unit: allocation.get("units"),
                    unit_name: allocation.get("type"),
                    minutes: allocation.get("time"),
                    duty_id: allocation.get("duty")
                }))
                .toJS(),
            scaling_learning: ddah.get("requiresTraining")
        };

        fetch
            .updateTemplate(template, updates)
            .then(this.set("ddahWorksheet.changed", false));
    }

    withdrawOffers(offers) {
        if (offers.length == 0) {
            this.alert("<b>Error</b>: No offer selected");
            return;
        }

        fetch.withdrawOffers(offers);
    }
}

let appState = new AppState();
export { appState };
