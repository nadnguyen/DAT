import React from 'react';
import './App.css';
import UploadData from './components/UploadData'
import ViewData from  './components/ViewData'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isViewChart:false,
    }
  }

  handleView = (data) =>{
    this.setState({
      isViewChart:true,
      data:[...data]
    })
  }

  render(){
    const { isViewChart,data } = this.state;
    return (
      <div className="App">
        {!isViewChart&&<UploadData onView={this.handleView}/>}
        {isViewChart&&<ViewData data={data}/>}
      </div>
    );
  }
}

export default App;
