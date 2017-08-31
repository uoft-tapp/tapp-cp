import React from 'react';
import { Panel, Form, FormGroup, ControlLabel, InputGroup, FormControl } from 'react-bootstrap';

class SessionsForm extends React.Component {
    render() {
        return (
            <Panel className="sessions">
                <Form
                    inline
                    onSubmit={event => {
                        event.preventDefault();
                        if (
                            this.pay.value !=
                            this.props.appState.getSessionsList().getIn([this.session.value, 'pay'])
                        ) {
                            this.props.appState.updateSessionPay(
                                this.session.value,
                                this.pay.value
                            );
                        }
                    }}>
                    <FormGroup>
                        <ControlLabel>Session:</ControlLabel>&ensp;
                        <FormControl
                            id="session"
                            componentClass="select"
                            inputRef={ref => {
                                this.session = ref;
                            }}
                            onChange={event => {
                                this.props.appState.selectSession(event.target.value);
                                let pay = this.props.appState
                                    .getSessionsList()
                                    .getIn([event.target.value, 'pay']);
                                this.pay.value = pay != undefined ? pay : '';
                            }}>
                            <option value="" key="session-all">
                                all
                            </option>
                            {this.props.appState.getSessionsList().map((session, sessionId) =>
                                <option value={sessionId}>
                                    {session.get('semester')}&nbsp;{session.get('year')}
                                </option>
                            )}
                        </FormControl>
                    </FormGroup>
                    <FormGroup id="pay">
                        <ControlLabel>Pay:</ControlLabel>&ensp;
                        <InputGroup>
                            <InputGroup.Addon>$</InputGroup.Addon>
                            <FormControl
                                type="number"
                                min="0.00"
                                step="0.01"
                                disabled={this.props.appState.getSelectedSession() == ''}
                                inputRef={ref => {
                                    this.pay = ref;
                                }}
                                onBlur={event => {
                                    if (
                                        event.target.value !=
                                        this.props.appState
                                            .getSessionsList()
                                            .getIn([this.session.value, 'pay'])
                                    ) {
                                        this.props.appState.updateSessionPay(
                                            this.session.value,
                                            event.target.value
                                        );
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
