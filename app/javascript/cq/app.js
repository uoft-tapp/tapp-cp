// Store and interface with the application's data
import React, { useState, useEffect } from "react";
import { useActions } from "easy-peasy";

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

import { AdminPage } from "./components/admin-page.js";

export default function App() {
    const initialise = useActions(actions => actions.initialise);
    useEffect(() => {
        initialise();
    });

    return <AdminPage />;
}
