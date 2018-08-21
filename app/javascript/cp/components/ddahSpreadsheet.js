import React from 'react';
import {
    Panel,
    Nav,
    NavItem,
    Button
} from 'react-bootstrap';
import { CourseInfoHeader } from './ddahForm2.js';
import { DdahTaskSelector } from './ddahTaskSelector.js';

class DdahSpreadsheet extends React.Component {
    render() {
        // const role = this.props.appState.getSelectedUserRole();
        // console.log(this.props.appState.getCoursesList());
        //console.log(this.props.appState.getSessionCourse());
        return (
            <div id="ddah-spreadsheet" className="container-fluid container-fit">
                <DdahCourseTabs {...this.props}/>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <table id="ddah-spreadsheet" className="table table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        <Button className="copy-paste-action" bsStyle='primary' bsSize='xsmall'
                                          title="Copy task hours in a selected row">Copy</Button>
                                        <Button className="copy-paste-action" bsStyle='info' bsSize='xsmall'
                                          title="Paste task hours to selected row">Paste</Button>
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
                                        <NewTaskButton {...this.props} onClick={()=>this.props.appState.setTaskSelectorOpen(true)}/>
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
                                    <RemoveButton {...this.props} />
                                    <RemoveButton {...this.props} />
                                    <RemoveButton {...this.props} />
                                    <RemoveButton {...this.props} />
                                    <RemoveButton {...this.props} />
                                    <RemoveButton {...this.props} />
                                    <RemoveButton {...this.props} />
                                    <RemoveButton {...this.props} />
                                </tr>
                            </tfoot>

                        </table>
                    </div>
                </div>

                <DdahImportExporter {...this.props} />
                <CourseInfoHeader {...this.props} />
                <DdahTaskSelector {...this.props}/>
            </div>
        );
    }
}

const DdahCourseTabs = props =>(
  <Nav bsStyle="tabs" justified activeKey={1} defaultValue={1}
    onChange={event=>console.log(event.target.value)}>
      <NavItem key={1}>item 1</NavItem>
      <NavItem key={2}>item 2</NavItem>
      <NavItem key={3} disabled>item 3</NavItem>
      <NavItem key={4} disabled>item 4</NavItem>
  </Nav>
);

const NewTaskButton = props =>(
  <Button bsStyle='success' bsSize='small' onClick={props.onClick}>
      New Task
      <br/>
      <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
      <span className="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
  </Button>
);

const RemoveButton = props =>(
  <td>
    <Button bsSize='xsmall' bsStyle='warning'>
        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
        Remove
    </Button>
  </td>
);

const DdahImportExporter = props =>(
  <Panel>
    <div className="row">
        <section className="col-xs-6">
            <Button bsStyle='primary' block>Import</Button>
        </section>
        <section className="col-xs-6">
            <Button block>Export</Button>
        </section>
    </div>
  </Panel>
);

export { DdahSpreadsheet };
