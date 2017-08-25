import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

// form for exporting app data to a file
class ExportForm extends React.Component {
    exportData(data, format) {
        if (data == 'offers') {
            // export offers
            let route;
            if (format == 'csv') {
                // export offers in CSV format
                window.open('/export/offers');
            } else if (
                confirm(
                    'This will lock all exported assignments.\nAre you sure you want to proceed?'
                )
            ) {
                // export offers in JSON format
                this.props.exportOffers();
            }
        } else {
            // export other data in CS
            if (format == 'csv') {
                window.open('/export/' + data);
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
                        {this.props.getSelectedRound() && <option value="json">JSON</option>}
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
