import React from 'react';
import {
    Button,
    Checkbox,
    ControlLabel,
    FormControl,
    FormGroup,
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
    let salary = pay * props.offer.get('hours');
    let vacationSalary = salary * 0.04;

    return (
        <div>
            <h3>
                Dear {props.offer.get('firstName')} {props.offer.get('lastName')},
            </h3>
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
            <p>
                This appointment is being granted on the basis that you are a student or Post-Doctoral Fellow (PDF)
                at the University of Toronto on the starting date of the appointment. If you are not a student on the
                starting date of this appointment, this offer is revoked and the University will have no obligations
                under this letter.
            </p>
            <p>
                As a Teaching Assistant, you will be a member of the Canadian Union of Public Employees (CUPE)
                Local 3902, Unit 1 bargaining unit.  Your employment will be governed by the terms and conditions of
                the collective <a href="http://agreements.hrandequity.utoronto.ca/#CUPE3902_Unit1" target="_blank">
                agreement between the University of Toronto and CUPE Local 3902</a>.
            </p>
            <p>
                Once you accept the offer of employment, a copy of the agreement will be given to you if you do not
                already have one. A statement about the Union prepared by the Union, along with other information about
                the Union, can be found <a href="http://www.cupe3902.org/unit-1/" target="_blank">here</a>. All of this
                information is that of the Union, represents the views of the Union and has not been approved or endorsed
                by the University.
            </p>
        </div>
    );
}

const Training = props => {

    return (
        <div>
            <h3>
                Mandatory Training
            </h3>
            <p>
                You are required to take the following mandatory training. You must complete this training within 60
                days of hire.
            </p>
            <list>
                <li>
                    <a href="http://aoda.hrandequity.utoronto.ca/" target="_blank">U of T AODA Online Training</a>,
                    provided by the Accessibility for Ontarians with Disabilities Act (AODA) Office.
                </li>
            </list>
            <br />
            <p>
                Completion of this training will be automatically captured in the system and you will be paid for this
                training in accordance with the rates set out in your collective agreement. Please note that you only
                need to complete the above training program once with the University.
            </p>
            <p>
                If this is your first appointment after becoming a Ph.D. student, you will be guaranteed five more
                appointments of the same number of hours in subsequent years as per Article 16.06 of the CUPE 3902
                (Unit 1) Collective Agreement. If this is not your first appointment, you may still be owed one or
                more subsequent appointments under the aforementioned Article. If this is the case, you may consult
                the letter you received last April, where your appointment status was summarized. Please feel free
                to contact {props.coordinator} to see how various guarantees fit together.
            </p>
            <p>
                You should contact your supervisor as soon as possible to discuss any questions you have about your
                duties. You will soon be given the opportunity to review the Description of Duties and Allocation of
                Hours (DDAH) form, which will set out more specifically the duties of your position, and the hours
                assigned to each.
            </p>
            <p>
                Please sign below to indicate your acceptance of this offer, and return a copy of this letter to me
                as soon as possible but no later than 2 days after you have been provided with the DDAH form. If we
                have not heard from you by this deadline, this offer may be withdrawn. If you are unable to accept
                this offer, please advise me immediately.
            </p>
            <p>
                If you have any questions, please contact {props.coordinator}.
            </p>
        </div>
    );
}

const Payroll = props => {
    return (
        <div>
            <h3>
                Payroll and Tax Forms
            </h3>
            <p>
                Your payroll documentation will be available online through
                the <a href="http://ess.hrandequity.utoronto.ca/" target="_blank">University’s Employee Self-Service (ESS)</a>. This
                includes electronic delivery of your pay statement, tax documentation, and other payroll documentation
                as made available from time to time. You are able to print copies of these documents directly from ESS.
            </p>
            <p>
                By signing this Employment Agreement, you authorize the University to provide your T4 slips electronically
                and not in a paper format. If you wish to discuss an alternative format, please contact Central Payroll
                Services at <a href="mailto:payroll.hr@utoronto.ca" target="_blank">payroll.hr@utoronto.ca</a>.
            </p>
        </div>
    );
}

const Policies = props => {
    return (
        <div>
            <h3>
                Policies & Procedures
            </h3>
            <p>
                You will also be subject to and bound by University policies of general application and their related
                guidelines. The policies are listed on
                the <a href="http://www.governingcouncil.utoronto.ca/Governing_Council/Policies.htm" target="_blank">Governing
                Council website</a>. For convenience, a partial list of policies, those applicable to all employees, and related
                guidelines can be found on the <a href="http://policies.hrandequity.utoronto.ca/" target="_blank">Human Resources
                and Equity website</a>. Printed versions will be provided, upon request, through Human Resources or your supervisor.
            </p>
            <p>
                You should pay particular attention to those policies which confirm the University’s commitment to, and
                your obligation to support, a workplace that is free from discrimination and harassment as set out in
                the <i>Human Rights Code</i>, is safe as set out in the <i>Occupational Health and Safety Act</i>, and
                that respects the University’s commitment to equity and to workplace civility.
            </p>
            <p>
                All of the applicable policies may be amended and/or new policies may be introduced from time to time.
                When this happens, if notice is required you will be given notice as the University deems necessary and
                the amendments will become binding terms of your employment contract with the University.
            </p>
        </div>
    );
}

const Accessibility = props => {
    return (
        <div>
            <h3>
                Accessibility
            </h3>
            <p>
                The University has a number of programs and services available to employees who have need of accommodation
                due to disability through its <a href="http://www.hrandequity.utoronto.ca/about-hr-equity/health.htm" target="_blank">Health
                & Well-being Programs and Services</a>. A description of the accommodation process is available in
                the <a href="http://well-being.hrandequity.utoronto.ca/services/#accommodation" target="_blank">Accommodation for Employees
                with Disabilities: U of T Guidelines</a>.
            </p>
            <p>
                In the event that you have a disability that would impact upon how you would respond to an emergency in
                the workplace (e.g., situations requiring evacuation), you should contact Health & Well-being Programs &
                Services at 416.978.2149 as soon as possible so that you can be provided with information regarding an
                individualized emergency response plan.
            </p>
            <p>
                The law requires the Employment Standards Act Poster to be provided to all employees; it is available on
                the <a href="http://www.labour.gov.on.ca/english/es/pubs/poster.php" target="_blank">HR & Equity website</a>. This poster
                describes the minimum rights and obligations contained in the <i>Employment Standards Act</i>. Please note
                that in many respects this offer of employment exceeds the minimum requirements set out in the <i>Act</i>.
            </p>
        </div>
    )
}

class Signature extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            nameValid: false,
            checkBoxChecked: false,
        }
    }

    validateName(name) {
        return name === this.props.offer.get("firstName") + " " + this.props.offer.get("lastName");
    }

    validateNameInput(name) {
        if (this.validateName(name))
            return 'success';
        else
            return 'error';
    }

    handleNameChange(e) {
        this.setState({
            nameValid: this.validateName(e.target.value),
            name: e.target.value,
        });
    }

    handleCheckBoxChange() {
        this.setState({ checkBoxChecked: !this.state.checkBoxChecked });
    }

    acceptOffer() {
        console.log("Offer accept button pressed");
    }

    render() {
        return (
            <div>
                <div>
                    <p>Yours sincerely,</p>
                    <p><b>{this.props.coordinator}</b></p>
                    <p>Designated Authority, TA Coordinator <br /> Computer Science</p>
                </div>
                <form>
                    <Checkbox
                        checked={this.state.accept}
                        onChange={(e) => this.handleCheckBoxChange(e)}
                    >
                        I have thoroughly read and agree to all the clauses of this offer.
                    </Checkbox>
                    <FormGroup
                        controlId="formName"
                        validationState={this.validateNameInput(this.state.name)}
                    >
                        <ControlLabel>Digital signature</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.name}
                            placeholder="Enter your first and last name as it appears on ACORN"
                            onChange={(e) => this.handleNameChange(e)}
                        />
                    </FormGroup>
                    <Button
                        onClick={() => this.acceptOffer()}
                        disabled={!(this.state.checkBoxChecked && this.state.nameValid)}
                    >
                        I accept this offer
                    </Button>
                </form>
            </div>
        );
    }
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
        // TODO: get TA coordinator from Rails ENV somehow
        let coordinator = "Karen Reid";

        return (
            <Grid>
                <Panel>
                    <div>
                        <h3>
                            Teaching Assistant Contract for {offer.get('course')}
                            <button className="close-button"
                                style={{float: "right"}}
                                onClick={() => this.props.closeContractWindow()}>
                            <span className="glyphicon glyphicon-remove">
                            </span>
                        </button>
                        </h3>
                    </div>
                    <div>
                        <h1>University of Toronto</h1>
                        <p>
                            <i>Toronto, Canada M5S 3G4</i>
                        </p>
                    </div>
                    <Well>
                        <Letter offer={offer} session={session} position={position}/>
                    </Well>
                    <Well>
                        <Training coordinator={coordinator}/>
                    </Well>
                    <Well>
                        <Payroll />
                    </Well>
                    <Well>
                        <Policies />
                    </Well>
                    <Well>
                        <Accessibility />
                    </Well>

                    <Signature offer={offer} coordinator={coordinator}/>
                </Panel>
            </Grid>
        );
    }
}

export { Contract };