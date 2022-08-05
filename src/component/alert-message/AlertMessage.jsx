import React, {Component} from 'react';
import './AlertMessage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class AlertMessage extends Component{
    constructor(props){
        super();
        this.state={
            header : props.header,
            body : props.body,
            active : props.active
        }
    }
    handleClick=()=>{
        this.props.setActiveInProps(false);
    }
    
    render(){
        return (
            <div className="modalDialog" style={{display:(this.props.active===true)?"block":"none"}}>
                <div className="son_modalDialog">
                    <a href="#fermer" className="close" onClick={()=>this.handleClick()}>X</a>
                    <h2 className="title_alertMessage">{this.props.header}</h2>
                    <div className="body_alertMessage">{this.props.body}</div>
                </div>
            </div>
        )
    }
}
export default AlertMessage;