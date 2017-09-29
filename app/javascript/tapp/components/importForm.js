import React from 'react';
import {
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    OverlayTrigger,
    Popover,
} from 'react-bootstrap';

// form for importing data from a file and persisting it to the database
class ImportForm extends React.Component {
    uploadFile() {
        let importFunc, files = this.files.files;

        if (files.length > 0) {
            importFunc = this.importChoices(files, this.data.value);
            if (
                confirm(
                    'Are you sure you want to import "' + files[0].name + '" into the database?'
                )
            ) {
                let reader = new FileReader();
                reader.onload = event => importFunc(event.target.result);
                reader.readAsText(files[0]);
            }
        } else {
            this.props.alert('<b>Error:</b> No file chosen.');
        }
    }

    importChoices(files, choice){
        switch (choice) {
          case "chass":
              if (files[0].type != 'application/json') {
                  this.props.alert('<b>Error:</b> The file you uploaded is not a JSON.');
                  return;
              }
              return data => {
                  try {
                      data = JSON.parse(data);

                      if (data['courses'] !== undefined && data['applicants'] !== undefined) {
                          this.props.importChass(data, this.year.value, this.semester.value);
                      } else {
                          this.props.alert('<b>Error:</b> This is not a CHASS JSON.');
                      }
                  } catch (err) {
                      this.props.alert('<b>Error:</b> ' + err);
                  }
              };
          case "enrol":
              return data => {
                  try {
                      this.props.importEnrolment(data);
                  } catch (err) {
                      this.props.alert('<b>Error:</b> ' + err);
                  }
              };
          case "instructor":
              if (files[0].type != 'application/json') {
                  this.props.alert('<b>Error:</b> The file you uploaded is not a JSON.');
                  return;
              }
              return data => {
                  try {
                      data = JSON.parse(data);

                      if (data['instructors'] !== undefined) {
                          this.props.importInstructors(data);
                      } else {
                          this.props.alert('<b>Error:</b> This is not an instructor JSON.');
                      }
                  } catch (err) {
                      this.props.alert('<b>Error:</b> ' + err);
                  }
              };
        }

    }

    detectChoice(){
      let options = document.getElementById("chassOptions");
      if (this.data.value=="chass")
          options.style.display = "block";
      else
          options.style.display = "none";
    }

    setChassOption(visible){
    }

    render() {
        return (
            <Form inline id="import">
                <FormGroup >
                  <span  style={{float: "left"}}>
                    <ControlLabel>Import&ensp;</ControlLabel>
                    <FormControl onChange={()=>this.detectChoice()}
                        componentClass="select"
                        inputRef={ref => {
                            this.data = ref;
                        }}>
                        <option value="chass">Courses/Applicants</option>
                        <option value="instructor">Instructors</option>
                        <option value="enrol">Enrolment</option>
                    </FormControl>
                    <ControlLabel>
                        &ensp;<i
                            className="fa fa-info-circle"
                            style={{ color: 'blue' }}
                            onClick={() =>
                                document.getElementById(this.data.value + '-dialog').click()}
                        />
                        <ChassDialog />
                        <EnrolDialog />
                    </ControlLabel>
                    </span>
                    <span id="chassOptions" style={{float: "left"}}>
                    <ControlLabel>&ensp;for&ensp;</ControlLabel>
                    <FormControl
                        componentClass="select"
                        inputRef={ref => {
                            this.semester = ref;
                        }}>
                        <option>Winter</option>
                        <option>Spring</option>
                        <option>Fall</option>
                    </FormControl>&nbsp;
                    <FormControl
                        id="year"
                        type="number"
                        min="2000"
                        step="1"
                        defaultValue={new Date().getFullYear()}
                        inputRef={ref => {
                            this.year = ref;
                        }}
                    />
                    </span>
                    <FormControl.Static style={{ verticalAlign: 'middle' }}>
                        &emsp;&emsp;{this.props.importing()
                            ? <i
                                  className="fa fa-spinner fa-spin"
                                  style={{ fontSize: '20px', color: 'blue' }}
                              />
                            : <i
                                  className="fa fa-upload"
                                  style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                                  onClick={() => this.uploadFile()}
                              />}&ensp;
                    </FormControl.Static>
                    <FormControl
                        id="file"
                        type="file"
                        accept="application/json"
                        inputRef={ref => {
                            this.files = ref;
                        }}
                    />
                </FormGroup>
            </Form>
        );
    }
}

const ChassDialog = props =>
    <OverlayTrigger
        trigger="click"
        rootClose
        placement="right"
        overlay={
            <Popover id="help" placement="right" title="CHASS JSON format">
                <pre>
                    {chassFormat}
                </pre>
            </Popover>
        }>
        <span id="chass-dialog" />
    </OverlayTrigger>;

const EnrolDialog = props =>
    <OverlayTrigger
        trigger="click"
        rootClose
        placement="right"
        overlay={
            <Popover id="help" placement="right" title="Enrolment fixed-width file line format">
                <pre>
                    {enrolFormat}
                </pre>
            </Popover>
        }>
        <span id="enrol-dialog" />
    </OverlayTrigger>;

const chassFormat = `{
  "courses": [
    {
      "instructor": [{},...],
      "last_updated": datetime,
      "end_nominations": string,
      "status": integer,
      "end_posting": datetime,
      "start_posting": datetime,
      "total_hours": integer,
      "duties": string,
      "qualifications": string,
      "tutorials": string,
      "dates": string,
      "n_hours": string,
      "n_positions": integer,
      "enrolment": integer,
      "round_id": integer,
      "course_name": string,
      "course_id": string,
      "dates": string
    },...],
  "applicants": [
    {
      "app_id": string,
      "utorid": string,
      "first_name": string,
      "last_name": string,
      "email": string,
      "phone": string,
      "student_no": string,
      "address": string,
      "ta_training": (Y/N),
      "access_acad_history": (Y/N),
      "dept": string,
      "program_id": string,
      "yip": string,
      "course_preferences": string,
      "ta_experience": "string,
      "academic_qualifications": string,
      "technical_skills": string,
      "availability": string,
      "other_info": string,
      "special_needs": string,
      "last_updated": datetime,
      "courses": [string, ...]
    },...]
}`;

const enrolFormat = `FIELD         POSITION  LENGTH  TYPE
Term          [0-4]     5       numerical
  Year        [0-3]     4       numerical
  Semester    [4]       1       one of {1,5,9}
Department    [6-9]     3
CourseCode    [11-19]   9
Title         [21-50]   0-20
Section       [51-57]   7
Type          [60-63]   0-4
CapEnrolment  [64-67]   0-4     numerical
CurrEnrolment [68-71]   0-4     numerical
Waitlist      [74-83]   0-10    numerical`;

export { ImportForm };
