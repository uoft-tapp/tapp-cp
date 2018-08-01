import React from 'react';
import {
    Grid,
    Panel,
    Well,
} from 'react-bootstrap';

import { getInstructorString } from "./contracts.js";

const InvalidContract = props => {
    return (
        <Grid>
            <div>
                <h3>Invalid contract</h3>
            </div>
        </Grid>
    );
}

const Letter = props => {
    let pay = props.session.get('pay');
    // TODO: remove following increment
    pay += 1;
    let salary = pay * props.offer.get('hours');
    let vacationSalary = salary * 0.04;
    console.log(pay);
    console.log(salary);

    return (
        <div>
            <p>
                Dear {props.offer.get('firstName')} {props.offer.get('lastName')},
            </p>
            <p>
                I am pleased to offer you an appointment as a Teaching Assistant in the Department of Computer Science.
                The starting date of your appointment will be <b>{props.offer.get('startDate')}</b> and
                this appointment will end on <b>{props.offer.get('endDate')}</b> with no further notice to you.
            </p>
            <p>
                Your appointment will be for <b>{props.offer.get('hours')}</b> hours for <b>{props.offer.get('position')}</b>,
                supervised by {getInstructorString(props.offer)}. You will be paid in equal instalments, once per month for
                the period of your appointment. Your salary will be paid by direct deposit. Your total salary is
                ${salary} plus 4% vacation pay of ${vacationSalary} for a total of ${salary + vacationSalary}.
            </p>
        </div>
    );
}


class Contract extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let offers = this.props.appState.getOffersList();
        if (!offers || (offers && offers.size === 0)) {
            return <InvalidContract />;
        }
        // Check if id in route matches any offer in appState
        let invalidContract = true;
        let routeId = this.props.match.params.id;
        let offer = null;
        offers.map((val, id) => {
            if (id === routeId) {
                invalidContract = false;
                offer = val;
            }
        });
        if (invalidContract) {
            return <InvalidContract />;
        }

        let session = offer.get('session');
        let position = offer.get('position');

        return (
            <Grid>
                <Panel>
                    <Panel.Heading>
                        <Panel.Title>
                            {offer.get('course')}
                            <button className="close-button"
                                    style={{float: "right"}}
                                    onClick={() => this.props.closeContractWindow()}>
                                <span className="glyphicon glyphicon-remove">
                                </span>
                            </button>
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <div>
                            <h3>University of Toronto</h3>
                            <p>
                                <i>Toronto, Canada M5S 3G4</i>
                            </p>
                        </div>
                        <Well>
                            <Letter offer={offer} session={session} position={position}/>
                        </Well>
                    </Panel.Body>
                </Panel>
            </Grid>
        );
    }
}

export { Contract };