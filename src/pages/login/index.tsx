import * as React from 'react';
import { Form, Input, Icon, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { LoginPage } from '../../stores';
import { FormEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import './style.css';

interface Props extends RouteComponentProps<{}> {
  loginPageStore: LoginPage;
}

interface State {
}

@inject('loginPageStore')
@observer
export default class Login extends React.Component<Props, State> {
  name: HTMLDivElement;

  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await this.props.loginPageStore.login();
    if (success) {
      // window.location.href = '/systemUsers';
      await this.props.loginPageStore.getUserMenu();
    }
  };

  componentDidMount() {
    this.name.style.height = window.innerHeight + "px";
  }

  render() {
    const {
      username, password, passwordInput,
      usernameInput, submitting,
    } = this.props.loginPageStore;
    return (
      <div className="login-page" ref={r => this.name = r as HTMLDivElement}>
        <div className="_form">
          <span className="_title">都市智造控制台</span>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item>
              <Input value={username} onChange={usernameInput} prefix={<Icon type="user" />} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item>
              <Input value={password} onChange={passwordInput} type="password" prefix={<Icon type="lock" />} placeholder="请输入密码" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                登&nbsp;录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}