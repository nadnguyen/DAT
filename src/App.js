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
      isHorizontal:true,
    }
  }

  handleView = (data) => {
    this.setState({
      isViewChart:true,
      data:[...data]
    })
  }
  handleChangeView = () =>{
    this.setState({
      isHorizontal:!this.state.isHorizontal,
    })
  }

  handleUpload = () => {
    this.setState({
      isViewChart:false,
      data:[]
    })
  }

  render(){
    const { isViewChart,data,isHorizontal } = this.state;
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
          {isViewChart&&<Button onClick={this.handleChangeView} icon={isHorizontal?'border-horizontal':'border-verticle'} style={{marginLeft:'10px'}} />}
          </div>
        </Header>
        <Content>
          {!isViewChart&& <UploadData onView={this.handleView}/>}
          {isViewChart&& <ViewData data={data} isHorizontal={isHorizontal}/>}
        </Content>
        <Footer style={{ textAlign: 'center' }}>Data Analytics Tool ©2020 Created by VNTEAM</Footer>
      </Layout>
    );
  }
}

export default App;
