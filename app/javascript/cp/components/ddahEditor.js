import React from 'react';
import { DdahForm } from './ddahForm2.js';
import { DdahSpreadsheet } from './ddahSpreadsheet.js';
import { mockDdahData } from '../../mock_ddah_data.js';  // temporary  .


class DdahEditor extends React.Component {
    constructor(props) {
        super(props);

        // most recently-clicked checkbox, stored to allow range selection
        this.lastClicked = null;
    }

    selectThisTab() {
        if (this.props.appState.getSelectedNavTab() != this.props.navKey) {
            this.props.appState.selectNavTab(this.props.navKey);
        }
    }

    componentWillMount() {
        this.selectThisTab();
    }

    componentWillUpdate() {
        this.selectThisTab();
    }

    render() {
        return (
          <main id="ddah-container" className="container-fluid">
              <DdahSpreadsheet {...this.props} mockDdahData={mockDdahData} />
              <DdahForm {...this.props} mockDdahData={mockDdahData} />
          </main>
        );
    }
}

export { DdahEditor };
