import React, { Component } from 'react';
import MenuConfig from '../router';
import { Layout, Menu, Breadcrumb, Tabs } from 'antd';
import './style/layout.css'
import { Icon } from 'antd';
import { urlSource } from 'ipfs-http-client';
import Allcomponent from './Allcomponent'
const { SubMenu } = Menu;
const {TabPane} = Tabs
const { Header, Footer, Sider, Content } = Layout;
import {Provider} from 'react-redux'


export default class NavLeft extends Component {
    rootSubmenuKeys=[]
    state = {
      openKeys: [],
      collapsed: false,
      current: ''
    };
    // 点击时切换展开项
    toggle = () => {
      this.setState({
        collapsed: !this.state.collapsed
      })
    }
    handleClick = (e) => {
      console.log(e)
      this.setState({
        current: e.key || '1'
      })
    } 
    onOpenChange = (openKeys) => {
      const latestOpenKey = openKeys.find(key =>
        this.state.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({ openKeys });
      } else {
        this.setState({
          openKeys: latestOpenKey ? [latestOpenKey] : []
        });
      }
    }


    render () {
      return (
        <div>
          <Layout className="layout">
            <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
              <div className="logo" style={{backgroundColor:'white',margin:'0'}} />
                  <Menu
                    mode="inline"
                    multiple
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%', borderRight: 0 }}
                    onClick = {this.handleClick}
                    selectedKeys = {[this.state.current || '1']}
                  >
                    <Menu.Item key="1">
                      <Icon type="cloud-o"/>
                      <span>首页</span>
                    </Menu.Item>
                  <SubMenu key="sub1" title={<span><Icon type="user" /><span>用户</span></span>}>
                    <Menu.Item key="2">
                      <Icon type="user"/>
                      <span>新建用户</span>
                    </Menu.Item>
                    <Menu.Item key="3">
                    <Icon type="unordered-list" />
                          <span>上传材料信息</span>
                    </Menu.Item>
                    <Menu.Item key="13">
                    <Icon type="unordered-list" />
                          <span>工作台</span>
                    </Menu.Item>
                    
                  </SubMenu>
                  <SubMenu key="sub2"  title={<span><Icon type="unordered-list" /><span>历史记录</span></span>}>
                    <Menu.Item key="4">捐助历史记录</Menu.Item>
                    <Menu.Item key="5">受捐历史记录</Menu.Item>
                  </SubMenu>
                  <SubMenu key="sub3"  title={<span><Icon type="team" /><span>团队成员</span></span>}>
                    <Menu.Item key="6">option9</Menu.Item>
                    <Menu.Item key="7">option10</Menu.Item>
                    <Menu.Item key="8">option11</Menu.Item>
                    <Menu.Item key="9">option12</Menu.Item>
                  </SubMenu>
                  <Menu.Item key="10">
                    <Icon type="usergroup-add" />
                          <span>加入我们</span>
                  </Menu.Item>
                </Menu>
              </Sider>
            <Layout style={{ padding: '0 24px 24px'}}>
            <Header className="header" style={{backgroundColor:'transparent'}}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
            />
            </Header>
                <Content
                  className="layoutContent"
                  style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 100
                  }}
                >
                  <Allcomponent selected = {this.state.current || '1'}/>
                </Content>
              </Layout>
          </Layout>
        </div>
      );
    }
}
