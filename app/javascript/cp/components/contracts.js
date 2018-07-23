import React from 'react';
import {
    Button,
    Grid,
    Panel
} from 'react-bootstrap';

const ContractPanel = props => {
    let instructors = [];
    props.offer.get('instructors').map(val => instructors.push(val));

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
                <Button>Details</Button>
                <Button>DDAH Form</Button>
            </div>

        </Panel>
    );
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
        let offers = this.props.appState.getOffersList();
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
                        {offers.map(val =>
                            <ContractPanel offer={val} />
                        )}
                    </div>
                </Grid>
            );
        }
    }
}

export { Contracts };