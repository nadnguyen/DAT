import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import './styles/index.scss';
import { Layout, Button } from 'antd';
import UploadData from './components/UploadData'
import ViewData from  './components/ViewData'
import logo from './assets/images/bar-chart.png';

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isViewChart:false,
    }
  }

  handleView = (data) => {
    this.setState({
      isViewChart:true,
      data:[...data]
    })
  }

  handleUpload = () => {
    this.setState({
      isViewChart:false,
      data:[]
    })
  }

  render(){
    const { isViewChart,data } = this.state;
    return (
      <Layout className="layout">
        <Header>
          <div className="left-header">
            <div className="logo">
              <img src={logo} alt=""/>
            </div>
            Data Analytics Tool
          </div>
          <div className="right-header">
          {isViewChart && <Button icon="upload" onClick={this.handleUpload}>Upload File</Button>}
          </div>
        </Header>
        <Content>
          {!isViewChart&& <UploadData onView={this.handleView}/>}
          {isViewChart&& <ViewData data={data}/>}
        </Content>
        <Footer style={{ textAlign: 'center' }}>Data Analytics Tool ©2020 Created by VNTEAM</Footer>
      </Layout>
    );
  }
}

export default App;
