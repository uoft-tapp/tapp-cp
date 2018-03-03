import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

// form for exporting app data to a file
class ExportForm extends React.Component {
    exportData(data, format) {
        let session = this.props.getSelectedSession();
        if (data == 'offers') {
            // export offers
            if (Object.keys(this.props.getAssignmentsList()).length == 0) {
                // no assignments have been made
                this.props.alert('Cannot export offers: no assignments have been made');
                return;
            }

            if (format == 'csv') {
                // export offers in CSV format
                this.props.downloadFile('/export/offers/'+session);
            } else if (this.props.getSelectedRound() != null) {
                // export offers for a round in JSON format
                if (
                    confirm(
                        'This will lock all exported assignments.\nAre you sure you want to proceed?'
                    )
                ) {
                    // export offers in JSON format
                    this.props.exportOffers(session);
                }
            } else {
                // export offers for all rounds in JSON format
                this.props.alert(
                    '<b>Export JSON for all rounds</b> This functionality is not currently supported. Please select a round.'
                );
            }
        } else {
            // export other data
            if (data == 'cdf-info' && Object.keys(this.props.getAssignmentsList()).length == 0) {
                // no assignments have been made
                this.props.alert('Cannot export CDF info: no assignments have been made');
                return;
            }

            // export other data in CS
            if (format == 'csv') {
                this.props.downloadFile('/export/' + data+'/'+session);
            } else {
                this.props.alert(
                    '<b>Export JSON</b> This functionality is not currently supported.'
                );
            }
        }
    }

    render() {
        return (
            <Form inline id="export">
                <FormGroup id="data">
                    <ControlLabel>Export&ensp;</ControlLabel>
                    <FormControl
                        id="data"
                        componentClass="select"
                        inputRef={ref => {
                            this.data = ref;
                        }}>
                        <option value="offers">Offers</option>
                        <option value="cdf-info">CDF info</option>
                        <option value="transcript-access">UG academic history access</option>
                    </FormControl>
                </FormGroup>

                <FormGroup id="format">
                    <ControlLabel>&ensp;to&ensp;</ControlLabel>
                    <FormControl
                        id="format"
                        componentClass="select"
                        inputRef={ref => {
                            this.format = ref;
                        }}>
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
                    </FormControl>
                </FormGroup>
                <FormControl.Static style={{ verticalAlign: 'middle' }}>
                    &emsp;<i
                        className="fa fa-download"
                        style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                        onClick={() => this.exportData(this.data.value, this.format.value)}
                    />
                </FormControl.Static>
            </Form>
        );
    }
}

export { ExportForm };
