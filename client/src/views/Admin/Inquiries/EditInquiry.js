import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import PhoneNumber from 'react-number-format'
import Spinner from 'views/Spinner'
import {
  edit,
  cancelSave,
  notFound,
  getInquiryById
} from "actions/admin/inquiry";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormFeedback,
  Input,
  Label,
  Row
} from "reactstrap";
import Errors from "views/Notifications/Errors";
import { REMOVE_ERRORS } from "actions/types";

const EditInquiry = ({
  getInquiryById,
  edit,
  cancelSave,
  notFound,
  inquiry: { currentInquiry, loading },
  history,
  match,
  errorList
}) => {
  const [formData, setFormData] = useState({
    Name: "",
    phone: "",
    email: "",
    message: "",
    status: ""
  });
  useMemo(() => {
    getInquiryById(match.params.inquiry_id,history).then(res => {
      if(res===undefined)
      notFound(history);
      else
      setFormData({
        Name: loading || !res.name ? "" : res.name,
        phone: loading || !res.phone ? "" : res.phone,
        email: loading || !res.email ? "" : res.email,
        message: loading || !res.message ? "" : res.message,
        status: loading || !res.status ? "" : res.status
      });
    });
  }, [loading, match.params.inquiry_id, getInquiryById]);

  const { Name, phone, email, message, status } = formData;

  const dispatch = useDispatch();

  const onChange = e =>{
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch({type:REMOVE_ERRORS});
  }

  const onSubmit = e => {
    e.preventDefault();
    edit(formData, history, match.params.inquiry_id);
  };
  const onClickHandel = e => {
    e.preventDefault();
    cancelSave(history);
  };
  return loading ? (
    <Spinner />
  ) : (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" sm="6">
          <Card>
            <Form className="form-horizontal" onSubmit={e => onSubmit(e)}>
              <CardHeader>
                <strong>Inquiry</strong> Form
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="name">
                    Name <span>*</span>
                  </Label>
                  <Input
                    required
                    type="text"
                    id="name"
                    name="name"
                    maxLength="50"
                    value={Name}
                    onChange={e => onChange(e)}
                    invalid={errorList.name ? true : false}
                  />
                  <Errors current_key="name" key="name" />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">
                    Email <span>*</span>
                  </Label>
                  <Input
                    required
                    type="email"
                    id="email"
                    name="email"
                    maxLength="50"
                    value={email}
                    onChange={e => onChange(e)}
                    invalid={errorList.email ? true : false}
                  />
                  <Errors current_key="email" key="email" />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="phone">
                    Phone <span>*</span>
                  </Label>
                  <PhoneNumber
                    style={{width:450,height:30,borderColor:"Black",borderRadius: 4}} 
                    type='tel'
                    pattern='[0-9]{10}'
                    maxLength='10'
                    id='phone'
                    name='phone'
                    value={phone}
                    required
                    onChange={e => onChange(e)}
                    invalid={errorList.phone ? true : false}
                  />
                  <Errors current_key="phone" key="phone" />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="message">
                    Message <span>*</span>
                  </Label>
                  <Input
                    required
                    type="textarea"
                    id="message"
                    name="message"
                    maxLength="500"
                    value={message}
                    onChange={e => onChange(e)}
                    invalid={errorList.message ? true : false}
                  />
                  <Errors current_key="message" key="message" />
                  {/* <FormFeedback>Houston, we have a problem...</FormFeedback> */}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="status">Select</Label>
                  <Input
                    type="select"
                    name="status"
                    id="status"
                    value={status}
                    onChange={e => onChange(e)}
                  >
                    <option value="0">Closed</option>
                    <option value="1">Open</option>
                  </Input>
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
    </div>
  );
};

EditInquiry.propTypes = {
  getInquiryById: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  cancelSave: PropTypes.func.isRequired,
  notFound: PropTypes.func.isRequired,
  inquiry: PropTypes.object.isRequired,
  errorList: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  inquiry: state.inquiry,
  errorList: state.errors
});

export default connect(mapStateToProps, { getInquiryById, edit, cancelSave, notFound })(
  EditInquiry
);
