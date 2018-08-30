import React from 'react';
import { Modal, Button, Checkbox } from 'react-bootstrap';

class CopyToModal extends React.Component {
  submit(){
    alert('copies stuff');
    this.props.appState.setCopyToModalOpen(false);
  }
  getApplicants(ddahs){
    let applicants = [];
    ddahs.forEach(ddah=>{
        applicants.push({
            name: ddah.name,
            utorid: ddah.utorid,
            checked: ddah.locked,
        })
    });
    return applicants;
  }
  checkApplicant(id){
    alert('Check applicant with id: '+id);
  }
  render() {
    let open = this.props.appState.getCopyToModalOpen();
    let ddahs = this.props.mockDdahData.ddahs_entries;
    let applicants = this.getApplicants(ddahs);

    return (
        <Modal show={open}
            onHide={()=>this.props.appState.setCopyToModalOpen(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Copy To ...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {applicants.map((applicant, i)=>
                <Checkbox key={i} checked={applicant.checked}
                    onClick={()=>props.checkApplicant(i)}>
                    {applicant.name}
                </Checkbox>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>this.props.appState.setCopyToModalOpen(false)}>Close</Button>
            <Button bsStyle="primary" onClick={()=>this.submit()}>Save changes</Button>
          </Modal.Footer>
        </Modal>
    );
  }
}

export { CopyToModal };
