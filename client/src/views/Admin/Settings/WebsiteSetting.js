import React, { useState , useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { edit, getScript, cancelSave } from 'actions/admin/setting';
import Errors from 'views/Notifications/Errors';
import Spinner from 'views/Spinner';
import SettingTabs from './SettingTabs'
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

const EditSettings = ({  
  getScript,
  edit,
  cancelSave,
  setting: { currentSetting, loading },
  history,
  errorList }) => {
  const [formData, setFormData] = useState({
    header_script: '',
    footer_script: '',
    copyright_text: ''
  });

  useMemo(() => {
    getScript(history).then(res => {
      setFormData({
        header_script: loading || (res===undefined) ? "" : res.value,
        footer_script: loading || (res===undefined) ? "" : res.footer_setting.value,
        copyright_text: loading || (res===undefined) ? "" : res.copyright_setting.value,
      });
    });
  }, [loading, getScript]);

  const { header_script, footer_script, copyright_text } = formData;

  const dispatch = useDispatch();

  const onChange = e =>{
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch({type:REMOVE_ERRORS});
  }

  const onSubmit = e => {
    e.preventDefault();
    edit(formData, history);
  };
  const onClickHandel = e => {
    e.preventDefault();
    cancelSave(history);
  };
  
  return loading ? (
    <Spinner />
  ) : (
    <div className='animated fadeIn'>
      <Row>
        <Col xs='12' sm='6'>
          <SettingTabs/>
          <Card>
            <Form className='form-horizontal' onSubmit={e => onSubmit(e)}>
              <CardBody><h4>Update website settings</h4><br></br>
                <FormGroup>
                  <Label htmlFor='header_script'>
                    Header Site Script 
                  </Label>
                  <Input
                    type='textarea'
                    id='header_script'
                    name='header_script'
                    maxLength="500"
                    value={header_script}
                    placeholder = "Enter Header Site Script"
                    // required
                    onChange={e => onChange(e)}
                    invalid={errorList.header_script ? true : false}
                  />
                  <Errors current_key='header_script' key='header_script' />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor='footer_script'>
                  Footer Site Script
                  </Label>
                  <Input
                    type='textarea'
                    id='footer_script'
                    name='footer_script'
                    maxLength="500"
                    value={footer_script}
                    placeholder = "Enter Footer Site Script"
                    // required
                    onChange={e => onChange(e)}
                    invalid={errorList.footer_script ? true : false}
                  />
                  <Errors current_key='footer_script' key='footer_script' />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor='copyright_text'>
                  Copyright text
                  </Label>
                  <Input
                    type='textarea'
                    id='copyright_text'
                    name='copyright_text'
                    maxLength="500"
                    value={copyright_text}
                    placeholder = "Enter copyright text"
                    // required
                    onChange={e => onChange(e)}
                    invalid={errorList.copyright_text ? true : false}
                  />
                  <Errors current_key='copyright_text' key='copyright_text' />
                </FormGroup>
              </CardBody>
              <CardFooter>
                <Button type='submit' size='sm' color='primary'>
                  <i className='fa fa-dot-circle-o'></i> Update
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

EditSettings.propTypes = {
  getScript: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  cancelSave: PropTypes.func.isRequired,
  setting: PropTypes.object.isRequired,
  errorList: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
  setting: state.setting,
  errorList: state.errors,
  loading: state.setting.loading
});

export default connect(
  mapStateToProps,
  { edit, getScript, cancelSave }
)(EditSettings);
