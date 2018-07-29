import React from 'react';
import {
    Button,
    Grid,
    Panel
} from 'react-bootstrap';
import { Switch, Redirect, Route } from 'react-router-dom';

import { routeConfig } from '../routeConfig.js';
import { Contract } from './contract.js';

const ContractPanel = props => {
    let instructors = [];
    props.offer.get('instructors').map(instructor => instructors.push(instructor));

    let instructorString = "";
    if (instructors.length) {
        instructorString += " with instructor" + ((instructors.length > 1) ? "s " : " ");
        instructors.map((instructor, i) => {
            instructorString += instructor.get("name");
            if (i < instructors.length - 1) {
                instructorString += ", ";
            }
        });
    }

    return (
        <Panel bsStyle="primary">
            <Panel.Heading>
                <Panel.Title>{props.offer.get('course') + instructorString}</Panel.Title>
            </Panel.Heading>
            <div>
                <Button onClick={() => props.selectContract()}>
                    Contract
                </Button>
                <Button>
                    DDAH Form
                </Button>
            </div>
        </Panel>
    );
}

class ContractsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contractSelected: 0
        };
    }

    selectContract(id) {
        this.setState({
            contractSelected: id
        });
    }

    render() {
        if (this.state.contractSelected) {
            return (
                <Redirect
                    to={routeConfig.contracts.route + "/" + this.state.contractSelected}
                />
            );
        }

        let offers = this.props.appState.getOffersList();

        // TODO: Show loader spinner when !offers
        if (!offers || (offers && offers.size === 0)) {
            return (
                <Grid>
                    <div>
                       <h3>Sorry, you have no offers on record.</h3>
                    </div>
                </Grid>
            );
        }
        else {
            return (
                <Grid>
                    <div>
                        <h3>Your teaching assistant offers</h3>
                    </div>
                    <div>
                        {offers.map((offer, id) =>
                            <ContractPanel
                                offer={offer}
                                selectContract={() => this.selectContract(id)}
                            />
                        )}
                    </div>
                </Grid>
            );
        }
    }
}


class Contracts extends React.Component {
    constructor(props) {
        super(props);
    }

    selectThisTab() {
        if (this.props.appState.getSelectedNavTab() != this.props.navKey) {
            this.props.appState.selectNavTab(this.props.navKey);
        }
    }

    componentWillMount() {
        this.selectThisTab();
    }

    componentWillUpdate() {
        this.selectThisTab();
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route
                        path={routeConfig.contracts.route + '/:id'}
                        // Pass in appState props and route matching props
                        render={(props) => <Contract {...this.props} {...props} />}
                    />
                    <Route
                        path={routeConfig.contracts.route}
                        render={() => <ContractsList {...this.props} />}
                    />
                </Switch>
            </div>
        );
    }
}

export { Contracts };