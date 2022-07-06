import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { login } from "actions/auth";
import Alert from "views/Notifications/Alert";

import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import { REMOVE_ERRORS } from "actions/types";

const Login = ({ login, isAuthenticated, history }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const dispatch = useDispatch();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch({ type: REMOVE_ERRORS });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <CardGroup>
              <Card className="p-4">
                <CardBody>
                  <Form onSubmit={(e) => onSubmit(e)}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <Alert />
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="email"
                        autoComplete="email"
                        name="email"
                        maxLength="50"
                        value={email}
                        onChange={(e) => onChange(e)}
                        required
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        name="password"
                        minLength="6"
                        value={password}
                        onChange={(e) => onChange(e)}
                      />
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button color="primary" className="px-4">
                          Login
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

Login.proTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  login,
})(Login);
