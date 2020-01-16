import React from 'react';
import Bar from './Bar';
import { InputNumber,Form,Button } from 'antd';

const ButtonGroup = Button.Group;

const classes = {
  barChart: {
    width: "100%",
    position: "relative",
  },
  container: {
    width: "100%",
  }
}
class BarChart extends React.Component {
    constructor(props){
        super(props);
        this.barHeight = `calc(${props.barStyle.height} + ${props.barStyle.marginTop})`;
        this.nItmes = Object.keys(this.props.data).length;
        this.maxItems = props.maxItems <= this.nItmes ? props.maxItems : this.nItmes;
        this.barChartStyle = {
            height: `calc(${this.maxItems} * ${this.barHeight})`,
        };
        let [initRank, maxVal] = this.sortAxis(0);
        this.state = {
            idx: 0,
            prevRank: initRank,
            currRank: initRank,
            maxVal: maxVal,
            started: false,
            timeout:1000,
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

    onChangeTimeout = (value) =>{
      this.setState({
        timeout:value
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
      };
      const prevStyle = {
        ...this.props.barStyle,
        marginTop: `calc(${this.state.prevRank[name]} * ${this.barHeight})`,
        width: `${100 * this.props.data[name][prevIdx]/ this.state.maxVal}%`,
        backgroundColor: this.props.colors[name],
      };
      return [value,preValue, hidden, currStyle, prevStyle];
    }
  
    render(){
      const { start, idx } = this.state;
      const { timeline } = this.props;
      const isEnd = idx + 1 === timeline.length;
      
      return (
        <div style={classes.container}>
          <ButtonGroup style={{float:'right',marginTop:'10px'}}>
            {start&&!isEnd&&<Button onClick={this.handleStop} icon='pause'/>}
            {!start&&<Button onClick={this.handlePlay} icon='caret-right' />}
            {isEnd&&<Button onClick={this.handleReplay} icon='reload'/>}
          </ButtonGroup>
          <Form.Item style={{float:'right',margin:'6px'}}>
            <span className="ant-form-text">Lead Time:</span>
            <InputNumber disabled={start&&!isEnd} value={this.state.timeout} min={100} max={10000} onChange={this.onChangeTimeout} />
          </Form.Item>
          <br/>
          <div style={this.props.timelineStyle}>
            {this.props.timeline[this.state.idx]}
          </div>
          <div style={{...classes.barChart, ...this.barChartStyle}}>
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
                    />
                )
              })
            }
          </div>
       
        </div>
      );
    }
}

export default BarChart;