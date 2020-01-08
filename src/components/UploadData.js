import React, { Component } from 'react';
import { Upload, Icon, Button } from 'antd';
import XLSX from 'xlsx';
import tempCSV from '../assets/templates/CSVtemplate.csv';
import tempXLSX from '../assets/templates/EXCELtemplate.xlsx';
const { Dragger } = Upload;

const make_cols = refstr => {
	let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
	for(var i = 0; i < C; ++i) o[i] = {name:XLSX.utils.encode_col(i), key:i}
	return o;
};

const SheetJSFT = [
	"xlsx", "csv"
].map(function(x) { return "." + x; }).join(",");

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};


class UploadData extends Component {
    constructor(props) {
        super(props);
        this.state = {
          file: {},
          data: [],
          cols: [],
          selectedFileList: []
        }
    }

    handleChange = (info) => {
      const nextState = {};
      switch (info.file.status) {
        case "uploading":
          nextState.selectedFileList = [info.file];
          break;
        case "done":
          nextState.file = info.file;
          nextState.selectedFileList = [info.file];
          break;
  
        default:
          // error or removed
          nextState.selectedFile = null;
          nextState.selectedFileList = [];
      }
      this.setState(() => nextState);
    };
     
    handleFile = () => {
        const { onView } = this.props;
        const { file } = this.state;
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
     
        reader.onload = (e) => {
          /* Parse data */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws);
          /* Update state */
          this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
            if(onView)
              onView(data)
          }); 
        };
    
        reader.readAsBinaryString(file.originFileObj);
    }

    render() {
        const { file, selectedFileList } = this.state;
        return (
          <div className="upload-area">
            <Dragger 
              name="file" 
              multiple={false} 
              customRequest={dummyRequest} 
              onChange={this.handleChange}
              fileList={selectedFileList}
              accept={SheetJSFT}
              >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support files: {SheetJSFT}.
              </p>
            </Dragger>
           
              <Button 
                size="large"
                type="primary" 
                disabled={!file.name}
                onClick={this.handleFile}>
                View Chart
              </Button>
              <br/>
              <a href={tempCSV} download="CSVtemplate.csv">Download CSV Template</a>
              <a href={tempXLSX} download="EXCELtemplate.xlsx">Download EXCEL Template</a>
        </div>
        );
    }

}
export default UploadData;