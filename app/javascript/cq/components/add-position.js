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

const DEFAULT_POSITION = {
    round_id: "100",
    course_name: "",
    course_id: "",
    n_hours: "",
    n_positions: "",
    dates: "July 1, 2019 to August 1, 2019",
    duties:
        "Some combination of marking, invigilating, tutorials, and math aid centre",
    status: "1",
    start_posting: null,
    end_posting: null,
    total_hours: 0,
    instructor: [],
    enrollment: "",
    end_nominations: null,
    last_updated: new Date().toJSON()
};
const REQUIRED_FIELDS = ["course_id", "dates", "round_id"];

function AddPositionDialog(props) {
    const { show = true, onHide = () => {} } = props;
    const [page, setPage] = useState(0);
    const { positions } = useStore(state => state.data);
    const { addPosition } = useActions(state => state.data);
    const [position, setPosition] = useState(DEFAULT_POSITION);

    function hide() {
        onHide();
        setPosition(DEFAULT_POSITION);
        setPage(0);
    }

    async function onSaveClick() {
        for (let field in position) {
            try {
                position[field] = position[field].trim();
            } catch (e) {}
        }
        await addPosition(position);
        hide();
    }

    function setAttrFactory(attr) {
        return e => {
            const newVal = e.target.value || "";
            const newPosition = { ...position, [attr]: newVal };
            setPosition(newPosition);
        };
    }

    function createFieldEditor(title, attr) {
        return (
            <>
                <ControlLabel>{title}</ControlLabel>
                <FormControl
                    type="text"
                    value={position[attr]}
                    onChange={setAttrFactory(attr)}
                />
            </>
        );
    }

    const conflictingCourseId = positions.some(
        a => a.position === position.course_id.trim()
    );
    const canProgress =
        REQUIRED_FIELDS.every(field => !!position[field].trim()) &&
        !conflictingCourseId;

    return (
        <Modal show={show} onHide={hide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Position</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {page === 0 && (
                    <Form>
                        <FormGroup>
                            {createFieldEditor(
                                "Course (e.g. 'MAT135H1Y'):",
                                "course_id"
                            )}
                            {createFieldEditor("Course Name:", "course_name")}
                            {createFieldEditor("Round:", "round_id")}
                            {createFieldEditor(
                                <>
                                    Dates (must be formatted 'Month day, YYYY{" "}
                                    <b>to</b> Month day, YYYY'):
                                </>,
                                "dates"
                            )}
                            {createFieldEditor(
                                "Hours per Assignment:",
                                "n_hours"
                            )}
                            {createFieldEditor("Duties:", "duties")}
                        </FormGroup>
                    </Form>
                )}
                {conflictingCourseId && (
                    <Alert bsStyle="danger">
                        <h4>Warning:</h4>
                        <p>
                            An position with course id=
                            <b>{position.course_id}</b> already exists
                        </p>
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={hide}>Cancel</Button>
                {page === 0 && (
                    <Button onClick={onSaveClick} disabled={!canProgress}>
                        Create Position
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export { AddPositionDialog };
