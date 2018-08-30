import React from 'react';
import { Modal, Button, Grid, ListGroup, ListGroupItem, Badge,
  FormGroup, FormControl, InputGroup } from 'react-bootstrap';

class DdahTaskSelector extends React.Component {
  getAllDuties(duties){
    return duties.map((duty, i)=>
      <TaskHeading key={i} value={duty}/>
    );
  }
  getAllTasks(duties, tasks){
    return duties.map((_, duty)=>
      <TaskCol key={duty} {...this.props} value={this.getTask(tasks, duty)}/>
    );
  }
  getTask(tasks, duty){
    return tasks[duty].map((task,i)=>
      <Task key={i} {...this.props} task={task.name} num={task.count?task.count:0}
          checked={task.checked}
          action={()=>this.props.appState.addTask(task.id)}/>
    );
  }
  render() {
    let nullCheck = this.props.appState.instrAnyNull();
    if (nullCheck) return null; // this is very important for loading the page
    let open = this.props.appState.getTaskSelectorOpen();
    let duties = this.props.appState.getDutiesList();
    let tasks = this.props.appState.getCategorisedTasks();

    return (
        <Modal id='task-selection-modal' show={open} bsSize='lg'
            onHide={()=>this.props.appState.setTaskSelectorOpen(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Select Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TaskTable {...this.props}
              headings={this.getAllDuties(duties)}
              body={this.getAllTasks(duties, tasks)}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>this.props.appState.setTaskSelectorOpen(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
    );
  }
}
const TaskTable = props =>(
  <table id="task-selection-modal" style={{width: '100%', tableLayout: 'fixed'}}>
    <tbody>
      <tr>{props.headings}</tr>
      <tr>{props.body}</tr>
    </tbody>
  </table>
);
const TaskHeading = props =>(
  <th><h4>{props.value}</h4></th>
);
const TaskCol = props =>(
  <td style={{verticalAlign: 'top'}}>
    <ListGroup style={{margin: '0 5px'}}>
      {props.value}
    </ListGroup>
  </td>
)
const Task = props =>(
  <ListGroupItem onClick={props.checked?()=>'':props.action} active={props.checked}>
    <small>
    {props.task}
    <Badge style={{float:'right'}}>{props.num}</Badge>
    </small>
  </ListGroupItem>
);
export { DdahTaskSelector };
