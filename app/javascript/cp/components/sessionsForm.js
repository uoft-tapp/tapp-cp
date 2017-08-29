import React from 'react';
import { Panel, Tabs, Tab, InputGroup, FormControl } from 'react-bootstrap';

class SessionsForm extends React.Component {
    render() {
        return (
            <div className="sessions">
                <Tabs id="sessions-tabs">
                    <Tab title={<b>Sessions</b>} disabled />
                    {this.props.appState.getSessionsList().map((session, sessionId) =>
                        <Tab title={session.get('semester') + ' ' + session.get('year')}>
                            <div className="form-inline">
                                <b>Start date:</b>&ensp;
                                <form
                                    className="form-group"
                                    onSubmit={event => {
                                        event.preventDefault();
                                    }}>
                                    <FormControl
                                        type="date"
                                        defaultValue={session.get('startDate').split('T', 1)[0]}
                                    />
                                </form>&emsp;&emsp;
                                <b>End date:</b>&ensp;
                                <form
                                    className="form-group"
                                    onSubmit={event => {
                                        event.preventDefault();
                                    }}>
                                    <FormControl
                                        type="date"
                                        defaultValue={session.get('endDate').split('T', 1)[0]}
                                    />
                                </form>&emsp;&emsp;
                                <b>Pay:</b>&ensp;
                                <form
                                    className="form-group"
                                    onSubmit={event => {
                                        event.preventDefault();
                                        if (event.target.elements[0].value != session.get('pay')) {
                                            this.props.appState.updateSessionPay(
                                                sessionId,
                                                event.target.elements[0].value
                                            );
                                        }
                                    }}>
                                    <InputGroup>
                                        <InputGroup.Addon>$</InputGroup.Addon>
                                        <FormControl
                                            type="number"
                                            name="pay"
                                            min="0.00"
                                            step="0.01"
                                            defaultValue={session.get('pay')}
                                            onBlur={event => {
                                                if (event.target.value != session.get('pay')) {
                                                    this.props.appState.updateSessionPay(
                                                        sessionId,
                                                        event.target.value
                                                    );
                                                }
                                            }}
                                        />
                                    </InputGroup>
                                </form>
                            </div>
                        </Tab>
                    )}
                </Tabs>
            </div>
        );
    }
}

export { SessionsForm };
