import React from "react";
import { Form, Button } from "react-bootstrap";

class ImportButton extends React.Component {
    constructor(props) {
        super(props);
    }

    uploadFile() {
        let fileInput = document.getElementById("file-input");
        let files = fileInput.files;

        if (files.length > 0) {
            if (this.getFileType(files[0]) != "text/csv") {
                this.props.appState.alert(
                    "<b>Error:</b> The file you selected is not a CSV."
                );
                return;
            }

            if (
                confirm(
                    'Are you sure you want to import "' +
                        files[0].name +
                        '" into the database?'
                )
            ) {
                let importFunc = data => {
                    this.props.appState.importDdahs(data);
                };

                let reader = new FileReader();
                reader.onload = event => importFunc(event.target.result);
                reader.readAsText(files[0]);
            }
            fileInput.value = "";
        }
    }

    getFileType(file) {
        let type = file.type;
        if (type == "application/vnd.ms-excel") {
            let name = file.name.split(".");
            if (name[name.length - 1] == "csv") {
                return "text/csv";
            } else {
                return type;
            }
        } else {
            return type;
        }
    }

    render() {
        return (
            <Form inline id="sessions">
                <Button
                    bsStyle="primary"
                    onClick={() =>
                        document.getElementById("file-input").click()
                    }
                >
                    {this.props.appState.importing() ? (
                        <i className="fa fa-spinner fa-spin" />
                    ) : (
                        <i className="fa fa-upload" />
                    )}{" "}
                    Import DDAH
                </Button>
                <input
                    id="file-input"
                    type="file"
                    accept="text/csv"
                    style={{ display: "none" }}
                    onChange={() => this.uploadFile()}
                />
            </Form>
        );
    }
}

export { ImportButton };
