import React, {Component} from 'react';
import './Loading.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Loading extends Component{
    constructor(props){
        super();
        this.state={}
    }
    handleClick=()=>{
        this.props.setActiveInProps(false);
    }
    
    render(){
        return (
            <div className="body_loading" style={{display:(this.props.active===true)?"block":"none"}}>
                <div className="loading">
                    <h2 className="title_loading">RDV Vaksiny</h2>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        )
    }
}
export default Loading;