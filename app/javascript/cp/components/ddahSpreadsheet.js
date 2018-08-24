import React from 'react';
import { Panel, Nav, NavItem, Button } from 'react-bootstrap';
import { CourseInfoHeader } from './ddahForm2.js';
import { DdahTaskSelector } from './ddahTaskSelector.js';

class DdahSpreadsheet extends React.Component {
    minutesToHours(minutes){
        return (minutes/60).toFixed(2);
    }
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
            tasks[duty_name][allocation.unit_name][ddah.utorid] = allocation.is_revised?this.minutesToHours(allocation.revised_minutes):this.minutesToHours(allocation.minutes);
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
    getSortedCourses(){
      return this.props.appState.getCoursesList().sort((a, b)=>{
        if(a.get('code') < b.get('code')) return -1;
        if(a.get('code') > b.get('code')) return 1;
        return 0;
      });
    }
    getFirstCourse(){
      let id = null, count = 0;
      this.getSortedCourses().forEach((_, course)=>{
        if(count==0)
          id=course;
        count++;
      });
      return id;
    }
    getCurrentCourse(){
      let selectedCourse = this.props.appState.getSelectedCourse();
      if(!selectedCourse)
        this.props.appState.selectCourse(this.getFirstCourse());
      return this.props.appState.getSelectedCourse();
    }
    changeHour(hours, utorid, duty_name, task_name){
      alert('apply change to hour: '+hours+' from appState');
    }
    render() {
        let nullCheck = this.props.appState.instrAnyNull();
        if (nullCheck) return null; // this is very important for loading the page
        let ddahs = this.props.mockDdahData.ddahs_entries;
        let tasks = this.getAllTasks(ddahs);
        let duties = Object.keys(tasks);
        let selectedApplicant = this.props.appState.getSelectedApplicant();
        let selectedCourseId= this.getCurrentCourse();

        return (
            <div id="ddah-spreadsheet" className="container-fluid container-fit">
                <DdahCourseTabs
                  {...this.props} selectedCourse={selectedCourseId}
                  onSelect={event=>this.props.appState.selectCourse(event)}
                  value={
                    this.getSortedCourses().map((course,i)=>
                      <NavItem key={i} eventKey={i} >
                      {course.get('code')}
                      </NavItem>
                    )
                  }/>
                 <NewTaskButton {...this.props}
                  onClick={()=>this.props.appState.setTaskSelectorOpen(true)}/>
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
                        </tr></thead>
                        <tbody>
                          {ddahs.map((ddah, i)=>
                            <DdahEntry key={i} {...this.props}
                              onClick={()=>this.props.appState.setSelectedApplicant(ddah.utorid)}
                              onChange={this.changeHour}
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
                <CourseInfoHeader {...this.props}
                  course={this.props.appState.getCourseHeaderInfo(selectedCourseId)}/>
                <DdahTaskSelector {...this.props}/>
            </div>
        );
    }
}

const DdahCourseTabs = props =>(
  <Nav id="course-tabs-nav" bsStyle="tabs" activeKey={props.selectedCourse} onSelect={props.onSelect}>
    {props.value}
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
    <Button id="new-task-button" bsStyle='success' bsSize='medium' onClick={props.onClick}>
        New Task
        &nbsp;&nbsp;
        <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
        <span className="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
    </Button>
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
            props.tasks[duty][task][props.utorid]:0}
            onChange={event=>
              props.onChange(event.target.value, props.utorid, duty, task)
            }/>
        )
      )}
  </tr>
);

const DdahInput = props =>(
  <td>
    <input type="number" value={props.value} onChange={props.onChange}
      className="duty-hour form-control" placeholder="0"/>
  </td>
);

const RemoveButton = props =>(
  <td>
    <Button bsSize='xsmall' bsStyle='warning' onClick={props.onClick}>
        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
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
