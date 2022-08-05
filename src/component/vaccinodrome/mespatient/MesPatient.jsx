import React, {Component,useRef} from 'react';
import './MesPatient.css';
import { faArrowDown, faArrowLeft, faArrowUp, faCakeCandles, faChevronDown, faChevronUp, faEye, faKitMedical, faRefresh, faSearch, faTrashAlt, faVenusMars , faEnvelope,faPhone, faUsers, faHouse, faFileArchive, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { auth } from '../../../service/auth';
import { fetchGet, fetchPost } from '../../../service/requeteHttp';
import { utile } from '../../../service/utile';
import AlertMessage from '../../alert-message/AlertMessage';
import Loading from '../../loading/Loading';
import Pagination from '../../pagination/Pagination';
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
class MesPatient extends Component{
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
            // display list demande rdv
            listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomPatient',status : 1,totalpage : 0},// data : [] = > {docs, page},
            listDemandeRdvSearch : { libeller : '', colone : 'nomPatient',ordre : false, status : 1, etat : false},
            inputReset : false,
            // data info patient 
            infoPatient : null,
            // data vaccination 
            showDetailPatient : false,
            qtVaccin : 0,
            traitementVaccin : '',
            dateProchainRDVVaccin : '',
            descriptionTraitementVaccin : '',
            listPrescription : [],
            //list prescription
            listPrescriptionData : [],
        }
    }
    componentDidMount() {
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
                    this.setState({activeloader : true});
                    fetchPost("demanderdv/search-list-demande-rdv-vaccinodrome", data).then(response=>{
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
                        let url = "demanderdv/list-demande-rdv-vaccinodrome/10/"+page+"/"+idutilisateur+"/"+dataSearch.status+"/"+dataSearch.ordre;
                        this.setState({activeloader : true});
                        fetchGet(url).then(response=>{ 
                            this.setState({activeloader : false});
                            console.log("response : ",response);
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
    // cherche dans toute la liste les texts saisis
    searchDataInList=()=>{
        let searchData = this.state.listDemandeRdvSearch;
        if(utile.getVerificationChampsText(searchData.libeller)){
            this.setState({
                listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomPatient',status : 1,totalpage : 0},// data : [] = > {docs, page},
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
    //get input search
    getInputSearch(listDemandeRdvSearch,inputReset) {
        let colone = listDemandeRdvSearch.colone; 
        if(colone==="statusRdv"){
            return (
                <select onChange={(e)=>this.setState({
                    listDemandeRdvSearch : { libeller : this.state.listDemandeRdvSearch.libeller, colone : this.state.listDemandeRdvSearch.colone,ordre : this.state.listDemandeRdvSearch.ordre, status : utile.parseStringToInt(e.target.value), etat : this.state.listDemandeRdvSearch.etat}
                    ,listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomPatient',status : 1,totalpage : 0}},()=>{this.getDataListDemandeRdv(0);})}>
                    <option value={1}>Selectionner l'etat des rendez-vous qui vous plaira</option>
                    <option value={5}>Patient vacciner</option>
                    <option value={1}>Demande de validation</option>
                    <option value={2}>Demande confirmé</option>
                    <option value={3}>Demande d'annulation patient</option>
                    <option value={22}>Demande d'annulation Vaccinodrome</option>
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
    //get data information utilisateur patient
    getInfoUtilisateurPatient(idDemandeRdv){
        this.setState({activeloader : true});
        fetchGet('utilisateur/info-utilisateur/'+idDemandeRdv).then(response=>{ 
            this.setState({activeloader : false});
            if(response !== undefined && response!==null){
                if(response.status===200){
                    this.setState({infoPatient : response},()=>{this.getListPrescription(idDemandeRdv)});
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
                }                        
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
            }
        });
    }
    //get data list prescription
    getListPrescription(idDemandeRdv){
        this.setState({activeloader : true});
        fetchGet('demanderdv/prescription/'+idDemandeRdv).then(response=>{ 
            this.setState({activeloader : false});
            if(response !== undefined && response!==null){ 
                console.log('listPrescriptionData : ',response);
                this.setState({listPrescriptionData : response});                     
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur est hors service.",etatsmsmodal : true});
            }
        });
    }
    getAgeByDateNaissance(naissance){
        try {
            let data = new Date(naissance);let now = new Date();
            return now.getFullYear() - data.getFullYear();
        } catch (error) {
            return "";
        }
        
    }
    getDataHtmlDetailPatient(infoPatient,listPrescriptionData){
        return (
            <>
                <ul className="ulAddRdvRdvPatient">
                    <li className="li1" onClick={()=>this.setState({stepper : 1})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                    <li className="li2">Voir le détail du rendez-vous</li>
                    <li className="li3"></li>
                </ul>
                {this.getDataHtmlDetailPatientSon(infoPatient,true,listPrescriptionData)}
            </>
        )
    }
    // data html voir détail 
    getDataHtmlDetailPatientSon(infoPatient,showBtnVaccination,listPrescriptionData){
        if(infoPatient!==undefined && infoPatient!==null){
            return (
                <>      
                    <div className="">
                        <ul className="headerInProfileVaccinodrome">
                            <li className="li1">
                                <div className="imageFondProfileVaccinodrome">
                                    <img src={infoPatient.utilisateur.urlPhoto} alt="image_de_fond_profil" className="image_de_fond_profil"/>
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
                            <li className="one">Description</li>
                            <li className="two">{infoPatient.demandeRdv.descriptions}</li>
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
    // data html vacciner patient
    getDataHtmlVaccinerPatient(infoPatient,showDetailPatient,listPrescription){
        return (
            <>
                <ul className="ulAddRdvRdvPatient">
                    <li className="li1" onClick={()=>this.setState({stepper : 1})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                    <li className="li2">Vaccination d'une patient</li>
                    <li className="li3"></li>
                </ul>
                {this.getDataHtmlVaccinerPatientSon(infoPatient,showDetailPatient,listPrescription)}
            </>
        )
    }
    getDataHtmlVaccinerPatientSon(infoPatient,showDetailPatient,listPrescription){
        if(infoPatient!==undefined && infoPatient!==null){
            return (
                <>
                    <ul className="ulShowDetailPatientMP">
                        <li className="li1">A propos du patient</li>
                        <li className="li2" onClick={()=>this.setState({showDetailPatient : !this.state.showDetailPatient})}><FontAwesomeIcon icon={(showDetailPatient)?faChevronDown:faChevronUp} /></li>
                    </ul>
                    {
                        (showDetailPatient)?this.getDataHtmlDetailPatientSon(infoPatient,true):<div></div>
                    }
                    <div className="vaccinationPatientMP">
                        <div className="textPrescriptionMedicalMP">Quantite du vaccin</div>
                        <div className="divInputMP">
                            <div className="inputMP">
                                <input onChange={(e)=>this.setState({qtVaccin : utile.parseStringToInt(""+e.target.value)})} defaultValue={infoPatient.demandeRdv.famille+1} type="number" placeholder=" "/>
                                <label>Quantite du vaccin ( quantite du stock : {infoPatient.vaccinCentre.quantite} )</label>
                            </div>
                        </div>
                        <div className="textPrescriptionMedicalMP textPrescriptionMedicalTmpMP">Prochain rendez-vous</div>
                        <div className="divInputMP">
                            <div className="inputMP">
                                <input onChange={(e)=>this.setState({ dateProchainRDVVaccin : e.target.value})} defaultValue={infoPatient.demandeRdv.famille+1} type="date" placeholder=" "/>
                                <label>Date du prochain RDV</label>
                            </div>
                        </div>
                        <div className="textPrescriptionMedicalMP textPrescriptionMedicalTmpMP">Prescription médical</div>
                        <div className="divPrescriptionMP">
                            <div className="divInputMP">
                                <div className="inputMP">
                                    <input onChange={(e)=>this.setState({traitementVaccin : e.target.value})} type="text" placeholder=" "/>
                                    <label>Traitement médical,physique ou examen medical</label>
                                </div>
                            </div>
                            <div className="divInputMP">
                                <div className="inputMP">
                                    <textarea onChange={(e)=>this.setState({descriptionTraitementVaccin : e.target.value})}rows="3"></textarea>
                                    <label>Description du traitement médical</label>
                                </div>
                            </div>
                            <button className="btn-success form-control" onClick={()=>this.addTraitementInPrescription()}>AJOUTER</button>
                            <div className="divTablePrescriptionMP" hidden={listPrescription.length<=0}>
                                <div className="table-responsive">
                                    <table className="table table-hover tablePrescriptionMP">
                                        <thead>
                                            <tr>
                                                <th>Traitement</th>
                                                <th>Description</th>
                                                <th className="thTmpMP">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (listPrescription).map((data,i)=>{
                                                    return (
                                                        <tr key={i}>
                                                            <td>{data.traitement}</td>
                                                            <td>{data.description}</td>
                                                            <td><button className="btn-danger form-control" onClick={()=>this.deletePrescription(i)}><FontAwesomeIcon icon={faTrashAlt} /></button></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="row divTablePrescriptionMP">
                            <div className="col-md-12 col-sm-12 col-xs-12"><button className="btn-primary form-control" onClick={()=>this.enregistrementVaccinationPatient(infoPatient)}>Enregistrer</button></div>
                        </div>
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
    // enregistrer vaccination patient
    generateDataPrescription(listPrescription,idDemandeRdv){
        let size = listPrescription.length;let data = [];
        for (let i = 0; i < size; i++) {
            data.push({
                idPrescription : 0,
                idDemandeRdv : idDemandeRdv,
                traitement : listPrescription[i].traitement,
                description : listPrescription[i].description,
                status : 1
            });
        }
        return data;
    }
    enregistrementVaccinationPatient=(infoPatient)=>{
        if(infoPatient !== undefined && infoPatient!==null){
            let qtVaccin = this.state.qtVaccin;
            let dateProchain = this.state.dateProchainRDVVaccin;
            let listPrescription = this.state.listPrescription;
            if(qtVaccin>0 && qtVaccin<=infoPatient.vaccinCentre.quantite){
                let data = {
                    idDemandeRdv : infoPatient.demandeRdv.idDemandeRdv,
                    quantite : qtVaccin,
                    prescription : this.generateDataPrescription(listPrescription,infoPatient.demandeRdv.idDemandeRdv),
                    etatProchainRDV : false,
                    dateProchainRDV : utile.getDateFormatNormal((new Date()).getTime())
                }
                if(utile.getVerificationChampsText(dateProchain)){
                    data.etatProchainRDV = true;
                    data.dateProchainRDV = dateProchain;
                }
                fetchPost('demanderdv/patient-vacciner',data).then(response=>{
                    if(response!==null && response!==undefined){
                        let stepper = this.state.stepper;
                        if(response.status === 200){
                            stepper = 6;
                        }
                        this.setState({stepper : stepper,headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true});
                    }
                })
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes ou la quantite saisi est superieur au quantités dans le stock.",etatsmsmodal : true});
            }
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes.",etatsmsmodal : true});
        }
    }
    // delete prescription by indice
    deletePrescription=(i)=>{
        let list = this.state.listPrescription;let size = list.length;
        if(size>i  && i>=0){
            list.splice(i,1);
            console.log("list : ",list);
            this.setState({listPrescription : list});
        }
    }
    // add traitement in liste prescription
    addTraitementInPrescription=()=>{
        let traitement = this.state.traitementVaccin;let description = this.state.descriptionTraitementVaccin;
        if(utile.getVerificationChampsText(traitement) && utile.getVerificationChampsText(description)){
            let list = this.state.listPrescription;let size = list.length;let test = false;
            for(let i = 0; i < size; i++){
                if(list[i].traitement===traitement){
                    test = true; break;
                }
            }
            if(!test){
                list.push({traitement: traitement, description: description});
                this.setState({listPrescription: list});
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Cette information existe déjà.",etatsmsmodal : true});
            }
        }
    }
    //data html liste rdv patient
    getDataHtmlListeRdvPatient(listDemandeRdv,listDemandeRdvSearch,inputReset){
        if(listDemandeRdv.data.length > 0){
            return (
                <>
                    <div className="titleInMP">Liste des rendez-vous patients</div>
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
                                                    <option value="nomPatient">Nom du patient</option>
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
                                    <th>Patient</th>
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
                                                <td>{data.nomPatient}</td>
                                                <td>{data.nomVaccin}</td>
                                                <td>{(data.dose===1)?data.dose+'ére ':data.dose+' éme'} / {data.nombreDose}</td>
                                                <td><div className="rightTmp">{data.famille+1}</div></td>
                                                <td>{utile.getDateComplet(data.dateRdv)}</td>
                                                <td>{(data.statusRdv===1)?'Demande de validation':(data.statusRdv===3 || data.statusRdv===22)?"Demande d'annulation":(data.statusRdv===5)?"vaccinée":'Rdv confirmé'}</td>
                                                <td className="textAlignCenter">
                                                    <ul className="btnEditSupAnnulationV4" hidden={data.statusRdv!==1}>
                                                        <li><button className="btn-primary" onClick={()=>this.setState({stepper : 3},()=>{this.getInfoUtilisateurPatient(data.idDemandeRdv)})}><FontAwesomeIcon icon={faEye} /></button> </li>
                                                        <li><button className="btn-success" onClick={()=>this.setStatusDemandeRDV(data.idDemandeRdv,2)}><FontAwesomeIcon icon={faCheck} /></button> </li>
                                                        <li data-tip data-for="registerTip_2">
                                                            <button className="btn-success" onClick={()=>this.setState({stepper : 2,qtVaccin : (data.famille+1)},()=>{this.getInfoUtilisateurPatient(data.idDemandeRdv)})}><FontAwesomeIcon icon={faKitMedical} /></button> 
                                                            <ReactTooltip id="registerTip_2" place="top" effect="solid">Vacciné le patient</ReactTooltip>
                                                        </li>
                                                        <li><button className="btn-danger" onClick={()=>this.setStatusDemandeRDV(data.idDemandeRdv,11)}><FontAwesomeIcon icon={faTrashAlt} /></button> </li>
                                                    </ul>
                                                    <ul className="btnEditSup" hidden={data.statusRdv!==2}>
                                                        <li><button className="btn-primary" onClick={()=>this.setState({stepper : 3},()=>{this.getInfoUtilisateurPatient(data.idDemandeRdv)})}><FontAwesomeIcon icon={faEye} /></button> </li>
                                                        <li><button className="btn-danger" onClick={()=>this.setStatusDemandeRDV(data.idDemandeRdv,22)}><FontAwesomeIcon icon={faTrashAlt} /></button> </li>
                                                    </ul>
                                                    <ul className="btnEditSup" hidden={data.statusRdv!==3}>
                                                        <li><button className="btn-primary" onClick={()=>this.setState({stepper : 3},()=>{this.getInfoUtilisateurPatient(data.idDemandeRdv)})}><FontAwesomeIcon icon={faEye} /></button> </li>
                                                        <li><button className="btn-danger" onClick={()=>this.deleteRdvStatusOne(data.idDemandeRdv)}><FontAwesomeIcon icon={faTrashAlt} /></button> </li>
                                                    </ul>
                                                    <ul className="btnEditSup" hidden={data.statusRdv!==5}>
                                                        <li><button className="btn-primary" onClick={()=>this.setState({stepper : 3},()=>{this.getInfoUtilisateurPatient(data.idDemandeRdv)})}><FontAwesomeIcon icon={faEye} /></button> </li>
                                                        <li data-tip data-for="registerTip_12">
                                                            <button className="btn-success" onClick={()=>this.getOrdonance(data.idDemandeRdv)}><FontAwesomeIcon icon={faFileArchive} /></button> 
                                                            <ReactTooltip id="registerTip_12" place="top" effect="solid">Ordonance médical</ReactTooltip>
                                                        </li>
                                                    </ul>
                                                    <button className="btn-primary form-control"  hidden={data.statusRdv!==22} onClick={()=>this.setStatusDemandeRDV(data.idDemandeRdv,2)}>Restaurer</button>
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
                <div className="pasDeListRdvPatient">Vous n'avez aucun demande de rendez-vous pour le moment</div>
            </>
        )
    }
    // delete rdv where status = 1
    deleteRdvStatusOne(idDemandeRdv){
        if(idDemandeRdv>0 && window.confirm("Êtes-vous certain de vouloir supprimer ces informations?")){
            fetchGet('demanderdv/delete-demande-rdv-status-one/'+idDemandeRdv).then(response => {
                if(response!== undefined && response!==null){
                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,
                    listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomPatient',status : 1,totalpage : 0},
                    listDemandeRdvSearch : { libeller : '', colone : 'nomPatient',ordre : false, status : 1, etat : false}
                },()=>{this.getDataListDemandeRdv(0);});
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur ne marche pas.",etatsmsmodal : true});
                }
            })
        }
    }
    // delete rdv where status = 1
    setStatusDemandeRDV(idDemandeRdv,status){
        if(idDemandeRdv>0 && window.confirm("Êtes-vous certain de vouloir supprimer ces informations?")){
            fetchGet('demanderdv/status-demande-rdv/'+idDemandeRdv+'/'+status).then(response => {
                if(response!== undefined && response!==null){
                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,
                    listDemandeRdv : {data : [],page : 0, libeller : '', colone : 'nomPatient',status : 1,totalpage : 0},
                    listDemandeRdvSearch : { libeller : '', colone : 'nomPatient',ordre : false, status : 1, etat : false}
                },()=>{this.getDataListDemandeRdv(0);});
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur ne marche pas.",etatsmsmodal : true});
                }
            })
        }
    }
    //get ordonance
    getOrdonance=(idDemandeRdv)=>{
        this.setState({stepper : 5},()=>{
            this.getInfoUtilisateurPatient(idDemandeRdv);
            this.getListPrescription(idDemandeRdv)
        })
    }
    // data html ordonance
    getDataHtmlOrdonance(infoPatient,listPrescriptionData){
        return (
            <>
                <ul className="ulAddRdvRdvPatient">
                    <li className="li1" onClick={()=>this.setState({stepper : 1})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                    <li className="li2">Ordonance médical</li>
                    <li className="li3"></li>
                </ul>
                {this.getDataHtmlOrdonanceSon(infoPatient,listPrescriptionData)}
            </>
        )
    }
    getDataHtmlOrdonanceSon(infoPatient,listPrescriptionData){
        if(infoPatient!== undefined && infoPatient!==null){
            return <Ordonance infoPatient={infoPatient} prescription={listPrescriptionData} />
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
                <div className="principaleMesPatients">
                    <div className="containerMP">
                        {
                            (this.state.stepper===3)?this.getDataHtmlDetailPatient(this.state.infoPatient,this.state.listPrescriptionData):
                            (this.state.stepper===2)?this.getDataHtmlVaccinerPatient(this.state.infoPatient,this.state.showDetailPatient,this.state.listPrescription):
                            (this.state.stepper===5)?this.getDataHtmlOrdonance(this.state.infoPatient,this.state.listPrescriptionData):
                            this.getDataHtmlListeRdvPatient(this.state.listDemandeRdv,this.state.listDemandeRdvSearch,this.state.inputReset)
                        }
                        
                    </div>
                </div>
            </>
        )
    }
}
export default MesPatient;