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

const DEFAULT_APPLICANT = {
    dept: "Mathematics",
    full_time: "Y",
    yip: "P1",
    app_id: (Math.random() * 100000) | 0,
    first_name: "",
    last_name: "",
    email: "",
    utorid: "",
    student_no: "",
    phone: ""
};
const REQUIRED_FIELDS = ["first_name", "last_name", "email", "utorid"];

function AddApplicantDialog(props) {
    const { show = true, onHide = () => {} } = props;
    const [page, setPage] = useState(0);
    const { applicants } = useStore(state => state.data);
    const { addApplicant } = useActions(state => state.data);
    const [applicant, setApplicant] = useState(DEFAULT_APPLICANT);

    function hide() {
        onHide();
        setApplicant(DEFAULT_APPLICANT);
        setPage(0);
    }

    async function onSaveClick() {
        for (let prop in applicant) {
            try {
                applicant[prop] = applicant[prop].trim();
            } catch (e) {}
        }
        await addApplicant(applicant);
        hide();
    }

    function setAttrFactory(attr) {
        return e => {
            const newVal = e.target.value || "";
            const newApplicant = { ...applicant, [attr]: newVal };
            setApplicant(newApplicant);
        };
    }

    function createFieldEditor(title, attr) {
        return (
            <>
                <ControlLabel>{title}</ControlLabel>
                <FormControl
                    type="text"
                    value={applicant[attr]}
                    onChange={setAttrFactory(attr)}
                />
            </>
        );
    }

    const conflictingUtorID = applicants.some(
        a => a.utorid === applicant.utorid.trim()
    );
    const canProgress =
        REQUIRED_FIELDS.every(field => !!applicant[field].trim()) &&
        !conflictingUtorID;

    return (
        <Modal show={show} onHide={hide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Applicant</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {page === 0 && (
                    <Form>
                        <FormGroup>
                            {createFieldEditor("First Name:", "first_name")}
                            {createFieldEditor("Last Name:", "last_name")}
                            {createFieldEditor("Email:", "email")}
                            {createFieldEditor("utorid:", "utorid")}
                            {createFieldEditor("Year-in-progress:", "yip")}
                            {createFieldEditor("Phone:", "phone")}
                        </FormGroup>
                    </Form>
                )}
                {conflictingUtorID && (
                    <Alert bsStyle="danger">
                        <h4>Warning:</h4>
                        <p>
                            An applicant with utorid=<b>{applicant.utorid}</b>{" "}
                            already exists
                        </p>
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={hide}>Cancel</Button>
                {page === 0 && (
                    <Button onClick={onSaveClick} disabled={!canProgress}>
                        Create Applicant
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export { AddApplicantDialog };
