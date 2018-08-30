import React from 'react';
import { Panel, Nav, NavItem, Button, InputGroup, FormControl, Glyphicon, Well } from 'react-bootstrap';
import { CourseInfoHeader } from './ddahForm.js';
import { DdahTaskSelector } from './ddahTaskSelector.js';
import { CopyToModal } from './copyToModal.js';

class DdahSpreadsheet extends React.Component {
    minutesToHours(minutes){
        return (minutes/60).toFixed(2);
    }
    getTotalHours(ddah){
      let total = 0;
      let allocations = ddah.get('allocations');
      allocations.forEach(allocation=>{
        let time = allocation.get('revisedTime')? allocation.get('revisedTime'): allocation.get('time');
        total += (allocation.get('units')*(!time?0:time));
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
    changeUnit(unit, utorid, duty_name, task_name){
      alert('apply change to hour: '+unit+' from appState');
    }
    changeMinute(minute, utorid, duty_name, task_name){
      alert('apply change to hour: '+minute+' from appState');
    }
    getHeadings(duties, tasks){
      return duties.map((duty, id)=>
        tasks[id].filter(task=>task.checked).map((task,i)=>
          <DutyTaskHeading key={i} {...this.props} duty={duty} task={task.name} />
        )
      );
    }
    getAllocations(selectedApplicant, ddahs, duties, tasks){
      return Object.keys(ddahs).map((i, k)=>
        <DdahEntry key={k} {...this.props}
          onClick={()=>this.props.appState.setSelectedApplicant(
          this.props.appState.getOfferAttrById(ddahs[i].get('offer'), 'applicantId'))}
          onChangeUnit={this.changeUnit}
          onChangeHour={this.changeMinute}
          checked={selectedApplicant==this.props.appState.getOfferAttrById(ddahs[i].get('offer'), 'applicantId')}
          name={this.props.appState.getOfferAttrById(ddahs[i].get('offer'), 'firstName')+' '+
            this.props.appState.getOfferAttrById(ddahs[i].get('offer'), 'lastName')}
          utorid={this.props.appState.getOfferAttrById(ddahs[i].get('offer'), 'utorid')}
          required={this.props.appState.getOfferAttrById(ddahs[i].get('offer'), 'hours')}
          value={this.getAllocationValues(duties, tasks, i)}
          total={this.getTotalHours(ddahs[i])} />
      );
    }
    getAllocationValues(duties, tasks, ddah){
      return duties.map((_,duty)=>
        tasks[duty].filter(task=>task.checked).map((task,i)=>
          <DdahInput {...this.props}
            unit={task.allocations[ddah]? task.allocations[ddah].units:''}
            minute={task.allocations[ddah]? task.allocations[ddah].time:''}
              onChangeUnit={event=>this.onChangeUnit(event.target.value, ddah, duty, i)}
              onChangeMinute={event=>this.onChangeMinute(event.target.value, ddah, duty, i)}/>
      ));
    }
    getRemoveButtons(duties, tasks){
      return duties.map((duty,id)=>
        tasks[id].filter(task=>task.checked).map((task, i)=>
          <RemoveButton key={i} {...this.props}
            onClick={()=>this.props.appState.removeTask(task.id)}/>
        )
      );
    }
    getCourseTabs(){
      let locked = true;  // todo: map over each TA in each sheet...
      return this.getSortedCourses().map((course,i)=>
        <NavItem key={i} eventKey={i} >
        {course.get('code')} {locked?<Glyphicon glyph="lock"/>:''}
        </NavItem>
      );
    }
    render() {
        let nullCheck = this.props.appState.instrAnyNull();
        if (nullCheck) return null; // this is very important for loading the page
        let selectedCourseId= this.getCurrentCourse();
        let ddahs = this.props.appState.getSelectedCourseDdahs();
        let duties = this.props.appState.getDutiesList();
        let tasks = this.props.appState.getCategorisedTasks();
        let selectedApplicant = this.props.appState.getSelectedApplicant();

        return (
            <div id="ddah-spreadsheet" className="container-fluid container-fit">
            <CopyToModal {...this.props} />
                <DdahCourseTabs
                  {...this.props} selectedCourse={selectedCourseId}
                  onSelect={event=>this.props.appState.selectCourse(event)}
                  value={this.getCourseTabs()}/>
                 <NewTaskButton {...this.props}
                  onClick={()=>this.props.appState.setTaskSelectorOpen(true)}/>
               <Panel>
                    <table id="ddah-spreadsheet" className="table table-hover">
                        <thead><tr>
                            <CopyToButton {...this.props}
                              onClick={()=>this.props.appState.setCopyToModalOpen(true)}/>
                            <th>Name</th>
                            <th>utorid</th>
                            <th>Required <br/> Hours</th>
                            <th>Total <br/> Hours</th>
                            <th>Tutorial <br/> Category</th>
                            {this.getHeadings(duties, tasks)}
                        </tr></thead>
                        <tbody>
                          {this.getAllocations(selectedApplicant, ddahs, duties, tasks)}
                        </tbody>
                        <tfoot>
                            <tr><td colSpan="6"></td>
                            {this.getRemoveButtons(duties, tasks)}
                          </tr>
                        </tfoot>
                    </table>
                </Panel>
                <DdahActionButtons {...this.props}
                  import={()=>alert('import action')}
                  export={()=>alert('export action')}
                  submit={()=>alert('submit action')}/>
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

const CopyToButton = props =>(
  <th>
      <Button className="copy-paste-action" bsStyle='primary' bsSize='xsmall'
        title="Copy task hours in a selected row"
        onClick={props.onClick}>Copy to</Button>
  </th>
);

const DutyTaskHeading = props =>(
  <th>
    {props.task}
    <div className="label label-default">{props.duty}</div>
  </th>
);

const NewTaskButton = props =>(
    <Button id="new-task-button" bsStyle='success' onClick={props.onClick}>
        New Task
        &nbsp;&nbsp;
        <Glyphicon glyph="plus-sign"/>
        <Glyphicon glyph="arrow-right"/>
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
      {props.value}
  </tr>
);

const DdahInput = props =>(
  <td>
    <InputGroup>
        <InputGroup.Addon style={{padding: '0', width: '50%'}}>
            <FormControl type="number" style={{height: '100%', border: '0'}}
                value={props.unit} onChange={props.onChangeUnit}
                placeholder="Units"/>
        </InputGroup.Addon>
        <FormControl id="task-minute-field" type="number" value={props.minute} onChange={props.onChangeMinute} placeholder="Minutes"/>
    </InputGroup>
   </td>
);

const RemoveButton = props =>(
  <td>
    <Button className='remove-task-button' bsSize='xsmall' bsStyle='warning' onClick={props.onClick}>
        <Glyphicon glyph="remove"/> Remove
    </Button>
  </td>
);

const DdahActionButtons = props =>(
  <Panel>
    <div className="row">
        <section className="col-xs-3">
            <Button bsStyle='primary' block onClick={props.import}>Import</Button>
        </section>
        <section className="col-xs-3">
            <Button block onClick={props.export}>Export</Button>
        </section>
        <section className="col-xs-6">
            <Button bsStyle='info' block onClick={props.submit}>Submit</Button>
        </section>
    </div>
  </Panel>
);

export { DdahSpreadsheet };
