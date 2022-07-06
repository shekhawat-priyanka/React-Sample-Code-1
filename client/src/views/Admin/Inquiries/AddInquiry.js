import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import PhoneNumber from 'react-number-format'
import { add, cancelSave, initialLoading } from 'actions/admin/inquiry';
import Errors from 'views/Notifications/Errors';
import Spinner from 'views/Spinner';
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
} from 'reactstrap';
import { REMOVE_ERRORS } from 'actions/types';

const AddInquiry = ({ add, cancelSave, history, errorList, loading, initialLoading}) => {
  const [formData, setFormData] = useState({
    Name: '',
    phone: '',
    email: '',
    message: '',
  });

  const { Name, phone, email, message } = formData;

  const dispatch = useDispatch();
  const onChange = e =>{
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch({type:REMOVE_ERRORS});
  }

  const onSubmit = e => {
    e.preventDefault();
    add(formData, history);
  };

  const onClickHandel = e => {
    e.preventDefault();
    cancelSave(history);
  };
  return (
    <div className='animated fadeIn'onLoad = {() => initialLoading()}>
    {loading ? <Spinner/> : 
      <Row>
        <Col xs='12' sm='6'>
          <Card>
            <Form className='form-horizontal' onSubmit={e => onSubmit(e)}>
              <CardBody>
                <FormGroup>
                  <Label htmlFor='Name'>
                    Name <span>*</span>
                  </Label>
                  <Input
                    type='text'
                    id='Name'
                    name='Name'
                    maxLength="50"
                    value={Name}
                    required
                    onChange={e => onChange(e)}
                    invalid={errorList.Name ? true : false}
                  />
                  <Errors current_key='Name' key='Name' />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor='email'>
                    Email <span>*</span>
                  </Label>
                  <Input
                    type='email'
                    id='email'
                    name='email'
                    maxLength="50"
                    value={email}
                    required
                    onChange={e => onChange(e)}
                    invalid={errorList.email ? true : false}
                  />
                  <Errors current_key='email' key='email' />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor='phone'>Phone <span>*</span>
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
                  <Errors current_key='phone' key='phone' />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor='message'>Message <span>*</span>
                  </Label>
                  <Input
                    type='textarea'
                    id='message'
                    name='message'
                    maxLength="500"
                    value={message}
                    required
                    onChange={e => onChange(e)}
                    invalid={errorList.message ? true : false}
                  />
                  <Errors current_key='message' key='message' />
                </FormGroup>
              </CardBody>
              <CardFooter>
                <Button type='submit' size='sm' color='primary'>
                  <i className='fa fa-dot-circle-o'></i> Submit
                </Button>
                <a onClick={onClickHandel} href='#!'>
                  <Button type='reset' size='sm' color='danger'>
                    <i className='fa fa-ban'></i> Cancel
                  </Button>
                </a>
              </CardFooter>
            </Form>
          </Card>
        </Col>
      </Row>
     }</div>
  );
};

AddInquiry.propTypes = {
  add: PropTypes.func.isRequired,
  cancelSave: PropTypes.func.isRequired,
  inquiry: PropTypes.object.isRequired,
  errorList: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  initialLoading: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  inquiry: state.inquiry,
  errorList: state.errors,
  loading: state.inquiry.loading
});

export default connect(
  mapStateToProps,
  { add, cancelSave, initialLoading }
)(AddInquiry);
