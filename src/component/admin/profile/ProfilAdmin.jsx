import React, {Component} from 'react';
import './ProfilAdmin.css';
import imgprofile from '../../../assets/imgprofile.jpg';
import { faCakeCandles, faEnvelope, faPhone, faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchGet, fetchPost } from '../../../service/requeteHttp';
import { utile } from '../../../service/utile';
import { auth } from '../../../service/auth';
import Loading from '../../loading/Loading';
import AlertMessage from '../../alert-message/AlertMessage';
import axios from 'axios';
import { confignode } from '../../../urlConf';

class ProfilAdmin extends Component{
    constructor(props){ 
        super();
        this.state = {
            //--laoding
            activeloader : false,
            //---modal        
            headersmsmodal : "",
            bodysmsmodal : '',
            etatsmsmodal : false,
            //stepper 
            stepper : 1,
            // data utilisateur
            utilisateur : null,
            // data edit utilisateur
            utilisateurEdit : null,
            nomUtilisateur : "",
            sexeUtilisateur : 0,
            naissanceUtilisateur : "",
            emailUtilisateur : "",
            telephoneUtilisateur : "",
            photoPatient : null,
        }
    }
    componentDidMount() {
        this.getUtilisateurById();
    }
    //get  utilisateur by idutilisateur 
    getUtilisateurById(){
        let dataToken = auth.getDataUtilisateurToken();
        if(dataToken!==null && dataToken!==undefined){
            let idutilisateur = utile.parseStringToInt(dataToken.id);
            if(idutilisateur!==undefined && idutilisateur!==null && idutilisateur>0){
                fetchGet('utilisateur/byid/'+idutilisateur).then(response=>{
                    if(response!== undefined && response!==null){
                        if(response.idutilisateur>0){
                            console.log(response)
                            this.setState({utilisateur : response});
                            console.log('date : ',utile.getDateFormatNormal(response.naissance))
                        }
                    }
                })
            }
        }
    }
    // data html profil administrateur 
    getDataHtmlProfilAdminstrateur(utilisateur){
        if(utilisateur!==undefined && utilisateur!==null){
            return (
                <>
                    <div className="img_user_profilePatient">
                        <img src={utilisateur.urlPhoto} alt="photo_patient" className="photoPatientProfilePatient"/>
                        <div className="nomUtilisateurProfilPatient">{utilisateur.nom}</div>
                        <div className="divdescriptionProfilePatient"> 
                            <div className="description"><span><FontAwesomeIcon icon={faVenusMars} /></span> &nbsp;&nbsp;&nbsp;  {(utilisateur.sexe===2)?'FEMME':'HOMME'}</div>
                            <div className="description"><span><FontAwesomeIcon icon={faCakeCandles} /></span> &nbsp;&nbsp;&nbsp;  {utile.getDateComplet(utilisateur.naissance)}</div>
                            <div className="description"><span><FontAwesomeIcon icon={faEnvelope} /></span> &nbsp;&nbsp;&nbsp; {utilisateur.email}</div>
                            <div className="description"><span><FontAwesomeIcon icon={faPhone} /></span> &nbsp;&nbsp;&nbsp; {utilisateur.telephone}</div>
                        </div>
                        <div className="btnModificationProfilePatient"><button className="btnProfilePatient" onClick={()=>this.setState({utilisateurEdit : utilisateur,stepper : 2})}>Modifier</button></div>
                    </div>
                </>
            )
        }else{
            return <div></div>
        }
    } 
    // data html update utilisateur
    getDataHtmlUpdateUtilisateur(utilisateur){
        return (
            <>
                <div className="editUtilisateurPA">
                    <div className="divrowAndContainerTwo">
                        <div className="editUtilisateurTitlePA">Modification des informations</div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({nomUtilisateur : e.target.value})} defaultValue={utilisateur.nom} type="text" placeholder=" Nom du patient"/>
                                <label>Nom</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <select defaultValue={utilisateur.sexe} onChange={(e)=>this.setState({sexeUtilisateur : utile.parseStringToInt(""+e.target.value)})}>
                                    <option value={0}>Votre sexe</option>
                                    <option value={1}>Homme</option>
                                    <option value={2}>Femme</option>
                                </select>
                                <label>Sexe</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({naissanceUtilisateur : e.target.value})} defaultValue={utile.getDateFormatNormal(utilisateur.naissance)} type="date" placeholder=""/>
                                <label>Date de naissance</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({emailUtilisateur : e.target.value})} defaultValue={utilisateur.email} type="email" placeholder="Email patient"/>
                                <label>Email</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({telephoneUtilisateur : e.target.value})} defaultValue={utilisateur.telephone} type="text" placeholder="Numéro de téléphone"/>
                                <label>Téléphone</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.changeImageUtilisateur(e)} type="file" placeholder="Numéro de téléphone"/>
                                <label>Photo</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-sm-6 col-xs-12"><button className="btnchampsUpdateProfilePatient" onClick={()=>this.enregistrerUpdateUtilisation(utilisateur)}>Enregistrer</button></div>
                            <div className="col-md-6 col-sm-6 col-xs-12"><button className="btn2champsUpdateProfilePatient" onClick={()=>this.setState({stepper : 1})}>Annuler</button></div>
                        </div>
                        
                    </div>
                </div>
            </>
        )
    }
    
    // enregistrer update utilisateur
    enregistrerUpdateUtilisation=(utilisateur)=>{
        if(utilisateur!==null && utilisateur!==undefined){
            let nomUtilisateur = this.state.nomUtilisateur;let sexeUtilisateur = this.state.sexeUtilisateur;let naissanceUtilisateur = this.state.naissanceUtilisateur;
            let emailUtilisateur = this.state.emailUtilisateur;let telephoneUtilisateur = this.state.telephoneUtilisateur;let photoPatient = this.state.photoPatient;
            let nomPhoto = utilisateur.urlPhoto;
            if(!utile.getVerificationChampsText(nomUtilisateur) || nomUtilisateur===null || nomUtilisateur===undefined){ nomUtilisateur = utilisateur.nom;}
            if(!(sexeUtilisateur>0 && sexeUtilisateur<3) || sexeUtilisateur===null || sexeUtilisateur===undefined){ sexeUtilisateur = utilisateur.sexe;}
            if(!utile.getVerificationChampsText(naissanceUtilisateur) || naissanceUtilisateur===null || naissanceUtilisateur===undefined){ naissanceUtilisateur = utilisateur.naissance;}
            if(!utile.getVerificationChampsText(emailUtilisateur) || emailUtilisateur===null || emailUtilisateur===undefined){ emailUtilisateur = utilisateur.email;}
            if(!utile.getVerificationChampsText(telephoneUtilisateur) || telephoneUtilisateur===null || telephoneUtilisateur===undefined){ telephoneUtilisateur = utilisateur.telephone;}
            if(photoPatient!==null && photoPatient!==undefined){ 
                const dataPhoto = new FormData() 
                dataPhoto.append('photo', photoPatient)
                axios.post(confignode+"photo", dataPhoto).then(res => { 
                    if(res.data!==null && res.data!==undefined){
                        let imageUrl = res.data.image;
                        if(imageUrl!==null && imageUrl!==undefined && imageUrl!==''){
                            let data ={
                                idutilisateur : utilisateur.idutilisateur,
                                idtypeutilisateur : utilisateur.idtypeutilisateur,
                                nom : nomUtilisateur,
                                sexe : sexeUtilisateur,
                                naissance : naissanceUtilisateur,
                                email : emailUtilisateur,
                                telephone : telephoneUtilisateur,
                                mot_de_passe : utilisateur.mot_de_passe,
                                urlPhoto : imageUrl,
                                date_ajout : utilisateur.date_ajout,
                                status : 1,
                            };
                            fetchPost('utilisateur/update-patient',data).then(response=>{
                                if(response!==null && response!==undefined){
                                    this.getUtilisateurById()
                                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true});
                                }
                            })
                        }
                    }else{
                        this.setState({headersmsmodal: "Message",bodysmsmodal: "L'insertion de l'image a echoué",etatsmsmodal : true});
                    }
                })
            }else{
                let data ={
                    idutilisateur : utilisateur.idutilisateur,
                    idtypeutilisateur : utilisateur.idtypeutilisateur,
                    nom : nomUtilisateur,
                    sexe : sexeUtilisateur,
                    naissance : naissanceUtilisateur,
                    email : emailUtilisateur,
                    telephone : telephoneUtilisateur,
                    mot_de_passe : utilisateur.mot_de_passe,
                    urlPhoto : nomPhoto,
                    date_ajout : utilisateur.date_ajout,
                    status : 1,
                };
                fetchPost('utilisateur/update-patient',data).then(response=>{
                    if(response!==null && response!==undefined){
                        this.getUtilisateurById()
                        this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true});
                    }
                })
            }
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes, merci de compléter tous les champs.",etatsmsmodal : true});
        }
    }
    // handle image  
    changeImageUtilisateur=(e)=>{
        let files = e.target.files;
        if(files.length >0){
            let size = files[0].size/1024;
            if(size<=1000){
                if(utile.getVerifiExtensionImage(files[0].name)){
                    this.setState({photoPatient : files[0]})
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "L'image doit être au format JPG,JPEG ou PNG.",etatsmsmodal : true});
                }
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "L'image doit être inférieur à 1000ko ( Votre image est de "+size+"ko )",etatsmsmodal : true});
            }
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "L'image contient des informations erronées.",etatsmsmodal : true});
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
        return ( 
            <> 
                {this.getDataHtmlLoading(this.state.activeloader)}
                {this.getAffichageModal(this.state.etatsmsmodal)}
                <div className="principaleProfilAdmin">
                    <div className="imageFondProfilePatient">
                        <img src={imgprofile} alt="image_de_fond_profil" className="image_de_fond_profil"/>
                    </div>
                    {
                        (this.state.stepper===2)?this.getDataHtmlUpdateUtilisateur(this.state.utilisateur)
                        :this.getDataHtmlProfilAdminstrateur(this.state.utilisateur)
                    }
                    
                </div>
            </>
        )
    }
}
export default ProfilAdmin;