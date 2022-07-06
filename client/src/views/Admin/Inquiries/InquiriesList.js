import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getInquiriesList,
  deleteInquiry,
  changeStatus
} from "actions/admin/inquiry";
import * as Constants from "constants/index";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Button, Card, CardBody, Col, Row, Input } from "reactstrap";
import Spinner from "views/Spinner";
const { SearchBar } = Search;

const actions = (
  <Link to="/admin/inquiries/add" className="addNewElementClass">
    <Button color="primary" size="sm">
      <i className="fa fa-plus"></i> Add Inquiry
    </Button>
  </Link>
);

const InquiriesList = ({
  getInquiriesList,
  deleteInquiry,
  changeStatus,
  history,
  inquiryList: { data, count },
  sortingParams,
  loading
}) => {
  let inquiryParams = {
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
      dataField: "name",
      text: "Name",
      sort: true,
      headerStyle: {
        backgroundColor: Constants.TABLE_BORDER_COLOR
      }
      // headerSortingStyle
    },
    {
      dataField: "email",
      text: "Email",
      headerStyle: {
        backgroundColor: Constants.TABLE_BORDER_COLOR
      }
    },
    {
      dataField: "phone",
      text: "Phone",
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
              <option value="0">Closed</option>
              <option value="1">Open</option>
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
          <Link to={`/admin/inquiries/${row._id}`}>
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
                  `Are you sure to delete ${row.name} inquiry?`
                )
              ) {
                deleteInquiry(row._id, history);
                getInquiriesList(inquiryParams);
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
    inquiryParams = {
      limit: sortingParams.limit,
      page: sortingParams.page,
      orderBy: sortingParams.orderBy,
      ascending: sortingParams.ascending,
      query: sortingParams.query
    };
    getInquiriesList(inquiryParams);
  }, [getInquiriesList]);

  const defaultSorted = [
    {
      //dataField: "created_at",
      dataField: "status",
      order: "desc"
    }
  ];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const options = {
    page: inquiryParams.page,
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
    inquiryParams.page = type === "search" ? 1 : page;
    inquiryParams.limit = sizePerPage;
    inquiryParams.orderBy = sortField;
    inquiryParams.ascending = sortOrder;
    inquiryParams.query = searchText;
    getInquiriesList(inquiryParams);
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
                keyField="email"
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
                    keyField="email"
                    data={data}
                    columns={columns}
                    pagination={paginationFactory(options)}
                    onTableChange={handleTableChange}
                    defaultSorted={defaultSorted}
                    noDataIndication="No Inquiry"
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

InquiriesList.propTypes = {
  getInquiriesList: PropTypes.func.isRequired,
  deleteInquiry: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
  inquiryList: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  sortingParams: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  inquiryList: state.inquiry.inquiriesList,
  loading: state.inquiry.loading,
  sortingParams: state.inquiry.sortingParams
});

export default connect(mapStateToProps, {
  getInquiriesList,
  deleteInquiry,
  changeStatus
})(withRouter(InquiriesList));
