import React from 'react';
import { Panel, Tabs, Tab, Form, InputGroup, FormGroup, FormControl } from 'react-bootstrap';

class SessionsForm extends React.Component {
    render() {
        return (
            <div className="sessions">
                <Tabs>
                    <Tab title={<b>Sessions</b>} disabled />
                    {this.props.appState.getSessionsList().map(session =>
                        <Tab title={session.get('semester') + ' ' + session.get('year')}>
                            <Form inline>
                                <b>Start date:</b>&ensp;{new Date(session.get('startDate')).toDateString()}&emsp;&emsp;
                                <b>End date:</b>&ensp;{new Date(session.get('endDate')).toDateString()}&emsp;&emsp;
                                <b>Pay:</b>&ensp;
                                <FormGroup
                                    validationState={
                                        this.pay == undefined || this.pay.value == null
                                            ? null
                                            : /[0-9]+\.[0-9]{2}/.test(this.pay.value)
                                              ? 'success'
                                              : 'error'
                                    }>
                                    <InputGroup>
                                        <InputGroup.Addon>$</InputGroup.Addon>
                                        <FormControl
                                            type="text"
                                            defaultValue={session.get('pay')}
                                            ref={input => (this.pay = input)}
                                            pattern="[0-9]+\.[0-9]{2}"
                                        />
                                    </InputGroup>
                                </FormGroup>
                            </Form>
                        </Tab>
                    )}
                </Tabs>
            </div>
        );
    }
}

export { SessionsForm };
