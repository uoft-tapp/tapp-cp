import React from 'react';
import { Panel, Nav, NavItem, Button } from 'react-bootstrap';
import { CourseInfoHeader } from './ddahForm2.js';
import { DdahTaskSelector } from './ddahTaskSelector.js';

class DdahSpreadsheet extends React.Component {
    getAllTasks(ddahs){
      let tasks = {}
      ddahs.forEach(ddah=>{
        let allocations = ddah.duty_allocations;
        let duties = Object.keys(allocations);
        duties.forEach(duty=>{
          let duty_name = allocations[duty].heading;
          if(!tasks[duty_name])
            tasks[duty_name] = {}
          allocations[duty].items.forEach(allocation=>{
            if(!tasks[duty_name][allocation.unit_name])
              tasks[duty_name][allocation.unit_name]={};
            tasks[duty_name][allocation.unit_name][ddah.utorid] = (allocation.minutes/60).toFixed(2);
          });
        });
      });
      return tasks;
    }
    getTotalHours(ddah){
      let total = 0;
      let allocations = ddah.duty_allocations;
      let duties = Object.keys(allocations);
      duties.forEach(duty=>{
        allocations[duty].items.forEach(allocation=>{
          total += (allocation.num_units*(!allocation.minutes?0:allocation.minutes));
        });
      });
      return (total/60).toFixed(2);
    }
    render() {
        let ddahs = this.props.mockDdahData.ddahs_entries;
        let tasks = this.getAllTasks(ddahs);
        let duties = Object.keys(tasks);
        let selectedApplicant = this.props.appState.getSelectedApplicant();

        return (
            <div id="ddah-spreadsheet" className="container-fluid container-fit">
                <DdahCourseTabs {...this.props}/>
                <Panel>
                    <table id="ddah-spreadsheet" className="table table-hover">
                        <thead><tr>
                            <CopyPasteButton {...this.props}
                              copy={()=>alert('copy action')}
                              paste={()=>alert('paste action')}/>
                            <th>Name</th>
                            <th>utorid</th>
                            <th>Required <br/> Hours</th>
                            <th>Total <br/> Hours</th>
                            <th>Tutorial <br/> Category</th>
                            {duties.map(duty=>
                              Object.keys(tasks[duty]).map((task,i)=>
                                <DutyTaskHeading key={i} {...this.props}
                                  duty={duty} task={task} />
                              )
                            )}
                            <NewTaskButton {...this.props}
                              onClick={()=>this.props.appState.setTaskSelectorOpen(true)}/>
                        </tr></thead>
                        <tbody>
                          {ddahs.map((ddah, i)=>
                            <DdahEntry key={i} {...this.props}
                              onClick={()=>this.props.appState.setSelectedApplicant(ddah.utorid)}
                              checked={selectedApplicant==ddah.utorid}
                              name={ddah.name} utorid={ddah.utorid} required={ddah.required_hours}
                              tasks={tasks} duties={duties}
                              total={this.getTotalHours(ddah)} />
                          )}
                        </tbody>
                        <tfoot>
                            <tr><td colSpan="6"></td>
                            {duties.map(duty=>
                              Object.keys(tasks[duty]).map((task, i)=>
                                <RemoveButton key={i} {...this.props}
                                  onClick={()=>alert(duty+'\n'+task)}/>
                              )
                            )}
                          </tr>
                        </tfoot>
                    </table>
                </Panel>
                <DdahImportExporter {...this.props}
                  import={()=>alert('import action')}
                  export={()=>alert('export action')}/>
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

const CopyPasteButton = props =>(
  <th>
      <Button className="copy-paste-action" bsStyle='primary' bsSize='xsmall'
        title="Copy task hours in a selected row"
        onClick={props.copy}>Copy</Button>
      <Button className="copy-paste-action" bsStyle='info' bsSize='xsmall'
        title="Paste task hours to selected row"
        onClick={props.paste}>Paste</Button>
  </th>
);

const DutyTaskHeading = props =>(
  <th>
    {props.task}
    <div className="label label-default">{props.duty}</div>
  </th>
);

const NewTaskButton = props =>(
  <th>
    <Button bsStyle='success' bsSize='small' onClick={props.onClick}>
        New Task
        <br/>
        <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
        <span className="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
    </Button>
  </th>
);

const DdahEntry = props =>(
  <tr className={(parseFloat(props.required)!=parseFloat(props.total))?'danger':''}
    onClick={props.onClick}>
      <td><input type="radio" name="copy-paste-radio" checked={props.checked}/></td>
      <th scope="row">{props.name}</th>
      <td>{props.utorid}</td>
      <td>{props.required}</td>
      <td>{props.total}</td>
      <td></td>
      {props.duties.map(duty=>
        Object.keys(props.tasks[duty]).map((task,i)=>
          <DdahInput {...props} value={props.tasks[duty][task][props.utorid]?
            props.tasks[duty][task][props.utorid]:0} />
        )
      )}
  </tr>
);

const DdahInput = props =>(
  <td>
    <input type="number" value={props.value}
      className="duty-hour form-control" placeholder="0"/>
  </td>
);

const RemoveButton = props =>(
  <td>
    <Button bsSize='xsmall' bsStyle='warning' onClick={props.onClick}>
        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
        Remove
    </Button>
  </td>
);

const DdahImportExporter = props =>(
  <Panel>
    <div className="row">
        <section className="col-xs-6">
            <Button bsStyle='primary' block onClick={props.import}>Import</Button>
        </section>
        <section className="col-xs-6">
            <Button block onClick={props.export}>Export</Button>
        </section>
    </div>
  </Panel>
);

export { DdahSpreadsheet };
