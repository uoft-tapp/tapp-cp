// Store and interface with the application's data
import React, { useState, useEffect } from "react";
import { useActions, useStore } from "easy-peasy";

import {
    Alert,
    Navbar,
    Nav,
    Button,
    Modal,
    Form,
    FormGroup,
    ControlLabel,
    FormControl
} from "react-bootstrap";

import { AddOfferDialog } from "./add-offer.js";
import { AddApplicantDialog } from "./add-applicant.js";
import { AddPositionDialog } from "./add-position.js";
import { SessionSelector } from "./session-selector.js";

function AdminPage() {
    const [addOfferDialogShow, setAddOfferDialogShow] = useState(false);
    const [addApplicantDialogShow, setAddApplicantDialogShow] = useState(false);
    const [addPositionDialogShow, setAddPositionDialogShow] = useState(false);
    const messages = [...useStore(state => state.data.messages)].reverse();

    const messageQueue = [];
    let i = 0;
    for (const message of messages) {
        for (const m of message.message) {
            let key = m + i;
            let style = "success";
            if (message.errors && !message.success) {
                style = "danger";
            } else if (message.errors && message.success) {
                style = "warning";
            }
            messageQueue.push(
                <Alert key={key} bsStyle={style}>
                    {m}
                </Alert>
            );
            i++;
        }
    }

    return (
        <div>
            <div>
                <div style={{ padding: "10px" }}>
                    <h4>
                        <a href="/cp">Back to CP</a>
                    </h4>
                </div>
                <div style={{ margin: "10px" }}>
                    <SessionSelector />
                    <h4>Add a new TA</h4>
                    <Button onClick={() => setAddApplicantDialogShow(true)}>
                        Add TA(s)
                    </Button>
                    <h4>
                        Create a new position (e.g. 'MAT135H1F'). You need to do
                        this in order to make an offer to a TA
                    </h4>
                    <Button onClick={() => setAddPositionDialogShow(true)}>
                        Create Position
                    </Button>
                    <h4>
                        Create an offer for an existing position. An offer can
                        be for any number of hours.
                    </h4>
                    <Button onClick={() => setAddOfferDialogShow(true)}>
                        Create Offer
                    </Button>
                </div>
            </div>
            <div style={{ marginTop: "15px", marginLeft: "10px" }}>
                Log Messages:{" "}
                <div style={{ maxHeight: "200px", overflow: "auto" }}>
                    {messageQueue}
                </div>
            </div>
            <AddApplicantDialog
                show={addApplicantDialogShow}
                onHide={() => setAddApplicantDialogShow(false)}
            />
            <AddOfferDialog
                show={addOfferDialogShow}
                onHide={() => setAddOfferDialogShow(false)}
            />
            <AddPositionDialog
                show={addPositionDialogShow}
                onHide={() => setAddPositionDialogShow(false)}
            />
        </div>
    );
}

export { AdminPage };
