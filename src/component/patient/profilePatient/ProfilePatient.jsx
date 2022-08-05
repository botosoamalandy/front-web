import React, {Component} from 'react';
import './ProfilePatient.css';
import imgprofile from '../../../assets/imgprofile.jpg';
import { faCakeCandles, faEdit, faEnvelope, faPerson, faPhone, faTrashAlt, faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { auth } from '../../../service/auth';
import { utile } from '../../../service/utile';
import { fetchGet, fetchPost } from '../../../service/requeteHttp';
import { confignode } from '../../../urlConf';
import AlertMessage from '../../alert-message/AlertMessage';
import Loading from '../../loading/Loading';
import Pagination from '../../pagination/Pagination';

class ProfilePatient extends Component{
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
            //utilisateur
            utilisateur : null,
            // data update utilisateur 
            nomUtilisateur : "",
            sexeUtilisateur : 0,
            naissanceUtilisateur : "",
            emailUtilisateur : "",
            telephoneUtilisateur : "",
            photoPatient : null,
            // data famille utilisateur
            nomFamille : "",
            sexeFamille : 0,
            naissanceFamille : "",
            positionFamille : "",
            photoFamille : null,
            // data famille
            listFamille : {data : [],page : 0,totalpage : 0},
            // data update famille
            dataUpdateFamille : null,
            nomUFamille : "",
            sexeUFamille : 0,
            naissanceUFamille : "",
            positionUFamille : "",
            photoUFamille : null, 
        }
    }
    componentDidMount() {
       this.getUtilisateurById();
       this.getFamille(0);
    }
    //data famille
    getVerificationDataPageFamille(page){
        let data = this.state.listFamille.data;let size =  data.length;
        if(size > 0){
            for (let i = 0; i < size; i++) {
                if(data.page === page){
                    this.setState({listFamille : {data : this.state.listFamille.data,page : page, totalpage : this.state.listFamille.totalpage}});
                    return true;
                }
            }
            return false;
        }
        return false;
    }
    getFamille(page){
        if(!this.getVerificationDataPageFamille(page)){
            this.setState({activeloader : true});
            fetchGet("famille/list/10/"+page).then(response=>{ 
                if(response !== undefined && response!==null){
                    this.setState({activeloader : false});
                    if(response !== undefined && response!==null){
                        let listFamille = this.state.listFamille;let tmp= listFamille.data;let size = tmp.length;let test = false;
                        for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
                        if(!test){ tmp.push({docs : response.docs,page : response.page}); }
                        this.setState({listFamille : {data : tmp,page : response.page,totalpage : response.totalPages}});
                    }
                }
            });
        }
    }
    getDataFamilleInState(listFamille){
        let data = listFamille.data;let page = listFamille.page;let size = data.length;
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
    //pagination liste famille
    setPageInPaginationFamille=(e)=>{
        let newpage = utile.parseStringToInt(e)-1;
        if(newpage>=0){   
            this.getFamille(newpage);
        }
    }
    createDataHtmlPaginationFamille(pageTotal,page){
        if(pageTotal>0  && page>=0){
            return  <Pagination totalPages={pageTotal} page={page} setPage={(e)=> this.setPageInPaginationFamille(e)} />
        }
        return <div></div>
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
    changeImageFamilleUtilisateur=(e)=>{
        let files = e.target.files;
        if(files.length >0){
            let size = files[0].size/1024;
            if(size<=1000){
                if(utile.getVerifiExtensionImage(files[0].name)){
                    this.setState({photoFamille : files[0]})
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
    changeImageUpdateFamilleUtilisateur=(e)=>{
        let files = e.target.files;
        if(files.length >0){
            let size = files[0].size/1024;
            if(size<=1000){
                if(utile.getVerifiExtensionImage(files[0].name)){
                    this.setState({photoUFamille : files[0]})
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
    // enregistre famille utilisateur
    enregistrerFamilleUtilisation=()=>{ 
        let nomFamille = this.state.nomFamille;let sexeFamille = this.state.sexeFamille;let naissanceFamille = this.state.naissanceFamille;
        let positionFamille = this.state.positionFamille;let photoFamille = this.state.photoFamille;let dataToken = auth.getDataUtilisateurToken();
        if(utile.getVerificationChampsText(nomFamille) && sexeFamille>0 && sexeFamille<3 && utile.getVerificationChampsText(naissanceFamille)
        && utile.getVerificationChampsText(positionFamille) && photoFamille!==null && photoFamille!==undefined && dataToken!==null && dataToken!==undefined){
            let idutilisateur = utile.parseStringToInt(dataToken.id);
            if(idutilisateur!==undefined && idutilisateur!==null && idutilisateur>0){
                const dataPhoto = new FormData() 
                dataPhoto.append('photo', photoFamille)
                axios.post(confignode+"photo", dataPhoto).then(res => { 
                    if(res.data!==null && res.data!==undefined){
                        let imageUrl = res.data.image;
                        if(imageUrl!==null && imageUrl!==undefined && imageUrl!==''){
                            let data = {
                                idFamille : 0,
                                idUtilisateur : idutilisateur,
                                nom : nomFamille,
                                sexe : sexeFamille,
                                naissance : naissanceFamille,
                                urlPhoto : imageUrl,
                                positionFamilliale : positionFamille,
                                status : 1
                            }
                            fetchPost('famille/insertion-famille',data).then(response=>{
                                if(response!==null && response!==undefined){
                                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true});
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
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes, merci de compléter tous les champs.",etatsmsmodal : true});
        }
    }
    // enregistrer les modifications familles
    enregistrerUpdateFamille=()=>{
        let dataUpdateFamille = this.state.dataUpdateFamille;let nomUFamille = this.state.nomUFamille;let sexeUFamille = this.state.sexeUFamille;
        let naissanceUFamille = this.state.naissanceUFamille;let positionUFamille = this.state.positionUFamille;let photoUFamille = this.state.photoUFamille;
        if(dataUpdateFamille!==undefined && dataUpdateFamille!==null){
            if(!utile.getVerificationChampsText(nomUFamille) || nomUFamille===null || nomUFamille===undefined){ nomUFamille = dataUpdateFamille.nom;}
            if(!(sexeUFamille > 0 && sexeUFamille < 3 ) || sexeUFamille===null || sexeUFamille===undefined){ sexeUFamille = dataUpdateFamille.sexe;}
            if(!utile.getVerificationChampsText(naissanceUFamille) || naissanceUFamille===null || naissanceUFamille===undefined){ naissanceUFamille = dataUpdateFamille.naissance;}
            if(!utile.getVerificationChampsText(positionUFamille) || positionUFamille===null || positionUFamille===undefined){ positionUFamille = dataUpdateFamille.positionFamilliale;}
            let data = {
                idFamille : dataUpdateFamille.idFamille,
                idUtilisateur : dataUpdateFamille.idUtilisateur,
                nom : nomUFamille,
                sexe : sexeUFamille,
                naissance : naissanceUFamille,
                urlPhoto : dataUpdateFamille.urlPhoto,
                positionFamilliale : positionUFamille,
                status : 1
            }
            console.log('dataUpdateFamille : ',dataUpdateFamille);
            console.log('DataTmp : ',data);
            if(photoUFamille!==null && photoUFamille!==undefined){ 
                const dataPhoto = new FormData() 
                dataPhoto.append('photo', photoUFamille)
                axios.post(confignode+"photo", dataPhoto).then(res => { 
                    if(res.data!==null && res.data!==undefined){
                        let imageUrl = res.data.image;
                        if(imageUrl!==null && imageUrl!==undefined && imageUrl!==''){
                            let data = {
                                idFamille : dataUpdateFamille.idFamille,
                                idUtilisateur : dataUpdateFamille.idUtilisateur,
                                nom : nomUFamille,
                                sexe : sexeUFamille,
                                naissance : naissanceUFamille,
                                urlPhoto : imageUrl,
                                positionFamilliale : positionUFamille,
                                status : 1
                            }
                            fetchPost('famille/update',data).then(response=>{
                                if(response!==null && response!==undefined){
                                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,listFamille : {data : [],page : 0,totalpage : 0}},()=>{
                                        this.getFamille(0);
                                    });
                                }
                            })
                        }
                    }else{
                        this.setState({headersmsmodal: "Message",bodysmsmodal: "L'insertion de l'image a echoué",etatsmsmodal : true});
                    }
                })
            }else{
                let data = {
                    idFamille : dataUpdateFamille.idFamille,
                    idUtilisateur : dataUpdateFamille.idUtilisateur,
                    nom : nomUFamille,
                    sexe : sexeUFamille,
                    naissance : naissanceUFamille,
                    urlPhoto : dataUpdateFamille.urlPhoto,
                    positionFamilliale : positionUFamille,
                    status : 1
                }
                fetchPost('famille/update',data).then(response=>{
                    if(response!==null && response!==undefined){
                        this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,listFamille : {data : [],page : 0,totalpage : 0}},()=>{
                            this.getFamille(0);
                        });
                    }
                })
            }
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes, merci de compléter tous les champs.",etatsmsmodal : true});
        }

    }
    // delete famille
    deleteFamille=(idFamille)=>{
        if(idFamille !== undefined && idFamille!==null && idFamille>0 && window.confirm("Êtes-vous certain de vouloir supprimer ces informations?")){
            this.setState({activeloader : true});
            fetchGet("famille/delete/"+idFamille).then(response=>{ 
                this.setState({activeloader : true,headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,listFamille : {data : [],page : 0,totalpage : 0}},()=>{
                    this.getFamille(0);
                });
            });
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes.",etatsmsmodal : true});
        }
    }
    // data html update utilisateur
    getDataHtmlUpdateUtilisateur(utilisateur){
        return (
            <>
                <div className="divrowAndContainerTwo">
                    <div className="divrowAndContainerTwotitle">Modification des informations</div>
                    <div className="son_champsUpdateProfilePatient">
                        <div className="formItem_champsUpdateProfilePatient">
                            <input onChange={(e)=>this.setState({nomUtilisateur : e.target.value})} defaultValue={utilisateur.nom} type="text" placeholder=" Nom du patient"/>
                            <label>Nom</label>
                        </div>
                    </div>
                    <div className="son_champsUpdateProfilePatient">
                        <div className="formItem_champsUpdateProfilePatient">
                            <select defaultValue={utilisateur.sexe} onChange={(e)=>this.setState({sexeUtilisateur : e.target.value})}>
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
            </>
        )
    }
    // data html ajout famille
    getDataHtmlAjoutFamille(){
        return (
            <>
                <div className="divrowAndContainerTwo">
                    <div className="divrowAndContainerTwotitle">Ajouter ma famille</div>
                    <div className="son_champsUpdateProfilePatient">
                        <div className="formItem_champsUpdateProfilePatient">
                            <input onChange={(e)=>this.setState({nomFamille : e.target.value})}  type="text" placeholder=" Nom du patient"/>
                            <label>Nom</label>
                        </div>
                    </div>
                    <div className="son_champsUpdateProfilePatient">
                        <div className="formItem_champsUpdateProfilePatient">
                            <select onChange={(e)=>this.setState({sexeFamille : e.target.value})}>
                                <option value={0}>Son sexe</option>
                                <option value={1}>Homme</option>
                                <option value={2}>Femme</option>
                            </select>
                            <label>Sexe</label>
                        </div>
                    </div>
                    <div className="son_champsUpdateProfilePatient">
                        <div className="formItem_champsUpdateProfilePatient">
                            <input onChange={(e)=>this.setState({naissanceFamille : e.target.value})} type="date" placeholder=""/>
                            <label>Date de naissance</label>
                        </div>
                    </div>
                    <div className="son_champsUpdateProfilePatient">
                        <div className="formItem_champsUpdateProfilePatient">
                            <select onChange={(e)=>this.setState({positionFamille : e.target.value})}>
                                <option value="">Position familiale</option>
                                <option value="Parents">Parents</option>
                                <option value="Enfant">Enfant</option>
                                <option value="Amis">Amis</option>
                            </select>
                            <label>Position familiale</label>
                        </div>
                    </div>
                    <div className="son_champsUpdateProfilePatient">
                        <div className="formItem_champsUpdateProfilePatient">
                            <input onChange={(e)=>this.changeImageFamilleUtilisateur(e)} type="file" placeholder="Numéro de téléphone"/>
                            <label>Photo</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12"><button className="btnchampsUpdateProfilePatient" onClick={()=>this.enregistrerFamilleUtilisation()}>Enregistrer</button></div>
                        <div className="col-md-6 col-sm-6 col-xs-12"><button className="btn2champsUpdateProfilePatient" onClick={()=>this.setState({stepper : 1})}>Annuler</button></div>
                    </div>
                </div>
            </>
        )
    }
    // data html ajout famille
    getDataHtmlUpdateFamille(famille){
        if(famille!==undefined && famille!==null){
            return (
                <>
                    <div className="divrowAndContainerTwo">
                        <div className="divrowAndContainerTwotitle">Modification des informations de ma famille</div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({nomUFamille : e.target.value})} defaultValue={famille.nom} type="text" placeholder=" Nom du patient"/>
                                <label>Nom</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <select onChange={(e)=>this.setState({sexeUFamille : e.target.value})}  defaultValue={famille.sexe}>
                                    <option value={0}>Son sexe</option>
                                    <option value={1}>Homme</option>
                                    <option value={2}>Femme</option>
                                </select>
                                <label>Sexe</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({naissanceUFamille : e.target.value})}  defaultValue={utile.getDateFormatNormal(famille.naissance)} type="date" placeholder=""/>
                                <label>Date de naissance</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <select onChange={(e)=>this.setState({positionUFamille : e.target.value})} defaultValue={famille.positionFamilliale}>
                                    <option value="">Position familiale</option>
                                    <option value="Parents">Parents</option>
                                    <option value="Enfant">Enfant</option>
                                    <option value="Amis">Amis</option>
                                </select>
                                <label>Position familiale</label>
                            </div>
                        </div>
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.changeImageUpdateFamilleUtilisateur(e)} type="file" placeholder="Numéro de téléphone"/>
                                <label>Photo</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-sm-6 col-xs-12"><button className="btnchampsUpdateProfilePatient" onClick={()=>this.enregistrerUpdateFamille()}>Enregistrer</button></div>
                            <div className="col-md-6 col-sm-6 col-xs-12"><button className="btn2champsUpdateProfilePatient" onClick={()=>this.setState({stepper : 1})}>Annuler</button></div>
                        </div>
                        
                    </div>
                </>
            )
        }
        return <div></div>
    }
    // data html list family
    getDataHtmlListFamily(listFamille){
        return (
            <>
                {
                    (this.getDataFamilleInState(listFamille)).map((data,i)=>{
                        return (
                            <div className="divfamilleProfilePatient" key={i}>
                                <ul className="ulfamilleProfilePatient">
                                    <li className="li1Famille"><img src={data.urlPhoto} alt="photo_familles" className="photofamillePatientProfilePatient"/> </li>
                                    <li className="li2Famille">
                                        <div className="nomFamilleProfilePatient">{data.nom}</div>
                                        <div className="detailsFamilleProfilePatient"><span><FontAwesomeIcon icon={faPerson} /></span> {data.positionFamilliale}</div>
                                        <div className="detailsFamilleProfilePatient"><span><FontAwesomeIcon icon={faVenusMars} /></span> {(data.sexe===2)?'FEMME':'HOMME'}</div>
                                        <div className="detailsFamilleProfilePatient"><span><FontAwesomeIcon icon={faCakeCandles} /></span> &nbsp;  {utile.getDateComplet(data.naissance)}</div>
                                        <div className="">
                                            <ul className="deleteOrUpdateFamilleProfilePatient">
                                                <li className="li1" onClick={()=>this.setState({dataUpdateFamille : data,stepper : 2})}><FontAwesomeIcon icon={faEdit} className="update" /></li>
                                                <li className="li1" onClick={()=>this.deleteFamille(data.idFamille)}><FontAwesomeIcon icon={faTrashAlt} className="delete" /></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        )
                    })
                }
                {this.createDataHtmlPaginationFamille(listFamille.totalpage,listFamille.page)}
            </>
        )
    }
    // data html si utilisateur !== null
    getDataHtmlIfUtilisateurNotNull(utilisateur,listFamille,stepper,dataUpdateFamille){
        if(utilisateur!==undefined && utilisateur!==null){
            return (
                <>
                    <div className="container-fluid rowAndContainer">
                        <ul className="rowAndContainer">
                            <li className="rowAndContainerOne">
                                <div className="img_user_profilePatient">
                                    <img src={utilisateur.urlPhoto} alt="photo_patient" className="photoPatientProfilePatient"/>
                                    <div className="nomUtilisateurProfilPatient">{utilisateur.nom}</div>
                                    <div className="divdescriptionProfilePatient"> 
                                        <div className="description"><span><FontAwesomeIcon icon={faVenusMars} /></span> &nbsp;&nbsp;&nbsp;  {(utilisateur.sexe===2)?'FEMME':'HOMME'}</div>
                                        <div className="description"><span><FontAwesomeIcon icon={faCakeCandles} /></span> &nbsp;&nbsp;&nbsp;  {utile.getDateComplet(utilisateur.naissance)}</div>
                                        <div className="description"><span><FontAwesomeIcon icon={faEnvelope} /></span> &nbsp;&nbsp;&nbsp; {utilisateur.email}</div>
                                        <div className="description"><span><FontAwesomeIcon icon={faPhone} /></span> &nbsp;&nbsp;&nbsp; {utilisateur.telephone}</div>
                                    </div>
                                    <div className="btnModificationProfilePatient"><button className="btnProfilePatient" onClick={()=>this.setState({stepper : 4})}>Modifier</button></div>
                                </div>
                            
                            </li>
                            <li className="rowAndContainerTwo">
                                <button className="addFamilyProfilePatient" hidden={stepper!==1} onClick={()=>this.setState({stepper : 3})}>Ajouter ma famille</button>
                                {
                                    (stepper===4)?this.getDataHtmlUpdateUtilisateur(utilisateur):
                                    (stepper===3)?this.getDataHtmlAjoutFamille():
                                    (stepper===2)?this.getDataHtmlUpdateFamille(dataUpdateFamille):
                                    this.getDataHtmlListFamily(listFamille)
                                    
                                }
                                
                            </li>
                        </ul>
                    </div>
                </>
            ) 
        }
        return <div></div>
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
                <div className="mainProfilePatient">
                    <div className="imageFondProfilePatient">
                        <img src={imgprofile} alt="image_de_fond_profil" className="image_de_fond_profil"/>
                    </div>
                    {this.getDataHtmlIfUtilisateurNotNull(this.state.utilisateur,this.state.listFamille,this.state.stepper,this.state.dataUpdateFamille)}
                </div>
            </>
        )
    }
}
export default ProfilePatient;