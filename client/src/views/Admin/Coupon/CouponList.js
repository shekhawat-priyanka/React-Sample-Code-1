import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import { getCouponList, deleteCoupon, changeStatus } from "actions/admin/coupon";
import * as Constants from "constants/index";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Button, Card, CardBody, Col, Row, Input } from "reactstrap";
import Spinner from "views/Spinner";
const { SearchBar } = Search;

const actions = (
  <Link to="/admin/coupons/add" className="addNewElementClass">
    <Button color="primary" size="sm">
      <i className="fa fa-plus"></i> Add Coupon
    </Button>
  </Link>
);

const CouponList = ({
  getCouponList,
  deleteCoupon,
  changeStatus,
  history,
  couponList: { data, count },
  sortingParams,
  loading
}) => {
  let couponParams = {
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
      dataField: "coupon_code",
      text: "Coupon Code",
      sort: true,
      headerStyle: {
        backgroundColor: Constants.TABLE_BORDER_COLOR
      }
      //headerSortingStyle
    },
    {
      dataField: "consumer_type",
      text: "Consumer Type",
      sort: true,
      formatter: (cellContent, row) => (
      <p>{cellContent===1 ? "All" : cellContent=== 2 ? "Dealer" :" Customer" }</p>
      ),
      headerStyle: {
        backgroundColor: Constants.TABLE_BORDER_COLOR
      }
      //headerSortingStyle
    },
    {
      dataField: "discount",
      text: "Discount",
      sort: true,
      headerStyle: {
        backgroundColor: Constants.TABLE_BORDER_COLOR
      }
      //headerSortingStyle
    },
    {
      dataField: "expiry_date",
      text: "Expiry Date",
      sort: true,
      formatter: (cellContent, row) => ( 
          cellContent !== null ?
        <Moment format={process.env.REACT_APP_DISPLAY_DATE_FORMATE}>
          {row.expiry_date}
        </Moment> : <p> - </p>
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
              <option value="0">Inactive</option>
              <option value="1">Active</option>
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
          <Link to={`/admin/coupons/${row._id}`}>
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
                window.confirm(`Are you sure to delete ${row.coupon_code} coupon?`)
              ) {
                deleteCoupon(row._id);
                getCouponList(couponParams);
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
    couponParams = {
      limit: sortingParams.limit,
      page: sortingParams.page,
      orderBy: sortingParams.orderBy,
      ascending: sortingParams.ascending,
      query: sortingParams.query
    };
    getCouponList(couponParams);
  }, [getCouponList]);

  const defaultSorted = [
    {
    //   dataField: "created_at",
      dataField: "expiry_date",  
      order: "desc"
    }
  ];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const options = {
    page: couponParams.page,
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
    couponParams.page = type === "search" ? 1 : page;
    couponParams.limit = sizePerPage;
    couponParams.orderBy = sortField;
    couponParams.ascending = sortOrder;
    couponParams.query = searchText;
    getCouponList(couponParams);
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
                keyField="coupon_code"
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
                    keyField="coupon_code"
                    data={data}
                    columns={columns}
                    pagination={paginationFactory(options)}
                    onTableChange={handleTableChange}
                    defaultSorted={defaultSorted}
                    noDataIndication="No Coupon found."
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

CouponList.propTypes = {
  getCouponList: PropTypes.func.isRequired,
  deleteCoupon: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
  couponList: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  sortingParams: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  couponList: state.coupon.couponList,
  loading: state.coupon.loading,
  sortingParams: state.coupon.sortingParams
});

export default connect(mapStateToProps, {
  getCouponList,
  deleteCoupon,
  changeStatus
})(withRouter(CouponList));
