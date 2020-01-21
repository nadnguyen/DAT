import React, {Component} from 'react';
import { Transition } from 'react-transition-group';

const styles = {
    container:{
        display: 'flex',
        width: "100%",
        borderBottom:'1px solid #555',
        margin:'10px 10px 40px 10px',
    },
    unitContainer:{
        marginLeft:'33px',
        width: '80%',                     
        height: '5px',
        position:'relative' 
    },
    unit:{
        width: '100%',                     
        borderRight:'1px solid #555',
        height: '10px',
        position:'absolute',
    },
    unitLabelCon:{
        position:'relative', 
        height: '10px',
        width: '10px',
        float: 'right',
    },
    unitLabel:{
        position:'absolute',
        width :100,
        top:10,
        right:-50,
        textAlign: 'center',
        color:'#555'
    }
}

const DF_STEP_NUM = 5;

const getCirNumber = (min)=>{
    let num='1'
    for (let i = 1; i < `${min}`.length; i++) {
        num=num+'0'
      } 
     return parseInt(num) 
}

const getMaxUnitVal = (min, max) => {

    const cirNum = getCirNumber(min);
    const roundingVal = parseInt(max/cirNum)%2!==0?1:2;
    const maxUnitValue = (max-(max%cirNum))+(cirNum*roundingVal);
    return maxUnitValue;
}
const getUnits = (max,stepValue,unitNumber) =>{
    let units={
        0:{
            width:'0%',
            value:0
        }
    }
    for (let i = 1; i <= unitNumber+1; i++) {
        const unit = {
            width:`${(stepValue*i)*100/max}%`,
            value:stepValue*i,
        }
        units[stepValue*i]=unit
      
    }
    return  units;
}

class BarUnit extends Component {
    state = {
        unitNumber:DF_STEP_NUM,
        stepValue:0,
        max:0,
        isEnd:false,
        preUnits:{}
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.isEnd!==prevState.isEnd){
            
            if(!nextProps.isEnd)
            {
                const maxUnitValue = getMaxUnitVal(nextProps.min, nextProps.max) 
                const stepValue=maxUnitValue/(DF_STEP_NUM-1);
                return { max: nextProps.max,unitNumber:DF_STEP_NUM,stepValue, isEnd:nextProps.isEnd,preUnits:{} };
            }
            return {
                isEnd:nextProps.isEnd
            }
        }
        else if(nextProps.max!==prevState.max){
            const preUnits= getUnits(prevState.max,prevState.stepValue,prevState.unitNumber)
            let i = prevState.unitNumber;
            while(prevState.stepValue&&(i*prevState.stepValue<nextProps.max))
            {
                i=i+1;
            }
            if(i>6)
            {
                const maxUnitValue = getMaxUnitVal(nextProps.min, nextProps.max) 
                const stepValue=maxUnitValue/(DF_STEP_NUM-1);
                return { max: nextProps.max,unitNumber:DF_STEP_NUM,stepValue,preUnits:{} };
            }
   

          return { max: nextProps.max,unitNumber:i,preUnits };
       }
       else return null;
     }

  
    componentDidMount(){
        const { min, max } = this.props;
        const maxUnitValue = getMaxUnitVal(min, max) 
        const stepValue=maxUnitValue/(DF_STEP_NUM-1);
        this.setState({
            stepValue,
        })
    }

    getTransitionStyles = (id,units,preUnits) =>{
        const { timeout } = this.props;
        const defaultStyle = {
            transition: `all ${timeout}ms ease-in-out`,
            width: preUnits[id]?preUnits[id].width:units[id].width
        }
          
        const transitionStyles = {
            entering: { width: preUnits[id]?preUnits[id].width:units[id].width },
            entered:  { width: units[id]?units[id].width:'120%'},
            exiting: { width: units[id]?units[id].width:'120%' },
        };
        return { defaultStyle,transitionStyles }
    }
    formatNumber = (number) =>{
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    }
 
    render(){
        const { stepValue, unitNumber,max,preUnits } = this.state
        const { textColor } = this.props;
        const units = getUnits( max,stepValue, unitNumber)
        return(
            <div style={{...styles.container, borderBottom:`1px solid ${textColor}`,}}>
                <div style={styles.unitContainer}>
                    {Object.values(units).map(unit=>(
                        <Transition key={unit.value} in={true} timeout={2000}>
                            {state =>{
                                const {defaultStyle,transitionStyles} = this.getTransitionStyles(unit.value,units,preUnits)
                                return (
                                    <div  style={{
                                        ...styles.unit,
                                        borderRight:`1px solid ${textColor}`,
                                        ...defaultStyle,
                                        ...transitionStyles[state]
                                    }}>
                                        <div style={styles.unitLabelCon}>
                                            <div style={{...styles.unitLabel, color:textColor}}>{this.formatNumber(unit.value)}</div>
                                        </div>
                                         
                                    </div>
                                )
                            }}
                        </Transition>
                        
                    ))}
                </div>
          </div>
        )
    }
}
export default BarUnit;