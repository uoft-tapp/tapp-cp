import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonToolbar,
  ButtonGroup,
  Button,
  DropdownButton,
  MenuItem,
  Glyphicon,
} from 'react-bootstrap';

class TableMenu extends React.Component {
  constructor(props) {
    super(props);
    this.icon = {
      '1': <Glyphicon style={{ fontSize: '7pt' }} glyph={'menu-up'} />,
      '-1': <Glyphicon style={{ fontSize: '7pt' }} glyph={'menu-down'} />,
    };
  }

  render() {
    return (
      <div className="table-menu">
        <ButtonToolbar>
          {this.props.config.map(field =>
            <DropdownButton
              title={field.header}
              key={'sort-' + field.header}
              id={'sort-' + field.header}
              noCaret>
              <MenuItem
                eventKey={'sort-' + field.header + '-down'}
                onSelect={() => this.props.sort(field.header)}>
                <span>
                  {' '}{field.header} {this.icon['-1']}{' '}
                </span>
              </MenuItem>
            </DropdownButton>
          )}
        </ButtonToolbar>
      </div>
    );
  }
}

export { TableMenu };
