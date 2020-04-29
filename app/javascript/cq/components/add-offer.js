// Store and interface with the application's data
import React, { useState } from "react";
import { useStore, useActions } from "easy-peasy";

import {
    Alert,
    Button,
    Modal,
    Form,
    FormGroup,
    ControlLabel,
    FormControl
} from "react-bootstrap";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Typeahead } from "react-bootstrap-typeahead";

function AddOfferDialog(props) {
    const { show = true, onHide = () => {} } = props;
    const [page, setPage] = useState(0);
    const {
        applicants,
        positions,
        getPositionDefaultHours,
        getApplicantsAlreadyHaveOffer
    } = useStore(state => state.data);
    const { addOffers } = useActions(state => state.data);
    const [selectedApplicants, setSelectedApplicants] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState({});
    const [hours, setHours] = useState(null);

    function courseSelected(e) {
        const position = positions[e.target.value];
        setSelectedPosition(position || {});
        if (position) {
            setHours(getPositionDefaultHours(position));
        } else {
            setHours(null);
        }
    }

    function hide() {
        onHide();
        setSelectedApplicants([]);
        setSelectedPosition({});
        setHours(null);
        setPage(0);
    }

    async function onSaveClick() {
        await addOffers({
            hours: hours,
            position: selectedPosition,
            applicants: selectedApplicants
        });
        hide();
    }

    const conflictingOffers = getApplicantsAlreadyHaveOffer({
        applicants: selectedApplicants,
        position: selectedPosition
    });

    const canProgress =
        conflictingOffers.length === 0 &&
        selectedApplicants.length > 0 &&
        !!selectedPosition.position &&
        !Number.isNaN(parseFloat(hours));

    return (
        <Modal show={show} onHide={hide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Offer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {page === 0 && (
                    <Form>
                        <FormGroup>
                            <ControlLabel>Applicant(s)</ControlLabel>
                            <Typeahead
                                id="applicant-input"
                                ignoreDiacritics={true}
                                multiple={true}
                                labelKey={option =>
                                    `${option.first_name} ${option.last_name}`
                                }
                                options={applicants}
                                placeholder="Applicant..."
                                onChange={setSelectedApplicants}
                            />
                            <ControlLabel>Course</ControlLabel>
                            <FormControl
                                componentClass="select"
                                onChange={courseSelected}
                            >
                                {[{ id: null, position: "- Select Course -" }]
                                    .concat(positions)
                                    .map((p, i) => {
                                        return (
                                            <option key={p.id} value={i - 1}>
                                                {p.position}
                                            </option>
                                        );
                                    })}
                            </FormControl>
                            <ControlLabel>Hours</ControlLabel>
                            <FormControl
                                type="text"
                                value={hours || ""}
                                placeholder="Hours"
                                onChange={e => {
                                    setHours(e.target.value);
                                }}
                            />
                        </FormGroup>
                    </Form>
                )}
                {conflictingOffers.length > 0 && (
                    <Alert bsStyle="danger">
                        <h4>Conflicting Offers</h4>
                        <p>
                            There are existing offers which conflict with the
                            new assignments:
                        </p>
                        <ul>
                            {conflictingOffers.map(offer => {
                                const { applicant } = offer;
                                return (
                                    <li key={offer.id}>
                                        <b>
                                            {applicant.first_name}{" "}
                                            {applicant.last_name}
                                        </b>{" "}
                                        ({offer.status}) {offer.position} for{" "}
                                        {offer.hours} hours
                                    </li>
                                );
                            })}
                        </ul>
                        <p>
                            You must modify the existing offer instead of
                            creating a new one.
                        </p>
                    </Alert>
                )}
                {page === 1 && (
                    <Alert bsStyle="info">
                        Create the following new assignment(s)?
                        <ul>
                            {selectedApplicants.map(applicant => {
                                return (
                                    <li key={applicant.id}>
                                        {applicant.first_name}{" "}
                                        {applicant.last_name} to{" "}
                                        <b>{selectedPosition.position}</b> for{" "}
                                        <b>{hours}</b> hours
                                    </li>
                                );
                            })}
                        </ul>
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={hide}>Cancel</Button>
                {page === 0 && (
                    <Button onClick={() => setPage(1)} disabled={!canProgress}>
                        Next
                    </Button>
                )}
                {page === 1 && (
                    <Button onClick={onSaveClick} disabled={!canProgress}>
                        Create Assignment
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export { AddOfferDialog };
