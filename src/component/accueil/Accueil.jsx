import React, {Component} from 'react';
import './Accueil.css';
import fond1 from '../../assets/fond1.jpg';
import fond2 from '../../assets/fond2.jpg';
import fond3 from '../../assets/fond3.jpg';
import fond4 from '../../assets/fond4.jpg';
import { Link } from 'react-router-dom';

var images = [];
images.push(fond1);
images.push(fond2);
images.push(fond3);
images.push(fond4);
var length = images.length;
var i = 0;
class Accueil extends Component{
    constructor(props){ 
        super();
        this.state = {
            currentImage: 0,
            images: [fond1,fond2,fond3,fond4]
        }
        this.switchImage = this.switchImage.bind(this);
    }
    slider(){
        var slideImg = document.getElementById("slideImg");
        if(i> length-1){
            i = 0;
        }
        slideImg.src = images[i];
        i++;
       setTimeout(() => {this.slider().bind(this);console.log(" i");}, 10000);
    }
    switchImage() {
        if (this.state.currentImage < this.state.images.length - 1) {
          this.setState({
            currentImage: this.state.currentImage + 1
          });
        } else {
          this.setState({
            currentImage: 0
          });
        }
        return this.currentImage;
    }
    componentDidMount() {
        setInterval(this.switchImage, 3000);
    }
    render(){
        return ( 
            <div>
                <div className="banner">
                    <div className="slider">
                        <img src={this.state.images[this.state.currentImage]} alt="fond_1" id="slideImg"/>
                    </div>
                    <div className="overlay">
                        <div className="content">
                            <h1>VACCIN CONTRE LE COVID-19</h1>
                            <h3>C'est le meilleur moyen de se protéger du virus. Le vaccin renforce l'immunité donc il est conseillé de faire le vaccin pour éviter les formes graves.</h3>
                            <div>
                                <Link to="/login-patient" ><button type="button" className="buttonslider">PATIENT</button></Link>
                                <Link to="/login-vaccinodrome" ><button type="button" className="buttonslider2">VACCINODROME</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Accueil;