import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import Spinner from "views/Spinner";
import randomstring from "randomstring";
import { add, cancelSave, initialLoading } from "actions/admin/coupon";
import Errors from "views/Notifications/Errors";
import { COUPON_DEFAULT_LENGTH } from "constants/index";
// import Moment from "react-moment"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import { REMOVE_ERRORS } from "actions/types";

const AddCoupon = ({
  add,
  cancelSave,
  history,
  errorList,
  initialLoading,
  loading
}) => {
  const [randomCouponCode] = useState(
    randomstring.generate(COUPON_DEFAULT_LENGTH)
  );

  const [formData, setFormData] = useState({
    coupon_code: randomCouponCode,
    user_specific: "",
    consumer_type: "",
    discount: "",
    min_purchase: 0,
    max_discount: 0,
    usage_limit: "",
    expiry_date: "",
    comment_text: ""
  });

  const {
    coupon_code,
    user_specific,
    consumer_type,
    discount,
    min_purchase,
    max_discount,
    usage_limit,
    expiry_date,
    comment_text
  } = formData;

  const dispatch = useDispatch();

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch({ type: REMOVE_ERRORS });
  };

  const onSubmit = e => {
    e.preventDefault();
    add(formData, history);
  };

  const onClickHandel = e => {
    e.preventDefault();
    cancelSave(history);
  };

  return (
    <div className="animated fadeIn" onLoad={() => initialLoading()}>
      {loading ? (
        <Spinner />
      ) : (
        <Row>
          <Col xs="12" sm="6">
            <Card>
              <Form className="form-horizontal" onSubmit={e => onSubmit(e)}>
                <CardBody>
                  <FormGroup>
                    <Label htmlFor="coupon_code">
                      Coupon code <span>*</span>
                    </Label>
                    <Input
                      type="text"
                      id="coupon_code"
                      name="coupon_code"
                      maxLength={50}
                      value={coupon_code}
                      required
                      onChange={e => onChange(e)}
                      invalid={errorList.coupon_code ? true : false}
                    />
                    <Errors current_key="coupon_code" key="coupon_code" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="consumer_type">
                      Consumer type <span>*</span>
                    </Label>
                    <Input
                      type="select"
                      id="consumer_type"
                      name="consumer_type"
                      value={consumer_type}
                      required
                      onChange={e => onChange(e)}
                      invalid={errorList.consumer_type ? true : false}
                    >
                      <option value="">{"Select"}</option>
                      <option value={1}>{"All"}</option>
                      <option value={2}>{"Dealer"}</option>
                      <option value={3}>{"Customer"}</option>
                    </Input>
                    <Errors current_key="consumer_type" key="consumer_type" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="user_specific">User specific</Label>
                    <Input
                      type="text"
                      id="user_specific"
                      name="user_specific"
                      value={user_specific}
                      onChange={e => onChange(e)}
                      invalid={errorList.user_specific ? true : false}
                    />
                    <Errors current_key="user_specific" key="user_specific" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="discount">
                      Discount (in %) <span>*</span>{" "}
                    </Label>
                    <Input
                      type="number"
                      id="discount"
                      name="discount"
                      min={0}
                      required
                      value={discount}
                      onChange={e => onChange(e)}
                      invalid={errorList.discount ? true : false}
                    />
                    <Errors current_key="discount" key="discount" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="min_purchase">Minimum purchase</Label>
                    <Input
                      type="number"
                      id="min_purchase"
                      name="min_purchase"
                      min={0}
                      value={min_purchase}
                      onChange={e => onChange(e)}
                      invalid={errorList.min_purchase ? true : false}
                    />
                    <Errors current_key="min_purchase" key="min_purchase" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="max_discount">Maximum discount</Label>
                    <Input
                      type="number"
                      id="max_discount"
                      name="max_discount"
                      min={0}
                      value={max_discount}
                      onChange={e => onChange(e)}
                      invalid={errorList.max_discount ? true : false}
                    />
                    <Errors current_key="max_discount" key="max_discount" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="usage_limit">
                      Usage limit <span>*</span>
                    </Label>
                    <Input
                      type="number"
                      id="usage_limit"
                      name="usage_limit"
                      min={0}
                      value={usage_limit}
                      required
                      onChange={e => onChange(e)}
                      invalid={errorList.usage_limit ? true : false}
                    />
                    <Errors current_key="usage_limit" key="usage_limit" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="expiry_date">Expiry date</Label>
                    <Input
                      type="date"
                      id="expiry_date"
                      name="expiry_date"
                      value={expiry_date}
                      onChange={e => onChange(e)}
                      invalid={errorList.expiry_date ? true : false}
                    />
                    <Errors current_key="expiry_date" key="expiry_date" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="comment_text">
                      Comment <span>*</span>
                    </Label>
                    <Input
                      type="textarea"
                      id="comment_text"
                      name="comment_text"
                      required
                      value={comment_text}
                      onChange={e => onChange(e)}
                      invalid={errorList.comment_text ? true : false}
                    />
                    <Errors current_key="comment_text" key="comment_text" />
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button type="submit" size="sm" color="primary">
                    <i className="fa fa-dot-circle-o"></i> Submit
                  </Button>
                  <a onClick={onClickHandel} href="#!">
                    <Button type="reset" size="sm" color="danger">
                      <i className="fa fa-ban"></i> Cancel
                    </Button>
                  </a>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

AddCoupon.propTypes = {
  add: PropTypes.func.isRequired,
  cancelSave: PropTypes.func.isRequired,
  initialLoading: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errorList: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  errorList: state.coupon.errors,
  loading: state.coupon.loading
});

export default connect(mapStateToProps, { add, cancelSave, initialLoading })(
  AddCoupon
);
