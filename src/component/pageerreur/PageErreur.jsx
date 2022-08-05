import React, {Component} from 'react';
import { utile } from '../../service/utile';
import './PageErreur.css';

class PageErreur extends Component{
    constructor(props){ 
        super();
        this.state = {
            one : "4",
            two : "0",
            three : "4",
            message : "Vous n'étiez pas autorisé à consulter cette page.",
            description : "Pour y accéder, il faut se connecter en tant qu'administrateur."
        }
    }
    componentDidMount() {
       let one = this.props.one;let two = this.props.two;let three = this.props.three;let message = this.props.message;let description = this.props.description;
       if(utile.getVerificationChampsText(one) && utile.getVerificationChampsText(two) && utile.getVerificationChampsText(three) && utile.getVerificationChampsText(message)
        && utile.getVerificationChampsText(description)){
            this.setState({one : one, two : two, three : three,message : message,description : description});
       }
    }
    
    render(){
        return ( 
            <> 
                <div className="bodyPageErreur">
                    <h1 className="titleerror">{this.state.message}</h1>
                    <p className="zoom-area">{this.state.description}</p>
                    <section className="error-container">
                        <span>{this.state.one}</span><span><span className="screen-reader-text">{this.state.two}</span></span><span>{this.state.three}</span>
                    </section>
                    <div className="link-container">
                        <a href="/" className="more-link">Retour</a>
                    </div>
                </div>
            </>
        )
    }
}
export default PageErreur;