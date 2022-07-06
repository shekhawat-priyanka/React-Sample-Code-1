import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import CKEditor from "ckeditor4-react";

import { connect, useDispatch } from "react-redux";
import { edit, cancelSave, getBlogById, notFound } from "actions/admin/blog";
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
import Errors from "views/Notifications/Errors";
import { REMOVE_ERRORS } from "actions/types";

const EditBlog = ({
  getBlogById,
  edit,
  cancelSave,
  blog: { currentBlog, loading },
  history,
  match,
  errorList
}) => {
  const [formData, setFormData] = useState({
    blog_title: "",
    blog_header: "",
    slug: "",
    description: "",
    meta_description: "",
    selectedFile: "",                                   // image file
    image: ""      ,                                    // object url of image (image src)
    oldImage: ""                                        // old image name(thumbnail)
  });

  useMemo(() => {
    getBlogById(match.params.blog_id).then((res) => {
      if (res === undefined) {
          notFound(history);                            // page not found
      } 
  });
  }, [getBlogById, match.params.blog_id]);

  useMemo(() => {
    if (Object.keys(currentBlog).length > 0) {
      setFormData({
        ...currentBlog,
        image: !currentBlog.thumbnail
          ? ""
          : process.env.REACT_APP_SERVER_URL + "/blog/" + currentBlog.thumbnail,
        oldImage: !currentBlog.thumbnail ? "" : currentBlog.thumbnail
      });
    }
  }, [currentBlog]);

  const {
    blog_title,
    blog_header,
    slug,
    description,
    meta_description,
    image,
    oldImage
  } = formData;

  const dispatch = useDispatch();

  const onChange = e => {
    if (e.target.name === "thumbnail") {
      let image_file = e.target.files[0];
      let image_url = URL.createObjectURL(image_file);
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        selectedFile: image_file,
        image: image_url
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    dispatch({ type: REMOVE_ERRORS });
  };

  const handelDescriptionChange = (event) => {
    setFormData({ ...formData, description: event.editor.getData() });
    dispatch({ type: REMOVE_ERRORS });
  };

  const onSubmit = e => {
    e.preventDefault();
    edit(formData, history, match.params.blog_id);
  };
  const onClickHandel = e => {
    e.preventDefault();
    cancelSave(history);
  };

  return loading || Object.keys(currentBlog).length === 0 ? (
    <Spinner />
  ) : (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" sm="6">
          <Card>
            <Form className="form-horizontal" onSubmit={e => onSubmit(e)}>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="slug">
                    Blog Slug <span>*</span>
                  </Label>
                  <Input
                    type="text"
                    id="slug"
                    name="slug"
                    maxLength="100"
                    value={slug}
                    onChange={e => onChange(e)}
                    readOnly
                    invalid={errorList.slug ? true : false}
                    disabled
                  />
                  <Errors current_key="slug" key="slug" />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="blog_title">
                    Subject <span>*</span>
                  </Label>
                  <Input
                    type="text"
                    id="blog_title"
                    name="blog_title"
                    maxLength="100"
                    value={blog_title}
                    onChange={e => onChange(e)}
                    invalid={errorList.blog_title ? true : false}
                  />
                  <Errors current_key="blog_title" key="blog_title" />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="blog_header">
                    Blog Header <span>*</span>
                  </Label>
                  <Input
                    type="text"
                    id="blog_header"
                    name="blog_header"
                    maxLength="100"
                    value={blog_header}
                    onChange={e => onChange(e)}
                    invalid={errorList.blog_header ? true : false}
                  />
                  <Errors current_key="blog_header" key="blog_header" />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Input
                    type="textarea"
                    id="meta_description"
                    name="meta_description"
                    value={meta_description}
                    onChange={e => onChange(e)}
                    invalid={errorList.meta_description ? true : false}
                  />
                  <Errors
                    current_key="meta_description"
                    key="meta_description"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="thumbnail">
                    Thumbnail<span>*</span>
                  </Label>
                  <Input
                    type="file"
                    id="thumbnail"
                    name="thumbnail"
                    onChange={e => onChange(e)}
                    multiple
                    invalid={errorList.image ? true : false}
                  />
                  <img src={image} className="preview-img" alt="" />
                  <Errors current_key="image" key="image" />
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
                    onChange={(event) => {
                      handelDescriptionChange(event);
                    }}
                    invalid={errorList.description ? true : false}
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
    </div>
  );
};

EditBlog.propTypes = {
  getBlogById: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  cancelSave: PropTypes.func.isRequired,
  notFound: PropTypes.func.isRequired,
  blog: PropTypes.object.isRequired,
  errorList: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  blog: state.blog,
  errorList: state.errors
});

export default connect(mapStateToProps, {
  getBlogById,
  edit,
  cancelSave,
  notFound
})(EditBlog);
