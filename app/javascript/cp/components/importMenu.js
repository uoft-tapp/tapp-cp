import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

// menu that allows importing data from a file and persisting it to the database, or importing data from TAPP and
// persisting it to the database
class ImportMenu extends React.Component {
    uploadFile() {
        let fileInput = document.getElementById('file-input');
        let files = fileInput.files;

        if (files.length > 0) {
            // uploading a CHASS offers file
            if (files[0].type != 'application/json') {
                this.props.appState.alert('<b>Error:</b> The file you selected is not a JSON.');
                return;
            }

            if (
                confirm(
                    'Are you sure you want to import "' + files[0].name + '" into the database?'
                )
            ) {
                let importFunc = data => {
                    try {
                        data = JSON.parse(data);
                        this.props.appState.importOffers(data);
                    } catch (err) {
                        this.props.appState.alert('<b>Error:</b> ' + err);
                    }
                };

                let reader = new FileReader();
                reader.onload = event => importFunc(event.target.result);
                reader.readAsText(files[0]);
            }

            fileInput.value = '';
        }
    }

    render() {
        return (
            <DropdownButton
                id="import-dropdown"
                bsStyle="primary"
                title={
                    <span>
                        Import&nbsp;{this.props.appState.importing() &&
                            <i
                                className="fa fa-spinner fa-spin"
                                style={{ fontSize: '16px', color: 'white' }}
                            />}
                    </span>
                }>
                <MenuItem onClick={() => document.getElementById('file-input').click()}>
                    Import offers from file
                </MenuItem>

                <input
                    id="file-input"
                    type="file"
                    accept="application/json"
                    style={{ display: 'none' }}
                    onChange={() => this.uploadFile()}
                />

                <MenuItem
                    onClick={() => {
                        if (
                            confirm(
                                'Are you sure you want to import the current set of locked assignments into the database?'
                            )
                        ) {
                            this.props.appState.importAssignments();
                        }
                    }}>
                    Import locked assignments
                </MenuItem>
            </DropdownButton>
        );
    }
}

export { ImportMenu };
