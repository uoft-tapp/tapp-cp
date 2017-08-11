import React from 'react';
import PropTypes from 'prop-types';
import {
  ToggleButtonGroup,
  ToggleButton,
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
        <ButtonToolbar id="table-toolbar">
          <ButtonGroup id="table-sortfields-group">
            {this.props.sortFields.map(field =>
              <DropdownButton
                title={
                  <span>
                    {' '}{field.header} {this.icon['1']}{' '}
                  </span>
                }
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
          </ButtonGroup>

          <ToggleButtonGroup id="table-toggle-group" type="checkbox">
            {this.props.toggleFields.map(field =>
              <ToggleButton key={'toggle-' + field.header} value={field.header}>
                {field.header}
              </ToggleButton>
            )}
          </ToggleButtonGroup>
        </ButtonToolbar>
      </div>
    );
  }
}

export { TableMenu };
