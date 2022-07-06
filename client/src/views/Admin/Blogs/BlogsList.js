import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import { getBlogList, deleteBlog, changeStatus } from "actions/admin/blog";
import * as Constants from "constants/index";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Button, Card, CardBody, Col, Row, Input } from "reactstrap";
import Spinner from "views/Spinner";
const { SearchBar } = Search;

const actions = (
  <Link to="/admin/blogs/create" className="addNewElementClass">
    <Button color="primary" size="sm">
      <i className="fa fa-plus"></i> Create Blog
    </Button>
  </Link>
);

const BlogList = ({
  getBlogList,
  deleteBlog,
  changeStatus,
  history,
  blogList: { data, count },
  sortingParams,
  loading
}) => {
  let blogParams = {
    limit: sortingParams.limit,
    page: sortingParams.page,
    orderBy: sortingParams.orderBy,
    ascending: sortingParams.ascending,
    query: sortingParams.query
  };

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
      dataField: "blog_title",
      text: "Blog Title",
      sort: true,
      headerStyle: {
        backgroundColor: Constants.TABLE_BORDER_COLOR
      }
      //headerSortingStyle
    },
    {
      dataField: "blog_header",
      text: "Blog Header",
      sort: true,
      headerStyle: {
        backgroundColor: Constants.TABLE_BORDER_COLOR
      }
      //headerSortingStyle
    },
    {
      dataField: "created_at",
      text: "Created At",
      sort: true,
      formatter: (cellContent, row) => (
        <Moment format={process.env.REACT_APP_DISPLAY_DATE_FORMATE}>
          {row.created_at}
        </Moment>
      ),
      headerStyle: {
        backgroundColor: Constants.TABLE_BORDER_COLOR
      }
      //headerSortingStyle
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
              <option value="0">Draft</option>
              <option value="1">Publish</option>
            </Input>
          </div>
        );
      }
      // headerSortingStyle
    },
    {
      dataField: "_id",
      text: "Actions",
      formatter: (cellContent, row) => (
        <div>
          <Link to={`/admin/blogs/${row._id}`}>
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
                window.confirm(`Are you sure to delete ${row.blog_title} blog?`)
              ) {
                deleteBlog(row._id);
                getBlogList(blogParams);
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
    blogParams = {
      limit: sortingParams.limit,
      page: sortingParams.page,
      orderBy: sortingParams.orderBy,
      ascending: sortingParams.ascending,
      query: sortingParams.query
    };
    getBlogList(blogParams);
  }, [getBlogList]);

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
    page: blogParams.page,
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
    blogParams.page = type === "search" ? 1 : page;
    blogParams.limit = sizePerPage;
    blogParams.orderBy = sortField;
    blogParams.ascending = sortOrder;
    blogParams.query = searchText;
    getBlogList(blogParams);
  };

  return loading ? (
    (<Spinner />)
  ) : (
    <div className="animated fadeIn userTableList">
      <Row>
        <Col>
          <Card>
            <CardBody>
              {actions}
              <ToolkitProvider
                keyField="blog_title"
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
                    keyField="blog_title"
                    data={data}
                    columns={columns}
                    pagination={paginationFactory(options)}
                    onTableChange={handleTableChange}
                    defaultSorted={defaultSorted}
                    noDataIndication="No Blog found."
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

BlogList.propTypes = {
  getBlogList: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
  blogList: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  sortingParams: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  blogList: state.blog.blogList,
  loading: state.blog.loading,
  sortingParams: state.blog.sortingParams
});

export default connect(mapStateToProps, {
  getBlogList,
  deleteBlog,
  changeStatus
})(withRouter(BlogList));
