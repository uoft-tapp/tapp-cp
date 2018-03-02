import React from 'react';
import { Modal, Row, Col, Nav, NavItem, Tab, Button } from 'react-bootstrap';
import { Applicant } from './applicant.js';

class InstructorModal extends React.Component {
    render() {
        let instructors = this.props.getInstructorsList();
        if(this.props.instructorModalOpen()){
          let instructor = null,
              selectedTab = 1;
          return (
              <Modal id="instructor-modal" show={true} onHide={() => this.props.hideInstructorModal()}>
                  <Modal.Header>
                      <Modal.Title>
                          Instructor Editor
                          <span className="text-muted" style={{ float: 'right' }}>
                              <i className="fa fa-times clickable"
                                  style={{ fontSize: '18px' }}
                                  onClick={() => this.props.hideInstructorModal()}
                              />
                          </span>
                      </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <Tab.Container id="tabs-with-dropdown" defaultActiveKey="create">
                          <Row className="clearfix">
                          <Col sm={12}>
                            <Nav bsStyle="tabs">
                              <NavItem eventKey="create">Create Instructor</NavItem>
                              <NavItem eventKey="edit">Edit Instructor</NavItem>
                            </Nav>
                          </Col>
                          <Col sm={12}>
                            <Tab.Content animation>
                              <Tab.Pane eventKey="create">
                              Tab 1 content
                              </Tab.Pane>
                              <Tab.Pane eventKey="edit">
                              Tab 2 content
                              </Tab.Pane>
                            </Tab.Content>
                          </Col>
                          </Row>
                      </Tab.Container>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button onClick={() => this.props.hideInstructorModal()}>Close</Button>
                      <Button bsStyle="primary"
                      onClick={()=>(selectedTab==1)?
                          this.props.createInstructor(instructor): this.props.updateInstructor(instructor)}>
                        {selectedTab==1? 'Submit': 'Save Changes'}
                        </Button>
                  </Modal.Footer>
              </Modal>
          );
        }
        return null;
    }
}

export { InstructorModal };
