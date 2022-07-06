import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import {
  edit,
  getSetting,
  setCheckboxError,
  cancelSave
} from "actions/admin/socialSetting";
import Errors from "views/Notifications/Errors";
import Spinner from "views/Spinner";
import SettingTabs from "./SettingTabs";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import { REMOVE_ERRORS } from "actions/types";

const SocialSettings = ({
  getSetting,
  edit,
  setCheckboxError,
  cancelSave,
  socialSetting: { currentSetting, loading },
  history,
  errorList
}) => {
  const [formData, setFormData] = useState({
    facebook: "",
    instagram: "",
    linkedIn: "",
    twitter: "",
    facebookCheck: false,
    instagramCheck: false,
    linkedInCheck: false,
    twitterCheck: false
  });

  useMemo(() => {
    getSetting(history).then(res => {
      setFormData({
        facebook: loading || res === undefined ? "" : res.value,
        instagram:
          loading || res === undefined ? "" : res.instagram_setting.value,
        linkedIn:
          loading || res === undefined ? "" : res.linkedIn_setting.value,
        twitter: loading || res === undefined ? "" : res.twitter_setting.value,
        facebookCheck:
          loading || res === undefined ? false : res.is_to_be_displayed,
        instagramCheck:
          loading || res === undefined
            ? false
            : res.instagram_setting.is_to_be_displayed,
        linkedInCheck:
          loading || res === undefined
            ? false
            : res.linkedIn_setting.is_to_be_displayed,
        twitterCheck:
          loading || res === undefined
            ? false
            : res.twitter_setting.is_to_be_displayed
      });
    });
  }, [loading, getSetting]);

  const {
    facebook,
    instagram,
    linkedIn,
    twitter,
    facebookCheck,
    instagramCheck,
    linkedInCheck,
    twitterCheck
  } = formData;

  const dispatch = useDispatch();

  const onChange = e => {
    if (e.target.name === "facebookCheck")
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    else if (e.target.name === "instagramCheck")
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    else if (e.target.name === "linkedInCheck")
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    else if (e.target.name === "twitterCheck")
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    dispatch({ type: REMOVE_ERRORS });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (formData.facebook === "" && facebookCheck === true)
      setCheckboxError(
        "Link is not provided for selected checkbox",
        "facebook"
      );
    else if (formData.instagram === "" && instagramCheck === true)
      setCheckboxError(
        "Link is not provided for selected checkbox",
        "instagram"
      );
    else if (formData.linkedIn === "" && linkedInCheck === true)
      setCheckboxError(
        "Link is not provided for selected checkbox",
        "linkedIn"
      );
    else if (formData.twitter === "" && twitterCheck === true)
      setCheckboxError("Link is not provided for selected checkbox", "twitter");
    else edit(formData, history);
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
          <SettingTabs />
          <Card>
            <Form className="form-horizontal" onSubmit={e => onSubmit(e)}>
              <CardBody>
                <h4>Social account settings</h4>
                <br></br>
                <InputGroup size="lg">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        addon
                        type="checkbox"
                        name="facebookCheck"
                        checked={facebookCheck}
                        onChange={e => onChange(e)}
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Facebook Link"
                    id="facebook"
                    name="facebook"
                    value={facebook}
                    onChange={e => onChange(e)}
                    invalid={errorList.facebook ? true : false}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i className="fa fa-facebook"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Errors current_key="facebook" key="facebook" />
                </InputGroup>
                <br></br>
                <InputGroup size="lg">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        addon
                        type="checkbox"
                        name="instagramCheck"
                        checked={instagramCheck}
                        onChange={e => onChange(e)}
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Instagram Link"
                    id="instagram"
                    name="instagram"
                    value={instagram}
                    onChange={e => onChange(e)}
                    invalid={errorList.instagram ? true : false}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i className="fa fa-instagram"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Errors current_key="instagram" key="instagram" />
                </InputGroup>
                <br></br>
                <InputGroup size="lg">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        addon
                        type="checkbox"
                        name="linkedInCheck"
                        checked={linkedInCheck}
                        onChange={e => onChange(e)}
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="LinkenIn Link"
                    id="linkedIn"
                    name="linkedIn"
                    value={linkedIn}
                    onChange={e => onChange(e)}
                    invalid={errorList.linkedIn ? true : false}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i className="fa fa-linkedin"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Errors current_key="linkedIn" key="linkedIn" />
                </InputGroup>
                <br></br>
                <InputGroup size="lg">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        addon
                        type="checkbox"
                        name="twitterCheck"
                        checked={twitterCheck}
                        onChange={e => onChange(e)}
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Twitter Link"
                    id="twitter"
                    name="twitter"
                    value={twitter}
                    onChange={e => onChange(e)}
                    invalid={errorList.twitter ? true : false}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i className="fa fa-twitter"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Errors current_key="twitter" key="twitter" />
                </InputGroup>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary">
                  <i className="fa fa-dot-circle-o"></i> Update
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

SocialSettings.propTypes = {
  getSetting: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  cancelSave: PropTypes.func.isRequired,
  setCheckboxError: PropTypes.func.isRequired,
  SocialSetting: PropTypes.object.isRequired,
  errorList: PropTypes.object.isRequired
  //   loading: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
  socialSetting: state.socialSetting,
  errorList: state.socialSetting.errors
  //   loading: state.setting.loading
});

export default connect(mapStateToProps, {
  edit,
  getSetting,
  setCheckboxError,
  cancelSave
})(SocialSettings);
