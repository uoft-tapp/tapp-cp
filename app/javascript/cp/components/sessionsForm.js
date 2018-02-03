import React from 'react';
import { Panel, Form, FormGroup, ControlLabel, InputGroup, FormControl } from 'react-bootstrap';

class SessionsForm extends React.Component {
    changePay(event){
      this.pay.value=event.target.value;
    }
    render() {
        let sessions = this.props.appState.getSessionsList();
        let session = this.props.appState.getSelectedSession();
        let pay = (sessions.length>0)?sessions.get(session).get('pay'):null;
        pay = pay?pay:'';
        return (
            <Panel className="sessions">
                <Form inline
                    onSubmit={event => {
                        event.preventDefault();
                        if (this.pay.value != pay) {
                            this.props.appState.updateSessionPay(session, this.pay.value);
                        }
                    }}>
                    <FormGroup id="pay">
                        <ControlLabel>Session Pay:</ControlLabel>&ensp;
                        <InputGroup>
                            <InputGroup.Addon>$</InputGroup.Addon>
                            <FormControl
                                type="number"
                                min="0.00"
                                step="0.01"
                                value={pay}
                                disabled={session=='N/A'}
                                onChange={event=>this.changePay(event)}
                                onBlur={event => {
                                    if (event.target.value != pay) {
                                        this.props.appState.updateSessionPay(session, event.target.value);
                                    }
                                }}
                            />
                        </InputGroup>
                    </FormGroup>
                </Form>
            </Panel>
        );
    }
}

export { SessionsForm };
