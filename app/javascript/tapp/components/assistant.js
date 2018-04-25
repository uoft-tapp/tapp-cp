import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class Assistant extends React.Component {
    render() {
      if (this.props.anyFetching()||this.props.anyNull()) {
        return null;
      }
      else{
        let sessions = Object.keys(this.props.getSessionsList());
        return(
          <div id='tapp-assistant'>
            <ListGroup style={{width: '500px', margin: '0 auto'}}>
              {sessions.map(id=>
                <ListGroupItem key={id} id={'session-'+id}
                  onClick={()=>this.props.downloadFile('/export/offers/'+id)}>
                  {this.props.getSessionName(id)}&nbsp;
                  <i className="fa fa-download"></i>
                </ListGroupItem>
              )}
            </ListGroup>
          </div>
        );
      }
    }
}

export { Assistant };
