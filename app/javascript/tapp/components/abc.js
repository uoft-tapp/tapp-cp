import React from 'react';
import { Grid, Row, Col, Well } from 'react-bootstrap';
import { CourseMenu } from './courseMenu.js';
import { CoursePanel } from './coursePanel.js';

class ABC extends React.Component {
    // determine the appropriate styling to produce the specified layout
    mapLayoutToStyling(layout) {
        let panel1style, panel2style, panel3style, panel4style;

        switch (layout) {
            case 0:
                return 0;

            case 1:
                panel1style = { height: '100%', width: '100%' };
                break;

            case 2:
                // side-by-side (default)
                panel1style = panel2style = { height: '100%', width: '50%' };
                break;

            case 2.1:
                // stacked
                panel1style = panel2style = { height: '50%', width: '100%' };
                break;

            case 3:
                // side-by-side (default)
                panel1style = panel2style = panel3style = {
                    height: '100%',
                    width: 'calc(100%/3)',
                };
                break;

            case 3.1:
                // 1 panel left, 2 stacked panels right
                panel1style = { height: '100%', width: '50%' };
                panel2style = panel3style = { height: '50%', width: '50%' };
                break;

            case 3.2:
                // 2 stacked panels left, 1 panel right
                panel1style = panel3style = { height: '50%', width: '50%' };
                panel2style = { height: '100%', width: '50%', float: 'right' };
                break;

            case 3.3:
                // 1 panel on top, 2 side-by-side panels on bottom
                panel1style = { height: '50%', width: '100%' };
                panel2style = panel3style = { height: '50%', width: '50%' };
                break;

            case 3.4:
                // 2 side-by-side panels on top, 1 panel on bottom
                panel1style = panel2style = { height: '50%', width: '50%' };
                panel3style = { height: '50%', width: '100%' };
                break;

            case 3.5:
                // stacked
                panel1style = panel2style = panel3style = {
                    height: 'calc(100%/3)',
                    width: '100%',
                };
                break;

            case 4:
                panel1style = panel2style = panel3style = panel4style = {
                    height: '50%',
                    width: '50%',
                };
                break;
        }

        return [panel1style, panel2style, panel3style, panel4style];
    }

    generateDefaultLayout() {
        // check whether the current layout contains the correct number of courses
        // if not, generate a default layout for the currently selected courses
        let selected = this.props.getSelectedCourses();
        let currLayout = this.props.getCoursePanelLayout();

        if (Math.floor(currLayout) != selected.length) {
            this.props.setCoursePanelLayout(selected.length);
        }
    }

    selectThisTab() {
        if (this.props.getSelectedNavTab() != this.props.navKey) {
            this.props.selectNavTab(this.props.navKey);
        }
    }

    componentWillMount() {
        this.selectThisTab();

        // remove selected courses that are not part of the selected round if necessary
        this.props.filterSelectedCourses();

        // generate a default layout for the selected courses if necessary
        this.generateDefaultLayout();

        // check whether the appropriate panel fields exist for the selected courses and update if necessary
        this.props.updateCoursePanelFields();
    }

    componentWillUpdate() {
        this.selectThisTab();

        // remove selected courses that are not part of the selected round if necessary
        this.props.filterSelectedCourses();

        // generate a default layout for the selected courses if necessary
        this.generateDefaultLayout();

        // check whether the appropriate panel fields exist for the selected courses and update if necessary
        this.props.updateCoursePanelFields();
    }

    render() {
        let nullCheck = this.props.anyNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = this.props.anyFetching();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        let selected = this.props.getSelectedCourses();
        let layout = this.props.getCoursePanelLayout();
        let styles = this.mapLayoutToStyling(layout);

        return (
            <Grid fluid id="abc-grid" style={cursorStyle}>
                <CourseMenu {...this.props} />
                <div id="course-panel-layout">
                    {styles == 0 &&
                        <Well id="no-courses-well">
                            <p>Nothing here yet!</p>
                            <p>Select one or more courses to start.</p>
                        </Well>}
                    {selected[0] &&
                        <CoursePanel
                            key="course-panel-1"
                            panelStyle={styles[0]}
                            course={selected[0]}
                            {...this.props}
                        />}
                    {selected[1] &&
                        <CoursePanel
                            key="course-panel-2"
                            panelStyle={styles[1]}
                            course={selected[1]}
                            {...this.props}
                        />}
                    {selected[2] &&
                        <CoursePanel
                            key="course-panel-3"
                            panelStyle={styles[2]}
                            course={selected[2]}
                            {...this.props}
                        />}
                    {selected[3] &&
                        <CoursePanel
                            key="course-panel-4"
                            panelStyle={styles[3]}
                            course={selected[3]}
                            {...this.props}
                        />}
                </div>
            </Grid>
        );
    }
}

export { ABC };
