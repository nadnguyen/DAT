import React, {Component} from 'react';
class BarCounting extends Component {

    timer = null;
    componentDidMount(){
        const {value,name,preValue,timeout} = this.props;
        this.animateValue(`counting-${name}`,preValue,value,timeout)
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        const {start} = this.props
        const {value,name,preValue,timeout} = nextProps;
        if(!!start&&this.props.value!==nextProps.name)
        {
            clearInterval(this.timer);
            this.animateValue(`counting-${name}`,preValue,value,timeout)
        }
    }
    animateValue = (id, start, end, duration) => {
        const range = end - start;
        let current = start;
        const increment = parseInt(range)!==range?range/100: Math.floor(range/100)
        const stepTime = duration / 100;
        const obj = document.getElementById(id);
        if(obj){
            this.timer = setInterval(function() {
                current += increment;
               
                if ((range>0&&current >= end)||(range<0&&current <= end)) {
                    clearInterval(this.timer);
                    obj.innerHTML = `${end}`.slice(0,12);
                } else {
                    obj.innerHTML = `${current}`.slice(0,12);
                }         
       
        }, stepTime);
        }
     
    }
    render() {
    return <span
    id={`counting-${this.props.name}`} >{`${this.props.value}`.slice(0,12)}</span>;
    }
}
export default BarCounting;