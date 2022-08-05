import React, {Component} from 'react';
import './Menu.css';
import logo from '../../assets/logo.jpg';
import { auth } from '../../service/auth';
import { Navigate,Link } from 'react-router-dom';


class Menu extends Component{
    constructor(props){ 
        super(); 
        this.state = {
            showNavBarBurger : false,
            redirect : {url : '', etat : false},
        }
        
    }
    functionShowNavBarBurger(){
        this.setState({showNavBarBurger : !this.state.showNavBarBurger});
    }
    deconnect(){
        auth.deconnection();
        window.location.replace('/');
    }
    redirectionInMenu(url){
        this.setState({redirect: {url : ''+url, etat : true}});
    }
    menuAccueil(){
        return (
            <div> 
                <nav className="navbar navbar-expand-lg navbar-expand-md bg-white navbar-light sticky-top md-0">
                    <a href="/" className="navbar-brand d-flex align-items-center border-end md-4 px-lg-5">
                        <img className="img-fluid" src={logo} alt=""/>
                    </a>
                    <button type="button" className="navbar-toggler me-3" onClick={()=>this.functionShowNavBarBurger()}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="navbar-nav ms-auto p-3 p-lg-0">
                            <Link className="nav-item nav-link active" to="/">Accueil</Link>
                            <Link className="nav-item nav-link" to="/login-patient">Patient</Link>
                            <Link className="nav-item nav-link" to="/login-vaccinodrome">Vaccinodrome</Link>
                            <Link className="nav-item nav-link" to="/connexion-administrateur">Admin</Link>
                        </div>
                    </div>
                </nav>
                <div className="menuBurgerNavBar" hidden={!this.state.showNavBarBurger}>
                    <div className="simple_menuBurgerNavBar" onClick={()=>this.redirectionInMenu('/')}>Accueil</div>
                    <div className="simple_menuBurgerNavBar" onClick={()=>this.redirectionInMenu('/login-patient')}>Patient</div>
                    <div className="simple_menuBurgerNavBar" onClick={()=>this.redirectionInMenu('/login-vaccinodrome')}>Vaccinodrome</div>
                    <div className="simple_menuBurgerNavBar" onClick={()=>this.redirectionInMenu('/connexion-administrateur')}>Administrateur</div>
                </div>
            </div>
        )
    }
    menuAdministrateur(){
        return (
            <div> 
                <nav className="navbar navbar-expand-lg navbar-expand-md bg-white navbar-light sticky-top md-0">
                    <a href="/profile-administrateur" className="navbar-brand d-flex align-items-center border-end md-4 px-lg-5">
                        <img className="img-fluid" src={logo} alt=""/>
                    </a>
                    <button type="button" className="navbar-toggler me-3" onClick={()=>this.functionShowNavBarBurger()}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="navbar-nav ms-auto p-3 p-lg-0">
                            <Link className="nav-item nav-link active" to="/profile-administrateur">Moi</Link>
                            <Link className="nav-item nav-link" to="/liste-utilisateur">Utilisateur</Link>
                            <Link className="nav-item nav-link" to="/liste-vaccinodrome">Vaccinodrome</Link>
                            <a href="#deconnexion" onClick={()=>{this.deconnect()}}  id="deconnexionMenu" className="nav-item nav-link">Deconnexion</a>
                        </div>
                    </div>
                </nav>
                <div className="menuBurgerNavBar" hidden={!this.state.showNavBarBurger}>
                    <div className="simple_menuBurgerNavBar" onClick={()=>this.redirectionInMenu('/profile-administrateur')}>Moi</div>
                    <div className="simple_menuBurgerNavBar" onClick={()=>this.redirectionInMenu('/liste-utilisateur')}>Utilisateur</div>
                    <div className="simple_menuBurgerNavBar" onClick={()=>this.redirectionInMenu('/liste-vaccinodrome')}>Vaccinodrome</div>
                    <div className="simple_menuBurgerNavBar" onClick={()=>{this.deconnect()}}>Deconnexion</div>
                </div>
            </div>
        )
    }
    menuVaccinodrome(){
        return (
            <div> 
                <nav className="navbar navbar-expand-lg navbar-expand-md bg-white navbar-light sticky-top md-0">
                    <a href="/profile-vaccinodrome" className="navbar-brand d-flex align-items-center border-end md-4 px-lg-5">
                        <img className="img-fluid" src={logo} alt=""/>
                    </a>
                    <button type="button" className="navbar-toggler me-3" onClick={()=>this.functionShowNavBarBurger()}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="navbar-nav ms-auto p-3 p-lg-0">
                            <Link className="nav-item nav-link active" to="/profile-vaccinodrome">Moi</Link>
                            <Link className="nav-item nav-link" to="/mes-patients">Patient</Link>
                            <Link className="nav-item nav-link" to="/vaccinodrome-vaccin">Vaccin</Link>
                            <a href="#deconnexion" onClick={()=>{this.deconnect()}}  id="deconnexionMenu" className="nav-item nav-link">Deconnexion</a>
                        </div>
                    </div>
                </nav>
                <div className="menuBurgerNavBar" hidden={!this.state.showNavBarBurger}>
                    <div className="simple_menuBurgerNavBar" onClick={()=>this.redirectionInMenu('/profile-vaccinodrome')}>Moi</div>
                    <div className="simple_menuBurgerNavBar" onClick={()=>this.redirectionInMenu('/mes-patients')}>Patient</div>
                    <div className="simple_menuBurgerNavBar" onClick={()=>this.redirectionInMenu('/vaccinodrome-vaccin')}>Vaccin</div>
                    <div className="simple_menuBurgerNavBar" onClick={()=>{this.deconnect()}}>Deconnexion</div>
                </div>
            </div>
        )
    }
    menuPatient(){
        return (
            <div> 
                <nav className="navbar navbar-expand-lg navbar-expand-md bg-white navbar-light sticky-top md-0">
                    <a href="/profile-patient" className="navbar-brand d-flex align-items-center border-end md-4 px-lg-5">
                        <img className="img-fluid" src={logo} alt=""/>
                    </a>
                    <button type="button" className="navbar-toggler me-3" onClick={()=>this.functionShowNavBarBurger()}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="navbar-nav ms-auto p-3 p-lg-0">
                            <Link className="nav-item nav-link active" to="/profile-patient">Moi</Link>
                            <Link className="nav-item nav-link" to="/rendez-vous-patient">Mes rendez-vous</Link>
                            <a href="#deconnexion" onClick={()=>{this.deconnect()}}  id="deconnexionMenu" className="nav-item nav-link">Deconnexion</a>
                        </div>
                    </div>
                </nav>
                <div className="menuBurgerNavBar" hidden={!this.state.showNavBarBurger}>
                    <div className="simple_menuBurgerNavBar" onClick={()=>this.redirectionInMenu('/profile-patient')}>Moi</div>
                    <div className="simple_menuBurgerNavBar" onClick={()=>this.redirectionInMenu('/rendez-vous-patient')}>Mes rendez-vous</div>
                    <div className="simple_menuBurgerNavBar" onClick={()=>{this.deconnect()}}>Deconnexion</div>
                </div>
            </div>
        )
    }
    navigateMenu(){
        let menu = this.props.menu;
        if(menu!==null && menu!==undefined && menu!==""){
            if(menu==="admin"){
                return this.menuAdministrateur();
            }else if(menu==="vaccinodrome"){
                return this.menuVaccinodrome();
            }else if(menu==="patient"){
                return this.menuPatient();
            }
        }
        return this.menuAccueil();
    }
    render(){
        if(this.state.redirect.etat) return <Navigate to={''+this.state.redirect.url}/>
        return ( 
            <>
                {this.navigateMenu()}
            </>
        )
    }
}
export default Menu;