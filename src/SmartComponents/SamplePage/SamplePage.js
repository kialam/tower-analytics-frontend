/* eslint-disable */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./sample-page.scss";
import BarChart from "./BarChart.js";
import LineChart from "./LineChart.js";
import { forHumans } from "./util.js";

import {
  Section,
  Main,
  PageHeader,
  PageHeaderTitle
} from "@red-hat-insights/insights-frontend-components";
import { CircleIcon, WarningTriangleIcon } from "@patternfly/react-icons";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DataList,
  DataListItem,
  DataListCell,
  FormSelect,
  FormSelectOption,
  Switch,
  Modal
} from "@patternfly/react-core";
import { Table, TableHeader, TableBody } from "@patternfly/react-table";

import SampleComponent from "../../PresentationalComponents/SampleComponent/sample-component";
// const PageHeader2 = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header'));
// const PageHeaderTitle2 = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header-title'));

class ModalTrigger extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onLinkClick(this.props.value);
  }

  render() {
    return (
      <span
        style={{ color: "#007bba", cursor: "pointer" }}
        onClick={this.handleClick}
      >
        {this.props.value}
      </span>
    );
  }
}

class TemplateModal extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.onModalClose(null);
  }

  render() {
    const successfulIcon = (
      <CircleIcon
        size="sm"
        key="5"
        style={{ color: "#52af51", marginRight: "5px" }}
      />
    );
    const failedIcon = (
      <CircleIcon
        size="sm"
        key="5"
        style={{ color: "#d9534f", marginRight: "5px" }}
      />
    );

    var rows = [];
    var i = 0;
    var datum = null;
    var average_time = 0;
    var total_time = 0;
    if (this.props.modalData !== undefined && this.props.modalData !== null) {
      for (i = 0; i < this.props.modalData.length; i++) {
        datum = this.props.modalData[i];
        rows.push([
          [
            datum.status === "successful" ? successfulIcon : failedIcon,
            "" + datum.id + " - " + datum.name
          ],
          datum.label,
          datum.started,
          forHumans(Math.floor(datum.elapsed))
        ]);
      }
      if (this.props.modalData.length > 0) {
        total_time = Math.floor(
          this.props.modalData
            .map(datum => +datum.elapsed)
            .reduce((total, amount) => total + amount)
        );
        average_time = Math.floor(total_time / this.props.modalData.length);
      }
    }
    return (
      <Modal
        className="templateModal"
        title={this.props.modalTemplate}
        isOpen={this.props.isModalOpen}
        onClose={this.handleClose}
        actions={[
          <h4>
            Total Time {forHumans(total_time)} | Avg Time{" "}
            {forHumans(average_time)}
          </h4>,
          <Button key="cancel" variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
        ]}
      >
        <Card>
          <Table
            caption={[""]}
            cells={["Id/Name", "Cluster", "Start Time", "Total Time"]}
            rows={rows}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </Card>
      </Modal>
    );
  }
}
/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SamplePage extends Component {
  async componentDidMount() {
    await this.init();
  }

  async init() {
    const modulesUrl = this.getApiUrl("modules");
    const modulesResponse = await fetch(modulesUrl);
    const modulesData = await modulesResponse.json();
    const templateUrl = this.getApiUrl("templates");
    const templateResponse = await fetch(templateUrl);
    const templatesData = await templateResponse.json();
    const notificationsUrl = this.getApiUrl("notifications");
    const notificationsResponse = await fetch(notificationsUrl);
    let notificationsData = await notificationsResponse.json();
    const clustersUrl = this.getApiUrl("clusters");
    const clustersResponse = await fetch(clustersUrl);
    const clustersData = await clustersResponse.json();
    this.setState({ modules: modulesData });
    this.setState({ templates: templatesData });
    this.setState({ clusters: clustersData });
    var rightOptions = this.state.rightOptions;
    var i = 0;
    for (i = 0; i < clustersData.length; i++) {
      rightOptions.push({
        value: clustersData[i].system_id,
        label: clustersData[i].label
      });
    }
    this.setState({ rightOptions: rightOptions });

    const mockNotificationsAddendum = [
      {
        date: "2019-04-30T15:06:40.995",
        label: "message",
        message: "Regular message number 1",
        notification_id: 2,
        notification_severity_id: 2,
        notification_type_id: 2,
        tenant_id: 4
      },
      {
        date: "2019-04-30T15:07:40.995",
        label: "message",
        message: "Regular message number 2",
        notification_id: 3,
        notification_severity_id: 2,
        notification_type_id: 2,
        tenant_id: 5
      }
    ];

    notificationsData = notificationsData.concat(mockNotificationsAddendum);
    this.setState({ notifications: notificationsData });
  }

  getApiUrl(name) {
    return (
      this.protocol + "://" + this.server + "/tower_analytics/" + name + "/"
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      isLeftOpen: false,
      isRightOpen: false,
      isModalOpen: false,
      leftValue: "past week",
      rightValue: "all clusters",
      notificationValue: "all",
      isAccessible: false,
      modules: [],
      templates: [],
      clusters: [],
      notifications: [],
      modalTemplate: null,
      modalData: [],
      rightOptions: [
        { value: "please choose", label: "Select Hosts", disabled: true },
        { value: "all clusters", label: "All Clusters", disabled: false }
      ]
    };
    this.server = "nginx-tower-analytics2.5a9f.insights-dev.openshiftapps.com";
    //this.server = 'ci.foo.redhat.com:1337';
    this.protocol = "https";

    this.onRightToggle = this.onRightToggle.bind(this);
    this.onRightSelect = this.onRightSelect.bind(this);
    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.getApiUrl = this.getApiUrl.bind(this);
    this.init = this.init.bind(this);

    this.leftChange = (value, event) => {
      this.setState({ leftValue: value });
    };
    this.rightChange = (value, event) => {
      this.setState({ rightValue: value });
    };
    this.notificationChange = (value, event) => {
      this.setState({ notificationValue: value });
    };
    this.handleToggle = isAccessible => {
      this.setState({ isAccessible });
    };
    this.leftOptions = [
      { value: "please choose", label: "Select Date Range", disabled: true },
      { value: "past week", label: "Past Week", disabled: false },
      { value: "past 2 weeks", label: "Past 2 Weeks", disabled: false },
      { value: "past month", label: "Past Month", disabled: false }
    ];
    this.notificationOptions = [
      {
        value: "please choose",
        label: "Select Notification Type",
        disabled: true
      },
      { value: "error", label: "View Danger", disabled: false },
      { value: "all", label: "View All", disabled: false }
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

  async handleModalToggle(modalTemplate) {
    var data = null;
    if (modalTemplate !== null) {
      const url = this.getApiUrl("template_jobs") + modalTemplate + "/";
      const response = await fetch(url);
      data = await response.json();
    }
    this.setState({
      modalTemplate: modalTemplate,
      isModalOpen: !this.state.isModalOpen,
      modalData: data
    });
  }

  render() {
    const {
      isModalOpen,
      modalTemplate,
      modalData,
      rightValue,
      notificationValue,
      notifications
    } = this.state;

    const dataListCellStyle = {
      display: "flex",
      justifyContent: "flex-end"
    };

    var i = 0;
    var modules = [];
    var module_name = null;
    for (i = 0; i < this.state.modules.length; i++) {
      if (this.state.modules[i].count > 0) {
        var module_name = this.state.modules[i].module;
        if (module_name[0] === '"') {
          module_name = module_name.slice(1);
        }
        if (module_name[module_name.length - 1] === '"') {
          module_name = module_name.slice(0, -1);
        }

        modules.push(
          <DataListItem aria-labelledby="simple-item1">
            <DataListCell>
              <span>{module_name}</span>
            </DataListCell>
            <DataListCell style={dataListCellStyle}>
              <Badge isRead>{this.state.modules[i].count}</Badge>
            </DataListCell>
          </DataListItem>
        );
      }
    }

    var templates = [];
    var template_name = null;
    for (i = 0; i < this.state.templates.length; i++) {
      template_name = this.state.templates[i].template;
      templates.push(
        <DataListItem aria-labelledby="simple-item1">
          <DataListCell>
            <ModalTrigger
              value={template_name}
              onLinkClick={this.handleModalToggle}
            />
          </DataListCell>
          <DataListCell style={dataListCellStyle}>
            <Badge isRead>Playbook Run</Badge>
          </DataListCell>
        </DataListItem>
      );
    }

    var notification_colors = { error: "#db524b", warning: "#f0ad37", "": "" };
    const notificationTemplate = notifications.map(notification => (
      <DataListItem aria-labelledby="simple-item1">
        <DataListCell>
          <span>
            {notification.label == "error" ||
            notification.label == "warning" ? (
              <WarningTriangleIcon
                style={{
                  color: notification_colors[notification.label],
                  marginRight: "5px"
                }}
              />
            ) : null}
            {notification.message}
          </span>
        </DataListCell>
      </DataListItem>
    ));
    const errorNotifications = notifications.filter(
      notification => notification.label === "error"
    );
    const errorNotificationTemplate = errorNotifications.map(notification => (
      <DataListItem aria-labelledby="simple-item1">
        <DataListCell>
          <span>
            <WarningTriangleIcon
              style={{
                color: notification_colors[notification.label],
                marginRight: "5px"
              }}
            />
            {notification.message}
          </span>
        </DataListCell>
      </DataListItem>
    ));

    return (
      <React.Fragment>
        <PageHeader>
          <PageHeaderTitle title="Tower Analytics" />
        </PageHeader>
        <Main>
          <Card>
            <CardHeader
              style={{
                borderBottom: "2px solid #ebebeb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <h1>Job Status</h1>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <FormSelect
                  value={this.state.leftValue}
                  onChange={this.leftChange}
                  aria-label="Select Date Range"
                  style={{ margin: "2px 10px" }}
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
                  style={{ margin: "2px 10px" }}
                >
                  {this.state.rightOptions.map((option, index) => (
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
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    padding: "5px",
                    marginLeft: "5px"
                  }}
                >
                  <label style={{ marginRight: "10px" }}>Accessibility</label>
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
              {rightValue === "all clusters" && (
                <BarChart
                  width={700}
                  height={350}
                  id="d3-chart-root"
                  value={this.state.leftValue}
                  isAccessible={this.state.isAccessible}
                  getApiUrl={this.getApiUrl}
                />
              )}
              {rightValue !== "all clusters" && (
                <LineChart
                  width={700}
                  height={350}
                  id="d3-chart-root"
                  value={this.state.leftValue}
                  cluster={this.state.rightValue}
                  isAccessible={this.state.isAccessible}
                  getApiUrl={this.getApiUrl}
                />
              )}
            </CardBody>
          </Card>
          <div
            className="dataCard"
            style={{ display: "flex", marginTop: "20px" }}
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
              {templates}
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
              {modules}
            </DataList>
            <DataList
              style={{ flex: "1" }}
              aria-label="Simple data list example"
            >
              <DataListItem aria-labelledby="simple-item1">
                <DataListCell>
                  <h3>Notifications</h3>
                </DataListCell>
                <DataListCell style={dataListCellStyle}>
                  <FormSelect
                    value={this.state.notificationValue}
                    onChange={this.notificationChange}
                    aria-label="Select Notification Type"
                    style={{ margin: "2px 10px" }}
                  >
                    {this.notificationOptions.map((option, index) => (
                      <FormSelectOption
                        isDisabled={option.disabled}
                        key={index}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </FormSelect>
                </DataListCell>
              </DataListItem>
              {/* NOTIFICATIONS */}
              {notificationValue === "all" && notificationTemplate}
              {notificationValue === "error" && errorNotificationTemplate}
            </DataList>
          </div>
          <TemplateModal
            modalTemplate={modalTemplate}
            isModalOpen={isModalOpen}
            onModalClose={this.handleModalToggle}
            getApiUrl={this.getApiUrl}
            modalData={modalData}
          />
        </Main>
      </React.Fragment>
    );
  }
}

export default withRouter(SamplePage);
