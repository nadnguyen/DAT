import React from 'react';
import { Transition } from 'react-transition-group'
import BarCounting from './BarCounting'
const classes = {
    bar: {
        position: "relative",
    },
    container: {
        width: "100%",
        display: "flex",
        position: "absolute",
    }
}
class Bar extends React.Component {
    componentDidMount(){
        this.flexLabel()
    }
    componentDidUpdate(){
        this.flexLabel()
    }
    flexLabel = () =>{
        const {currStyle} = this.props;
        const labelWidth = document.getElementById(`label-${ this.props.name}`)&&document.getElementById(`label-${ this.props.name}`).offsetWidth;
         const barWidth = document.getElementById(`bar-${ this.props.name}`)&&document.getElementById(`bar-${ this.props.name}`).offsetWidth;
         const isFill = labelWidth+10 >= barWidth;
         if(isFill)
        {
            document.getElementById(`labelf-${ this.props.name}`).hidden=false;
            document.getElementById(`label-${ this.props.name}`).style.color=currStyle.backgroundColor;
        }else {
            document.getElementById(`label-${ this.props.name}`).style.color='#fff';
            document.getElementById(`labelf-${ this.props.name}`).hidden=true;
        }
    }
    render() {
        const barDefaultStyle = {
            transition: `all ${this.props.timeout}ms ease-in-out`,
            ...this.props.prevStyle,
          };
          const posDefaultStyle = {
            transition: `all ${this.props.timeout}ms ease-in-out`,
            marginTop: this.props.prevStyle.marginTop,
          }
          const barTransitionStyles = {
              entering:  this.props.prevStyle,
              entered:   this.props.currStyle,
              exiting:  this.props.currStyle,
          };
          const posTransitionStyles = {
              entering: {marginTop:  this.props.prevStyle.marginTop},
              entered: {marginTop:  this.props.currStyle.marginTop},
              exiting: {marginTop:  this.props.currStyle.marginTop},
          }
          const {height} = barDefaultStyle;
          return (
              <div style={classes.container}>
                <Transition in={true} timeout={ this.props.timeout}>
                    { 
                    state => (
                    <React.Fragment>
                    <div style={{
                        ...posDefaultStyle, 
                        ...posTransitionStyles[state],
                        height,
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        { this.props.label.logo}
                    </div>
                    <div style={{width: '80%',
                        }}>
                        <div
                            id={`bar-${ this.props.name}`}
                            style={{
                                ...classes.bar, 
                                ...barDefaultStyle, 
                                ...barTransitionStyles[state],
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection:'row-reverse',
                                paddingRight: '10px',
                                marginRight: '5px',
                                float:'left',
                                color:'#fff',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                }} >
                            <b id={`label-${ this.props.name}`}>{ this.props.label.name}</b>
                        </div>
                        <div style={{
                        ...posDefaultStyle, 
                        ...posTransitionStyles[state],
                        height,
                        display: 'flex',
                        flexDirection:'row',
                        alignItems: 'center',
                        color: this.props.textColor
                    }}>
                        <b id={`labelf-${ this.props.name}`}>{ this.props.label.name}&nbsp;&nbsp;</b>
                        <BarCounting {...this.props} />
                    </div>
    
                           
                    </div>
                  
                    </React.Fragment>)
                    }
                </Transition>
              </div>
            );
    }
}


export default Bar;