import React from 'react';
import { Panel, Tabs, Tab, Form, InputGroup, FormGroup, FormControl } from 'react-bootstrap';

class SessionsForm extends React.Component {
    render() {
        return (
            <div className="sessions">
                <Tabs>
                    <Tab title={<b>Sessions</b>} disabled />
                    {this.props.appState.getSessionsList().map((session, sessionId) =>
                        <Tab title={session.get('semester') + ' ' + session.get('year')}>
		        <Form
			    inline
			    onSubmit={event => {
				if (event.target.elements[0].value != session.get('pay')) {
				    this.props.appState.updateSessionPay(
					sessionId, event.target.elements[0].value);
				}
                                event.preventDefault();
                            }}>
				<b>Start date:</b>&ensp;
				{new Date(session.get('startDate')).toDateString()}&emsp;&emsp;
				<b>End date:</b>&ensp;
				{new Date(session.get('endDate')).toDateString()}&emsp;&emsp;
                                <b>Pay:</b>&ensp;
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon>$</InputGroup.Addon>
                                        <FormControl
					    type="number"
					    min="0.00"
				            step="0.01"
                                            defaultValue={session.get('pay')}
				            onBlur={event => {
						if (event.target.value != session.get('pay')) {
						    this.props.appState.updateSessionPay(
							sessionId,
							event.target.value);
						}
					    }}
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
