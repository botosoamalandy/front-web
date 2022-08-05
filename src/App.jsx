import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Menu from './component/menu/Menu';
import Footer from './component/footer/Footer';
import Accueil from './component/accueil/Accueil';
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom';
import LoginAdmin from './component/login/LoginAdmin';
import ProfilAdmin from './component/admin/profile/ProfilAdmin';
import { auth } from './service/auth';
import LoginVaccinodrome from './component/login/LoginVaccinodrome';
import PageErreur from './component/pageerreur/PageErreur';
import { codeAuth } from './service/codeAuth';
import ProfileVaccinodrome from './component/vaccinodrome/profile/ProfileVaccinodrome';
import Vaccin from './component/vaccinodrome/vaccin/Vaccin';
import LoginPatient from './component/login/LoginPatient';
import ProfilePatient from './component/patient/profilePatient/ProfilePatient';
import RdvPatient from './component/patient/rdvPatient/RdvPatient';
import MesPatient from './component/vaccinodrome/mespatient/MesPatient';
import ListeUser from './component/admin/listeuser/ListeUser';
import ListeVaccinodrome from './component/admin/listevaccinodrome/ListeVaccinodrome';

class App extends React.Component {
  constructor(props){ 
    super(props);
    document.title="RDV Vaksiny";
  }
  redirectionUrlNonConnecter(header,content,footer){
    let authAdmin = auth.getAuthentication();
    if(authAdmin.etat){
      if(authAdmin.utilisateur.codeutilisateur===codeAuth.patient){return <Navigate to={'/profile-patient'}/>}
      if(authAdmin.utilisateur.codeutilisateur===codeAuth.vaccinodrome){return <Navigate to={'/profile-vaccinodrome'}/>}
      if(authAdmin.utilisateur.codeutilisateur===codeAuth.administrateur){return <Navigate to={'/profile-administrateur'}/>}
    }
    return (
      <>
        <header>{header}</header>
        <main>{content}</main>
        <footer>{footer}</footer>
      </>
    )

  }
  redirectionPageSecuriserAdmin(header,content,footer){
    let authAdmin = auth.getAuthentication();
    if(authAdmin.etat && authAdmin.utilisateur.codeutilisateur===codeAuth.administrateur){
      return (
        <>
          <header>{header}</header>
          <main>{content}</main>
          <footer>{footer}</footer>
        </>
      ) 
    }else{
      return <PageErreur one="4" two="0" three="3" message="Vous n'étiez pas autorisé à consulter cette page." description="Pour y accéder, il faut se connecter en tant qu'administrateur."/>
    }
  }
  redirectionPageSecuriserPatient(header,content,footer){
    let authPatient = auth.getAuthentication();
    if(authPatient.etat && authPatient.utilisateur.codeutilisateur===codeAuth.patient){
      return (
        <>
          <header>{header}</header>
          <main>{content}</main>
          <footer>{footer}</footer>
        </>
      ) 
    }else{
      return <PageErreur one="4" two="0" three="3" message="Vous n'étiez pas autorisé à consulter cette page." description="Pour y accéder, il faut se connecter en tant qu'administrateur."/>
    }
  }
  redirectionPageSecuriserVaccinodrome(header,content,footer){
    let authAdmin = auth.getAuthentication();
    if(authAdmin.etat && authAdmin.utilisateur.codeutilisateur===codeAuth.vaccinodrome){
      return (
        <>
          <header>{header}</header>
          <main>{content}</main>
          <footer>{footer}</footer>
        </>
      ) 
    }else{
      let description = "RDV Vaksiny est une application de prise de rendez-vous d'un patient à un centre de vaccination anti-Covid 19"; 
      let  message= "Vous n'étiez pas autorisé à consulter cette page.";
      return <PageErreur  one="4" two="0" three="3"  message={message} description={description}/>
    }
  }
  render() {
    return (
      <>
        <div className="App">
          <Router>
            <Routes>
              <Route exact path="/" element = {this.redirectionUrlNonConnecter(<Menu/>,<Accueil/>,<Footer/>)}/>
              {/* Administrateur */}
              <Route exact path="/connexion-administrateur" element = {this.redirectionUrlNonConnecter(<Menu/>,<LoginAdmin/>,<Footer/>)}/>
              <Route exact path="/profile-administrateur" element = {this.redirectionPageSecuriserAdmin(<Menu menu="admin"/>,<ProfilAdmin/>,<Footer/>)}/>
              <Route exact path="/liste-utilisateur" element = {this.redirectionPageSecuriserAdmin(<Menu menu="admin"/>,<ListeUser/>,<Footer/>)}/>
              <Route exact path="/liste-vaccinodrome" element = {this.redirectionPageSecuriserAdmin(<Menu menu="admin"/>,<ListeVaccinodrome/>,<Footer/>)}/>
              {/* vaccinodrome */}
              <Route exact path="/login-vaccinodrome" element = {this.redirectionUrlNonConnecter(<Menu/>,<LoginVaccinodrome stepContent={1} />,<Footer/>)}/>
              <Route exact path="/inscription-vaccinodrome" element = {this.redirectionUrlNonConnecter(<Menu/>,<LoginVaccinodrome stepContent={2}/>,<Footer/>)}/>
              <Route exact path="/profile-vaccinodrome" element = {this.redirectionPageSecuriserVaccinodrome(<Menu menu="vaccinodrome"/>,<ProfileVaccinodrome/>,<Footer/>)}/>
              <Route exact path="/vaccinodrome-vaccin" element = {this.redirectionPageSecuriserVaccinodrome(<Menu menu="vaccinodrome"/>,<Vaccin/>,<Footer/>)}/>
              <Route exact path="/mes-patients" element = {this.redirectionPageSecuriserVaccinodrome(<Menu menu="vaccinodrome"/>,<MesPatient/>,<Footer/>)}/>
              {/* patient */}
              <Route exact path="/login-patient" element = {this.redirectionUrlNonConnecter(<Menu/>,<LoginPatient stepContent={1} />,<Footer/>)}/>
              <Route exact path="/profile-patient" element = {this.redirectionPageSecuriserPatient(<Menu menu="patient"/>,<ProfilePatient/>,<Footer/>)}/>
              <Route exact path="/rendez-vous-patient" element = {this.redirectionPageSecuriserPatient(<Menu menu="patient"/>,<RdvPatient/>,<Footer/>)}/>
              {/* erreur */}
              <Route exact path="/*" element = {<PageErreur  one="4" two="0" three="4" message="Cette page n'est pas accessible" description="RDV Vaksiny est une application de prise de rendez-vous d'un patient à un centre de vaccination anti-Covid 19" />}/>
            </Routes>
          </Router> 
        </div>
      </>
    )
  }
}

export default App;
