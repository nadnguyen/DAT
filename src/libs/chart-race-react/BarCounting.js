import React, {Component} from 'react';

const getRandomRa = (min)=>{
    let num='1'
    for (let i = 0; i < `${min}`.length; i++) {
        num=num+'0'
      } 
     return parseInt(num) 
}

class BarCounting extends Component {

    timer = null;
    timerRan = null;
    componentDidMount(){
        const {value,name} = this.props;
        this.setValueToDOM(name,value)
    }

    setValueToDOM = (name,value,prefix=true,suffix=true) =>{
        const objc = document.getElementById(`counting-${name}`);
        const objr = document.getElementById(`rand-${name}`);
        const num = this.formatNumber(value).slice(0,3)
        const nums = (num.includes('.')||num.includes(','))?4:3;
        if(objc&&prefix)
            objc.innerHTML=this.formatNumber(value).slice(0,nums)
        if(objr&&suffix)
            objr.innerHTML=this.formatNumber(value).slice(nums)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const {start} = this.props
        const {value,name,preValue,timeout} = nextProps;
        if(!!start&&this.props.value!==nextProps.name)
        {
            clearInterval(this.timer);
            clearInterval(this.timerRan);
            this.animateNumRan(name,value)
            this.animateValue(name,preValue,value,timeout)
           
        }
    }
    formatNumber = (number) =>{
        const num = Math.floor(number * 1000) / 1000;
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    }
    animateNumRan = (name,value) => {
        const numR=getRandomRa(Math.floor(value))
        const isN = value===parseInt(value)
        this.timerRan = setInterval(() =>{
            const num = isN?Math.floor(Math.random()*numR):Math.random()*numR
            this.setValueToDOM(name,num,false,true)
        },10)
    }
    animateValue = (name, start, end, duration) => {
        const range = end - start;
        let current = start;
        const increment = parseInt(range)!==range?range/10: Math.floor(range/10)
        const stepTime = duration / 10;
        this.timer = setInterval(() => {
                current += increment;
               
                if ((range>0&&current >= end)||(range<0&&current <= end)) {
                    clearInterval(this.timer);
                    clearInterval(this.timerRan);
                    this.setValueToDOM(name,end)
                } else {
                    this.setValueToDOM(name,current,true,false)
                }         
       
        }, stepTime);
     
    }
 
    render() {
        const { name } = this.props;
    return [<span id={`counting-${name}`}/>,<span id={`rand-${name}`} />];
    }
}
export default BarCounting;