import React, {Component} from 'react';
import './Footer.css';

class Footer extends Component{
    constructor(props){ 
        super();
        this.state = {}
    }
    render(){
        return ( 
            <div> 
                <div className="container-fluid bg-dark text-body footer mt-5 pt-5 wow fadeIn tmpClassFooter" data-wow-delay="0.1s">
                    <div className="container">
                        <div className="copyright">
                            <div className="row">
                                <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                                    &copy; <a href="#RDVVaksiny">RDVVaksiny</a>, All Right Reserved.
                                </div>
                                <div className="col-md-6 text-center text-md-end">
                                    Copyright 2022
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        )
    }
}
export default Footer;