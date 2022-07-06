import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import CKEditor from "ckeditor4-react";

import {
  create,
  cancelSave,
  initialLoading
} from "actions/admin/emailTemplate";
import Errors from "views/Notifications/Errors";
import Spinner from "views/Spinner";
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

const CreateEmailTemplate = ({
  create,
  cancelSave,
  history,
  errorList,
  loading,
  initialLoading
}) => {
  const [formData, setFormData] = useState({
    subject: "",
    slug: "",
    description: "",
    dynamic_parameters: ""
  });

  const { subject, slug, description, dynamic_parameters } = formData;

  const dispatch = useDispatch();

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch({ type: REMOVE_ERRORS });
  };

  const handelDescriptionChange = event => {
    setFormData({ ...formData, description: event.editor.getData() });
    dispatch({ type: REMOVE_ERRORS });
  };

  const onSubmit = e => {
    e.preventDefault();
    create(formData, history);
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
                    <Label htmlFor="slug">
                      Email Template Slug <span>*</span>
                    </Label>
                    <Input
                      type="text"
                      id="slug"
                      name="slug"
                      maxLength="100"
                      value={slug}
                      required
                      onChange={e => onChange(e)}
                      invalid={errorList.slug ? true : false}
                    />
                    <Errors current_key="slug" key="slug" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="subject">
                      Subject <span>*</span>
                    </Label>
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      maxLength="100"
                      value={subject}
                      required
                      onChange={e => onChange(e)}
                      invalid={errorList.subject ? true : false}
                    />
                    <Errors current_key="subject" key="subject" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="dynamic_parameters">
                      Dynamic Variables
                    </Label>
                    <Input
                      type="textarea"
                      id="dynamic_parameters"
                      name="dynamic_parameters"
                      maxLength="500"
                      value={dynamic_parameters}
                      onChange={e => onChange(e)}
                      invalid={errorList.dynamic_parameters ? true : false}
                    />
                    <Errors
                      current_key="dynamic_parameters"
                      key="dynamic_parameters"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="description">
                      Body <span>*</span>
                    </Label>
                    <CKEditor
                      data={description}
                      id="description"
                      name="description"
                      config={{
                        height: 100,
                        toolbar: [
                          ["Cut", "Copy", "Paste"],
                          ["Undo", "Redo"],
                          ["SpellChecker"],
                          ["Link", "Unlink", "Anchor"],
                          [
                            "Image",
                            "Table",
                            "Horizontal Line",
                            "Special Character"
                          ],
                          ["Maximize"],
                          ["Source"],
                          ["Bold", "Italic", "Strike"],
                          ["RemoveFormat"],
                          ["NumberedList", "BulletedList"],
                          ["DecreaseIndent", "IncreaseIndent"],
                          ["BlockQuote"],
                          ["Styles"],
                          ["Format"],
                          ["About"]
                        ]
                      }}
                      onChange={event => handelDescriptionChange(event)}
                    />
                    <Errors current_key="description" key="description" />
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

CreateEmailTemplate.propTypes = {
  create: PropTypes.func.isRequired,
  cancelSave: PropTypes.func.isRequired,
  emailTemplate: PropTypes.object,
  errorList: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  initialLoading: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  emailTemplate: state.emailTemplate,
  errorList: state.errors,
  loading: state.emailTemplate.loading
});

export default connect(mapStateToProps, { create, cancelSave, initialLoading })(
  CreateEmailTemplate
);
