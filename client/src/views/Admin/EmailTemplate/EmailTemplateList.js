import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import {
  getEmailTemplateList,
  deleteEmailTemplate,
  changeStatus
} from "actions/admin/emailTemplate";
import * as Constants from "constants/index";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Button, Card, CardBody, Col, Row, Input } from "reactstrap";
import Spinner from "views/Spinner";
const { SearchBar } = Search;

const actions = (
  <Link to="/admin/email-templates/create" className="addNewElementClass">
    <Button color="primary" size="sm">
      <i className="fa fa-plus"></i> Create Email Template
    </Button>
  </Link>
);

const EmailTemplateList = ({
  getEmailTemplateList,
  deleteEmailTemplate,
  history,
  emailTemplateList: { data, count },
  sortingParams,
  changeStatus,
  loading
}) => {
  let emailTemplateParams = {
    limit: sortingParams.limit,
    page: sortingParams.page,
    orderBy: sortingParams.orderBy,
    ascending: sortingParams.ascending,
    query: sortingParams.query
  };

  // const headerSortingStyle = { backgroundColor: '#c8e6c9' };
  const sizePerPageOptionRenderer = ({ text, page, onSizePerPageChange }) => (
    <li key={text} role="presentation" className="dropdown-item">
      <a
        href="#"
        tabIndex="-1"
        role="menuitem"
        data-page={page}
        onMouseDown={e => {
          e.preventDefault();
          onSizePerPageChange(page);
        }}
        className="sizePerPageaTag"
      >
        {text}
      </a>
    </li>
  );
  const columns = [
    {
      dataField: "title",
      text: "Title",
      sort: true,
      headerStyle: {
        backgroundColor: Constants.TABLE_BORDER_COLOR
      }
      // headerSortingStyle
    },
    {
      dataField: "created_at",
      text: "Created At",
      sort: true,
      // headerSortingStyle,
      formatter: (cellContent, row) => (
        <Moment format={process.env.REACT_APP_DISPLAY_DATE_FORMATE}>
          {row.created_at}
        </Moment>
      ),
      headerStyle: {
        backgroundColor: Constants.TABLE_BORDER_COLOR
      }
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      headerStyle: {
        backgroundColor: Constants.TABLE_BORDER_COLOR
      },
      // formatter: (cell, row) => {
      //   return (
      //     <div
      //       className="updateStatus"
      //       onClick={(e, a) => {
      //         changeStatus(row._id, cell == 0 ? 1 : 0);
      //       }}
      //     >
      //       {cell == 0 ? (
      //         <i
      //           className="fa fa-2x fa-thumbs-down"
      //           title="Click to Activate"
      //         ></i>
      //       ) : (
      //         <i
      //           className="fa fa-2x fa-thumbs-up"
      //           title="Click to Deactivate"
      //         ></i>
      //       )}
      //     </div>
      //   );
      // }
      // headerSortingStyle
      formatter: (cell, row) => {
        return (
          <div>
            <Input
              type="select"
              name="status"
              id={row._id}
              defaultValue={cell}
              onChange={(e, a) => {
                changeStatus(row._id, e.target.value);
              }}
            >
              <option value="0">Inactive</option>
              <option value="1">Active</option>
            </Input>
          </div>
        );
      }
    },
    {
      dataField: "_id",
      text: "Actions",
      formatter: (cellContent, row) => (
        <div>
          <Link to={`/admin/email-templates/${row._id}`}>
            <Button type="button" size="sm" color="success">
              <i className="fa fa-pencil"></i>
            </Button>
          </Link>
          <Button
            type="button"
            size="sm"
            color="danger"
            onClick={e => {
              if (
                window.confirm(
                  `Are you sure to delete ${row.title} email template?`
                )
              ) {
                deleteEmailTemplate(row._id, history);
                getEmailTemplateList(emailTemplateParams);
              }
            }}
          >
            <i className="fa fa-trash"></i>
          </Button>
        </div>
      ),
      headerStyle: {
        backgroundColor: Constants.TABLE_BORDER_COLOR
      }
    }
  ];

  useEffect(() => {
    emailTemplateParams = {
      limit: sortingParams.limit,
      page: sortingParams.page,
      orderBy: sortingParams.orderBy,
      ascending: sortingParams.ascending,
      query: sortingParams.query
    };
    getEmailTemplateList(emailTemplateParams);
  }, [getEmailTemplateList]);

  const defaultSorted = [
    {
      dataField: "created_at",
      order: "desc"
    }
  ];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const options = {
    page: emailTemplateParams.page,
    pageStartIndex: 1,
    // alwaysShowAllBtns: true, // Always show next and previous button
    withFirstAndLast: false, // Hide the going to First and Last page button
    // hideSizePerPage: true, // Hide the sizePerPage dropdown always
    hidePageListOnlyOnePage: true, // Hide the pagination list when only one page

    showTotal: true,
    paginationTotalRenderer: customTotal,
    totalSize: count,
    sizePerPageOptionRenderer,
    sizePerPageList: [
      {
        text: Constants.DEFAULT_PAGE_SIZE,
        value: Constants.DEFAULT_PAGE_SIZE
      },
      {
        text: "10",
        value: 10
      },
      {
        text: "All",
        value: count
      }
    ] // A numeric array is also available. the purpose of above example is custom the text
  };

  const handleTableChange = (
    type,
    { page, sizePerPage, searchText, sortField, sortOrder }
  ) => {
    emailTemplateParams.page = type === "search" ? 1 : page;
    emailTemplateParams.limit = sizePerPage;
    emailTemplateParams.orderBy = sortField;
    emailTemplateParams.ascending = sortOrder;
    emailTemplateParams.query = searchText;
    getEmailTemplateList(emailTemplateParams);
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className="animated fadeIn userTableList">
      <Row>
        <Col>
          <Card>
            <CardBody>
              {actions}
              <ToolkitProvider
                keyField="title"
                data={data}
                columns={columns}
                search
              >
                {toolkitprops => [
                  <SearchBar {...toolkitprops.searchProps} />,
                  <BootstrapTable
                    {...toolkitprops.baseProps}
                    bootstrap4
                    remote={{ pagination: true, filter: true, sort: true }}
                    keyField="title"
                    data={data}
                    columns={columns}
                    pagination={paginationFactory(options)}
                    onTableChange={handleTableChange}
                    defaultSorted={defaultSorted}
                    noDataIndication="No Email Template."
                    bordered={false}
                    hover
                  />
                ]}
              </ToolkitProvider>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

EmailTemplateList.propTypes = {
  getEmailTemplateList: PropTypes.func.isRequired,
  deleteEmailTemplate: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
  emailTemplateList: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  sortingParams: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  emailTemplateList: state.emailTemplate.emailTemplateList,
  loading: state.emailTemplate.loading,
  sortingParams: state.emailTemplate.sortingParams
});

export default connect(mapStateToProps, {
  getEmailTemplateList,
  deleteEmailTemplate,
  changeStatus
})(withRouter(EmailTemplateList));
