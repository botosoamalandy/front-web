import React, {Component} from 'react';
import './LoginAdmin.css';
import { utile } from '../../service/utile';
import Loading from '../loading/Loading';
import AlertMessage from '../alert-message/AlertMessage';
import { fetchPost } from '../../service/requeteHttp';
import { auth } from '../../service/auth';
import { Navigate } from 'react-router-dom';
import { codeAuth } from '../../service/codeAuth';

class LoginAdmin extends Component{
    constructor(props){ 
        super();
        this.state = {
            //laoding
            activeloader : false,
            //modal        
            headersmsmodal : "",
            bodysmsmodal : '',
            etatsmsmodal : false,
            //data login
            telephone : '',
            mdp : '',
            //data erreur
            error : {message : '', etat: false},
            //redirection page vers autre page 
            redirect : {url : '', etat : false},
        }
    }
    //login
    functionLoginAdmin(){
        let tel = this.state.telephone; let mdp = this.state.mdp;
        if(utile.getVerificationChampsText(tel) && utile.getVerificationChampsText(mdp)){
            const data ={telephone : tel, mot_de_passe : mdp , status : codeAuth.administrateur};
            this.setState({activeloader : true});
            fetchPost('utilisateur/login-utilisateur',data).then(response=>{
                if(response!==null && response!==undefined){
                    if(response.status === 200){
                        console.log('token : ',response.token)
                        let verification = auth.getVerifToken(response.token);
                        if(verification){ 
                            let utilisateur = auth.getDataUtilisateurByToken(response.token);
                            console.log('utilisateur : ',utilisateur)
                            if(utilisateur.codeutilisateur===codeAuth.administrateur){
                                //console.log('codeutilisateur : ',utilisateur.codeutilisateur)
                                auth.authentificationUtilisateur(response.token);
                                window.location.replace('/profile-administrateur');
                                //this.setState({redirect: {url : '/profil-administrateur', etat : true}});
                            }
                        }else{
                            this.setState({headersmsmodal: "Message",bodysmsmodal: 'Les informations sont incomplètes, merci de compléter tous les champs.',etatsmsmodal : true});
                        }
                    }else{
                        this.setState({headersmsmodal: "Message",bodysmsmodal: ''+response.message,etatsmsmodal : true});
                    }
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: 'Le serveur ne marche pas',etatsmsmodal : true});
                }
                this.setState({activeloader : false});
            });
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: 'Les informations sont incomplètes, merci de compléter tous les champs.',etatsmsmodal : true});
        }
    }
    //loading 
    getDataHtmlLoading(activation){
        return <Loading active ={activation} />
    }
    //Alert message
    setActiveInPropsAlertMessage(valeur){
        this.setState({etatsmsmodal: valeur});
    }
    getAffichageModal(etatsmsmodal){
        return <AlertMessage header={this.state.headersmsmodal} body={this.state.bodysmsmodal} active ={etatsmsmodal} setActiveInProps={(e)=>this.setActiveInPropsAlertMessage(e)} />;
    }
    render(){
        if(this.state.redirect.etat) return <Navigate to={''+this.state.redirect.url}/>
        return ( 
            <> 
                {this.getDataHtmlLoading(this.state.activeloader)}
                {this.getAffichageModal(this.state.etatsmsmodal)}
                <div className="mainLoginVaccinodrome">
                    <div className="containerLoginVaccinodrome">
                        <div className="appointment-form" id="appointment-form">
                            <h2 className="title_register">Connexion Administrateur</h2>
                            <div className="smsloginVaccinodrome"></div>
                            <div className="form-group-1">
                                <input type="email" className="champsRegister" onChange={(e)=>this.setState({telephone: e.target.value})} placeholder="Numéro de téléphone" />
                                <input type="password" className="champsRegister" onChange={(e)=>this.setState({mdp: e.target.value})}  placeholder="Mot de passe" />
                            </div>
                            <div className="form-submit"><input type="button" onClick={()=>this.functionLoginAdmin()} className="submit" value="Connexion" /></div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default LoginAdmin;