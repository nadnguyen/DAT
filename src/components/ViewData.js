import React, { Component } from 'react';
import BarChart from '../libs/chart-race-react';


class ViewData extends Component {

    getData = (rawData=[]) =>{
        let data={}
        let colors={}
        let labels={}
        let time=[]
        let len = 0
        rawData.forEach((value)=>{
            const {name,color,logo,...otherValue } = value
            data[name]=Object.values(otherValue)
            time=Object.keys(otherValue)
            colors[name]=color;
            labels[name]=(
                <div style={{textAlign:"center",}}>
                  <div>{name}</div>
                </div>
                )
            len = time.length
        })
        return {
            data,colors,labels,time,len
        }

    }

    render(){
        const { data,time,labels,colors,len } = this.getData(this.props.data)
        
        return ( <BarChart 
            start={true}
            data={data} 
            timeline={time}
            labels={labels}
            colors={colors}
            len={len}
            timeout={400}
            delay={100}
            timelineStyle={{
              textAlign: "center",
              fontSize: "50px",
              color: "rgb(148, 148, 148)",
              marginBottom: "100px"
            }}
            textBoxStyle={{
              textAlign: "right",
              color: "rgb(133, 131, 131)",
              fontSize: "30px",
            }}
            barStyle={{
              height: "60px",
              marginTop: "10px",
              borderRadius: "10px",
            }}
            width={[15, 75, 10]}
            maxItems={100}
          />)
    }
}
export default ViewData;