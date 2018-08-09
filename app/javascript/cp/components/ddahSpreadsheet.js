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

import { CourseInfoHeader } from './ddahForm2.js';


class DdahSpreadsheet extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {};
        console.log('Spreadsheet constructor ran.');
        // console.log(this.props);
        console.log(this.props.mockDdahData.course_data);
        console.log(this.props.mockDdahData.ta_name);
        console.log(this.props.mockDdahData.ddahs_entries);
        console.log(this.props.mockDdahData.duty_tasks);
        console.log(this.props.mockDdahData.training);
        // console.log(this.props.mockDdahData.tutorial_category);
    }

    render() {
        // const role = this.props.appState.getSelectedUserRole();
        return (
            <div id="ddah-spreadsheet" className="container-fluid container-fit">
                <header>
                    <h3>DDAH Spreadsheet</h3>
                </header>

                <div className="panel panel-default">
                    <div className="panel-body">
                        <table id="ddah-spreadsheet" className="table table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        <button type="button" className="copy-paste-action btn btn-primary btn-xs" title="Copy task hours in a selected row">Copy</button>
                                        <button type="button" className="copy-paste-action btn btn-info btn-xs" title="Paste task hours to selected row">Paste</button>
                                    </th>
                                    <th>Name</th>
                                    <th>utorid</th>
                                    <th>Required <br/> Hours</th>
                                    <th>Total <br/> Hours</th>
                                    <th>Tutorial <br/> Category</th>

                                    {/*<!-- Duties -->*/}
                                    <th>
                                         Assignment Grading
                                        <div className="label label-default">Grading</div>
                                    </th>
                                    <th>
                                         Test Grading
                                         <div className="label label-default">Grading</div>
                                    </th>
                                    <th>
                                         Final Exam Grading
                                         <div className="label label-default">Grading</div>
                                    </th>

                                    <th>
                                        Prep Time for Tutorials
                                        <div className="label label-default">Preparation</div>
                                    </th>
                                    <th>
                                        Meeting with Supervisor
                                        <div className="label label-default">Preparation</div>
                                    </th>

                                    <th>
                                        Office Hours
                                        <div className="label label-default">Contact Time</div>
                                    </th>

                                    <th>
                                        _________
                                        <div className="label label-default">Training</div>
                                    </th>
                                    <th>
                                        _________
                                        <div className="label label-default">Other Duties</div>
                                    </th>

                                    <th>
                                        <button type="button" data-toggle="modal" data-target="#newTaskModal" id="new-task-action" className="btn btn-success btn-sm">
                                            New Task
                                            <br/>
                                            <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
                                            <span className="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
                                        </button>
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input type="radio" name="copy-paste-radio"/></td>
                                    <th scope="row">Studentlonglongname Studerson</th>
                                    <td>theutor8</td>
                                    <td>60</td>
                                    <td>60</td>
                                    <td></td>
                                    <td><input type="number" value="7" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" value="8" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" value="16" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" value="10" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" value="4" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" value="15" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                </tr>
                                <tr className="danger">
                                    <td><input type="radio" name="copy-paste-radio"/></td>
                                    <th scope="row">Lukarkark Mrokirmed</th>
                                    <td>applicant66</td>
                                    <td>60</td>
                                    <td>0</td>
                                    <td></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                </tr>
                                <tr className="danger">
                                    <td><input type="radio" name="copy-paste-radio"/></td>
                                    <th scope="row">Crumiarc Maruraked</th>
                                    <td>applicant390</td>
                                    <td>120</td>
                                    <td>0</td>
                                    <td></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                    <td><input type="number" className="duty-hour form-control" placeholder="0"/></td>
                                </tr>
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <button type="button" className="btn btn-warning btn-xs">
                                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
                                        </button>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-warning btn-xs">
                                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
                                        </button>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-warning btn-xs">
                                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
                                        </button>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-warning btn-xs">
                                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
                                        </button>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-warning btn-xs">
                                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
                                        </button>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-warning btn-xs">
                                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
                                        </button>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-warning btn-xs">
                                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
                                        </button>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-warning btn-xs">
                                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>

                        </table>
                    </div>
                </div>


                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="row">

                            <section className="col-xs-6">
                                <button type="button" className="btn btn-primary btn-block">Import</button>
                            </section>

                            <section className="col-xs-6">
                                <button type="button" className="btn btn-default btn-block">Export</button>
                            </section>
                        </div>
                    </div>
                </div>


                <CourseInfoHeader {...this.props} />


                {/*
                <img id="dcs-logo-spreadsheet" className="img-responsive" src="<%= asset_url('dcs_logo_blue_big.jpg') %>" />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src="<%= asset_url('images/dcs_logo_blue_big.jpg') %>" />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src={"<%= asset_url('dcs_logo_blue_big.jpg') %>"} />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src={"<%= asset_url('images/dcs_logo_blue_big.jpg') %>"} />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src="<%= image_path('dcs_logo_blue_big.png') %>" />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src="<%= image_path('images/dcs_logo_blue_big.png') %>" />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src="<%= asset_path('dcs_logo_blue_big.jpg') %>" />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src="<%= asset_path('images/dcs_logo_blue_big.jpg') %>" />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src="<%= asset_pack_path('dcs_logo_blue_big.jpg') %>" />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src="<%= asset_pack_path('images/dcs_logo_blue_big.jpg') %>" />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src={"<%= asset_pack_path('dcs_logo_blue_big.jpg') %>"} />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src={"<%= asset_pack_path('images/dcs_logo_blue_big.jpg') %>"} />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src="../../../assets/images/dcs_logo_blue_big.jpg" />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src="assets/images/dcs_logo_blue_big.jpg" />

                <img id="dcs-logo-spreadsheet" className="img-responsive" src="../../../assets/images/dcs_logo_blue_big.jpg" />

                <img src="<%= asset_pack_path 'images/dcs_logo_blue_big.jpg' %>" />

                <img src="<%= asset_path 'images/dcs_logo_blue_big.jpg' %>" />

                <img src="<%= asset_path 'images/dcs_logo_blue_big.jpg' %>" />

                <img src="/assets/images/dcs_logo_blue_big.jpg" />

                <img src="/images/dcs_logo_blue_big.jpg" />

                <img src="/images/dcs_logo_blue_big.jpg" />
                */}




                {/*THE REAL ONE*/}

                <div id="newTaskModal" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">×</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title" id="myModalLabel">Modal title</h4>
                            </div>
                        </div>
                    </div>
                </div>



                {/*<!-- MOCK UP -->*/}

                <div id="task-selection-modal" className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">×</span><span className="sr-only">Close</span></button>
                            <h3 className="modal-title" id="myModalLabel">Select Task</h3>
                        </div>

                        <div className="modal-body">

                            <div className="row">
                                <section className="col-sm-3">
                                    <h4>Grading</h4>

                                    <ul className="list-group">
                                        <button className="list-group-item"> <span className="badge">14</span> Assignment Grading </button>
                                        <button className="list-group-item"> <span className="badge">2</span> Test Grading </button>
                                        <button className="list-group-item"> <span className="badge">1</span> Final Exam Grading </button>
                                        <button className="list-group-item"> <span className="badge">1</span> Quiz Marking </button>
                                        <button className="list-group-item"> <span className="badge">0</span> Demo Grading </button>
                                    </ul>
                                </section>

                                <section className="col-sm-3">
                                    <h4>Preparation</h4>

                                    <ul className="list-group">
                                        <button className="list-group-item"> <span className="badge">2</span> Prep Time for Tutorials </button>
                                        <button className="list-group-item"> <span className="badge">2</span> Meeting with Supervisor </button>
                                        <button className="list-group-item"> <span className="badge">0</span> .  </button>
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                    </ul>
                                </section>

                                <section className="col-sm-3">
                                    <h4>Contact Time</h4>

                                    <ul className="list-group">
                                        <button className="list-group-item"> <span className="badge">12</span> Office Hours </button>
                                        <button className="list-group-item"> <span className="badge">0</span> .  </button>
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                    </ul>
                                </section>

                                <section className="col-sm-3">
                                    <h4>Training</h4>

                                    <ul className="list-group">
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                        <button className="list-group-item"> <span className="badge">0</span> .  </button>
                                    </ul>
                                </section>
                            </div>

                            <hr />

                            <h4>Other Duties</h4>

                            <div className="row">

                                <section className="col-sm-3">

                                    <ul className="list-group">
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                        <button className="list-group-item"> <span className="badge">0</span> .  </button>
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                    </ul>
                                </section>

                                <section className="col-sm-3">

                                    <ul className="list-group">
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                        <button className="list-group-item"> <span className="badge">0</span> .  </button>
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                    </ul>
                                </section>

                                <section className="col-sm-3">

                                    <ul className="list-group">
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                        <button className="list-group-item"> <span className="badge">0</span> .  </button>
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                    </ul>
                                </section>

                                <section className="col-sm-3">

                                    <ul className="list-group">
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                        <button className="list-group-item"> <span className="badge">0</span> . </button>
                                        <button className="list-group-item"> <span className="badge">0</span> .  </button>
                                    </ul>
                                </section>
                            </div>


                            <br />

                            <div className="input-group input-group-sm">

                                {/*<!-- <form className="form-inline"> -->*/}
                                {/*<!-- <div className="form-group"> -->*/}

                                <span className="input-group-addon">Create New Duty:</span>

                                <input type="text" className="form-control" placeholder="Enter Name of Task/Duty" aria-describedby="sizing-addon1"/>

                                <span className="input-group-btn">
                                    <button className="btn btn-primary" type="button">Save</button>
                                </span>

                                {/*<!-- </div> -->*/}
                                {/*<!-- </form>  -->*/}
                            </div>

                        </div>

                        <div className="modal-footer">
                            {/*<!-- <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button> -->*/}
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}


export { DdahSpreadsheet };
