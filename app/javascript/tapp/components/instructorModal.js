import React from 'react';
import { Modal, Form, FormGroup, Alert, FormControl,DropdownButton, MenuItem, Row, Col, Nav, NavItem, Tab, Button } from 'react-bootstrap';
import { Applicant } from './applicant.js';

class InstructorModal extends React.Component {
    render() {
        let modalData = this.props.instructorModalOpen();
        if(modalData){
          let id = this.props.getInstructorDataFromModal('id'),
              instructors = this.props.getInstructorsList(true),
              selectedTab = this.props.getSelectedTabFromModal();

          return (
              <Modal className="_modal instructor" show={true} onHide={() => this.props.hideInstructorModal()}>
                <Form horizontal>
                  <Modal.Header>
                      <Modal.Title>
                          Instructor Editor
                          <span className="text-muted" style={{ float: 'right' }}>
                              <i className="fa fa-times button"
                                  style={{ fontSize: '18px' }}
                                  onClick={() => this.props.hideInstructorModal()}
                              />
                          </span>
                      </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{paddingTop: '0'}}>
                      <Tab.Container id="tabs-with-dropdown" defaultActiveKey={selectedTab}
                        onSelect={key=>this.props.setSelectedTabFromModal(key)}>
                          <Row className="clearfix">
                          <Col sm={12}>
                            <Nav bsStyle="pills">
                              <NavItem eventKey="create">Create Instructor</NavItem>
                              <NavItem eventKey="edit">Edit Instructor</NavItem>
                            </Nav>
                            <Alert bsStyle="danger" style={{opacity: this.props.getInstructorModalAlert()?'1':'0'}}>
                              <b>Error: </b>{this.props.getInstructorModalAlert()}
                            </Alert>
                          </Col>
                          <Col sm={12}>
                            <Tab.Content animation style={{margin: '0px 0 20px 20px'}}>
                              <CreateInstructor {...this.props} instructors={instructors}/>
                              <EditInstructor {...this.props} id={id} instructors={instructors}/>
                            </Tab.Content>
                          </Col>
                          </Row>
                      </Tab.Container>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button onClick={() => this.props.hideInstructorModal()}>Close</Button>
                      <Button bsStyle="primary"
                      onClick={()=>(selectedTab=='create')?
                          this.props.createInstructor(): this.props.updateInstructor()}>
                        {selectedTab=='create'? 'Submit': 'Save Changes'}
                        </Button>
                  </Modal.Footer>
                </Form>
              </Modal>
          );
        }
        return null;
    }
}

const CreateInstructor = props =>(
  <Tab.Pane eventKey="create">
    <FormFormat cid='instructor-utorid' type='text'
      label='Utorid'
      placeholder='Utorid'
      value={props.getInstructorDataFromModal('utorid')}
      update={event=>props.setInstructorDataFromModal('utorid', event.target.value)}
      {...props}/>
    <InstructorForm {...props}/>
  </Tab.Pane>
);

const EditInstructor = props =>(
  <Tab.Pane eventKey="edit">
    <FormFormat cid='instructor-utorid-dropdown' type='dropdown'
      label='Instructor'
      placeholder={props.id?props.instructors[props.id]['utorid']:'Choose a Utorid'}
      update={key=>props.setInstructorDataFromModal('id', key)}
      body={Object.keys(props.instructors).map(key=>
            <MenuItem key={key} eventKey={key}>
              {props.instructors[key]['utorid']}
            </MenuItem>
      )}
      {...props}/>
    <InstructorForm {...props}/>
  </Tab.Pane>
);

const InstructorForm = props =>(
  <div>
    <FormFormat cid='instructor-name' type='text'
      label='Name'
      placeholder='Full Name'
      value={props.getInstructorDataFromModal('name')}
      update={event=>props.setInstructorDataFromModal('name', event.target.value)}
      {...props}/>
    <FormFormat cid='instructor-email' type='email'
      label='Email'
      placeholder='Email'
      value={props.getInstructorDataFromModal('email')}
      update={event=>props.setInstructorDataFromModal('email', event.target.value)}
      {...props}/>
  </div>
);

const FormFormat = props =>(
  <FormGroup controlId={props.cid}>
    <Col sm={3}>
      {props.label}
    </Col>
    <Col sm={9}>
      {(props.type=='dropdown')?
      <div>
        <DropdownButton key='1' id={props.cid}
          bsStyle='default'
          title={props.placeholder}
          onSelect={props.update}>
          {props.body}
        </DropdownButton>
        <i className='fa fa-trash' onClick={()=>props.deleteInstructor()}></i>
      </div>:
      <FormControl type={props.type}
        placeholder={props.placeholder}
        onChange={props.update}
        value={props.value}/>}
    </Col>
  </FormGroup>
);

export { InstructorModal };
