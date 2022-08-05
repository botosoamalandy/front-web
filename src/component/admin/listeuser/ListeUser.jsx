import React, {Component} from 'react';
import './ListeUser.css';
import { fetchGet, fetchPost } from '../../../service/requeteHttp';
import { utile } from '../../../service/utile';
import Loading from '../../loading/Loading';
import AlertMessage from '../../alert-message/AlertMessage';
import Pagination from '../../pagination/Pagination';
import { ProgressBar} from 'react-bootstrap';
import { auth } from '../../../service/auth';
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import verificationMotDePasseEnPourcentage from '../../../service/motDePasse';
import { codeAuth } from '../../../service/codeAuth';
import { confignode } from '../../../urlConf';
import axios from 'axios';

class ListeUser extends Component{
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
            listUtilisateur : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },// data : [] = > {docs, page},
            dataSearchListUtilisateur : {libeller : '', colone : '',etat : false},
            listUtilisateurStatus : 11,
            //add administrateur
            nomUtilisateur : "",
            sexeUtilisateur : 0,
            naissanceUtilisateur : "",
            emailUtilisateur : "",
            telephoneUtilisateur : "",
            motDePasseUtilisateur : "",
            conformationUtilisateur : "",
            photoUtilisateur : null,
            percentageMdpOublie : '',
        }
    }
    componentDidMount() {
        this.getListeUtilisateur(0);
    }
    // list utilisateur to display list
    getVerificationDataPage(page){
        let data = this.state.listUtilisateur.data;let size =  data.length;
        if(size > 0){
            for (let i = 0; i < size; i++) {
                if(data.page === page){
                    this.setState({listUtilisateur : {data : this.state.listUtilisateur.data,page : page, libeller : this.state.listUtilisateur.libeller, colone : this.state.listUtilisateur.colone}});
                    return true;
                }
            }
            return false;
        }
        return false;
    }
    getListeUtilisateur(page){
        if(!this.getVerificationDataPage(page)){
            let dataSearchListUtilisateur = this.state.dataSearchListUtilisateur;
            let listUtilisateurStatus = this.state.listUtilisateurStatus;
            console.log("listUtilisateurStatus : ",listUtilisateurStatus)
            let url = "utilisateur/";let libeller =  dataSearchListUtilisateur.libeller;
            if(dataSearchListUtilisateur.etat && utile.getVerificationChampsText(libeller)){url=url+"list-search/10/"+page+"/"+listUtilisateurStatus+"/"+libeller;}else{url=url+"list/10/"+page+"/"+listUtilisateurStatus;}
            this.setState({activeloader : true});
            fetchGet(url).then(response=>{ 
                console.log("response : ",response);
                this.setState({activeloader : false});
                if(response !== undefined && response!==null){
                    let listUtilisateur = this.state.listUtilisateur;let tmp= listUtilisateur.data;let size = tmp.length;let test = false;
                    for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
                    if(!test){ tmp.push({docs : response.docs,page : response.page}); }
                    this.setState({listUtilisateur : {data : tmp,page : response.page, libeller : listUtilisateur.libeller, colone : listUtilisateur.colone,totalpage : response.totalPages}});
                }
            });
        }
    }
    getDataUtilisateurInState(listUtilisateur){
        let data = listUtilisateur.data;let page = listUtilisateur.page;let size = data.length;
        if(size > 0){
            for (let i = 0; i < size; i++) {
                if(data[i].page === page){
                    return data[i].docs;
                }
            }
            return [];
        }
        return [];
    }
    //pagination liste vaccinview
    setPageInPaginationUtilisateur=(e)=>{
        let newpage = utile.parseStringToInt(e)-1;
        if(newpage>=0){   
            this.getListeUtilisateur(newpage);
        }
    }
    createDataHtmlPaginationUtilisateur(pageTotal,page){
        if(pageTotal>0  && page>=0){
            return  <Pagination totalPages={pageTotal} page={page} setPage={(e)=> this.setPageInPaginationUtilisateur(e)} />
        }
        return <div></div>
    }
    // 
    getVerificationIdentiter(idutilisateurUser){
        let dataToken = auth.getDataUtilisateurToken();
        if(dataToken!==null && dataToken!==undefined){
            let idutilisateur = utile.parseStringToInt(dataToken.id);
            if(idutilisateur!==undefined && idutilisateur!==null && idutilisateur>0){
                if(idutilisateur === idutilisateurUser){return true;}
            }
        }
        return false;
    }
    //changement de couleur (progression mot de passe)
    getColorPourcentage(pourcentage){
        if(pourcentage>=100){
            return 'success';
        }else if(pourcentage>60 && pourcentage<=99){
            return 'warning';
        }else{
            return 'danger';
        }
    }
    // handle image  
    changeImageUtilisateur=(e)=>{
        let files = e.target.files;
        if(files.length >0){
            let size = files[0].size/1024;
            if(size<=1000){
                if(utile.getVerifiExtensionImage(files[0].name)){
                    this.setState({photoUtilisateur : files[0]})
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
    // handle select etat utilisateur
    handleSelectEtatUtilisateur=(value)=>{
        this.setState({listUtilisateurStatus : value,listUtilisateur : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, }},()=>{
            this.getListeUtilisateur(0)
        })
    }
    //data html de tous les utilisateurs
    getDataHtmlTousLesUtilisateur(listUtilisateur){
        return (
            <>
                <div className="containerListeUtilisateur">
                    <h1 className="title_table_list_utilisateurLU">Liste de tous les utilisateurs</h1>
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered tableRdvPatient">
                            <thead>
                                <tr className="trSearchRdvPatient">
                                    <th colSpan={3}><input type="text" className="inputListeUtilisateurLU" onChange={(e)=>this.setState({dataSearchListUtilisateur : {libeller : e.target.value, colone : '',etat : true}})} placeholder="Nom de l'utilisateur"/></th>
                                    <th colSpan={1}>
                                        <select className="inputListeUtilisateurLU" onChange={(e)=>this.handleSelectEtatUtilisateur(utile.parseStringToInt(""+e.target.value))}>
                                            <option value={1}>Selectionner votre utilisateur</option>
                                            <option value={11}>toutes les utilisateur</option>
                                            <option value={1}>Patient</option>
                                            <option value={3}>Administrateur</option>
                                        </select>    
                                    </th>
                                    <th colSpan={1}><button className="btnSearchListeUtilisateurLU" onClick={()=>this.setState({listUtilisateur : {data : [],page : 0, libeller : '', colone : '',totalpage : 0}},()=>this.getListeUtilisateur(0))}><FontAwesomeIcon icon={faSearch} /></button></th>
                                    <th colSpan={1}><button className="btnRefreshListeUtilisateurLU" onClick={()=>this.setState({dataSearchListUtilisateur : {libeller : '', colone : '',etat : false},listUtilisateur : {data : [],page : 0, libeller : '', colone : '',totalpage : 0}},()=>this.getListeUtilisateur(0))}><FontAwesomeIcon icon={faRefresh} /></button></th>
                                    <th colSpan={1}><button className="btnAddRdvPatient" onClick={()=>this.setState({stepper : 2})}>Nouvelle admin</button></th>
                                </tr>
                                <tr className="tr2SearchRdvPatientTmp">
                                    <th colSpan={7}></th>
                                </tr>
                                <tr>
                                    <th>Nom</th>
                                    <th>sexe</th>
                                    <th>Age</th>
                                    <th>Email</th>
                                    <th className="textAlignCenter">Téléphone</th>
                                    <th>Etat</th>
                                    <th className="textAlignCenter">Actions</th>
                                </tr>
                            </thead>
                            <tbody> 
                                {
                                    (this.getDataUtilisateurInState(listUtilisateur)).map((data,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td className="textAlignLeft">{data.nom}</td>
                                                <td className="textAlignLeft">{(data.sexe===2)?"Femme":"Homme"}</td>
                                                <td className="textAlignRightTmp">{this.getAgeByDateNaissance(data.naissance)}</td>
                                                <td className="textAlignLeft">{data.email}</td>
                                                <td className="textAlignCenter">{data.telephone}</td>
                                                {
                                                    (data.idtypeutilisateur===3)?(
                                                        <>
                                                            <td className="textAlignLeft" colSpan={2} >{(data.idtypeutilisateur===3)?"Administrateur":(data.idtypeutilisateur===2)?"Vaccinodrome":"Patient"}</td>
                                                        </>
                                                    ):(
                                                        <>
                                                            <td className="textAlignLeft" colSpan={1}>{(data.idtypeutilisateur===3)?"Administrateur":(data.idtypeutilisateur===2)?"Vaccinodrome":"Patient"}</td>
                                                            <td className="textAlignCenter">
                                                                <button className="btn-danger" hidden={data.status!==1} onClick={()=>this.bloquerPatient(data.idutilisateur)}>Bloquer</button>
                                                                <button className="btn-primary" hidden={data.status!==11} onClick={()=>this.restaurerPatient(data.idutilisateur)}>Restaurer</button>
                                                            </td>
                                                        </>
                                                    )
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    {this.createDataHtmlPaginationUtilisateur(listUtilisateur.totalpage,listUtilisateur.page)}
                </div>
            </>
        )
    }
    // data html ajouter administrateur
    getDataHtmlAddAdministrateur(){
        return (
            <>
                <div className="editUtilisateurPA">
                    <div className="divrowAndContainerTwo">
                        <div className="editUtilisateurTitlePA">Ajouter une nouvelle adminstrateur</div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({nomUtilisateur : e.target.value})}  type="text" placeholder=" Nom de l'administrateur"/>
                                <label>Nom</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <select onChange={(e)=>this.setState({sexeUtilisateur : utile.parseStringToInt(""+e.target.value)})}>
                                    <option value={0}>Votre sexe</option>
                                    <option value={1}>Homme</option>
                                    <option value={2}>Femme</option>
                                </select>
                                <label>Sexe</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({naissanceUtilisateur : e.target.value})} type="date" placeholder=""/>
                                <label>Date de naissance</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({emailUtilisateur : e.target.value})} type="email" placeholder="Email de l'administrateur"/>
                                <label>Email</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({telephoneUtilisateur : e.target.value})} type="text" placeholder="Numéro de téléphone"/>
                                <label>Téléphone</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({motDePasseUtilisateur : e.target.value,percentageMdpOublie : verificationMotDePasseEnPourcentage(e.target.value)})} type="password" placeholder="Mot de passe"/>
                                <label>Mot de passe</label>
                            </div>
                            <div className="input-group mdpgourpLoginPatient" style={{marginTop : "5px"}}>
                                <div className="progressBarSonOfChildLoggin"><ProgressBar variant={this.getColorPourcentage(this.state.percentageMdpOublie)} now={this.state.percentageMdpOublie} /></div>
                                <div className="text-mdp-ListeUser">Le mot de passe doit contenir un nombre, une majuscule, une minuscule, un caractère spécial(#,*,%,!...) et au moins 8 caractères.</div>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({conformationUtilisateur : e.target.value})} type="password" placeholder="Confirmation mot de passe"/>
                                <label>Confirmation mot de passe</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.changeImageUtilisateur(e)} type="file" />
                                <label>Photo</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-sm-6 col-xs-12"><button className="btnchampsUpdateProfilePatient" onClick={()=>this.enregistrerAdministrateur()}>Enregistrer</button></div>
                            <div className="col-md-6 col-sm-6 col-xs-12"><button className="btn2champsUpdateProfilePatient" onClick={()=>this.setState({stepper : 1})}>Annuler</button></div>
                        </div>
                        
                    </div>
                </div>
            </>
        )
    }
    // ajouter une nouvelle administrateur
    enregistrerAdministrateur=()=>{
        let nom = this.state.nomUtilisateur;let sexe = utile.parseStringToInt(""+this.state.sexeUtilisateur);let naissance = this.state.naissanceUtilisateur;
        let email = this.state.emailUtilisateur;let telephone = this.state.telephoneUtilisateur;let motDePasse = this.state.motDePasseUtilisateur;
        let conformation = this.state.conformationUtilisateur;let photoUtilisateur = this.state.photoUtilisateur;let percentageMdp = this.state.percentageMdpOublie;
        if(utile.getVerificationChampsText(nom) && sexe>0 && sexe<3 && utile.getVerificationChampsText(naissance) && utile.getVerificationChampsText(email) && 
        utile.getVerificationChampsText(telephone) && utile.getVerificationChampsText(motDePasse) && utile.getVerificationChampsText(conformation) && 
        photoUtilisateur!==undefined && photoUtilisateur!==null && percentageMdp===100 && motDePasse===conformation){
            const dataPhoto = new FormData() 
            dataPhoto.append('photo', photoUtilisateur)
            axios.post(confignode+"photo", dataPhoto).then(res => { 
                if(res.data!==null && res.data!==undefined){
                    let imageUrl = res.data.image;
                    if(imageUrl!==null && imageUrl!==undefined && imageUrl!==''){
                        let data ={
                            idutilisateur : 0,
                            idtypeutilisateur : codeAuth.administrateur,
                            nom : nom,
                            sexe : sexe,
                            naissance : naissance,
                            email : email,
                            telephone : telephone,
                            mot_de_passe : motDePasse,
                            urlPhoto : imageUrl,
                            date_ajout : naissance,
                            status : 1,
                        };
                        fetchPost('utilisateur/administrateur-patient',data).then(response=>{
                            if(response!==null && response!==undefined){
                                this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,dataSearchListUtilisateur : {libeller : '', colone : '',etat : false},listUtilisateur : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, }},()=>{
                                    this.getListeUtilisateur(0);
                                });
                            }
                        })
                    }
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "L'insertion de l'image a echoué",etatsmsmodal : true});
                }
            })
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes, merci de compléter tous les champs.",etatsmsmodal : true});
        }
    }
    // bloquer un utilisateur
    bloquerPatient=(idutilisateur)=>{
        if(window.confirm("êtes-vous certain de vouloir bloquer ce compte ?")){
            if(idutilisateur!==undefined && idutilisateur!==null){
                this.setState({activeloader : true});
                fetchGet("utilisateur/bloquer-utilisateur/"+idutilisateur).then(response=>{ 
                    this.setState({activeloader : false});
                    if(response !== undefined && response!==null){
                        this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,dataSearchListUtilisateur : {libeller : '', colone : '',etat : false},listUtilisateur : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, }},()=>{
                            this.getListeUtilisateur(0);
                        });
                    }
                });
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes.",etatsmsmodal : true});
            }
        }
    }
    // restaure un utilisateur blouqué
    restaurerPatient=(idutilisateur)=>{
        if(window.confirm("Voulez-vous vraiment rétablir l'accès à ce compte ?")){
            if(idutilisateur!==undefined && idutilisateur!==null){
                this.setState({activeloader : true});
                fetchGet("utilisateur/restaurer-utilisateur/"+idutilisateur).then(response=>{ 
                    this.setState({activeloader : false});
                    if(response !== undefined && response!==null){
                        this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,dataSearchListUtilisateur : {libeller : '', colone : '',etat : false},listUtilisateur : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, }},()=>{
                            this.getListeUtilisateur(0);
                        });
                    }
                });
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes.",etatsmsmodal : true});
            }
        }
    }
    // calcul age 
    getAgeByDateNaissance(naissance){
        try {
            let data = new Date(naissance);let now = new Date();
            return now.getFullYear() - data.getFullYear();
        } catch (error) {
            return "";
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
                    {
                        (this.state.stepper===2)?this.getDataHtmlAddAdministrateur():
                        this.getDataHtmlTousLesUtilisateur(this.state.listUtilisateur)
                    }
                </div>
            </>
        )
    }
}
export default ListeUser;