import React, {Component,useRef} from 'react';
import './RdvPatient.css';
import { faArrowDown, faArrowLeft, faArrowUp, faCakeCandles, faChevronDown, faChevronUp, faEnvelope, faEye, faFileArchive, faHouse, faPhone, faRefresh, faSearch, faTrashAlt, faUsers, faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchGet, fetchGetUrl, fetchPost } from '../../../service/requeteHttp';
import { utile } from '../../../service/utile';
import { auth } from '../../../service/auth';
import Pagination from '../../pagination/Pagination';
import Loading from '../../loading/Loading';
import AlertMessage from '../../alert-message/AlertMessage';
import { confignode } from '../../../urlConf';
import Search from '../../search/Search';
import ReactTooltip from 'react-tooltip'; 
import { useReactToPrint } from 'react-to-print';

function getAgeByDateNaissance(naissance){
    try {
        let data = new Date(naissance);let now = new Date();
        return now.getFullYear() - data.getFullYear();
    } catch (error) {
        return "";
    }
    
}
const Ordonance = ({infoPatient,prescription}) => {  
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
    return (
      <> 
        <div ref={componentRef} className="componentOrdonance">
            <ul className="headerOrdonance">
                <li className="li1"> <img src="http://localhost:8010/rdvvaksiny/profile/1659292466534_fond4.jpg" alt="image_vaccinodrome" /> </li>
                <li className="li2">
                    <div className="">
                        <div className="nomVaccinodromeOradonance">{infoPatient.vaccinodrome.nomCentre}</div>
                        <div className=""><span><FontAwesomeIcon icon={faEnvelope} /></span> &nbsp;&nbsp;&nbsp; {infoPatient.vaccinodrome.email}</div>
                        <div className=""><span><FontAwesomeIcon icon={faPhone} /></span> &nbsp;&nbsp;&nbsp; {infoPatient.vaccinodrome.telephone}</div>
                        <div className=""><span><FontAwesomeIcon icon={faHouse} /></span> &nbsp;&nbsp;&nbsp; {infoPatient.vaccinodrome.adresse}</div>
                        <div className=""> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; le {utile.getDateCompletAuJourdui()}</div>
                    </div>
                </li>
            </ul>
            <div className="bodyOrdonance">
                <ul className="bodyOrdonanceUl">
                    <li className="li1">
                        <div className="titleOrdonance">Vaccin</div>
                        <div className="vaccinOrdonance">
                            <div className="nomvaccinOrdonance">Vaccin : <span>{infoPatient.vaccin.nomVaccin}</span></div>
                            <div className="">Dose : {(infoPatient.demandeRdv.demandeRdv===1)?infoPatient.demandeRdv.dose+"ére ":infoPatient.demandeRdv.dose+"éme "} / {infoPatient.vaccinCentre.nombreDose}</div>
                            <div className="">Le : {utile.getDateComplet(infoPatient.demandeRdv.dateRdv)}</div>
                        </div>
                        <div className="titleOrdonance">Patient</div>
                        <div className="vaccinOrdonance">
                            <div className="nomPatient"><span>{infoPatient.utilisateur.nom}</span></div>
                            <div className=""><span><FontAwesomeIcon icon={faVenusMars} /></span> {(infoPatient.utilisateur.sexe===2)?"Femme":"Homme"}</div>
                            <div className=""><span><FontAwesomeIcon icon={faCakeCandles} /></span> {utile.getDateComplet(infoPatient.utilisateur.naissance)} ( {getAgeByDateNaissance(infoPatient.utilisateur.naissance)} )</div>
                            <div className=""><span><FontAwesomeIcon icon={faEnvelope} /></span> {infoPatient.utilisateur.email}</div>
                            <div className=""><span><FontAwesomeIcon icon={faPhone} /></span> {infoPatient.utilisateur.telephone}</div>
                        </div>
                        {
                            (infoPatient.famille).map((data,i)=>{
                                return (
                                    <div className="vaccinOrdonance" key={i}>
                                        <div className="nomPatient"><span>{data.nom}</span></div>
                                        <div className=""><span><FontAwesomeIcon icon={faVenusMars} /></span> {(data.sexe===2)?"Femme":"Homme"}</div>
                                        <div className=""><span><FontAwesomeIcon icon={faCakeCandles} /></span> {utile.getDateComplet(data.naissance)} ( {getAgeByDateNaissance(data.naissance)} )</div>
                                        <div className=""><span><FontAwesomeIcon icon={faUsers} /></span> {data.positionFamilliale}</div>
                                    </div>
                                )
                            })
                        }
                    </li>
                    <li className="li2 traitementOrdonance">
                        <ul>
                            {
                                (prescription).map((data,i)=>{
                                    return (
                                        <li key={i}>
                                            <div className=""><span>{data.traitement}</span></div>
                                            <div className="">{data.description}</div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </li>
                </ul>
            </div>
            <div className="footerOrdonance">
                <ul className="bodyOrdonanceUl footerOrdonancerow">
                    <li className="li1"><div className="dotted">Dr </div><div className="dotted"></div></li>
                    <li className="li2 signature">Signature</li>
                </ul>
            </div>
        </div>
        <div className="row page_accueil_div_bouton_imprimer_facture_all_component">
            <div className="col-md-12 col-sm-12 col-xs-12"><button onClick={handlePrint} style={{marginTop: '2%'}} className="form-control btn-primary">Imprimer</button></div>
        </div>
      </>     
    )
}

class RdvPatient extends Component{
    constructor(props){ 
        super();
        this.state = {
            //--laoding
            activeloader : false,
            //---modal        
            headersmsmodal : "",
            bodysmsmodal : '',
            etatsmsmodal : false,
            //Stepper 
            stepper : 1,
            //Stepper  maladie
            stepperMaladie : false,
            //data avertissement maladie
            initDataMaladie : false,
            dataAvertissementMaladie : null,
            dataListMaladie : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },
            //info vaccin demande rdv
            infoDemandeRdv : null,
            //info vaccin utilisateur
            infoVaccinUser :null,
            vaccin : null,
            vaccinodrome : null,
            vaccinCentre : null,
            utilisateur : null,
            famille : [],
            //horaire vaccinodrome
            horaireVaccinodrome : [],
            // data showDetailUtilisateur
            showDetailUtilisateur : false,
            //data rdv enregistrement
            doseDemandeRdv : 0,
            dateDemandeRdv : '',
            aQuiDemandeRdv : 1,
            descriptionDemandeRdv : '', 
            // display list demande rdv
            listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0},// data : [] = > {docs, page},
            listDemandeRdvSearch : { libeller : '', colone : 'nomVaccinodrome',ordre : false, status : 1, etat : false},
            inputReset : false,
            // ---------------- set vaccinodrome ---------------
            //Vaccin step 1
            dataListVaccinView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },// data : [] = > {docs, page},
            dataSearchListVaccinView : {libeller : '', colone : '',etat : false},
            //Vaccinodrome step 2
            dataListVaccinCentreView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },// data : [] = > {docs, page},
            dataSearchListVaccinCentreView : {libeller : '', colone : '',etat : false},
            //initialisationSetVaccinodrome
            initialisationSetVaccinodrome : false,
            stepperInscription : 1,
            //data vaccin selectionner patient
            dataVaccinInscriptionPatient : null,
            dataAvertissementMaladieVaccinodrome : null,
            //regions
            regions : null,
            libellerRegion : '',
            //district
            district : null,
            libellerDistrict : '',
            //commune
            commune : null,
            libellerCommune : '',
            //arrondissement
            arrondissement : null,
            libellerArrondissement : '',
            //fokontany
            fokontany : null,
            libellerFokontany : '',
            //data filtre search by localistion
            regionInscription : null,
            districtInscription : null,
            communeInscription : null,
            arrondissementInscription : null,
            fokontanyInscription : null,
            libellerSearch : '',
            //show search or filter search
            showSearch : false,
            etatsearch : false,
            // data info patient confirmer
            infoPatientConfirmer : null,
            listPrescriptionData : []
        }
    }
    componentDidMount() {
       this.getInfoUtilisateur();
       this.getDataListDemandeRdv(0);
    }
    //data listDemandeRdv to display list
    getVerificationDataPageListDemandeRdv(page){
        let rdv = this.state.listDemandeRdv;let data = rdv.data;let size =  data.length;
        if(size > 0){
            for (let i = 0; i < size; i++) {
                if(data[i].page === page){
                    this.setState({listDemandeRdv : {data : rdv.data,page : data[i].page, libeller : rdv.libeller, colone : rdv.colone,status : rdv.status,totalpage : rdv.totalpage}});
                    return true;
                }
            }
            return false;
        }
        return false;
    }
    getDataListDemandeRdv(page){
        let dataToken = auth.getDataUtilisateurToken();
        if(dataToken!==null && dataToken!==undefined){
            let idutilisateur = utile.parseStringToInt(dataToken.id);
            if(idutilisateur!==undefined && idutilisateur!==null && idutilisateur>0){
                let dataSearch = this.state.listDemandeRdvSearch;let listDemandeRdv = this.state.listDemandeRdv;
                if(dataSearch.colone==="dateRdv"){
                    try {
                        let date = new Date(dataSearch.libeller);dataSearch.libeller = date.getTime();
                    } catch (error) {
                        let date = new Date();dataSearch.libeller = date.getTime();
                    }
                }
                if(dataSearch.etat){
                    let data = { 
                        limite  : 10,
                        page: page,
                        idUtilisateur : idutilisateur,
                        libeller : dataSearch.libeller,
                        colone : dataSearch.colone,
                        ordre : dataSearch.ordre,
                        status : dataSearch.status
                    };
                    let url = "demanderdv/searchlist-demande-rdv";
                    this.setState({activeloader : true});
                    fetchPost(url, data).then(response=>{
                        this.setState({activeloader : false});
                        if(response !== undefined && response!==null){
                            let tmp= listDemandeRdv.data;let size = tmp.length;let test = false;
                            for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
                            if(!test){ tmp.push({docs : response.docs,page : response.page}); }
                            this.setState({listDemandeRdv : {data : tmp,page : response.page, libeller : listDemandeRdv.libeller, colone : listDemandeRdv.colone,status : listDemandeRdv.status,totalpage : response.totalPages}});
                        }
                    })
                }else{
                    if(!this.getVerificationDataPageListDemandeRdv(page)){
                        let url = "demanderdv/list-demande-rdv/10/"+page+"/"+idutilisateur+"/"+dataSearch.status+"/"+dataSearch.ordre;
                        this.setState({activeloader : true});
                        fetchGet(url).then(response=>{ 
                            this.setState({activeloader : false});
                            if(response !== undefined && response!==null){
                                let tmp= listDemandeRdv.data;let size = tmp.length;let test = false;
                                for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
                                if(!test){ tmp.push({docs : response.docs,page : response.page}); }
                                this.setState({listDemandeRdv : {data : tmp,page : response.page, libeller : listDemandeRdv.libeller, colone : listDemandeRdv.colone,status : listDemandeRdv.status,totalpage : response.totalPages}});
                            }
                        });
                    }
                }
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Votre session est terminé.",etatsmsmodal : true});
            }
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Votre session est terminé.",etatsmsmodal : true});
        }
    }
    getDataDemandeRdvInState(listDemandeRdv){
        let data = listDemandeRdv.data;let page = listDemandeRdv.page;let size = data.length;
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
    //pagination liste listDemandeRdv
    setPageInPaginationListDemandeRdv=(e)=>{
        let newpage = utile.parseStringToInt(e)-1;
        if(newpage>=0){   
            this.getDataListDemandeRdv(newpage);
        }
    }
    createDataHtmlPaginationDemandeRdv(pageTotal,page){
        if(pageTotal>0  && page>=0){
            return  <Pagination totalPages={pageTotal} page={page} setPage={(e)=> this.setPageInPaginationListDemandeRdv(e)} />
        }
        return <div></div>
    }
    //get input search
    getInputSearch(listDemandeRdvSearch,inputReset) {
        let colone = listDemandeRdvSearch.colone; 
        if(colone==="statusRdv"){
            return (
                <select onChange={(e)=>this.setState({
                    listDemandeRdvSearch : { libeller : this.state.listDemandeRdvSearch.libeller, colone : this.state.listDemandeRdvSearch.colone,ordre : this.state.listDemandeRdvSearch.ordre, status : utile.parseStringToInt(e.target.value), etat : this.state.listDemandeRdvSearch.etat}
                    ,listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0}},()=>{this.getDataListDemandeRdv(0);})}>
                    <option value={1}>Selectionner l'etat des rendez-vous qui vous plaira</option>
                    <option value={5}>Patient vacciné</option>
                    <option value={1}>Demande en cours</option>
                    <option value={2}>Demande accepter</option>
                    <option value={3}>Demande d'annulation</option>
                    <option value={11}>Demande de rendez-vous refusé</option>
                </select>
            )
        }else if (colone==="dateRdv"){
            return <input type="date"
            onChange={(e)=>this.setState({listDemandeRdvSearch : { libeller : e.target.value, colone : this.state.listDemandeRdvSearch.colone,ordre : this.state.listDemandeRdvSearch.ordre, status : this.state.listDemandeRdvSearch.status, etat : this.state.listDemandeRdvSearch.etat}})}
            onFocus={(e)=>{if(inputReset){e.target.value = ""; this.setState({inputReset: false})}}} placeholder="Saissez votre recherche" />
        }else{
            return <input type="text"
            onChange={(e)=>this.setState({listDemandeRdvSearch : { libeller : e.target.value, colone : this.state.listDemandeRdvSearch.colone,ordre : this.state.listDemandeRdvSearch.ordre, status : this.state.listDemandeRdvSearch.status, etat : this.state.listDemandeRdvSearch.etat}})}
            onFocus={(e)=>{if(inputReset){e.target.value = ""; this.setState({inputReset: false})}}} placeholder="Saissez votre recherche" />
        }
    }
    // cherche dans toute la liste les texts saisis
    searchDataInList=()=>{
        let searchData = this.state.listDemandeRdvSearch;
        if(utile.getVerificationChampsText(searchData.libeller)){
            this.setState({
                listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0},// data : [] = > {docs, page},
                listDemandeRdvSearch : { libeller : searchData.libeller, colone : searchData.colone,ordre : searchData.ordre, status : searchData.status, etat : true}
            },()=>{this.getDataListDemandeRdv(0);});
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "La liste c'est actualiser car le champs recherche est vide",etatsmsmodal : true},()=>{this.refreshList()});
        }
    }
    // ordoner la list de rendez-vous 
    orderList(){
        this.setState({
            listDemandeRdvSearch : { 
                libeller : this.state.listDemandeRdvSearch.libeller, 
                colone : this.state.listDemandeRdvSearch.colone,
                ordre : !this.state.listDemandeRdvSearch.ordre, 
                status : this.state.listDemandeRdvSearch.status, 
                etat : this.state.listDemandeRdvSearch.etat
            },
            listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0}},()=>{this.getDataListDemandeRdv(0);});
    }
    // actualiser la liste
    refreshList=()=>{
        this.setState({
            listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0},// data : [] = > {docs, page},
            listDemandeRdvSearch : { libeller : '', colone : 'nomVaccinodrome',ordre : false, status : 1, etat : false},
            inputReset : true
        },()=>{this.getDataListDemandeRdv(0);})
    }
    // delete rdv where status = 1
    deleteRdvStatusOne(idDemandeRdv){
        if(idDemandeRdv>0 && window.confirm("Êtes-vous certain de vouloir supprimer ces informations")){
            fetchGet('demanderdv/delete-demande-rdv-status-one/'+idDemandeRdv).then(response => {
                if(response!== undefined && response!==null){
                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,
                    listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0},
                    listDemandeRdvSearch : { libeller : '', colone : 'nomVaccinodrome',ordre : false, status : 1, etat : false}
                },()=>{this.getDataListDemandeRdv(0);});
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
                }
            })
        }
    }
    // delete rdv where status = 1
    deleteRdvStatusTwo(idDemandeRdv){
        if(idDemandeRdv>0 && window.confirm("Demander l'annulation du rendez-vous envoyé dans le vaccinodrome concerné ?")){
            fetchGet('demanderdv/delete-demande-rdv-status-two/'+idDemandeRdv).then(response => {
                if(response!== undefined && response!==null){
                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,
                    listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0},
                    listDemandeRdvSearch : { libeller : '', colone : 'nomVaccinodrome',ordre : false, status : 1, etat : false}
                },()=>{this.getDataListDemandeRdv(0);});
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
                }
            })
        }
    }
    // restauration d'une demande de rdv annuler
    restaurationDemandeRdvAnnuler(idDemandeRdv){
        if(idDemandeRdv>0 && window.confirm("Êtes-vous certain de vouloir supprimer ces informations")){
            fetchGet('demanderdv/restauration-demande-rdv/'+idDemandeRdv).then(response => {
                if(response!== undefined && response!==null){
                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,
                    listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0},
                    listDemandeRdvSearch : { libeller : '', colone : 'nomVaccinodrome',ordre : false, status : 1, etat : false}
                },()=>{this.getDataListDemandeRdv(0);});
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
                }
            })
        }
    }
    //data html liste rdv patient
    getDataHtmlListeRdvPatient(listDemandeRdv,listDemandeRdvSearch,inputReset){
        if(listDemandeRdv.data.length > 0){
            return (
                <>
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered tableRdvPatient">
                            <thead>
                                <tr className="trSearchRdvPatient">
                                    <th colSpan={5}>
                                        <ul className="ulSearchRdvPatient">
                                            <li className="li0"><button onClick={()=>this.orderList()}><FontAwesomeIcon icon={(listDemandeRdvSearch.ordre)?faArrowUp:faArrowDown} /></button></li>
                                            <li className="li1">{this.getInputSearch(listDemandeRdvSearch,inputReset)}</li>
                                            <li className="li2">
                                                <select onChange={(e)=>this.setState({inputReset : true,listDemandeRdvSearch : { libeller : '', colone : e.target.value,ordre : this.state.listDemandeRdvSearch.ordre, status : this.state.listDemandeRdvSearch.status, etat : this.state.listDemandeRdvSearch.etat}})}>
                                                    <option value="nomVaccinodrome">Vaccinodrome</option>
                                                    <option value="nomVaccin">Vaccin</option>
                                                    <option value="dateRdv">Date</option>
                                                    <option value="statusRdv">Etat</option>
                                                </select>
                                            </li>
                                            <li className="li3"><button onClick={()=>this.searchDataInList()}><FontAwesomeIcon icon={faSearch} /></button></li>
                                            <li className="li4"><button onClick={()=>this.refreshList()}><FontAwesomeIcon icon={faRefresh} /></button></li>
                                        </ul>
                                    </th>
                                    <th colSpan={2}><button className="btnAddRdvPatient" onClick={()=>this.setState({stepper : 2})}>Demander une rendez-vous</button></th>
                                </tr>
                                <tr className="tr2SearchRdvPatient">
                                    <th colSpan={7}></th>
                                </tr>
                                <tr>
                                    <th>Vaccinodrome</th>
                                    <th>Vaccin</th>
                                    <th>Dose</th>
                                    <th>Personne</th>
                                    <th>Date</th>
                                    <th>Etat</th>
                                    <th className="textAlignCenter">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.getDataDemandeRdvInState(listDemandeRdv).map((data,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td>{data.nomVaccinodrome}</td>
                                                <td>{data.nomVaccin}</td>
                                                <td>{(data.dose===1)?data.dose+'ére ':data.dose+' éme'} / {data.nombreDose}</td>
                                                <td><div className="rightTmp">{data.famille+1}</div></td>
                                                <td>{utile.getDateComplet(data.dateRdv)}</td>
                                                <td>{(data.statusRdv===1)?'Demande en cours':(data.statusRdv===11)?"rendez-vous refusé":(data.statusRdv===5)?"vacciné":(data.statusRdv===3)?"Demande d'annulation":'Demande accepter'}</td>
                                                <td className="textAlignCenter">
                                                    <ul className="btnEditSup" hidden={data.statusRdv!==1}>
                                                        <li><button className="btn-primary" onClick={()=>this.setState({stepper : 3},()=>{this.getInfoUtilisateurByIdDemande(data.idDemandeRdv)})}><FontAwesomeIcon icon={faEye} /></button> </li>
                                                        <li><button className="btn-danger" onClick={()=>this.deleteRdvStatusOne(data.idDemandeRdv)}><FontAwesomeIcon icon={faTrashAlt} /></button> </li>
                                                    </ul>
                                                    <ul className="btnEditSup" hidden={data.statusRdv!==2}>
                                                        <li><button className="btn-primary" onClick={()=>this.setState({stepper : 3},()=>{this.getInfoUtilisateurByIdDemande(data.idDemandeRdv)})}><FontAwesomeIcon icon={faEye} /></button> </li>
                                                        <li><button className="btn-danger" onClick={()=>this.deleteRdvStatusTwo(data.idDemandeRdv)}><FontAwesomeIcon icon={faTrashAlt} /></button> </li>
                                                    </ul>
                                                    <ul className="btnEditSupAnnulation" hidden={data.statusRdv!==3}>
                                                        <li><button className="btn-primary" onClick={()=>this.setState({stepper : 3},()=>{this.getInfoUtilisateurByIdDemande(data.idDemandeRdv)})}><FontAwesomeIcon icon={faEye} /></button> </li>
                                                        <li><button className="btn-success" onClick={()=>this.restaurationDemandeRdvAnnuler(data.idDemandeRdv)}><FontAwesomeIcon icon={faRefresh} /></button> </li>
                                                        <li><button className="btn-danger" onClick={()=>this.deleteRdvStatusOne(data.idDemandeRdv)}><FontAwesomeIcon icon={faTrashAlt} /></button> </li>
                                                    </ul>
                                                    <ul className="btnEditSup" hidden={data.statusRdv!==5}>
                                                        <li><button className="btn-primary" onClick={()=>this.setState({stepper : 22},()=>{this.getDataInfoUtilisateurPatient(data.idDemandeRdv)})}><FontAwesomeIcon icon={faEye} /></button> </li>
                                                        <li data-tip data-for="registerTip_12">
                                                            <button className="btn-success" onClick={()=>this.getOrdonance(data.idDemandeRdv)}><FontAwesomeIcon icon={faFileArchive} /></button> 
                                                            <ReactTooltip id="registerTip_12" place="top" effect="solid">Ordonance médical</ReactTooltip>
                                                        </li>
                                                    </ul>
                                                    <button className="btn-danger form-control"  hidden={data.statusRdv!==11} onClick={()=>this.deleteRdvStatusOne(data.idDemandeRdv)}>Supprimer</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    {this.createDataHtmlPaginationDemandeRdv(listDemandeRdv.totalpage,listDemandeRdv.page)}
                </>
            )
        }
        return (
            <>
                <div className="btnDemandeDeRdvPatient"><button className="btnAddRdvPatient" onClick={()=>this.setState({stepper : 2})}>Demander une rendez-vous</button></div>
                <div className="pasDeListRdvPatient" onClick={()=>this.setState({stepper : 2})}>Veuillez demandé une rendez-vous dans le vaccinodrome de votre choix en cliquant ici</div>
            </>
        )
    }
    
    getAgeByDateNaissance(naissance){
        try {
            let data = new Date(naissance);let now = new Date();
            return now.getFullYear() - data.getFullYear();
        } catch (error) {
            return "";
        }
        
    }
    // data html voir détail 
    getDataHtmlDetailPatient(infoPatientConfirmer,listPrescriptionData){
        return (
            <>
                <ul className="ulAddRdvRdvPatient">
                    <li className="li1" onClick={()=>this.setState({stepper : 1})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                    <li className="li2">Voir le détail du rendez-vous</li>
                    <li className="li3"></li>
                </ul>
                {this.getDataHtmlDetailPatientSon(infoPatientConfirmer,true,listPrescriptionData)}
            </>
        )
    }
    
    getDataHtmlDetailPatientSon(infoPatient,showBtnVaccination,listPrescriptionData){
        if(infoPatient!==undefined && infoPatient!==null){
            return (
                <>      
                    <div className="">
                        <ul className="headerInProfileVaccinodrome">
                            <li className="li1">
                                <div className="imageFondProfileVaccinodrome">
                                    <img src={infoPatient.vaccinodrome.urlPhoto} alt="image_de_fond_profil" className="image_de_fond_profil"/>
                                </div>
                            </li>
                            <li className="li2">
                                <div className="fathertextInfoVaccinodrome">
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Nom</li>
                                        <li className="two">{infoPatient.utilisateur.nom}</li>
                                    </ul>
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Sexe</li>
                                        <li className="two">{(infoPatient.utilisateur.sexe===2)?"Femme":"Homme"}</li>
                                    </ul>
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Age</li>
                                        <li className="two">{this.getAgeByDateNaissance(infoPatient.utilisateur.naissance)} ans</li>
                                    </ul>
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Née le</li>
                                        <li className="two">{utile.getDateComplet(infoPatient.utilisateur.naissance)}</li>
                                    </ul>
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Email</li>
                                        <li className="two">{infoPatient.utilisateur.email}</li>
                                    </ul>
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Téléphone</li>
                                        <li className="two">{infoPatient.utilisateur.telephone}</li>
                                    </ul>
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Date du RDV</li>
                                        <li className="two">{utile.getDateComplet(infoPatient.demandeRdv.dateRdv)}</li>
                                    </ul>
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Etat</li>
                                        <li className="two">{(infoPatient.demandeRdv.status===1)?'Demande de validation':(infoPatient.demandeRdv.status===5)?"vaccinée":(infoPatient.demandeRdv.status===3)?"Demande d'annulation":'Rdv confirmé'}</li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="fathertextInfoVaccinodrome">
                        <ul className="textInfoVaccinodrome">
                            <li className="one">Vaccin</li>
                            <li className="two">{infoPatient.vaccin.nomVaccin}</li>
                        </ul>
                        <ul className="textInfoVaccinodrome">
                            <li className="one">Dose</li>
                            <li className="two">{(infoPatient.demandeRdv.dose===1)?infoPatient.demandeRdv.dose+"ére ":infoPatient.demandeRdv.dose+"éme "} / {infoPatient.vaccinCentre.nombreDose}</li>
                        </ul>
                        <ul className="textInfoVaccinodrome">
                            <li className="one">Nombre de personnes à vacciner</li>
                            <li className="two">{infoPatient.demandeRdv.famille+1}</li>
                        </ul>
                        <ul className="textInfoVaccinodrome">
                            <li className="one">Description RDV</li>
                            <li className="two">{infoPatient.demandeRdv.descriptions}</li>
                        </ul>
                        <ul className="textInfoVaccinodrome">
                            <li className="one">Vaccinodrome</li>
                            <li className="two">{infoPatient.vaccinodrome.nomCentre}</li>
                        </ul>
                        <ul className="textInfoVaccinodrome">
                            <li className="one">Email du vaccinodrome</li>
                            <li className="two">{infoPatient.vaccinodrome.email}</li>
                        </ul>
                        <ul className="textInfoVaccinodrome">
                            <li className="one">Téléphone du vaccinodrome</li>
                            <li className="two">{infoPatient.vaccinodrome.telephone}</li>
                        </ul>
                        <ul className="textInfoVaccinodrome">
                            <li className="one">Adresse du vaccinodrome</li>
                            <li className="two">{infoPatient.vaccinodrome.adresse}</li>
                        </ul>
                        <ul className="textInfoVaccinodrome">
                            <li className="one">Localisation du vaccinodrome</li>
                            <li className="two">{this.getRectificationDataLocalisation(infoPatient.vaccinodrome.localisation)}</li>
                        </ul>
                        <ul className="textInfoVaccinodrome">
                            <li className="one">Description du vaccinodrome</li>
                            <li className="two">{infoPatient.vaccinodrome.descriptions}</li>
                        </ul>
                        <div className="maFamilleMP">
                            <div className="" hidden={infoPatient.famille.length<=0}>
                                <div className="detailFamilleMP">
                                    <div className="textMaFamille">Ma famille</div>
                                    <div className="table-responsive">
                                        <table className="table tableHoraireVaccinodromeRdvPatient">
                                            <thead>
                                                <tr>
                                                    <th className="titleTable">Etat</th>
                                                    <th className="titleTable">Nom</th>
                                                    <th className="titleTable">Sexe</th>
                                                    <th className="titleTable">Age</th>
                                                    <th className="titleTable">Date de naissance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    {
                                                        (infoPatient.famille).map((data,i)=>{
                                                            return (
                                                                <tr key={i}>
                                                                    <td className="answerTable firstanswerTable">{data.positionFamilliale}</td>
                                                                    <td className="answerTable firstanswerTable">{data.nom}</td>
                                                                    <td className="answerTable firstanswerTable">{(data.sexe===2)?'Femme':'Homme'}</td>
                                                                    <td className="answerTable firstanswerTable">{this.getAgeByDateNaissance(data.naissance)} ans</td>
                                                                    <td className="answerTable firstanswerTable">{utile.getDateComplet(data.naissance)}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="maFamilleMP">
                            <div className="" hidden={listPrescriptionData.length<=0}>
                                <div className="detailFamilleMP">
                                    <div className="textMaFamille">Prescription médical</div>
                                    <div className="table-responsive">
                                        <table className="table tableHoraireVaccinodromeRdvPatient">
                                            <thead>
                                                <tr>
                                                    <th className="titleTable textAlignLeft">Médicament</th>
                                                    <th className="titleTable textAlignLeft">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    {
                                                        (listPrescriptionData).map((data,i)=>{
                                                            return (
                                                                <tr key={i}>
                                                                    <td className="answerTable firstanswerTable textAlignLeft">{data.traitement}</td>
                                                                    <td className="answerTable firstanswerTable textAlignLeft">{data.description}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <button className="btn-success form-control" hidden={showBtnVaccination}>Vacciner ce patient</button>
                    </div>
                </>
            )
        }
        return (
            <>
                <div className="pasDeListRdvPatient">Il y a une erreur, veuillez recherger la page</div>
            </>
        )
    }
    //get data list prescription
    getListPrescription(idDemandeRdv){
        this.setState({activeloader : true});
        fetchGet('demanderdv/prescription/'+idDemandeRdv).then(response=>{ 
            this.setState({activeloader : false});
            if(response !== undefined && response!==null){ 
                this.setState({listPrescriptionData : response});                     
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
            }
        });
    }
    //get data information utilisateur patient
    getDataInfoUtilisateurPatient(idDemandeRdv){
        this.setState({activeloader : true});
        fetchGet('utilisateur/info-utilisateur/'+idDemandeRdv).then(response=>{ 
            this.setState({activeloader : false});
            if(response !== undefined && response!==null){
                if(response.status===200){
                    console.log('re : ',response);
                    this.setState({infoPatientConfirmer : response},()=>{this.getListPrescription(idDemandeRdv)});
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
                }                        
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
            }
        });
    }
    // rectification data localisation
    getRectificationDataLocalisation(localisation) {
        if(utile.getVerificationChampsText(localisation)){
            let tab = localisation.split('///');
            if(tab.length>0){
                return (
                    <>
                        <div>
                            {
                                (tab).map((data,i)=>{
                                    return <div key={i}>{data}</div>
                                })
                            }
                        </div>
                    </>
                )
            }else{
                return localisation;
            }
            
        }
        return "";
    }
    //get ordonance
    getOrdonance=(idDemandeRdv)=>{
        this.setState({stepper : 11},()=>{
            this.getDataInfoUtilisateurPatient(idDemandeRdv);
        })
    }
    // data html ordonance
    getDataHtmlOrdonance(infoPatientConfirmer,listPrescriptionData){
        return (
            <>
                <ul className="ulAddRdvRdvPatient">
                    <li className="li1" onClick={()=>this.setState({stepper : 1})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                    <li className="li2">Ordonance médical</li>
                    <li className="li3"></li>
                </ul>
                {this.getDataHtmlOrdonanceSon(infoPatientConfirmer,listPrescriptionData)}
            </>
        )
    }
    getDataHtmlOrdonanceSon(infoPatientConfirmer,listPrescriptionData){
        if(infoPatientConfirmer!== undefined && infoPatientConfirmer!==null){
            return <Ordonance infoPatient={infoPatientConfirmer} prescription={listPrescriptionData} />
        }
        return <div></div>
    }
    //get data information utilisateur
    getInfoUtilisateur(){
        let dataToken = auth.getDataUtilisateurToken();
        if(dataToken!==null && dataToken!==undefined){
            let idutilisateur = utile.parseStringToInt(dataToken.id);
            if(idutilisateur!==undefined && idutilisateur!==null && idutilisateur>0){
                this.setState({activeloader : true});
                fetchGet('utilisateur/info-vaccin-utilisateur/'+idutilisateur).then(response=>{ 
                    this.setState({activeloader : false});
                    if(response !== undefined && response!==null){
                        if(response.status===200){
                            let infoVaccinUser = response.infoVaccinUser;let vaccin = response.vaccin;let vaccinodrome = response.vaccinodrome;let vaccinCentre = response.vaccinCentre;
	                        let utilisateur = response.utilisateur;let famille = response.famille;
                            if(infoVaccinUser!==undefined && infoVaccinUser!==null && vaccin!==undefined && vaccin!==null && vaccinodrome!==undefined && vaccinodrome!==null && 
                                vaccinCentre!==undefined && vaccinCentre!==null && utilisateur!==undefined && utilisateur!==null && famille!==undefined && famille!==null){
                                if(vaccin.idVaccin!== undefined && vaccin.idVaccin !== null && vaccin.idVaccin > 0){
                                    this.getAvertissementMaladie(vaccin.idVaccin);
                                    this.getHoraireVaccinodromeByIdVaccinodrome(vaccinodrome.idVaccinodrome);
                                    this.setState({infoVaccinUser : infoVaccinUser,vaccin : vaccin,vaccinodrome : vaccinodrome,vaccinCentre : vaccinCentre,utilisateur : utilisateur,famille : famille});
                                }
                            }
                        }else{
                            this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
                        }                        
                    }else{
                        this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
                    }
                });
            }
        }
    }
    //get data information by id demande rdv
    getInfoUtilisateurByIdDemande(iddemanderdv){
        this.setState({activeloader : true});
        fetchGet('utilisateur/info-utilisateur/'+iddemanderdv).then(response=>{ 
            this.setState({activeloader : false});
            if(response !== undefined && response!==null){
                if(response.status===200){
                    this.setState({infoDemandeRdv : response});
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
                }
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
            }
        });
    }
    //get data horaire vaccinodrome
    getHoraireVaccinodromeByIdVaccinodrome(idVaccinodrome){
        if(idVaccinodrome!==null && idVaccinodrome!==undefined && idVaccinodrome>0){
            this.setState({activeloader : true});
            fetchGet('vaccinodrome/horaire-vaccinodrome/'+idVaccinodrome).then(response=>{ 
                this.setState({activeloader : false});
                if(response !== undefined && response!==null){
                    this.setState({horaireVaccinodrome : response});
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
                }
            });
        }
    }
    //get data avertissement maladie
    getAvertissementMaladie(idvaccin){
        if(utile.getVerificationChampsText(''+idvaccin)){
            this.setState({activeloader : true});
            fetchGet('maladie/avertissement-maladie/'+idvaccin).then(response=>{ 
                this.setState({activeloader : false});
                if(response !== undefined && response!==null){
                    this.setState({dataAvertissementMaladie : response});
                }
            });
        }
    }
    //data maladie to display list
    getVerificationDataPageMaladie(page){
        let data = this.state.dataListMaladie.data;let size =  data.length;
        if(size > 0){
            for (let i = 0; i < size; i++) {
                if(data.page === page){
                    this.setState({dataListMaladie : {data : this.state.dataListMaladie.data,page : page, libeller : this.state.dataListMaladie.libeller, colone : this.state.dataListMaladie.colone}});
                    return true;
                }
            }
            return false;
        }
        return false;
    }
    getDataMaladie(page,idvaccin){
        if(!this.getVerificationDataPageMaladie(page) && utile.getVerificationChampsText(''+idvaccin)){
            this.setState({activeloader : true});
            fetchGet("maladie/listbyidvaccin/"+idvaccin+"/10/"+page).then(response=>{ 
                this.setState({activeloader : false});
                if(response !== undefined && response!==null){
                    let dataListMaladie = this.state.dataListMaladie;let tmp= dataListMaladie.data;let size = tmp.length;let test = false;
                    for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
                    if(!test){ tmp.push({docs : response.docs,page : response.page}); }
                    this.setState({dataListMaladie : {data : tmp,page : response.page, libeller : dataListMaladie.libeller, colone : dataListMaladie.colone,totalpage : response.totalPages}});
                }
            });
        }
    }
    getDataMaladieInState(dataListMaladie){
        let data = dataListMaladie.data;let page = dataListMaladie.page;let size = data.length;
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
    //vide tous les states
    videTousLesStates(){
        this.setState({
            //Stepper 
            stepper : 1,
            //Stepper  maladie
            stepperMaladie : false,
            //data avertissement maladie
            initDataMaladie : false,
            dataAvertissementMaladie : null,
            dataListMaladie : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },
            //info vaccin demande rdv
            infoDemandeRdv : null,
            //info vaccin utilisateur
            infoVaccinUser :null,
            vaccin : null,
            vaccinodrome : null,
            vaccinCentre : null,
            utilisateur : null,
            famille : [],
            //horaire vaccinodrome
            horaireVaccinodrome : [],
            // data showDetailUtilisateur
            showDetailUtilisateur : false,
            //data rdv enregistrement
            doseDemandeRdv : 0,
            dateDemandeRdv : '',
            aQuiDemandeRdv : 1,
            descriptionDemandeRdv : ''
        },()=>{
            this.getInfoUtilisateur();
            this.getDataListDemandeRdv(0);
        });
    }
    //pagination liste maladie
    setPageInPaginationMaladie=(e)=>{
        let newpage = utile.parseStringToInt(e)-1;let vaccin = this.state.vaccin;
        if(newpage>=0 && vaccin!==undefined && vaccin!==undefined){   
            let idVaccin = vaccin.idVaccin;
            if(idVaccin!==undefined && idVaccin!==null && idVaccin>0){
                this.getDataMaladie(newpage,idVaccin);
                this.setState({stepperMaladie: true,initDataMaladie:true});
            }
        }
    }
    createDataHtmlPaginationMaladie(pageTotal,page){
        if(pageTotal>0  && page>=0){
            return  <Pagination totalPages={pageTotal} page={page} setPage={(e)=> this.setPageInPaginationMaladie(e)} />
        }
        return <div></div>
    }
    // initialisation data maladie
    getInitialisationDataMaladie=(initDataMaladie,vaccin)=>{
        if(!initDataMaladie && vaccin!==undefined && vaccin!==undefined){
            let idVaccin = vaccin.idVaccin;
            if(idVaccin!==undefined && idVaccin!==null && idVaccin>0){
                this.getDataMaladie(0,idVaccin);
                this.setState({stepperMaladie: true,initDataMaladie:true});
            }
        }else{
            this.setState({stepperMaladie: true})
        }
    }
    // get data html avertissement maladie 
    getDataHtmlAvertissementMaladie(dataAvertissementMaladie,initDataMaladie,vaccin) {
        if(dataAvertissementMaladie!==undefined && dataAvertissementMaladie!==null){
            if(dataAvertissementMaladie.status === 200){
                return (
                    <>
                        <div className="descriptionInscriptionPatient">
                            <div className=""><b><span className="spantmp">Attention</span>, les maladies suivantes ne sont pas compatibles avec le vaccin :</b> {dataAvertissementMaladie.message} 
                            <span className="sondescriptionInscriptionPatient" onClick={()=>this.getInitialisationDataMaladie(initDataMaladie,vaccin)}>Voir en détail</span></div>
                        </div>
                    </>
                )
            }
        }
        return <div></div>;
    }
    //enregistrement du rdv patient 
    enregisterDemandeRdvPatient=()=>{
        let infoVaccinUser = this.state.infoVaccinUser;let vaccin = this.state.vaccin;let vaccinodrome = this.state.vaccinodrome;let vaccinCentre = this.state.vaccinCentre;
        let utilisateur = this.state.utilisateur;let famille = this.state.famille;let doseDemandeRdv = this.state.doseDemandeRdv;let dateDemandeRdv = this.state.dateDemandeRdv;let aQuiDemandeRdv = this.state.aQuiDemandeRdv;
        let descriptionDemandeRdv = this.state.descriptionDemandeRdv;let verifDate = this.setDateRdvConf(dateDemandeRdv,this.state.horaireVaccinodrome);
        if(infoVaccinUser!==undefined && infoVaccinUser!==null && vaccin!==undefined && vaccin!==null && vaccinodrome!==undefined && vaccinodrome!==null && 
            vaccinCentre!==undefined && vaccinCentre!==null && utilisateur!==undefined && utilisateur!==null && utile.getVerificationChampsText(dateDemandeRdv) && 
            verifDate &&  aQuiDemandeRdv>0 && aQuiDemandeRdv<3 && doseDemandeRdv>0){
                let size = famille.length;
                if(aQuiDemandeRdv===2 && size<=0){
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Vous devez ajouté votre famille si vous voulez selectionné 'Moi et ma famille' dans le champs 'Pour qui est ce rendez-vous'.",etatsmsmodal : true});
                }else{
                    let listfamille = []; 
                    if(aQuiDemandeRdv===2){
                        for(let i = 0; i < size; i++){
                            listfamille.push({
                                idRdvFamille : 0,
                                idDemandeRdv : 0,
                                idFamille : famille[i].idFamille,
                                status : 1
                            });
                        }
                    }
                    let data = {
                        demandeRdv : {
                            idDemandeRdv : 0,
                            idInfovaccinuser : infoVaccinUser.idInfoVaccinUser,
                            dose : doseDemandeRdv,
                            dateRdv : dateDemandeRdv,
                            famille : aQuiDemandeRdv,
                            descriptions : descriptionDemandeRdv,
                            status : 1
                        },
                        famille : listfamille
                    }
                    fetchPost('demanderdv/demande-rdv-patient',data).then(response=>{
                        if(response!==null && response!==undefined){
                            this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true});
                        }
                    })
                }
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes, merci de compléter tous les champs.",etatsmsmodal : true});
        }
    }
    //change date rdv en date normal
    getVerificationDayIfNotDisponible(horaireVaccinodrome,day){
        let size = horaireVaccinodrome.length;
        for(let i = 0; i < size; i++){
            if(horaireVaccinodrome[i].jour===day && horaireVaccinodrome[i].status===0){
                return true;
            }
        }
        return false;
    }
    setDateRdv(dateDemandeRdv,horaireVaccinodrome){
        if(utile.getVerificationChampsText(dateDemandeRdv)){
            let date = new Date(dateDemandeRdv); let now = new Date();let day = date.getDay();let semaine = utile.getAllSemaine();
            if(now>date){
                return 'Vous dévez selectionné une date superieur à '+utile.getDateCompletAuJourdui();
            }
            if(this.getVerificationDayIfNotDisponible(horaireVaccinodrome,day)){
                return "La date '"+utile.getDateComplet(dateDemandeRdv)+"' est invalide car le jour "+semaine[day]+" est indisponble dans l'emploie du temps du vaccinodrome";
            }
            return 'Rendez-vous fixé le '+utile.getDateComplet(dateDemandeRdv);
        }
        return <div></div>
    }
    setDateRdvConf(dateDemandeRdv,horaireVaccinodrome){
        if(utile.getVerificationChampsText(dateDemandeRdv)){
            let date = new Date(dateDemandeRdv); let now = new Date();let day = date.getDay();
            if(now>date){
                return false;
            }
            if(this.getVerificationDayIfNotDisponible(horaireVaccinodrome,day)){
                return false;
            }
            return true;
        }
        return false
    }
    //handle button set vaccinodrome
    handleButtonSetVaccindrome(){
        let initialisationSetVaccinodrome= this.state.initialisationSetVaccinodrome;
        if(!initialisationSetVaccinodrome){
            this.setState({stepper : 4,initialisationSetVaccinodrome : true},()=>{
                this.getDataVaccinView(0);
            });
        }else{
            this.setState({stepper : 4});
        }
    }
    // get data html détail vaccinodrome 
    getDataHtmlDetailVaccinodrome(vaccin,vaccinodrome,vaccinCentre,showDetailUtilisateur,horaireVaccinodrome,dateDemandeRdv,famille,aQuiDemandeRdv) {
        if(vaccin!==undefined && vaccin!==null && vaccinodrome!==undefined && vaccinodrome!==null && vaccinCentre!==undefined && vaccinCentre!==null 
            && horaireVaccinodrome!==undefined && horaireVaccinodrome!==null){
            return (
                <>
                    <div className="showDetailUtilisateur">
                        <ul onClick={()=>this.setState({showDetailUtilisateur: !this.state.showDetailUtilisateur})}>
                            <li className="li1">Vaccinodrome : {vaccinodrome.nomCentre}</li>
                            <li className="li2"><FontAwesomeIcon icon={(showDetailUtilisateur)?faChevronUp:faChevronDown} /></li>
                        </ul>
                    </div>
                    <div className="DetailUtilisateur" hidden={!showDetailUtilisateur}>
                        <div className="DetailUtilisateurV1">
                            <img src={vaccinodrome.urlPhoto} alt="image_vaccinodrome" className="imageVaccinodrome"/>
                        </div>
                        <div className="DetailUtilisateurV2">
                            <table className="table tableDetailUtilisateur">
                                <tbody>
                                    <tr>
                                        <td className="td1">Vaccinodrome</td>
                                        <td className="td2"> : {vaccinodrome.nomCentre}</td>
                                    </tr>
                                    <tr>
                                        <td className="td1">Vaccin</td>
                                        <td className="td2"> : {vaccin.nomVaccin}</td>
                                    </tr>
                                    <tr>
                                        <td className="td1">Nombre de dose</td>
                                        <td className="td2"> : {vaccinCentre.nombreDose}</td>
                                    </tr>
                                    <tr>
                                        <td className="td1">Age minimum patient</td>
                                        <td className="td2"> : {vaccinCentre.ageMinimum}</td>
                                    </tr>
                                    <tr>
                                        <td className="td1">Email</td>
                                        <td className="td2"> : {vaccinodrome.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="td1">Téléphone</td>
                                        <td className="td2"> : {vaccinodrome.telephone}</td>
                                    </tr>
                                    <tr>
                                        <td className="td1">Adresse</td>
                                        <td className="td2"> : {vaccinodrome.adresse}</td>
                                    </tr>
                                    <tr>
                                        <td className="td1">Localisation</td>
                                        <td className="td2"> : {vaccinodrome.localisation}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}><button className="btn-warning form-control" onClick={()=>this.handleButtonSetVaccindrome()}>Changer de vaccinodrome</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="divHoraireVaccinodromeRdvPatient">
                        <div className="textHoraireVaccindormeRdvPatient">Jour d'ouverture du vaccindorme</div>
                        <div className="table-responsive">
                            <table className="table tableHoraireVaccinodromeRdvPatient">
                                <thead>
                                    <tr>
                                        <th className="titleTable">Jour</th>
                                        <th className="titleTable">Dimanche</th>
                                        <th className="titleTable">Lundi</th>
                                        <th className="titleTable">Mardi</th>
                                        <th className="titleTable">Mercredi</th>
                                        <th className="titleTable">Jeudi</th>
                                        <th className="titleTable">Vendredi</th>
                                        <th className="titleTable">Samedi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="titleTable secondanswerTable">Matin</td>
                                        {
                                            (horaireVaccinodrome).map((data,i)=>{
                                                return <td key={i} className="answerTable firstanswerTable">
                                                    {
                                                        (data.matinDebut!==0 && data.matinFin!==0)?(''+utile.completChiffre(data.matinDebut)+'h à '+utile.completChiffre(data.matinFin)+'h'): 
                                                        ('INDISPONIBLE')
                                                    }
                                                </td>
                                            })
                                        }
                                    </tr>
                                    <tr>
                                        <td className="titleTable">Après midi</td>
                                        {
                                            (horaireVaccinodrome).map((data,i)=>{
                                                return <td key={i} className="answerTable">
                                                    {(data.midiDebut!==0 && data.midiFin!==0)?(''+utile.completChiffre(data.midiDebut)+'h à '+utile.completChiffre(data.midiFin)+'h'):
                                                    ('INDISPONIBLE')}
                                                </td>
                                            })
                                        }
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                    </div>
                    <div className="champsInputRdvPatient">
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input type="text" defaultValue={vaccin.nomVaccin} disabled/>
                                <label>Vaccin</label>
                            </div>
                        </div>
                    </div>
                    <div className="son_champsUpdateProfilePatient">
                        <div className="formItem_champsUpdateProfilePatient">
                            <select defaultValue={0} onChange={(e)=>this.setState({doseDemandeRdv : utile.parseStringToInt(e.target.value)})}>
                                <option value={0}>N émé dose</option>
                                {
                                    (utile.createTableauNumber(1,vaccinCentre.nombreDose)).map((data,i)=>{
                                        return <option value={data} key={i}>{(data===1)?data+'ére':data+'éme'}</option>
                                    })
                                }
                            </select>
                            <label>Vous étez à combien de dose ?</label>
                        </div>
                    </div>
                    <div className="champsInputRdvPatient">
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <input onChange={(e)=>this.setState({dateDemandeRdv : e.target.value})}  type="date"/>
                                <label>Date du rendez-vous</label>
                            </div>
                        </div>
                    </div>
                    <div className="dateDuRdvPatient">{this.setDateRdv(dateDemandeRdv,horaireVaccinodrome)}</div>
                    <div className="son_champsUpdateProfilePatient">
                        <div className="formItem_champsUpdateProfilePatient">
                            <select defaultValue={1} onChange={(e)=>this.setState({aQuiDemandeRdv : utile.parseStringToInt(e.target.value)})}>
                                <option value={0}>Sélectionner votre choix</option>
                                <option value={1}>Pour moi</option>
                                <option value={2}>Pour moi et ma famille</option>
                            </select>
                            <label>Pour qui est ce rendez-vous</label>
                        </div>
                    </div>
                    <div className="tableMaFamilleRdvPatient" hidden={aQuiDemandeRdv!==2 || famille.length<=0}>
                        <div className="table-responsive">
                            <table className="table table-bordered ">
                                <thead>
                                    <tr>
                                        <th>Etat</th>
                                        <th>Nom</th>
                                        <th>Sexe</th>
                                        <th>Date de naissance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (famille).map((data,i)=>{
                                            return (
                                                <tr key={i}>
                                                    <td>{data.positionFamilliale}</td>
                                                    <td>{data.nom}</td>
                                                    <td>{(data.sexe===2)?'Femme':'Homme'}</td>
                                                    <td>{utile.getDateComplet(data.naissance)}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="champsInputRdvPatient">
                        <div className="son_champsUpdateProfilePatient">
                            <div className="formItem_champsUpdateProfilePatient">
                                <textarea rows="2" onChange={(e)=>this.setState({descriptionDemandeRdv : e.target.value})} placeholder="La description du rendez-vous n'est pas oubligatoire"></textarea>
                                <label>Description du rendez-vous</label>
                            </div>
                        </div>
                    </div>
                    <button className="btn-primary form-control" onClick={()=>this.enregisterDemandeRdvPatient()}>Envoie la demande de rendez-vous</button>
                </>
            )
        }
        return <div></div>;
    }
    //get data html détail d'une rendez-vous
    getDataHtmlDetailRdv(infoDemandeRdv){
        return (
            <>
                <ul className="ulAddRdvRdvPatient">
                    <li className="li1" onClick={()=>this.setState({stepper : 1})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                    <li className="li2">Voir le détail du rendez-vous</li>
                    <li className="li3"></li>
                </ul>
                {this.getDataHtmlDetailRdvSon(infoDemandeRdv)}
            </>
        )
    }
    //get data html détail d'une rendez-vous
    getDataHtmlDetailRdvSon(infoDemandeRdv){
        if(infoDemandeRdv!==undefined && infoDemandeRdv!==null){
            return (
                <>
                    <div className="divSeparator">
                        <div className="textMiniTitleRdvPatient one">Moi</div>
                        <div className="DetailUtilisateur DetailUtilisateurTmp">
                            <div className="DetailUtilisateurV1">
                                <img src={infoDemandeRdv.utilisateur.urlPhoto} alt="image_utilisateur" className="imageVaccinodrome"/>
                            </div>
                            <div className="DetailUtilisateurV2 DetailUtilisateurV2Tmp">
                                <table className="table tableHoraireVaccinodromeRdvPatient">
                                    <tbody>
                                        <tr>
                                            <td className="titleTable leftTmp">Utilisateur</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.utilisateur.nom}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">sexe</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp">{(infoDemandeRdv.utilisateur.sexe===2)?'Femme':'Homme'}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Date de naissance</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.utilisateur.naissance}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Mon email</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.utilisateur.email}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Numéro de téléphone</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.utilisateur.telephone}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Nom du vaccin</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.vaccin.nomVaccin}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Dose</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {(infoDemandeRdv.demandeRdv.dose===1) ? '1ére ' : infoDemandeRdv.demandeRdv.dose+' éme '} / {infoDemandeRdv.vaccinCentre.nombreDose}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Personne à vaccinée</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.demandeRdv.famille + 1}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Date du RDV</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {utile.getDateComplet(infoDemandeRdv.demandeRdv.dateRdv)}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Description du RDV</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.demandeRdv.descriptions}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="divSeparator">
                        <div className="textMiniTitleRdvPatient two">Vaccinodrome</div>
                        <div className="DetailUtilisateur DetailUtilisateurTmp">
                            <div className="DetailUtilisateurV1">
                                <img src={infoDemandeRdv.vaccinodrome.urlPhoto} alt="image_vaccinodrome" className="imageVaccinodrome"/>
                            </div>
                            <div className="DetailUtilisateurV2 DetailUtilisateurV2Tmp">
                                <table className="table tableHoraireVaccinodromeRdvPatient">
                                    <tbody>
                                        <tr>
                                            <td className="titleTable leftTmp">Vaccinodrome</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.vaccinodrome.nomCentre}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Vaccin</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp">{infoDemandeRdv.vaccin.nomVaccin}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Maladie incompatible au vaccin</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp">{infoDemandeRdv.vaccinCentre.descriptions}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Nombre de dose</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.vaccinCentre.nombreDose}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Age minimum</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.vaccinCentre.ageMinimum}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Email</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.vaccinodrome.email}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Téléphone</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.vaccinodrome.telephone}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Adresse</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.vaccinodrome.adresse}</td>
                                        </tr>
                                        <tr>
                                            <td className="titleTable leftTmp">Localisation</td>
                                            <td className="answerTable firstanswerTable leftTmp sizeTmp"> {infoDemandeRdv.vaccinodrome.localisation}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="divSeparator">
                        <div className="divHoraireVaccinodromeRdvPatient DetailUtilisateurTmp">
                            <div className="textHoraireVaccindormeRdvPatient textHoraireVaccindormeRdvPatientTmp three">Jour d'ouverture du vaccindorme</div>
                            <div className="table-responsive">
                                <table className="table tableHoraireVaccinodromeRdvPatient">
                                    <thead>
                                        <tr>
                                            <th className="titleTable">Jour</th>
                                            <th className="titleTable">Dimanche</th>
                                            <th className="titleTable">Lundi</th>
                                            <th className="titleTable">Mardi</th>
                                            <th className="titleTable">Mercredi</th>
                                            <th className="titleTable">Jeudi</th>
                                            <th className="titleTable">Vendredi</th>
                                            <th className="titleTable">Samedi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="titleTable secondanswerTable">Matin</td>
                                            {
                                                (infoDemandeRdv.horaireVaccinodrome).map((data,i)=>{
                                                    return <td key={i} className="answerTable firstanswerTable">
                                                        {
                                                            (data.matinDebut!==0 && data.matinFin!==0)?(''+utile.completChiffre(data.matinDebut)+'h à '+utile.completChiffre(data.matinFin)+'h'): 
                                                            ('INDISPONIBLE')
                                                        }
                                                    </td>
                                                })
                                            }
                                        </tr>
                                        <tr>
                                            <td className="titleTable">Après midi</td>
                                            {
                                                (infoDemandeRdv.horaireVaccinodrome).map((data,i)=>{
                                                    return <td key={i} className="answerTable">
                                                        {(data.midiDebut!==0 && data.midiFin!==0)?(''+utile.completChiffre(data.midiDebut)+'h à '+utile.completChiffre(data.midiFin)+'h'):
                                                        ('INDISPONIBLE')}
                                                    </td>
                                                })
                                            }
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                        </div>
                    </div>
                    <div className="divSeparator" hidden={infoDemandeRdv.famille.length<=0}>
                        <div className="divHoraireVaccinodromeRdvPatient DetailUtilisateurTmp">
                            <div className="textHoraireVaccindormeRdvPatient textHoraireVaccindormeRdvPatientTmp four">Ma famille</div>
                            <div className="table-responsive">
                                <table className="table tableHoraireVaccinodromeRdvPatient">
                                    <thead>
                                        <tr>
                                            <th className="titleTable">Etat</th>
                                            <th className="titleTable">Nom</th>
                                            <th className="titleTable">Sexe</th>
                                            <th className="titleTable">Date de naissance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {
                                                (infoDemandeRdv.famille).map((data,i)=>{
                                                    return (
                                                        <tr key={i}>
                                                            <td className="answerTable firstanswerTable">{data.positionFamilliale}</td>
                                                            <td className="answerTable firstanswerTable">{data.nom}</td>
                                                            <td className="answerTable firstanswerTable">{(data.sexe===2)?'Femme':'Homme'}</td>
                                                            <td className="answerTable firstanswerTable">{utile.getDateComplet(data.naissance)}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                    </tbody>
                                </table>
                            </div>
                            
                        </div>
                    </div>
                </>
            )
        }
        return <div>Il y a une erreur</div>;
    }
    // get data html change vaccinodrome
    getDataHtmlChangeVaccinodrome(dataListVaccinView,stepperInscription,showSearch,dataAvertissementMaladieVaccinodrome,regions,district,commune,arrondissement,fokontany,regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription,libellerSearch,dataListVaccinCentreView){
        return (
            <>
                <div className="">
                    <ul className="ulAddRdvRdvPatient">
                        <li className="li1" onClick={()=>this.videTousLesStates()}><FontAwesomeIcon icon={faArrowLeft} /></li>
                        <li className="li2">Change de vaccinodrome</li>
                        <li className="li3"></li>
                    </ul>

                    <div className="setVaccinodromeRdvPatient">
                        <ul className="ulAddRdvRdvPatient">
                            <li className="li1" hidden={stepperInscription<2} onClick={()=>this.setState({stepperInscription : this.state.stepperInscription-1})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                            <li className="li1" hidden={stepperInscription > 1}></li>
                            <li className="li2"></li>
                            <li className="li3"></li>
                        </ul>
                        <div hidden={stepperInscription!==1}>
                            <div className="miniTitleInscriptionPatient">Veuillez sélectionner le vaccin qui vous convient</div>
                            <div className="searchVaccinDemanderLoginPatient">
                                <ul className="ul">
                                    <li className="li1"><input type="text"  onChange={(e)=>this.setState({dataSearchListVaccinView : {libeller : e.target.value, colone : '',etat : true}})} className="input" placeholder="Saisissez votre recherche" /></li>
                                    <li className="li2"><button className="btn" onClick={()=>this.setState({dataListVaccinView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0}},()=>this.getDataVaccinView(0))}><FontAwesomeIcon icon={faSearch} /></button></li>
                                </ul>
                            </div>
                            <div className="container containerPageWrapper">
                                <div className="row">
                                    {
                                        this.getDataVaccinViewInState(dataListVaccinView).map((data,i)=>{
                                            return (
                                                <div className="col-md-4 col-sm-4 col-xs-12" key={i}>
                                                    <div className="pageInner">
                                                        <div className="">
                                                            <div className="elWrapper">
                                                                <div className="boxUp">
                                                                    <img className="imageInboxUp" src={data.urlPhoto} alt="image_du_vaccin" />
                                                                    <div className="">
                                                                        <div className="infoInner">
                                                                            <span className="infoInnerPNname">{data.nomVaccin}</span>
                                                                            <span className="infoInnerPCompany"></span>
                                                                        </div>
                                                                        <div className="descriptionvaccinationasize">
                                                                            <div className="descdescriptionvaccinationasize"><div>Description </div> {data.descriptions}</div>
                                                                            <div className="descdescriptionvaccinationasize"><div>Maladies non compatibles avec le vaccin </div> {data.maladie}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>       
                                                                <div className="boxDown">
                                                                    <div className="boxDownHbg">
                                                                        <div className="boxDownHbgInner"></div>
                                                                    </div>           
                                                                    <a className="cartPrixVaccin" href={"#"+data.nomVaccin} onClick={()=>this.selectionnerUnVaccin(data)}>
                                                                        <span className="price">Séléctionner</span>
                                                                        <span className="addToCart"><span className="txtVaccin">Séléctionner</span></span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="row" style={{marginTop: '40px'}}>
                                    <div className="col-md-12 col-sm-12 col-xs-12">{this.createDataHtmlPaginationVaccinView(dataListVaccinView.totalpage,dataListVaccinView.page)}</div>
                                </div>
                                <div className="form-check" style={{marginTop: '52px'}}>
                                    <label className="label-agree-term"><span><span></span></span>Pour vous connecter sur votre compte, <a href="#login" className="term-service" onClick={() =>this.setState({stepContent : 1})} >cliquez ici.</a></label>
                                </div>
                            </div>
                        </div>
                        <div  hidden={stepperInscription!==2}>
                            {this.getDataHtmlAvertissementMaladieTmp(dataAvertissementMaladieVaccinodrome)}
                            <div className="searchVaccinodromeLoginPatient" hidden={showSearch}>
                                <ul className="ul">
                                    <li className="li1"><input type="text" className="input"  onChange={(e)=>this.setState({dataSearchListVaccinCentreView : {libeller : e.target.value, colone : '',etat : true}})} placeholder="Saisissez votre recherche" /></li>
                                    <li className="li2"><button className="btn" onClick={()=>this.setState({etatsearch : false,dataListVaccinCentreView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0}},()=>this.getDataVaccinCentreView(0))}><FontAwesomeIcon icon={faSearch} /></button></li>
                                    <li className="li3"><button className="btn" onClick={()=>this.setState({showSearch : true})} >Filtrer</button></li>
                                </ul>
                            </div>
                            <div className="filtreSearchLoginPatient" hidden={!showSearch}>
                                <div className="titlefiltreSearchLoginPatient">Recherche avancé</div>
                                <div className="row">
                                    <div className="col-md-4 col-xs-6 col-xs-12">
                                        <div className="select_search_LoginVaccinodrome">
                                            <Search
                                                title = "Sélectionner une region"
                                                typeInput = "text"
                                                placeholderInput = "Saisissez votre recherche ici"
                                                options  = {this.setListeRegionToListReactSelect(regions)}
                                                hasNextPage = {this.getRegionsHasNextPageOrNot(regions)}
                                                onchange = {(e)=>{this.handleChangeOptionListeRegions(e)}}
                                                onClickNext = {(e)=>this.onClickNextRegions(regions)}
                                                onClickSearch = {(e)=>this.onClickSearchRegions(e)}
                                                onClickActualize = {()=>this.onClickActualizeRegions()}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-xs-6 col-xs-12">
                                        <div className="select_search_LoginVaccinodrome">
                                            <Search 
                                                title = "Sélectionner une distrcit"
                                                typeInput = "text"
                                                placeholderInput = "Saisissez votre recherche ici"
                                                options  = {this.setListeDistrictToListReactSelect(district)}
                                                hasNextPage = {this.getDistrictHasNextPageOrNot(district)}
                                                onchange = {(e)=>{this.handleChangeOptionListeDistrict(e)}}
                                                onClickNext = {(e)=>this.onClickNextDistrict(district)}
                                                onClickSearch = {(e)=>this.onClickSearchDistrict(e)}
                                                onClickActualize = {()=>this.onClickActualizeDistrict()}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-xs-6 col-xs-12">
                                        <div className="select_search_LoginVaccinodrome">
                                            <Search 
                                                title = "Sélectionner un commune"
                                                typeInput = "text"
                                                placeholderInput = "Saisissez votre recherche ici"
                                                options  = {this.setListeCommuneToListReactSelect(commune)}
                                                hasNextPage = {this.getCommuneHasNextPageOrNot(commune)}
                                                onchange = {(e)=>{this.handleChangeOptionListeCommune(e)}}
                                                onClickNext = {(e)=>this.onClickNextCommune(commune)}
                                                onClickSearch = {(e)=>this.onClickSearchCommune(e)}
                                                onClickActualize = {()=>this.onClickActualizeCommune()}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-xs-6 col-xs-12">
                                        <div className="select_search_LoginVaccinodrome">
                                            <Search 
                                                title = "Sélectionner un arrondissement"
                                                typeInput = "text"
                                                placeholderInput = "Saisissez votre recherche ici"
                                                options  = {this.setListeArrondissementToListReactSelect(arrondissement)}
                                                hasNextPage = {this.getArrondissementHasNextPageOrNot(arrondissement)}
                                                onchange = {(e)=>{this.handleChangeOptionListeArrondissement(e)}}
                                                onClickNext = {(e)=>this.onClickNextArrondissement(arrondissement)}
                                                onClickSearch = {(e)=>this.onClickSearchArrondissement(e)}
                                                onClickActualize = {()=>this.onClickActualizeArrondissement()}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-xs-6 col-xs-12">
                                        <div className="select_search_LoginVaccinodrome">
                                            <Search 
                                                title = "Sélectionner un fokontany"
                                                typeInput = "text"
                                                placeholderInput = "Saisissez votre recherche ici"
                                                options  = {this.setListeFokontanyToListReactSelect(fokontany)}
                                                hasNextPage = {this.getFokontanyHasNextPageOrNot(fokontany)}
                                                onchange = {(e)=>{this.handleChangeOptionListeFokontany(e)}}
                                                onClickNext = {(e)=>this.onClickNextFokontany(fokontany)}
                                                onClickSearch = {(e)=>this.onClickSearchFokontany(e)}
                                                onClickActualize = {()=>this.onClickActualizeFokontany()}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-xs-12 col-xs-12">
                                        <div className="champsInputSearchAvancerLoginPatient"><input type="text" onChange={(e)=>this.setState({libellerSearch : e.target.value})} className="input" placeholder="Saisissez votre recherche"  /></div>
                                    </div>
                                    <div className="col-md-12 col-xs-12 col-xs-12">
                                        <div className="champsInputSearchAvancerLoginPatient">
                                            {this.getVerificationIfNotNullInfo('Region ',regionInscription)}
                                            {this.getVerificationIfNotNullInfo('District',districtInscription)}
                                            {this.getVerificationIfNotNullInfo('Commune ',communeInscription)}
                                            {this.getVerificationIfNotNullInfo('Arrondissement ',arrondissementInscription)}
                                            {this.getVerificationIfNotNullInfo('Fokontany ',fokontanyInscription)}
                                            {this.getVerificationIfNotNullInfo('Libellé champs de recherche ',{libeller : libellerSearch})}
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-xs-6 col-xs-12"><button className="form-control btn-success" onClick={()=>this.setState({etatsearch : true,dataListVaccinCentreView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0}},()=>this.getDataVaccinCentreView(0))} >Rechercher</button></div>
                                    <div className="col-md-6 col-xs-6 col-xs-12"><button className="form-control btn-danger" onClick={()=>this.setState({showSearch:false,dataListVaccinCentreView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0}},()=>{this.getDataVaccinCentreView(0);})} >Annuler</button></div>
                                </div>
                            </div>
                            <div className="">
                                {
                                    (this.getDataVaccinCentreViewInState(dataListVaccinCentreView)).map((data,i)=>{
                                        return (
                                            <div key={i}>
                                                <div className="row rowlistVaccinodromeLoginPatient">
                                                    <div className="col-md-4 col-sm-6 col-xs-12 colrowlistVaccinodromeLoginPatient">
                                                        <img src={data.imgvaccinodrome} alt="image_vaccinodrome" className="imageVaccinodrome"/>
                                                    </div>
                                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                                        <table className="table StitlelistVaccindormeLoginPatient">
                                                            <tbody>
                                                                <tr>
                                                                    <td className="td1">Vaccinodrome</td>
                                                                    <td className="td2">{data.nomCentre}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="td1">Vaccin</td>
                                                                    <td className="td2">{data.nomVaccin}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="td1">Nombre de dose</td>
                                                                    <td className="td2">{data.nombreDose}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="td1">Age minimum patient</td>
                                                                    <td className="td2">{data.ageMinimum}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="td1">Email</td>
                                                                    <td className="td2">{data.email}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="td1">Téléphone</td>
                                                                    <td className="td2">{data.telephone}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="td1">Adresse</td>
                                                                    <td className="td2">{data.adresse}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="td1">Localisation</td>
                                                                    <td className="td2">{data.localisation}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={2}><button className="btn-success form-control" onClick={()=>this.selectionUneVaccinodrome(data)}>Selectionner le vaccinodrome</button></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                
                            </div>
                            <div className="row" style={{marginTop: '40px'}}>
                                <div className="col-md-12 col-sm-12 col-xs-12">{this.createDataHtmlPaginationVaccinCentreView(dataListVaccinCentreView.totalpage,dataListVaccinCentreView.page)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    selectionnerUnVaccin=(dataVaccin)=>{
        this.setState({dataVaccinInscriptionPatient : dataVaccin},()=>{
            this.getDataVaccinCentreView(0);
            this.getAvertissementMaladieTmp(this.state.dataVaccinInscriptionPatient.idVaccin);
            this.setState({stepperInscription : 2});
        })
    }
    
    selectionUneVaccinodrome=(vaccinodrome)=>{
        let vaccin = this.state.dataVaccinInscriptionPatient;
        let dataToken = auth.getDataUtilisateurToken();
        if(dataToken!==null && dataToken!==undefined){
            let idutilisateur = utile.parseStringToInt(dataToken.id);
            if(idutilisateur!==undefined && idutilisateur!==null && idutilisateur>0){
                let data = {
                    idInfoVaccinUser : 0,
                    idUtilisateur : idutilisateur,
                    idVaccinCentre : vaccinodrome.idVaccinCentre,
                    idVaccinodrome : vaccinodrome.idVaccinodrome,
                    idVaccin : vaccin.idVaccin,
                    status : 1
                }
                fetchPost('infovaccinuser/insertion-infovaccinuser',data).then(response=>{
                    if(response!==null && response!==undefined){
                        this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true});
                    }
                })
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes, ou votre session est terminé.",etatsmsmodal : true});
            }
        }
    }
    //verification info select localisation si null ou pas
    getVerificationIfNotNullInfo(text,data){
        if(data!==null && data!==undefined){
            if(data.libeller!==undefined && data.libeller !== null && data.libeller !=='' && data.libeller !==' '){ 
                return <div className="text_value_localisation_inscriptionVaccinodromev2"><span  className="sontext_value_localisation_inscriptionVaccinodrome">{text}</span> : {data.libeller}</div>
            }
        }
        return '';
    }
    // get data html avertissement maladie 
    getDataHtmlAvertissementMaladieTmp(dataAvertissementMaladieVaccinodrome) {
        if(dataAvertissementMaladieVaccinodrome!==undefined && dataAvertissementMaladieVaccinodrome!==null){
            if(dataAvertissementMaladieVaccinodrome.status === 200){
                return (
                    <>
                        <div className="descriptionInscriptionPatient">
                            <div className="des">Veuillez sélectionner le centre de vaccination qui vous convient le mieux</div>
                            <div className=""><b><span className="spantmp">Attention</span>, les maladies suivantes ne sont pas compatibles avec le vaccin :</b> {dataAvertissementMaladieVaccinodrome.message} </div>
                        </div>
                    </>
                )
            }
        }
        return (
            <>
                <div className="descriptionInscriptionPatient">
                    <div className="">Veuillez sélectionner le centre de vaccination qui vous convient le mieux</div>
                </div>
            </>
        )
    }
    //get data avertissement maladie
    getAvertissementMaladieTmp(idvaccin){
        if(utile.getVerificationChampsText(''+idvaccin)){
            this.setState({activeloader : true});
            fetchGet('maladie/allavertissement-maladie/'+idvaccin).then(response=>{ 
                this.setState({activeloader : false});
                if(response !== undefined && response!==null){
                    this.setState({dataAvertissementMaladieVaccinodrome : response});
                }
            });
        }
    }
    //data vaccinview to display list
    getVerificationDataPageVaccinView(page){
        let data = this.state.dataListVaccinView.data;let size =  data.length;
        if(size > 0){
            for (let i = 0; i < size; i++) {
                if(data.page === page){
                    this.setState({dataListVaccinView : {data : this.state.dataListVaccinView.data,page : page, libeller : this.state.dataListVaccinView.libeller, colone : this.state.dataListVaccinView.colone}});
                    return true;
                }
            }
            return false;
        }
        return false;
    }
    getDataVaccinView(page){
        if(!this.getVerificationDataPageVaccinView(page)){
            let dataSearchListVaccinView = this.state.dataSearchListVaccinView;
            let url = "vaccin/";let libeller =  dataSearchListVaccinView.libeller;
            if(dataSearchListVaccinView.etat && utile.getVerificationChampsText(libeller)){url=url+"vaccinviewsearch/10/"+page+"/"+libeller;}else{url=url+"vaccinview/10/"+page;}
            this.setState({activeloader : true});
            fetchGet(url).then(response=>{ 
                this.setState({activeloader : false});
                if(response !== undefined && response!==null){
                    let dataListVaccinView = this.state.dataListVaccinView;let tmp= dataListVaccinView.data;let size = tmp.length;let test = false;
                    for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
                    if(!test){ tmp.push({docs : response.docs,page : response.page}); }
                    this.setState({dataListVaccinView : {data : tmp,page : response.page, libeller : dataListVaccinView.libeller, colone : dataListVaccinView.colone,totalpage : response.totalPages}});
                }
            });
        }
    }
    getDataVaccinViewInState(dataListVaccinView){
        let data = dataListVaccinView.data;let page = dataListVaccinView.page;let size = data.length;
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
    setPageInPaginationVaccinView=(e)=>{
        let newpage = utile.parseStringToInt(e)-1;
        if(newpage>=0){   
            this.getDataVaccinView(newpage);
        }
    }
    createDataHtmlPaginationVaccinView(pageTotal,page){
        if(pageTotal>0  && page>=0){
            return  <Pagination totalPages={pageTotal} page={page} setPage={(e)=> this.setPageInPaginationVaccinView(e)} />
        }
        return <div></div>
    }
    //data vaccincentreview to display list
    getVerificationDataPageVaccinCentreView(page){
        let data = this.state.dataListVaccinCentreView.data;let size =  data.length;
        if(size > 0){
            for (let i = 0; i < size; i++) {
                if(data.page === page){
                    this.setState({dataListVaccinCentreView : {data : this.state.dataListVaccinCentreView.data,page : page, libeller : this.state.dataListVaccinCentreView.libeller, colone : this.state.dataListVaccinCentreView.colone}});
                    return true;
                }
            }
            return false;
        }
        return false;
    }
    getDataLocalisation(page,idvaccin){
        let region = this.state.regionInscription;let district = this.state.districtInscription;let commune = this.state.communeInscription;
        let arrondissement = this.state.arrondissementInscription;let fokontany = this.state.fokontanyInscription;let libeller = this.state.libellerSearch;
        let data = {
            idRegion : '',
            idDistrict : '',
            idCommune : '',
            idArrindissement : '',
            idFokontany : '',
            libellerSearch : '',
            idvaccin : idvaccin,
            page : page
        };
        if(region!==undefined && region!==null){if(utile.getVerificationChampsText(region.libeller)){ data.idRegion = region.id;}}
        if(district!==undefined && district!==null){if(utile.getVerificationChampsText(district.libeller)){ data.idDistrict = district.id;}}
        if(commune!==undefined && commune!==null){if(utile.getVerificationChampsText(commune.libeller)){ data.idCommune = commune.id;}}
        if(arrondissement!==undefined && arrondissement!==null){if(utile.getVerificationChampsText(arrondissement.libeller)){ data.idArrindissement = arrondissement.id;}}
        if(fokontany!==undefined && fokontany!==null){if(utile.getVerificationChampsText(fokontany.libeller)){ data.idFokontany = fokontany.id;}}
        if(utile.getVerificationChampsText(libeller)){ data.libellerSearch = libeller;}
        if(page!==null && page!==undefined){ if(page<0){ data.page =0;}else{ data.page =page;}}else{ data.page = 0;}
        return data;
    }
    getDataVaccinCentreView(page){
        let idvaccin = this.state.dataVaccinInscriptionPatient.idVaccin;let etatsearch = this.state.etatsearch;
        if(idvaccin!==undefined && idvaccin!==null && idvaccin>0){
            if(etatsearch){
                let data = this.getDataLocalisation(page,idvaccin);
                this.setState({activeloader : true});
                fetchPost('vaccincentre/searchbyfilter-centrevaccination',data).then(response=>{ 
                    this.setState({activeloader : false});
                    if(response !== undefined && response!==null){
                        let dataListVaccinCentreView = this.state.dataListVaccinCentreView;let tmp= dataListVaccinCentreView.data;let size = tmp.length;let test = false;
                        for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
                        if(!test){ tmp.push({docs : response.docs,page : response.page}); }
                        this.setState({dataListVaccinCentreView : {data : tmp,page : response.page, libeller : dataListVaccinCentreView.libeller, colone : dataListVaccinCentreView.colone,totalpage : response.totalPages}});
                    }
                });
            }else{
                if(!this.getVerificationDataPageVaccinCentreView(page)){
                    let dataSearchListVaccinCentreView = this.state.dataSearchListVaccinCentreView;
                    let url = "vaccincentre/";let libeller =  dataSearchListVaccinCentreView.libeller;
                    if(dataSearchListVaccinCentreView.etat && utile.getVerificationChampsText(libeller)){url=url+"searchbyidvaccin/"+idvaccin+"/10/"+page+"/"+libeller;}else{url=url+"listbyidvaccin/"+idvaccin+"/10/"+page;}
                    this.setState({activeloader : true});
                    fetchGet(url).then(response=>{ 
                        this.setState({activeloader : false});
                        if(response !== undefined && response!==null){
                            let dataListVaccinCentreView = this.state.dataListVaccinCentreView;let tmp= dataListVaccinCentreView.data;let size = tmp.length;let test = false;
                            for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
                            if(!test){ tmp.push({docs : response.docs,page : response.page}); }
                            this.setState({dataListVaccinCentreView : {data : tmp,page : response.page, libeller : dataListVaccinCentreView.libeller, colone : dataListVaccinCentreView.colone,totalpage : response.totalPages}});
                        }
                    });
                }
            }
        }
    }
    getDataVaccinCentreViewInState(dataListVaccinCentreView){
        let data = dataListVaccinCentreView.data;let page = dataListVaccinCentreView.page;let size = data.length;
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
    //pagination liste VaccinCentreView
    setPageInPaginationVaccinCentreView=(e)=>{
        let newpage = utile.parseStringToInt(e)-1;
        if(newpage>=0){   
            this.getDataVaccinCentreView(newpage);
        }
    }
    createDataHtmlPaginationVaccinCentreView(pageTotal,page){
        if(pageTotal>0  && page>=0){
            return  <Pagination totalPages={pageTotal} page={page} setPage={(e)=> this.setPageInPaginationVaccinCentreView(e)} />
        }
        return <div></div>
    }
    //----------------------------------------------------------------Localisation data in mongodb Search ----------------------------------------------------------------
    
    //data region search 
    getRegion(page,addData){
        let libeller = this.state.libellerRegion;let url =""+confignode;
        if(utile.getVerificationChampsText(libeller)){url=url+"find-regions/"+libeller+"?page="+page;}else{url=url+"regions?page="+page;}
        fetchGetUrl(url).then(response=>{ 
            if(response !== undefined && response!==null){
                if(addData){
                    if(response!==undefined && response!==null){
                        let allData = response;let data = response.docs;let regions = this.state.regions;
                        if(regions!==undefined && regions!==null){
                            let docs = regions.docs;
                            if(docs!==undefined && docs!==null){
                                let size = data.length;
                                for(let i = 0; i < size; i++){
                                    docs.push(data[i]);
                                }
                                data = [];data = docs;
                            }
                        }
                        allData.docs = data;
                        this.setState({regions : allData});
                    }
                }else{
                    this.setState({regions: response});
                }
            }
        });
    }
    getRegionsHasNextPageOrNot(regions){
        if(regions!==undefined && regions!==null){ let hasNext = regions.hasNextPage; if(hasNext!==undefined && hasNext!==null){return hasNext;} }
        return false;
    }
    setListeRegionToListReactSelect(regions){
        let data = [];
        if(regions!==undefined && regions!==null){
            let dataRegions = regions.docs;
            let size = dataRegions.length;
            for (let i = 0; i < size; i++) {
                let lb = (<div><div>{dataRegions[i].libeller}</div></div>);
                data.push({value : {id : dataRegions[i]._id, libeller : dataRegions[i].libeller},label : lb});
            }
            return data;
        }
        return data;
    }
    handleChangeOptionListeRegions=(selectedOption)=>{
        if(selectedOption !== undefined && selectedOption!==null){
            this.setState({regionInscription : selectedOption.value,districtInscription : null,communeInscription : null,arrondissementInscription : null,fokontanyInscription : null},()=>{this.getDistrict(1,false);});
        }
    }
    onClickNextRegions=(regions)=>{
        if(regions!==undefined && regions!==null){ 
            if(regions.hasNextPage!==undefined && regions.hasNextPage!==null && regions.nextPage!==undefined && regions.nextPage!==null){
                if(regions.hasNextPage===true  && regions.nextPage>0){
                    this.getRegion(regions.nextPage,true);
                }
            } 
        }
    }
    onClickActualizeRegions=()=>{
        this.setState({libellerRegion : ''},()=>{ this.getRegion(1,false); });
    }
    onClickSearchRegions=(data)=>{
        if(utile.getVerificationChampsText(data)){ this.setState({libellerRegion : data},()=>{ this.getRegion(1,false); }) }
        else{this.onClickActualizeRegions();}
    }
    //data district search 
    getDistrict(page,addData){
        let dataRegion  = this.state.regionInscription;
        if(dataRegion!==null && dataRegion!==undefined){
            if(dataRegion.id!==undefined && dataRegion.id !== null && dataRegion.id !==''){
                let libeller = this.state.libellerDistrict;let url =""+confignode;
                if(utile.getVerificationChampsText(libeller)){url=url+"find-district/"+libeller+"/"+dataRegion.id+"?page="+page;}
                else{url=url+"find-district-idregion/"+dataRegion.id+"?page="+page;}
                fetchGetUrl(url).then(response=>{ 
                    if(response !== undefined && response!==null){
                        if(addData){
                            if(response!==undefined && response!==null){
                                let allData = response;let data = response.docs;let tmp = this.state.district;
                                if(tmp!==undefined && tmp!==null){
                                    let docs = tmp.docs;
                                    if(docs!==undefined && docs!==null){
                                        let size = data.length;
                                        for(let i = 0; i < size; i++){
                                            docs.push(data[i]);
                                        }
                                        data = [];data = docs;
                                    }
                                }
                                allData.docs = data;
                                this.setState({district : allData});
                            }
                        }else{
                            this.setState({district: response});
                        }
                    }
                });
            }else{
                this.setState({district : null,libellerDistrict : ''});
            }
        }else{
            this.setState({district : null,libellerDistrict : ''});
        }
    }
    getDistrictHasNextPageOrNot(data){
        if(data!==undefined && data!==null){ let hasNext = data.hasNextPage; if(hasNext!==undefined && hasNext!==null){return hasNext;} }
        return false;
    }
    setListeDistrictToListReactSelect(dataTmp){
        let data = [];
        if(dataTmp!==undefined && dataTmp!==null){
            let docs = dataTmp.docs;
            let size = docs.length;
            for (let i = 0; i < size; i++) {
                let lb = (<div><div>{docs[i].libeller}</div></div>);
                data.push({value : {id : docs[i]._id, libeller : docs[i].libeller},label : lb});
            }
            return data;
        }
        return data;
    }
    handleChangeOptionListeDistrict=(selectedOption)=>{
        if(selectedOption !== undefined && selectedOption!==null){
            this.setState({districtInscription : selectedOption.value,communeInscription : null,arrondissementInscription : null,fokontanyInscription : null},()=>{this.getCommune(1,false)});
        }
    }
    onClickNextDistrict=(data)=>{
        let dataTmp  = this.state.regionInscription;
        if(dataTmp!==null && dataTmp!==undefined){
            if(data!==undefined && data!==null && dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !==''){ 
                if(data.hasNextPage!==undefined && data.hasNextPage!==null && data.nextPage!==undefined && data.nextPage!==null){
                    if(data.hasNextPage===true  && data.nextPage>0){
                        this.getDistrict(data.nextPage,true);
                    }
                } 
            }
        }
    }
    onClickActualizeDistrict=()=>{
        this.setState({libellerDistrict : ''},()=>{ 
            let dataTmp  = this.state.regionInscription;
            if(dataTmp!==null && dataTmp!==undefined){ 
                if(dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !==''){  this.getDistrict(1,false);}else{this.setState({district : null,libellerDistrict : ''})}
            }else{this.setState({district : null,libellerDistrict : ''})}
        });
    }
    onClickSearchDistrict=(data)=>{
        let dataTmp  = this.state.regionInscription;
        if(dataTmp!==null && dataTmp!==undefined){ 
            if(dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !=='' && utile.getVerificationChampsText(data)){ 
                this.setState({libellerDistrict : data},()=>{ this.getDistrict(1,false); }) 
            }else{
                this.onClickActualizeDistrict();
            }
        }else{
            this.onClickActualizeDistrict();
        }
    }
    //data commune search 
    getCommune(page,addData){
        let dataTmp  = this.state.districtInscription;
        if(dataTmp!==null && dataTmp!==undefined){
            if(dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !==''){
                let libeller = this.state.libellerCommune;let url =""+confignode;
                if(utile.getVerificationChampsText(libeller)){url=url+"find-commune/"+libeller+"/"+dataTmp.id+"?page="+page;}
                else{url=url+"find-commune-iddistrict/"+dataTmp.id+"?page="+page;}
                fetchGetUrl(url).then(response=>{ 
                    if(response !== undefined && response!==null){
                        if(addData){
                            if(response!==undefined && response!==null){
                                let allData = response;let data = response.docs;let tmp = this.state.commune;
                                if(tmp!==undefined && tmp!==null){
                                    let docs = tmp.docs;
                                    if(docs!==undefined && docs!==null){
                                        let size = data.length;
                                        for(let i = 0; i < size; i++){
                                            docs.push(data[i]);
                                        }
                                        data = [];data = docs;
                                    }
                                }
                                allData.docs = data;
                                this.setState({commune : allData});
                            }
                        }else{
                            this.setState({commune: response});
                        }
                    }
                });
            }else{
                this.setState({commune : null,libellerCommune : ''});
            }
        }else{
            this.setState({commune : null,libellerCommune : ''});
        }
    }
    setListeCommuneToListReactSelect(dataTmp){
        let data = [];
        if(dataTmp!==undefined && dataTmp!==null){
            let docs = dataTmp.docs;
            let size = docs.length;
            for (let i = 0; i < size; i++) {
                let lb = (<div><div>{docs[i].libeller}</div></div>);
                data.push({value : {id : docs[i]._id, libeller : docs[i].libeller},label : lb});
            }
            return data;
        }
        return data;
    }
    handleChangeOptionListeCommune=(selectedOption)=>{
        if(selectedOption !== undefined && selectedOption!==null){
            this.setState({communeInscription : selectedOption.value,arrondissementInscription : null,fokontanyInscription : null},()=>{this.getArrondissement(1,false)});
        }
    }
    getCommuneHasNextPageOrNot(data){
        if(data!==undefined && data!==null){ let hasNext = data.hasNextPage; if(hasNext!==undefined && hasNext!==null){return hasNext;} }
        return false;
    }
    onClickNextCommune=(data)=>{
        let dataTmp  = this.state.districtInscription;
        if(dataTmp!==null && dataTmp!==undefined){
            if(data!==undefined && data!==null && dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !==''){ 
                if(data.hasNextPage!==undefined && data.hasNextPage!==null && data.nextPage!==undefined && data.nextPage!==null){
                    if(data.hasNextPage===true  && data.nextPage>0){
                        this.getCommune(data.nextPage,true);
                    }
                } 
            }
        }
    }
    onClickActualizeCommune=()=>{
        this.setState({libellerCommune : ''},()=>{ 
            let dataTmp  = this.state.districtInscription;
            if(dataTmp!==null && dataTmp!==undefined){ 
                if(dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !==''){  this.getCommune(1,false);}else{this.setState({commune : null,libellerCommune : ''})}
            }else{this.setState({commune : null,libellerCommune : ''})}
        });
    }
    onClickSearchCommune=(data)=>{
        let dataTmp  = this.state.regionInscription;
        if(dataTmp!==null && dataTmp!==undefined){ 
            if(dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !=='' && utile.getVerificationChampsText(data)){ 
                this.setState({libellerCommune : data},()=>{ this.getCommune(1,false); }) 
            }else{
                this.onClickActualizeCommune();
            }
        }else{
            this.onClickActualizeCommune();
        }
    }
    //data arrondissement search 
    getArrondissement(page,addData){
        let dataTmp  = this.state.communeInscription;
        if(dataTmp!==null && dataTmp!==undefined){
            if(dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !==''){
                let libeller = this.state.libellerArrondissement;let url =""+confignode;
                if(utile.getVerificationChampsText(libeller)){url=url+"find-arrondissement/"+libeller+"/"+dataTmp.id+"?page="+page;}
                else{url=url+"find-arrondissement-idcommune/"+dataTmp.id+"?page="+page;}
                fetchGetUrl(url).then(response=>{ 
                    if(response !== undefined && response!==null){
                        if(addData){
                            if(response!==undefined && response!==null){
                                let allData = response;let data = response.docs;let tmp = this.state.arrondissement;
                                if(tmp!==undefined && tmp!==null){
                                    let docs = tmp.docs;
                                    if(docs!==undefined && docs!==null){
                                        let size = data.length;
                                        for(let i = 0; i < size; i++){
                                            docs.push(data[i]);
                                        }
                                        data = [];data = docs;
                                    }
                                }
                                allData.docs = data;
                                this.setState({arrondissement : allData});
                            }
                        }else{
                            this.setState({arrondissement: response});
                        }
                    }
                });
            }else{
                this.setState({arrondissement : null,libellerArrondissement : ''});
            }
        }else{
            this.setState({arrondissement : null,libellerArrondissement : ''});
        }
    }
    setListeArrondissementToListReactSelect(dataTmp){
        let data = [];
        if(dataTmp!==undefined && dataTmp!==null){
            let docs = dataTmp.docs;
            let size = docs.length;
            for (let i = 0; i < size; i++) {
                let lb = (<div><div>{docs[i].libeller}</div></div>);
                data.push({value : {id : docs[i]._id, libeller : docs[i].libeller},label : lb});
            }
            return data;
        }
        return data;
    }
    handleChangeOptionListeArrondissement=(selectedOption)=>{
        if(selectedOption !== undefined && selectedOption!==null){
            this.setState({arrondissementInscription : selectedOption.value,fokontanyInscription : null},()=>{this.getFokontany(1,false)});
        }
    }
    getArrondissementHasNextPageOrNot(data){
        if(data!==undefined && data!==null){ let hasNext = data.hasNextPage; if(hasNext!==undefined && hasNext!==null){return hasNext;} }
        return false;
    }
    onClickNextArrondissement=(data)=>{
        let dataTmp  = this.state.communeInscription;
        if(dataTmp!==null && dataTmp!==undefined){
            if(data!==undefined && data!==null && dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !==''){ 
                if(data.hasNextPage!==undefined && data.hasNextPage!==null && data.nextPage!==undefined && data.nextPage!==null){
                    if(data.hasNextPage===true  && data.nextPage>0){
                        this.getArrondissement(data.nextPage,true);
                    }
                } 
            }
        }
    }
    onClickActualizeArrondissement=()=>{
        this.setState({libellerArrondissement : ''},()=>{ 
            let dataTmp  = this.state.communeInscription;
            if(dataTmp!==null && dataTmp!==undefined){ 
                if(dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !==''){  this.getArrondissement(1,false);}else{this.setState({arrondissement : null,libellerArrondissement : ''})}
            }else{this.setState({arrondissement : null,libellerArrondissement : ''})}
        });
    }
    onClickSearchArrondissement=(data)=>{
        let dataTmp  = this.state.regionInscription;
        if(dataTmp!==null && dataTmp!==undefined){ 
            if(dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !=='' && utile.getVerificationChampsText(data)){ 
                this.setState({libellerArrondissement : data},()=>{ this.getArrondissement(1,false); }) 
            }else{
                this.onClickActualizeArrondissement();
            }
        }else{
            this.onClickActualizeArrondissement();
        }
    }
    //data fokontany search 
    getFokontany(page,addData){
        let dataTmp  = this.state.arrondissementInscription;
        if(dataTmp!==null && dataTmp!==undefined){
            if(dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !==''){
                let libeller = this.state.libellerFokontany;let url =""+confignode;
                if(utile.getVerificationChampsText(libeller)){url=url+"find-fokontany/"+libeller+"/"+dataTmp.id+"?page="+page;}
                else{url=url+"find-fokontany-idarrondissement/"+dataTmp.id+"?page="+page;}
                fetchGetUrl(url).then(response=>{ 
                    if(response !== undefined && response!==null){
                        if(addData){
                            if(response!==undefined && response!==null){
                                let allData = response;let data = response.docs;let tmp = this.state.fokontany;
                                if(tmp!==undefined && tmp!==null){
                                    let docs = tmp.docs;
                                    if(docs!==undefined && docs!==null){
                                        let size = data.length;
                                        for(let i = 0; i < size; i++){
                                            docs.push(data[i]);
                                        }
                                        data = [];data = docs;
                                    }
                                }
                                allData.docs = data;
                                this.setState({fokontany : allData});
                            }
                        }else{
                            this.setState({fokontany: response});
                        }
                    }
                });
            }else{
                this.setState({fokontany : null,libellerFokontany : ''});
            }
        }else{
            this.setState({fokontany : null,libellerFokontany : ''});
        }
    }
    setListeFokontanyToListReactSelect(dataTmp){
        let data = [];
        if(dataTmp!==undefined && dataTmp!==null){
            let docs = dataTmp.docs;
            let size = docs.length;
            for (let i = 0; i < size; i++) {
                let lb = (<div><div>{docs[i].libeller}</div></div>);
                data.push({value : {id : docs[i]._id, libeller : docs[i].libeller},label : lb});
            }
            return data;
        }
        return data;
    }
    handleChangeOptionListeFokontany=(selectedOption)=>{
        if(selectedOption !== undefined && selectedOption!==null){
            this.setState({fokontanyInscription : selectedOption.value});
        }
    }
    getFokontanyHasNextPageOrNot(data){
        if(data!==undefined && data!==null){ let hasNext = data.hasNextPage; if(hasNext!==undefined && hasNext!==null){return hasNext;} }
        return false;
    }
    onClickNextFokontany=(data)=>{
        let dataTmp  = this.state.arrondissementInscription;
        if(dataTmp!==null && dataTmp!==undefined){
            if(data!==undefined && data!==null && dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !==''){ 
                if(data.hasNextPage!==undefined && data.hasNextPage!==null && data.nextPage!==undefined && data.nextPage!==null){
                    if(data.hasNextPage===true  && data.nextPage>0){
                        this.getFokontany(data.nextPage,true);
                    }
                } 
            }
        }
    }
    onClickActualizeFokontany=()=>{
        this.setState({libellerFokontany : ''},()=>{ 
            let dataTmp  = this.state.communeInscription;
            if(dataTmp!==null && dataTmp!==undefined){ 
                if(dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !==''){  this.getFokontany(1,false);}else{this.setState({fokontany : null,libellerFokontany : ''})}
            }else{this.setState({fokontany : null,libellerFokontany : ''})}
        });
    }
    onClickSearchFokontany=(data)=>{
        let dataTmp  = this.state.communeInscription;
        if(dataTmp!==null && dataTmp!==undefined){ 
            if(dataTmp.id!==undefined && dataTmp.id !== null && dataTmp.id !=='' && utile.getVerificationChampsText(data)){ 
                this.setState({libellerFokontany : data},()=>{ this.getFokontany(1,false); }) 
            }else{
                this.onClickActualizeFokontany();
            }
        }else{
            this.onClickActualizeFokontany();
        }
    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
                <div className="mainRdvPatient">
                    <div className="containerRdvPatient">              
                        {
                            (this.state.stepper===11)?this.getDataHtmlOrdonance(this.state.infoPatientConfirmer,this.state.listPrescriptionData):
                            (this.state.stepper===22)?this.getDataHtmlDetailPatient(this.state.infoPatientConfirmer,this.state.listPrescriptionData):
                            (this.state.stepper===1)?this.getDataHtmlListeRdvPatient(this.state.listDemandeRdv,this.state.listDemandeRdvSearch,this.state.inputReset):
                            (this.state.stepper===3)?this.getDataHtmlDetailRdv(this.state.infoDemandeRdv):
                            (this.state.stepper===4)?this.getDataHtmlChangeVaccinodrome(this.state.dataListVaccinView,this.state.stepperInscription,this.state.showSearch,this.state.dataAvertissementMaladieVaccinodrome,
                                this.state.regions,this.state.district,this.state.commune,this.state.arrondissement,this.state.fokontany,this.state.regionInscription,
                                this.state.districtInscription,this.state.communeInscription,this.state.arrondissementInscription,this.state.fokontanyInscription,
                                this.state.libellerSearch,this.state.dataListVaccinCentreView):
                            (
                                <>
                                    {
                                        (!this.state.stepperMaladie)?(
                                            <>
                                                <ul className="ulAddRdvRdvPatient">
                                                    <li className="li1" onClick={()=>this.setState({stepper : 1})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                                                    <li className="li2">Demander une nouvelle rendez-vous</li>
                                                    <li className="li3"></li>
                                                </ul>
                                                {this.getDataHtmlAvertissementMaladie(this.state.dataAvertissementMaladie,this.state.initDataMaladie,this.state.vaccin)}
                                                {this.getDataHtmlDetailVaccinodrome(this.state.vaccin,this.state.vaccinodrome,this.state.vaccinCentre,this.state.showDetailUtilisateur,this.state.horaireVaccinodrome,
                                                    this.state.dateDemandeRdv,this.state.famille,this.state.aQuiDemandeRdv)}
                                            </>
                                        ):(
                                            <>
                                                <ul className="ulAddRdvRdvPatient">
                                                    <li className="li1" onClick={()=>this.setState({stepperMaladie : false})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                                                    <li className="li2">MALADIES NON COMPATIBLES AVEC LE VACCIN</li>
                                                    <li className="li3"></li>
                                                </ul>
                                                <div className="containerTableInscriptionPAtient">
                                                    <div className="table-responsive">
                                                        <table className="table table-hover table-bordered tableListVaccinVaccinodrome">
                                                            <thead>
                                                                <tr>
                                                                    <th>Nom de la maladie</th>
                                                                    <th>Description</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    (this.getDataMaladieInState(this.state.dataListMaladie)).map((data,i)=>{
                                                                        return (
                                                                            <tr key={i}>
                                                                                <td className="tableBodyListVaccinVaccinodromeTd1">{data.maladie}</td>
                                                                                <td className="tableBodyListVaccinVaccinodromeTd2">{data.descriptions}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {this.createDataHtmlPaginationMaladie(this.state.dataListMaladie.totalpage,this.state.dataListMaladie.page)}
                                                </div>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                        
                    </div>
                </div>
            </>
        )
    }
}
export default RdvPatient;