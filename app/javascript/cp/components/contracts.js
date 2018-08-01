import React from 'react';
import {
    Button,
    Grid,
    Panel
} from 'react-bootstrap';
import { Switch, Redirect, Route } from 'react-router-dom';

import { routeConfig } from '../routeConfig.js';
import { Contract } from './contract.js';

function getInstructorString(offer) {
    let instructors = [];
    offer.get('instructors').map(instructor => instructors.push(instructor));

    let instructorString = "";
    if (instructors.length) {
        instructorString += "Professor" + ((instructors.length > 1) ? "s " : " ");
        instructors.map((instructor, i) => {
            instructorString += instructor.get("name");
            if (i < instructors.length - 1) {
                instructorString += ", ";
            }
        });
    }
    return instructorString;
}

const ContractPanel = props => {
    let instructorString = getInstructorString(props.offer);
    if (instructorString) {
        instructorString = " with " + instructorString;
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
    }

    render() {
        console.log(this.props.contractSelected);
        if (this.props.contractSelected) {
            return (
                <Redirect
                    to={routeConfig.contracts.route + "/" + this.props.contractSelected}
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
                                selectContract={() => this.props.selectContract(id)}
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
        this.state = {
            contractSelected: 0
        };
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

    selectContract(id) {
        this.setState({
            contractSelected: id
        });
    }

    closeContractWindow() {
        this.setState({
            contractSelected: 0
        });
        this.props.history.push(routeConfig.contracts.route);
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route
                        path={routeConfig.contracts.route + '/:id'}
                        render={(props) => {
                            return (
                                <Contract
                                    {...this.props}
                                    {...props} // Route matching props
                                    closeContractWindow={() => this.closeContractWindow()}
                                />
                            );
                        }}
                    />
                    <Route
                        path={routeConfig.contracts.route}
                        render={() => {
                            return (
                                <ContractsList
                                    {...this.props}
                                    contractSelected={this.state.contractSelected}
                                    selectContract={(id) => this.selectContract(id)}
                                />
                            );
                        }}
                    />
                </Switch>
            </div>
        );
    }
}

export { Contracts, getInstructorString };