import React from 'react';
import {
    Button,
    Grid,
    OverlayTrigger,
    Panel,
    Tooltip,
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

    const tooltip = (
        <Tooltip id="tooltip">
            The <i>Description of Duties And Hours</i> form for this offer has not yet been sent to you.
        </Tooltip>
    );

    return (
        <Panel bsStyle="primary">
            <p>
                {props.offer.get('course') + instructorString}
            </p>
            <div>
                <div style={{display: 'inline-block'}}>
                    <Button onClick={() => props.selectContract()}>
                        Contract
                    </Button>
                </div>
                <div style={{display: 'inline-block'}}>
                    {!props.ddah && <OverlayTrigger placement="bottom" overlay={tooltip}>
                        <div style={{cursor: 'not-allowed'}}>
                            <Button style={{pointerEvents: 'none'}} disabled>
                                DDAH Form
                            </Button>
                        </div>
                    </OverlayTrigger>}
                    {props.ddah && <Button>
                        DDAH Form
                    </Button>}
                </div>
            </div>
        </Panel>
    );
}

class ContractsList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.contractSelected) {
            return (
                <Redirect
                    to={routeConfig.contracts.route + "/" + this.props.contractSelected}
                />
            );
        }

        let offers = this.props.appState.getOffersList();
        let ddahs = this.props.appState.getDdahsList();

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

        return (
            <Grid>
                <div>
                    <h3>Your teaching assistant offers</h3>
                </div>
                <div>
                    {offers.map((offer, id) => {
                        // Find corresponding ddah
                        let ddah = null;
                        ddahs.map(d => {
                           if (d.get('offer') === id) {
                               ddah = d;
                           }
                        });
                        return (
                            <ContractPanel
                                offer={offer}
                                ddah={ddah}
                                selectContract={() => this.props.selectContract(id)}
                            />
                        );
                    })}
                </div>
            </Grid>
        );
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