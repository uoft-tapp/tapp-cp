import React from 'react';
import { Modal, Button, Grid, ListGroup, ListGroupItem, Badge,
  FormGroup, FormControl, InputGroup } from 'react-bootstrap';

const otherwise = 'Other Duties';
class DdahTaskSelector extends React.Component {
  generateMockTask(num){
    let task= {name: 'task #..', num: 0, action: ()=>alert('hello')};
    let tasks = [];
    for(let i=0; i<num; i++)
      tasks.push(task);
    return tasks;
  }
  splitDataToCol(data, num_cols){
    let output =[];
    let portion = Math.ceil(data.length/num_cols);
    for (let i = 0; i < data.length; i += portion){
        output[output.length] = data.slice(i, i + portion);
    }
    return output;
  }
  getDutiesKey(duties, allocations){
    let keys = [];
    duties.forEach(duty=>{
      if(allocations[duty].heading!=otherwise)
        keys.push(duty);
    })
    return keys;
  }
  saveTasks(){
    alert('save action');
    this.props.appState.setTaskSelectorOpen(false)
  }
  render() {
    let open = this.props.appState.getTaskSelectorOpen();
    let num_cols = 5;
    let allocations= this.props.mockDdahData.ddahs_entries[0].duty_allocations;
    let duties = this.getDutiesKey(Object.keys(allocations), allocations);
    let other_duties = this.splitDataToCol(this.generateMockTask(27), num_cols);


    return (
      <div>
        <Modal show={open} onHide={()=>this.props.appState.setTaskSelectorOpen(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Select Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TaskTable {...this.props} headings={
              duties.map((duty, i)=>
                <TaskHeading  key={i} value={allocations[duty].heading}/>
            )}
            body={duties.map((duty,i)=>
              <TaskCol key={i} {...this.props} value={
                  allocations[duty].items.map((allocation,i)=>
                      <Task key={i} {...this.props} task={allocation.unit_name} num={allocation.minutes}
                          action={()=>alert(allocation.unit_name)}/>
                )}/>
              )}/>
            <hr />
            <TaskTable {...this.props} headings={<TaskHeading value={otherwise}/>}
              body={other_duties.map((col,i)=>
                  <TaskCol key={i} {...this.props} value={
                    col.map((task, i)=>
                      <Task key={i} {...this.props} task={task.name} num={task.num}
                        action={task.action}/>
                  )}/>
                )}/>
            <hr/>
            <NewDuty {...this.props} onSave={()=>alert('save new tasks')}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>this.props.appState.setTaskSelectorOpen(false)}>Close</Button>
            <Button bsStyle="primary" onClick={()=>this.saveTasks()}>Save changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
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
  <ListGroupItem onClick={props.action}>
    <small>
    {props.task}
    <Badge style={{float:'right'}}>{props.num}</Badge>
    </small>
  </ListGroupItem>
);
const NewDuty = props =>(
  <FormGroup bsSize="small">
    <InputGroup>
      <InputGroup.Addon>Create New Duty:</InputGroup.Addon>
      <FormControl type="text"
        placeholder="Enter Name of Task/Duty"/>
      <InputGroup.Button>
        <Button bsStyle='primary' bsSize='small' onClick={props.onSave}>Save</Button>
      </InputGroup.Button>
    </InputGroup>
  </FormGroup>
);
export { DdahTaskSelector };
