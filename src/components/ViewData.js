import React, { Component } from 'react';
import BarChart from '../libs/chart-race-react';
import randomcolor from 'randomcolor';
import { Row, Col, Table } from 'antd';



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
            colors[name]=randomcolor();
            labels[name]=(
                <div style={{
                    textAlign:"center",
                    display: 'flex',
                    alignItems:'center',
                    justifyContent: 'center'
                    }}>
                    {logo && <img src={logo} alt={name} style={{ width: '20px',   height: '20px',marginRight: '8px'
}}/>}
                    <div>{name}</div>
                </div>
                )
            len = time.length
        })
        return {
            data,colors,labels,time,len
        }

    }

    getColumnTable = (data) =>{
        return Object.keys(data||{}).map(value=>{
            if(value==='logo')
                return ({
                    title: value.toUpperCase(),
                    dataIndex: value,
                    render: (data) => <img src={data} alt='logo' style={{ width: '20px',  height: '20px'
                }}/>,
                });
            return ({
                title: value.toUpperCase(),
                dataIndex: value,
                fixed:value==='name'?true:false,
            })
        })
    }

    render(){
        const { data,time,labels,colors,len } = this.getData(this.props.data);
        const barChartHeight = window.innerHeight - 188;
        const barMarginTop = 10;
        const dataLength = this.props.data.length;
        const barHeight = (barChartHeight - barMarginTop*dataLength)/dataLength;
        const columns=this.getColumnTable(this.props.data[0]);
        return ( <Row gutter={[16, 16]}>
            <Col span={12}>
            <BarChart 
                start={true}
                data={data} 
                timeline={time}
                labels={labels}
                colors={colors}
                len={len}
                timeout={500}
                delay={100}
                timelineStyle={{
                    textAlign: "center",
                    fontSize: "50px",
                    color: "rgb(148, 148, 148)",
                    marginBottom: "20px"
                    }}
                textBoxStyle={{
                    textAlign: "right",
                    color: "rgb(133, 131, 131)",
                    fontSize: `${barHeight/2}px`,
                    fontWeight: 'bold',
                    }}
                barStyle={{
                    height: `${barHeight}px`,
                    marginTop: `${barMarginTop}px`,
                    borderRadius: `${barHeight/2}px`,
                    }}
                width={[15, 75, 10]}
                maxItems={100}
          
            />
            </Col>
            <Col span={12} style ={{
                background:'#fff',
               
            }}>
                <Table bordered={false} scroll={{ x: 1300 }} columns={columns} dataSource={this.props.data} pagination={false} size="small" />
            </Col>
        </Row> )
    }
}
export default ViewData;