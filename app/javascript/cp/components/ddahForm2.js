import React from 'react';
import {
    // Grid,
    // ButtonToolbar,
    // ButtonGroup,
    // Button,
    // PanelGroup,
    Panel,
    // Well,
    // DropdownButton,
    // MenuItem,
    // OverlayTrigger,
} from 'react-bootstrap';


function CourseInfoHeader(props) {
    return (
        <div className="panel panel-default">
            <div className="panel-body">
                <div className="row">

                    <section className="col-xs-8" id="course-overview">
                        <span id="course-code">
                            {props.mockDdahData.course_data.code}
                        </span>

                        <span id="course-prof">
                            {/*Profname Profferson*/}
                            {props.mockDdahData.course_data.prof}
                        </span>

                        <div id="course-title">
                            {/*Introduction to Computer Programming*/}
                            {props.mockDdahData.course_data.name}
                        </div>

                    </section>

                    <section className="col-xs-4" id="course-details">

                        <form className="form-horizontal">

                            <div className="form-group form-group-sm">
                              <label className="col-xs-7 control-label">Expected Enrollment</label>
                              <div className="col-xs-3">
                                  <p className="form-control-static">{props.mockDdahData.course_data.enrollment}</p>
                              </div>
                            </div>

                            <div className="form-group form-group-sm">
                              <label className="col-xs-7 control-label">Est. Enrollment / TA</label>
                              <div className="col-xs-3">
                                  <p className="form-control-static">{props.mockDdahData.course_data.enrollment_rate}</p>
                              </div>
                            </div>

                        </form>

                    </section>

                </div>
            </div>
        </div>
    );
}


class DdahForm extends React.Component {
    // constructor(props) {
    //     super(props);
    //     // this.state = {};
    //     console.log('Form constructor ran.');
    //     // console.log(this.props.mockDdahData.training.length)
    //     // console.log(this.props);
    //     // console.log(this.props.mockDdahData.course_data);
    //     // console.log(this.props.mockDdahData.ta_name);
    //     // console.log(this.props.mockDdahData.ddahs_entries);
    //     // console.log(this.props.mockDdahData.duty_tasks);
    //     // console.log(this.props.mockDdahData.training);
    //     // console.log(this.props.mockDdahData.tutorial_category);

    //     // instructorFetchAll
    // }

    render() {
        // const role = this.props.appState.getSelectedUserRole();
        // console.log(this.props.appState.getTemplatesList());

        let signatures = this.props.mockDdahData.signatures;
        let review_signatures = this.props.mockDdahData.mid_course_review_changes;
        return (
            <div id="ddah-form" className="container-fluid container-fit">
                <header>
                    <h3>Description of Duties and Allocation of Hours (DDAH)</h3>
                </header>

                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">

                            <div className="col-sm-7">
                                <section id="ta-person">

                                    <div id="ta-info">
                                        <h3 id="ta-name">{this.props.mockDdahData.ta_name}</h3>
                                    </div>
                                </section>
                            </div>

                            <div className="col-sm-5">
                                <img id="dcs-logo-ddah" className="img-responsive" src="<%= asset_url('dcs_logo_blue_big.jpg') %>" />
                            </div>

                        </div>
                    </div>
                </div>

                <CourseInfoHeader {...this.props} />

                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title">Allocation of Hours Worksheet</h3>
                  </div>
                  <div className="panel-body">
                        <table id="duty-table" className="table table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        {/*<!-- Assume always keep at # Units = 1,
                                        so that revisions to Time/Task is simple. -->*/}
                                        # Unit
                                    </th>
                                    <th>
                                        Type of Unit
                                    </th>
                                    <th>
                                        Hours per Unit
                                    </th>
                                    <th>
                                        Hours Revision **
                                    </th>
                                    <th>
                                        Total Hours
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="duty-heading ">
                                    <th colSpan="4">Grading</th>
                                    <td className="total">31</td>
                                </tr>
                              <tr className="">
                                  <td className="number-of-units">1</td>
                                  <td className="duty-description">Assignment Grading</td>
                                  <td className="unit-time">7</td>
                                  <td className="revised-time"></td>
                                  <td></td>
                              </tr>
                              <tr className="">
                                  <td className="number-of-units">1</td>
                                  <td className="duty-description">Test Grading</td>
                                  <td className="unit-time">8</td>
                                  <td className="revised-time"></td>
                                  <td></td>
                              </tr>
                              <tr className="">
                                  <td className="number-of-units">1</td>
                                  <td className="duty-description">Final Exam Grading</td>
                                  <td className="unit-time">16</td>
                                  <td className="revised-time"></td>
                                  <td></td>
                              </tr>


                              <tr className="duty-heading">
                                  <th colSpan="4">Preparation</th>
                                  <td className="total">14</td>
                              </tr>
                              <tr className="">
                                  <td className="number-of-units">1</td>
                                  <td className="duty-description">Prep Time for Tutorials</td>
                                  <td className="unit-time">3</td>
                                  <td className="revised-time">10</td>
                                  <td></td>
                              </tr>
                              <tr className="">
                                  <td className="number-of-units">1</td>
                                  <td className="duty-description">Meeting with Supervisor</td>
                                  <td className="unit-time">4</td>
                                  <td className="revised-time"></td>
                                  <td></td>
                              </tr>


                              <tr className="duty-heading">
                                  <th colSpan="4">Contact Time</th>
                                  <td className="total">15</td>
                              </tr>
                              <tr className="">
                                  <td className="number-of-units">1</td>
                                  <td className="duty-description">Office Hours</td>
                                  <td className="unit-time">22</td>
                                  <td className="revised-time">15</td>
                                  <td></td>
                              </tr>


                              <tr className="duty-heading">
                                  <th colSpan="4">Training</th>
                                  <td className="total">0</td>
                              </tr>


                              <tr className="duty-heading">
                                  <th colSpan="4">Other Duties</th>
                                  <td className="total">0</td>
                              </tr>

                              <tr className="info row-total">
                                  <td>Total</td>
                                  <td></td>
                                  <td>60</td>
                                  <td>N/A</td>
                                  <td>60</td>
                              </tr>
                            </tbody>
                        </table>
                  </div>
                  <div className="worksheet-footer panel-footer">** Revised as necessary, following mid-course review</div>
                </div>


                <div className="row">

                    <div className="col-sm-6">
                        <div className="panel panel-default">
                          <div className="panel-heading">
                            <h3 className="panel-title">Training</h3>
                          </div>
                          <div className="panel-body">
                              <div className="list-group">
                                {this.props.mockDdahData.training.map((item, i)=>
                                    <div className="checkbox" key={'training' + i}>
                                        <label>
                                            <input name="trainings" type="checkbox" value={item.id} defaultChecked={item.checked} />
                                            {item.name}
                                        </label>
                                    </div>
                                )}
                              </div>
                          </div>
                        </div>
                    </div>

                    <div className="col-sm-6" id="tutorial-category">
                        <div className="panel panel-default">
                          <div className="panel-heading">
                            <h3 className="panel-title">Tutorial Category (1 primary activity)</h3>
                          </div>
                          <div className="list-group">
                            {this.props.mockDdahData.tutorial_category.map((item, i)=>
                                <div className="list-group-item list-group-item-condensed" key={'tutorial' + i}>
                                    <div className="radio">
                                        <label>
                                            <input name="tutorial-category" type="radio" defaultChecked={item.checked} value=""/>
                                            {item.name}
                                        </label>
                                    </div>
                                </div>
                            )}
                          </div>
                        </div>
                    </div>

                </div>


                <section id="signature-block" className="panel panel-default panel-warning">
                    <div className="panel-body bg-warning">
                        {Object.keys(signatures).map(key=>
                            <div className="row">
                                <div className="col-sm-12">
                                    <p className="form-label-heading">{signatures[key].title}</p>
                                </div>
                                <div className="signatures-col col-sm-5">
                                    <div className="form-group">
                                        <input type="text" className="form-control" value={signatures[key].name}/>
                                        <span className="help-block">Prepared by (Supervisor)</span>
                                    </div>
                                </div>
                                <div className="signatures-col col-sm-4">
                                    <div className="form-group">
                                        <input type="text" className="form-control" value={signatures[key].signature_initials}/>
                                        <span className="help-block">SIGNATURE / INITIAL</span>
                                    </div>
                                </div>
                                <div className="signatures-col col-sm-3">
                                    <div className="form-group">
                                        <input type="text" className="form-control" value={signatures[key].date}/>
                                        <span className="help-block">Date</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="panel-footer">
                        <div className="row">
                            <div className="col-sm-12">
                                <h6>Mid-Course Review Changes (if any **)</h6>
                            </div>

                            <div className="col-sm-12">
                                {Object.keys(review_signatures).map(key=>
                                    <div className="row">
                                        <div className="course-change-col col-sm-4">
                                            <p className="form-label-heading form-control-static pull-right">{review_signatures[key].title}</p>
                                        </div>
                                        <div className="course-change-col col-sm-4">
                                            <div className="form-group">
                                                <input type="text" className="form-control" value={review_signatures[key].signature_initials}/>
                                                <span className="help-block">SIGNATURE / INITIAL</span>
                                            </div>
                                        </div>
                                        <div className="course-change-col col-sm-3">
                                            <div className="form-group">
                                                <input type="text" className="form-control" value={review_signatures[key].date}/>
                                                <span className="help-block">Date</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </section>
            </div>
        );
    }
}


export { DdahForm, CourseInfoHeader };
