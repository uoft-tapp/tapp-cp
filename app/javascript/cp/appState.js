import React from 'react';
import { fromJS } from 'immutable';

import * as fetch from './fetch.js';

const initialState = {
    role: 'admin', // one of { 'admin', 'hris', 'inst' }
    user: 'user',

    // list of unread notifications (string can contain HTML, but be careful because it is not sanitized!)
    notifications: [],

    // list of UI alerts (string can contain HTML, but be careful because it is not sanitized!)
    alerts: [],

    // will be populated with selected sort and filter fields
    selectedSortFields: [],
    selectedFilters: {},

    /** DB data **/
    offers: { fetching: 0, list: null },

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

    // check whether any of the given filters in the category are selected on the offers table
    anyFilterSelected(field) {
        return this.get('selectedFilters').has(field);
    }

    // remove all selected filters on the offers table
    clearFilters() {
        this.set('selectedFilters', fromJS({}));
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

    getCurrentUserRole() {
        return this.get('role');
    }

    getFilters() {
        return this.get('selectedFilters');
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

    setCurrentUserName(user) {
        return this.set('user', user);
    }

    setCurrentUserRole(role) {
        return this.set('role', role);
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

    // toggle the sort direction of the sort currently applied to the offers table
    toggleSortDir(field) {
        let sortFields = this.get('selectedSortFields');
        let i = sortFields.findIndex(f => f.get(0) == field);

        if (i != -1) {
            this.set('selectedSortFields[' + i + '][1]', -sortFields.get(i).get(1));
        }
    }

    /******************************
     ** data getters and setters **
     ******************************/

    email(offers) {
        let allOffers = this.getOffersList();
        fetch.email(offers.map(offer => allOffers.getIn([offer, 'email'])));
    }

    // check if offers are being fetched
    fetchingOffers() {
        return this.get('offers.fetching') > 0;
    }

    getOffersList() {
        return this.get('offers.list');
    }

    // get a sorted list of the positions in the current offers list as a JS array
    getPositions() {
        let offers = this.getOffersList();

        if (offers) {
            return offers
                .map(offer => offer.getIn(['contract_details', 'position']))
                .flip()
                .keySeq()
                .toJS();
        }
        return [];
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

    isOffersListNull() {
        return this.get('offers.list') == null;
    }

    nag(offers) {
        let pendingOffers = [],
            allOffers = this.getOffersList();

        for (var offer of offers) {
            if (allOffers.getIn([offer, 'contract_statuses', 'status']) == 'Pending') {
                pendingOffers.push(parseInt(offer));
            } else {
                // offers that are not 'pending' cannot be nagged about
                this.alert(
                    '<b>Error:</b> Offer to ' +
                        allOffers.getIn([offer, 'last_name']) +
                        ', ' +
                        allOffers.getIn([offer, 'first_name']) +
                        ' is not pending'
                );
            }
        }

        fetch.nag(pendingOffers);
    }

    print(offers) {
        fetch.print(offers);
    }

    sendContracts(offers) {
        let status,
            unsentOffers = [],
            allOffers = this.getOffersList();

        for (var offer of offers) {
            status = allOffers.getIn([offer, 'contract_statuses', 'status']);

            switch (status) {
                // can only send contracts that are unsent
                case 'Unsent':
                    unsentOffers.push(parseInt(offer));
                    break;
                case 'Withdrawn':
                    this.alert(
                        '<b>Error:</b> Cannot send contract to ' +
                            allOffers.getIn([offer, 'last_name']) +
                            ', ' +
                            allOffers.getIn([offer, 'first_name']) +
                            '. Offer was withdrawn.'
                    );
                    break;
                default:
                    this.alert(
                        '<b>Error:</b> Contract has already been sent to ' +
                            allOffers.getIn([offer, 'last_name']) +
                            ', ' +
                            allOffers.getIn([offer, 'first_name'])
                    );
            }
        }

        fetch.sendContracts(unsentOffers);
    }

    setDdahAccepted(offers) {
        let acceptedOffers = [],
            allOffers = this.getOffersList();

        for (var offer of offers) {
            // can only accept DDAH form for accepted offers
            if (allOffers.getIn([offer, 'contract_statuses', 'status']) == 'Accepted') {
                acceptedOffers.push(parseInt(offer));
            } else {
                this.alert(
                    '<b>Error:</b> Cannot accept DDAH form for ' +
                        allOffers.getIn([offer, 'last_name']) +
                        ', ' +
                        allOffers.getIn([offer, 'first_name']) +
                        '. Offer is not accepted.'
                );
            }
        }

        fetch.setDdahAccepted(acceptedOffers);
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

    setHrProcessed(offers) {
        let acceptedOffers = [],
            allOffers = this.getOffersList();

        for (var offer of offers) {
            // can only process contract for accepted offers
            if (allOffers.getIn([offer, 'contract_statuses', 'status']) == 'Accepted') {
                acceptedOffers.push(parseInt(offer));
            } else {
                this.alert(
                    '<b>Error:</b> Cannot process contract for ' +
                        allOffers.getIn([offer, 'last_name']) +
                        ', ' +
                        allOffers.getIn([offer, 'first_name']) +
                        '. Offer is not accepted.'
                );
            }
        }

        fetch.setHrProcessed(acceptedOffers);
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

    setOffersList(list) {
        this.set('offers.list', list);
    }

    showContractApplicant(offer) {
        fetch.showContractApplicant(offer);
    }

    showContractHr(offer) {
        fetch.showContractHr(offer);
    }

    withdrawOffers(offers) {
        let status,
            pendingOffers = [],
            allOffers = this.getOffersList();

        for (var offer of offers) {
            // cannot withdraw unsent offers
            if (allOffers.getIn([offer, 'contract_statuses', 'status']) == 'Unsent') {
                this.alert(
                    '<b>Error:</b> Offer to ' +
                        allOffers.getIn([offer, 'last_name']) +
                        ', ' +
                        allOffers.getIn([offer, 'first_name']) +
                        ' has not been sent'
                );
            } else {
                pendingOffers.push(parseInt(offer));
            }
        }

        fetch.withdrawOffers(pendingOffers);
    }
}

let appState = new AppState();
export { appState };
