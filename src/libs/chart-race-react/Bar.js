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

function Bar(props) {
    const barDefaultStyle = {
        transition: `all ${props.timeout}ms ease-in-out`,
        ...props.prevStyle,
      };
      const posDefaultStyle = {
        transition: `all ${props.timeout}ms ease-in-out`,
        marginTop: props.prevStyle.marginTop,
      }
      const barTransitionStyles = {
          entering: props.prevStyle,
          entered:  props.currStyle,
          exiting: props.currStyle,
      };
      const posTransitionStyles = {
          entering: {marginTop: props.prevStyle.marginTop},
          entered: {marginTop: props.currStyle.marginTop},
          exiting: {marginTop: props.currStyle.marginTop},
      }
      const {height} = barDefaultStyle;
      const { widthRaw } = props.currStyle;
     
      return (
          <div style={classes.container}>
            <Transition in={true} timeout={props.timeout}>
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
                    {props.label.logo}
                </div>
                <div style={{width: '80%',
                    }}>
                    <div
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
                        {widthRaw>10&&<b>{props.label.name}</b>}
                    </div>
                    <div style={{
                    ...posDefaultStyle, 
                    ...posTransitionStyles[state],
                    height,
                    display: 'flex',
                    flexDirection:'row',
                    alignItems: 'center',
                    color:props.textColor
                }}>
                    {widthRaw<10&&<b>{props.label.name}</b>}&nbsp;
                    <BarCounting {...props} />
                </div>

                       
                </div>
              
                </React.Fragment>)
                }
            </Transition>
          </div>
        );
}

export default Bar;