import React from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap';

class TableMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="table-menu">
        <ButtonGroup>
          {this.props.config.map((field, i) =>
            <DropdownButton title={field.header} key={'sort' + field} id={'sort-' + field} noCaret>
              <MenuItem onSelect={() => this.props.toggleSort(field)}>
                {field.header}
              </MenuItem>
            </DropdownButton>
          )}
        </ButtonGroup>
      </div>
    );
  }
}

export { TableMenu };
