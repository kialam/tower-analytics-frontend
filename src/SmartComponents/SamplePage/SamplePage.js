/* eslint-disable */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './sample-page.scss';
import BarChart from './BarChart.js';
import LineChart from './LineChart.js';

import {
  Section,
  Main,
  PageHeader,
  PageHeaderTitle
} from '@red-hat-insights/insights-frontend-components';
import { WarningTriangleIcon } from '@patternfly/react-icons';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DataList,
  DataListItem,
  DataListCell,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  FormSelect,
  FormSelectOption,
  Switch,
  Modal
} from '@patternfly/react-core';

import SampleComponent from '../../PresentationalComponents/SampleComponent/sample-component';
// const PageHeader2 = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header'));
// const PageHeaderTitle2 = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header-title'));

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SamplePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLeftOpen: false,
      isRightOpen: false,
      isModalOpen: false,
      leftValue: 'past week',
      rightValue: 'all clusters',
      isAccessible: false
    };

    this.onRightToggle = this.onRightToggle.bind(this);
    this.onRightSelect = this.onRightSelect.bind(this);
    this.handleModalToggle = this.handleModalToggle.bind(this);

    this.leftChange = (value, event) => {
      this.setState({ leftValue: value });
    };
    this.rightChange = (value, event) => {
      this.setState({ rightValue: value });
    };
    this.handleToggle = isAccessible => {
      this.setState({ isAccessible });
    };
    this.leftOptions = [
      { value: 'please choose', label: 'Select Date Range', disabled: true },
      { value: 'past week', label: 'Past Week', disabled: false },
      { value: 'past 2 weeks', label: 'Past 2 Weeks', disabled: false },
      { value: 'past month', label: 'Past Month', disabled: false }
    ];
    this.rightOptions = [
      { value: 'please choose', label: 'Select Hosts', disabled: true },
      { value: 'all clusters', label: 'All Clusters', disabled: false },
      { value: 'cluster 001', label: 'Cluster 001', disabled: false },
      { value: 'cluster 002', label: 'Cluster 002', disabled: false }
    ];
    this.dropdownItems = [
      <DropdownItem key="danger" component="button">
        View Danger
      </DropdownItem>,
      <DropdownItem key="warning" component="button">
        View Warning
      </DropdownItem>,
      <DropdownItem key="all" component="button">
        View All
      </DropdownItem>
    ];
  }

  onRightToggle(isRightOpen) {
    this.setState({
      isRightOpen
    });
  }

  onRightSelect(event) {
    this.setState({
      isRightOpen: !this.state.isRightOpen
    });
  }

  handleModalToggle() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  render() {
    const { isModalOpen, rightValue, isRightOpen } = this.state;

    const dataListCellStyle = {
      display: 'flex',
      justifyContent: 'flex-end'
    };

    return (
      <React.Fragment>
        <PageHeader>
          <PageHeaderTitle title="Tower Analytics" />
        </PageHeader>
        <Main>
          <Card>
            <CardHeader
              style={{
                borderBottom: '2px solid #ebebeb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h1>Job Status</h1>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <FormSelect
                  value={this.state.leftValue}
                  onChange={this.leftChange}
                  aria-label="Select Date Range"
                  style={{ margin: '2px 10px' }}
                >
                  {this.leftOptions.map((option, index) => (
                    <FormSelectOption
                      isDisabled={option.disabled}
                      key={index}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </FormSelect>
                <FormSelect
                  value={this.state.rightValue}
                  onChange={this.rightChange}
                  aria-label="Select Hosts"
                  style={{ margin: '2px 10px' }}
                >
                  {this.rightOptions.map((option, index) => (
                    <FormSelectOption
                      isDisabled={option.disabled}
                      key={index}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </FormSelect>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    padding: '5px',
                    marginLeft: '5px'
                  }}
                >
                  <label style={{ marginRight: '10px' }}>Accessibility</label>
                  <Switch
                    // label={'Accessibility'}
                    isChecked={this.state.isAccessible}
                    onChange={this.handleToggle}
                    aria-label="Accessibility enabled"
                  />
                </div>
                {/* // </div> */}
              </div>
            </CardHeader>
            <CardBody>
              {rightValue === 'all clusters' && (
                <BarChart
                  width={700}
                  height={350}
                  id="d3-chart-root"
                  value={this.state.leftValue}
                  isAccessible={this.state.isAccessible}
                />
              )}
              {(rightValue === 'cluster 001' ||
                rightValue === 'cluster 002') && (
                <LineChart
                  width={700}
                  height={350}
                  id="d3-chart-root"
                  value={this.state.leftValue}
                  isAccessible={this.state.isAccessible}
                />
              )}
            </CardBody>
          </Card>
          <div
            className="dataCard"
            style={{ display: 'flex', marginTop: '20px' }}
          >
            <DataList aria-label="Simple data list example">
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <h3>Top Templates</h3>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <h3>Type</h3>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <span
                    style={{ color: '#007bba', cursor: 'pointer' }}
                    onClick={this.handleModalToggle}
                  >
                    Template Name 1
                  </span>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <Badge isRead>Playbook Run</Badge>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item2">
                <DataListCell>
                  <span
                    style={{ color: '#007bba', cursor: 'pointer' }}
                    onClick={this.handleModalToggle}
                  >
                    Template Name 2
                  </span>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <Badge isRead>Workflow</Badge>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <span
                    style={{ color: '#007bba', cursor: 'pointer' }}
                    onClick={this.handleModalToggle}
                  >
                    Template Name 3
                  </span>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <Badge isRead>Playbook Run</Badge>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <span
                    style={{ color: '#007bba', cursor: 'pointer' }}
                    onClick={this.handleModalToggle}
                  >
                    Template Name 4
                  </span>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <Badge isRead>Playbook Run</Badge>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <span
                    style={{ color: '#007bba', cursor: 'pointer' }}
                    onClick={this.handleModalToggle}
                  >
                    Template Name 5
                  </span>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <Badge isRead>Playbook Run</Badge>
                </DataListCell>
              </DataListItem>
            </DataList>
            <DataList aria-label="Simple data list example">
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <h3>Top Modules</h3>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <h3>Usage</h3>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <span>Module Name 1</span>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <Badge isRead>5</Badge>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item2">
                <DataListCell>
                  <span>Module Name 2</span>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <Badge isRead>11</Badge>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <span>Module Name 3</span>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <Badge isRead>22</Badge>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <span>Module Name 4</span>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <Badge isRead>17</Badge>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <span>Module Name 5</span>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <Badge isRead>7</Badge>
                </DataListCell>
              </DataListItem>
            </DataList>
            <DataList
              style={{ flex: '1' }}
              aria-label="Simple data list example"
            >
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <h3>Notifications</h3>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <Dropdown
                    style={{
                      border: '1px solid #ededed',
                      borderBottomColor: '#282d33'
                    }}
                    onSelect={this.onRightSelect}
                    toggle={
                      <DropdownToggle onToggle={this.onRightToggle}>
                        View All
                      </DropdownToggle>
                    }
                    isOpen={isRightOpen}
                    dropdownItems={this.dropdownItems}
                  />
                </DataListCell>
              </DataListItem>

              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <span>
                    <WarningTriangleIcon
                      style={{ color: '#db524b', marginRight: '5px' }}
                    />
                    It's 3am, time to create some chaos{' '}
                  </span>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item2">
                <DataListCell>
                  <span>
                    <WarningTriangleIcon
                      style={{ color: '#f0ad37', marginRight: '5px' }}
                    />
                    why use post when this sofa is here.
                  </span>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <span>Kitty scratches couch bad kitty</span>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <span>lick the curtain just to be annoying or bite</span>
                </DataListCell>
              </DataListItem>
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <span>
                    off human's toes meow loudly just to annoy owners.
                  </span>
                </DataListCell>
              </DataListItem>
            </DataList>
          </div>
          <Modal
            title={'Template Name 1'}
            isOpen={isModalOpen}
            onClose={this.handleModalToggle}
            actions={[
              <Button
                key="cancel"
                variant="secondary"
                onClick={this.handleModalToggle}
              >
                Close
              </Button>
            ]}
          >
            {/* Table */}
            <Card>
              <h1>hi</h1>
            </Card>
          </Modal>
        </Main>
      </React.Fragment>
    );
  }
}

export default withRouter(SamplePage);
