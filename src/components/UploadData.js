import React, { Component } from 'react';
import XLSX from 'xlsx';

const make_cols = refstr => {
	let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
	for(var i = 0; i < C; ++i) o[i] = {name:XLSX.utils.encode_col(i), key:i}
	return o;
};

const SheetJSFT = [
	"xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function(x) { return "." + x; }).join(",");

class UploadData extends Component {
    constructor(props) {
        super(props);
        this.state = {
          file: {},
          data: [],
          cols: []
        }
    }

    handleChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) this.setState({ file: files[0] });
    };
     
    handleFile = () => {
        const { onView } = this.props;
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
     
        if (rABS) {
          reader.readAsBinaryString(this.state.file);
        } else {
          reader.readAsArrayBuffer(this.state.file);
        };
    }

    render() {
        const { file,data } = this.state;
        console.log(data)
        return (
          <div>
            <label htmlFor="file">Upload Data</label>
            <br />
            <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />
            <br />
            {file.name&&<input type='submit' 
              value="View Chart"
              onClick={this.handleFile} />}
        </div>
        );
    }

}
export default UploadData;