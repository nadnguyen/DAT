import React from 'react';
import Bar from './Bar';
import { Popover,InputNumber,Input,Button,Upload } from 'antd';
import { SketchPicker } from 'react-color';
import BarUnit from './BarUnit';
const ButtonGroup = Button.Group;


const classes = {
  barChart: {
    width: "100%",
    position: "relative",
    margin:'0px 10px',
    overflow: 'hidden',
  },
  chartImage:{
    position: 'absolute',
    width: '200px',
    height: '200px',
    right: '20px',
    bottom: '11px',
  },
  container: {
    width: "100%",
    backgroundColor:'pink',
    overflow: 'hidden',
    marginTop:10
  },
  toolbar: {
    width: "100%",
    display: 'flex',
    alignItems: 'center',
    backgroundColor:'black',
    color:'white',
    padding:5,
    marginBottom:20,
    opacity: 0.5,
  },
  editTool:{
    display: 'flex',
    flexDirection:'row-reverse',
  },
  control:{
    display: 'flex',
    alignItems: 'center',
    marginLeft:'10px'
  },
  chartTitle:{
    width: "100%",
    fontSize:24,
    textAlign: 'center',
  },
  timeline:{
    width: "100%",
    fontSize: "40px",
    color: "rgb(148, 148, 148)",
    marginBottom: "20px",
    textAlign: 'center',
  },
  label:{
    marginRight: "5px",
  },

}
class BarChart extends React.Component {
    constructor(props){
        super(props);
        this.barHeight = `calc(${props.barStyle.height} + ${props.barStyle.marginTop})`;
        this.nItmes = Object.keys(this.props.data).length;
        this.maxItems = props.maxItems <= this.nItmes ? props.maxItems : this.nItmes;
        this.barChartStyle = {
            height: `calc(${props.maxItemsShow} * ${this.barHeight})`,
        };
        let [initRank, maxVal] = this.sortAxis(0);
        this.state = {
            idx: 0,
            prevRank: initRank,
            currRank: initRank,
            maxVal: maxVal,
            started: false,
            timeout:2000,
            titleSize:32,
            titleText:'The Chart Title',
            titleColor:'rgb(148, 148, 148)',
            timeSize:46,
            timeColor:'rgb(148, 148, 148)',
            image:null,
            backgroundColor:'black',
            textColor:'#555'

        };
    }


    componentWillUnmount = () => {
      clearInterval(this.state.intervalId);
    }

    handleStop = () => {
      clearInterval(this.state.intervalId);
      this.setState({
        start:false
      })
    }

    handleReplay = () => {
      let [initRank, maxVal] = this.sortAxis(0);
      this.setState({
        idx: 0,
        prevRank: initRank,
        currRank: initRank,
        maxVal: maxVal,
        started: true,
      },()=>{
        var intervalId = setInterval(this.update, this.state.timeout + this.props.delay);
        this.setState({intervalId: intervalId});
      })
    }
    
    handlePlay = () => {
      var intervalId = setInterval(this.update, this.state.timeout + this.props.delay);
      this.setState({intervalId: intervalId, start:true});
    }
  
    update = () => {
      if(this.state.idx + 1 === this.props.timeline.length) {
        clearInterval(this.state.intervalId);
        return;
      }
      this.setState(prevState => {
            let [currRank, maxVal] = this.sortAxis(prevState.idx + 1);
            return {
                idx: prevState.idx + 1,
                prevRank: prevState.currRank,
                currRank: currRank,
                maxVal: maxVal,
            }
        });
    }

    sortAxis = (i, descending) => {
        if(descending === undefined) descending = true;
        let toSort = Object.keys(this.props.data).map(name => {
            return {
                name: name, 
                val: this.props.data[name][i]
            };
        });
        toSort.sort((left, right) => left.val - right.val)
        if (descending) {
          toSort.reverse()
        }
        toSort = toSort.slice(0, this.maxItems);
        const maxVal = Math.max.apply(Math, toSort.map(item => item.val));
        return [toSort.reduce((ret, item, idx) => ({
          ...ret, ...{[item.name]: idx}
        }), {}), maxVal];
    }

    onChangeTimeout = (value) => {
      this.setState({
        timeout:value
      })
    }

    onChangeFontSize = (value,type) => {
      this.setState({
        [`${type}Size`]:value
      })
    }

    handleChangeColor = (value,type) => {
      this.setState({ [`${type}Color`]: value.hex });
    }

    onChangeText = (e,type) => {
      this.setState({
        [`${type}Text`]:e.target.value
      })
    }

    getInfoFromRank = name => {
      const currIdx = this.state.idx;
      const prevIdx = (currIdx > 0 ? currIdx - 1 : 0);
      const value = this.props.data[name][currIdx];
      const preValue = this.props.data[name][prevIdx];
      const hidden = (this.state.currRank[name] === undefined||this.state.currRank[name]>this.props.maxItemsShow-1);
      const currStyle = {
        ...this.props.barStyle,
        marginTop: `calc(${this.state.currRank[name]} * ${this.barHeight})`,
        width: `${100 * this.props.data[name][currIdx]/ this.state.maxVal}%`,
        backgroundColor: this.props.colors[name],
        widthRaw:100 * this.props.data[name][currIdx]/ this.state.maxVal
      };
      const prevStyle = {
        ...this.props.barStyle,
        marginTop: `calc(${this.state.prevRank[name]} * ${this.barHeight})`,
        width: `${100 * this.props.data[name][prevIdx]/ this.state.maxVal}%`,
        backgroundColor: this.props.colors[name],
      };
      return [value,preValue, hidden, currStyle, prevStyle];
    }

    getToolBar = (type) =>{
      return (
        <div style={classes.editTool}>
        <div style={classes.control}>
            <b style={classes.label}>Color:</b>
            <Popover content={<SketchPicker
              color={this.state[`${type}Color`]}
              onChangeComplete={ (value)=>this.handleChangeColor(value,type) }
            />}  trigger="click">
              <div style={{
                width:25,
                height:25,
                backgroundColor:this.state[`${type}Color`]
              }}/>
            </Popover>
            
        </div>
        <div style={classes.control}>
            <b style={classes.label}>Size: </b>
            <InputNumber  value={this.state[`${type}Size`]} min={8} max={64} onChange={(value)=>this.onChangeFontSize(value,type)} />
        </div>
        {type==='title'&&<div style={classes.control}>
            <b style={classes.label}>Text: </b>
            <Input style={{width:200}} value={this.state[`${type}Text`]} onChange={(value)=>this.onChangeText(value,type)} placeholder="Text" />
        </div>}
      </div>
      )
    }

    getMinVal = (data,currRank,maxItemsShow,idx) =>{
      let minItem = '';
      Object.keys(currRank||{}).every((key)=>{
        if(currRank[key]===maxItemsShow-1){
          
          minItem=key;
          return false;
        } else
        return true;
      })
      return data[minItem][idx]
    }

    handleUploadChange = (e) =>{
      const image=URL.createObjectURL(e.file.originFileObj);
      this.setState({
        image
      })
    }
  
    render(){
      const { start, maxVal,currRank,idx,timeout,titleSize,titleText,titleColor,timeColor,timeSize,image,backgroundColor,textColor } = this.state;
      const { timeline,data,maxItemsShow } = this.props;
      const isEnd = idx + 1 === timeline.length;
      const titleToobar = this.getToolBar('title')
      const timeToobar = this.getToolBar('time')
      const minVal=this.getMinVal(data,currRank,maxItemsShow,idx)
      const props = {
        onChange: this.handleUploadChange,
        multiple: false,
        showUploadList:false,
        accept:'image/*'
      };
      return (
        <div style={{...classes.container,backgroundColor}}>
          <div style={classes.toolbar}> 
              <ButtonGroup>
                {start&&!isEnd&&<Button  type="primary" onClick={this.handleStop} icon='pause'/>}
                {!start&&<Button  type="primary" onClick={this.handlePlay} icon='caret-right' />}
                {isEnd&&<Button  type="primary" onClick={this.handleReplay} icon='reload'/>}
              </ButtonGroup>
              <div style={classes.control}>
                <b style={classes.label}>Lead Time: </b>
                <InputNumber disabled={start&&!isEnd} value={timeout} min={100} max={10000} onChange={this.onChangeTimeout} />
              </div>
              <div style={classes.control}>
                <b style={classes.label}>Image: </b>
                <Upload {...props}>
                  <Button icon='upload'/>
                </Upload>
              </div>
              <div style={classes.control}>
                <b style={classes.label}>Background Color:</b>
                <Popover content={<SketchPicker
                  color={backgroundColor}
                  onChangeComplete={ (value)=>this.handleChangeColor(value,'background') }
                />}  trigger="click">
                  <Button icon='bg-colors'/>
                </Popover>
              </div>
              <div style={classes.control}>
                <b style={classes.label}>Text Color:</b>
                <Popover content={<SketchPicker
                  color={textColor}
                  onChangeComplete={ (value)=>this.handleChangeColor(value,'text') }
                />}  trigger="click">
                  <Button icon='highlight'/>
                </Popover>
              </div>
          </div>
          <Popover content={titleToobar}  trigger="click">
            <div style={{...classes.chartTitle,fontSize:titleSize,color:titleColor}}>
              {titleText}
            </div>
          </Popover>
          <Popover content={timeToobar}  trigger="click">
            <div style={{...classes.timeline,fontSize:timeSize,color:timeColor}}>
              {this.props.timeline[this.state.idx]}
            </div>
          </Popover>
          <div style={{...classes.barChart, ...this.barChartStyle}}>
          {image&&<div style={classes.chartImage} >
            <img src={image} alt="pic chart" style={{width:'100%'}} />
           </div>}
            {
              Object.keys(this.props.data).map(name => {
                const [value,preValue, hidden, currStyle, prevStyle] = this.getInfoFromRank(name);
                if(hidden) return null;
                return (
                    <Bar
                      name={name}
                      value={value}
                      start={start&&!isEnd}
                      preValue={preValue}
                      label={this.props.labels[name]}
                      currStyle={currStyle}
                      prevStyle={prevStyle}
                      key={name}
                      timeout={this.state.timeout}
                      textBoxStyle={this.props.textBoxStyle}
                      width={this.props.width}
                      textColor={textColor}
                    />
                )
              })
            }
          </div>
          <BarUnit  textColor={textColor} timeout={this.state.timeout} isEnd={isEnd} max={parseInt(maxVal)} min={parseInt(minVal)}/>
        </div>
      );
    }
}

export default BarChart;