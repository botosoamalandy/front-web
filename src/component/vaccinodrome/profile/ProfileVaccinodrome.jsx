
import React, {Component} from 'react';
import { auth } from '../../../service/auth';
import { fetchGet, fetchGetUrl, fetchPost } from '../../../service/requeteHttp';
import { utile } from '../../../service/utile';
import { faArrowLeft, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AlertMessage from '../../alert-message/AlertMessage';
import Loading from '../../loading/Loading';
import './ProfileVaccinodrome.css';
import axios from 'axios';
import Search from '../../search/Search';
import { confignode } from '../../../urlConf';

class ProfileVaccinodrome extends Component{
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
            //data vaccinodrome
            vaccinodrome : null,
            horaireVaccinodrome : [],
            //data edit info vaccinodrome
            nomEdit : '',
            emailEdit : '',
            telephoneEdit : '',
            adresseEdit : '',
            descriptionEdit : '',
            regionInscription : null,
            districtInscription : null,
            communeInscription : null,
            arrondissementInscription : null,
            fokontanyInscription : null,
            photoEdit : null,
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
            // data edit horaire vaccinodrome
            jourSemaine : {label : '', indice : -1},
            jour : { indicejour : -1, heureMatinDebut : 0,heureMatinFin : 0,heureMidiDebut : 0,heureMidiFin : 0},
            listeJours : [], // indice : 0, matinDebut : 0,matinFin : 0,midiDebut : 0,midiFin : 0,
        }
    }
    componentDidMount() {
       this.getVaccinodromeById();
       this.getHoraireVaccinodromeById();
    }
    //---------------------------------------------------Localisation--------------------------------------------------------
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
                        console.log('allData : ',allData);
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
                                console.log('alldistrict : ',allData);
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
                                console.log('allCommune : ',allData);
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
                                console.log('allArrondissement : ',allData);
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
                                console.log('allFokontany : ',allData);
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
    getVerificationIfNotNullInfo(text,data){
        if(data!==null && data!==undefined){
            if(data.libeller!==undefined && data.libeller !== null && data.libeller !=='' && data.libeller !==' '){ 
                return <div className="text_value_localisation_inscriptionVaccinodrome"><span  className="sontext_value_localisation_inscriptionVaccinodrome">{text}</span> : {data.libeller}</div>
            }
        }
        return '';
    }
    //----------------------------------------------------------------------------------------------------------------
    // get vaccinodrome by idVaccinodrome 
    getVaccinodromeById(){
        let dataToken = auth.getDataUtilisateurToken();
        if(dataToken!==null && dataToken!==undefined){
            let idutilisateur = utile.parseStringToInt(dataToken.id);
            if(idutilisateur!==undefined && idutilisateur!==null && idutilisateur>0){
                fetchGet('vaccinodrome/vaccinodrome-by-id/'+idutilisateur).then(response=>{
                    if(response!== undefined && response!==null){
                        if(response.idVaccinodrome>0){
                            this.setState({vaccinodrome : response});
                            console.log('response : ',response);
                        }
                    }else{
                        this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur ne marche pas.",etatsmsmodal : true});
                    }
                })
            }
        }
    }
    // get horaire vaccinodrome by idVaccinodrome 
    getHoraireVaccinodromeById(){
        let dataToken = auth.getDataUtilisateurToken();
        if(dataToken!==null && dataToken!==undefined){
            let idutilisateur = utile.parseStringToInt(dataToken.id);
            if(idutilisateur!==undefined && idutilisateur!==null && idutilisateur>0){
                fetchGet('vaccinodrome/horaire-vaccinodrome/'+idutilisateur).then(response=>{
                    if(response!== undefined && response!==null){
                        this.setState({horaireVaccinodrome : response});
                        console.log('response : ',response);
                    }else{
                        this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur ne marche pas.",etatsmsmodal : true});
                    }
                })
            }
        }
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
    // data html vaccinodrome
    getDataHtmlVaccinodrome(vaccinodrome,horaireVaccinodrome){
        if(vaccinodrome!== undefined && vaccinodrome!==null && horaireVaccinodrome.length === 7){
            return (
                <>
                    <div className="">
                        <ul className="headerInProfileVaccinodrome">
                            <li className="li1">
                                <div className="imageFondProfileVaccinodrome">
                                    <img src={vaccinodrome.urlPhoto} alt="image_de_fond_profil" className="image_de_fond_profil"/>
                                </div>
                            </li>
                            <li className="li2">
                                <div className="fathertextInfoVaccinodrome">
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Nom</li>
                                        <li className="two">{vaccinodrome.nomCentre}</li>
                                    </ul>
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Email</li>
                                        <li className="two">{vaccinodrome.email}</li>
                                    </ul>
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Téléphone</li>
                                        <li className="two">{vaccinodrome.telephone}</li>
                                    </ul>
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Adresse</li>
                                        <li className="two">{vaccinodrome.adresse}</li>
                                    </ul>
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Localisation</li>
                                        <li className="two">{this.getRectificationDataLocalisation(vaccinodrome.localisation)}</li>
                                    </ul>
                                    <ul className="textInfoVaccinodrome">
                                        <li className="one">Description</li>
                                        <li className="two">{vaccinodrome.descriptions}</li>
                                    </ul>
                                    <button className="btn-warning form-control btnModificationInfoPV" onClick={()=>this.setState({stepper : 2})}>Modifier les informations</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="divHoraireProfileVaccindrome">
                        <div className="textHoraireVaccindormePV">Jour d'ouverture du vaccindorme</div>
                        <div className="table-responsive">
                            <table className="table tableHoraireVaccinodromePV">
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
                        <button className="btn-warning form-control btnModificationInfoPV" onClick={()=>this.handleEditVaccinodrome(horaireVaccinodrome)}>Modifier les horaires d'ouverture</button>
                    </div>
                </>
            )
        }else{
            return (
                <>
                    <div className="errorLoadingProfileVaccinodrome">Une erreur s'est produite s'il vous plaît réessayer.</div>
                </>
            )
        }
    }
    //data html edit info vaccinodrome
    getDataHtmlEditInfoVaccinodrome(vaccinodrome,regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription) {
        if(vaccinodrome!== undefined && vaccinodrome!==null){
            return (
                <>
                    <div className="">
                        <div className="fathertextInfoVaccinodrome">
                            <ul className="miniMenuRetourPV">
                                <li className="li1" onClick={()=>this.setState({stepper : 1})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                                <li className="li2">Modification des informations</li>
                                <li className="li3"></li>
                            </ul>
                            <ul className="textInfoVaccinodrome">
                                <li className="one">Nom</li>
                                <li className="two"><input type="text" onChange={(e)=>this.setState({nomEdit : e.target.value})} className="inputModificationPV" defaultValue={vaccinodrome.nomCentre} /></li>
                            </ul>
                            <ul className="textInfoVaccinodrome">
                                <li className="one">Email</li>
                                <li className="two"><input type="text" onChange={(e)=>this.setState({emailEdit : e.target.value})} className="inputModificationPV" defaultValue={vaccinodrome.email} /></li>
                            </ul>
                            <ul className="textInfoVaccinodrome">
                                <li className="one">Téléphone</li>
                                <li className="two"><input type="text" onChange={(e)=>this.setState({telephoneEdit : e.target.value})} className="inputModificationPV" defaultValue={vaccinodrome.telephone} /></li>
                            </ul>
                            <ul className="textInfoVaccinodrome">
                                <li className="one">Adresse</li>
                                <li className="two"><input type="text" onChange={(e)=>this.setState({adresseEdit : e.target.value})} className="inputModificationPV" defaultValue={vaccinodrome.adresse} /></li>
                            </ul>
                            <ul className="textInfoVaccinodrome">
                                <li className="one">Description</li>
                                <li className="two"><textarea rows="4" onChange={(e)=>this.setState({descriptionEdit : e.target.value})} className="inputModificationPV txtPV"  defaultValue={vaccinodrome.descriptions}></textarea></li>
                            </ul>
                            <ul className="textInfoVaccinodrome">
                                <li className="one">Region</li>
                                <li className="two">
                                    <Search
                                        title = "Sélectionner une region"
                                        typeInput = "text"
                                        placeholderInput = "Saisissez votre recherche ici"
                                        options  = {this.setListeRegionToListReactSelect(this.state.regions)}
                                        hasNextPage = {this.getRegionsHasNextPageOrNot(this.state.regions)}
                                        onchange = {(e)=>{this.handleChangeOptionListeRegions(e)}}
                                        onClickNext = {(e)=>this.onClickNextRegions(this.state.regions)}
                                        onClickSearch = {(e)=>this.onClickSearchRegions(e)}
                                        onClickActualize = {()=>this.onClickActualizeRegions()}
                                    />
                                </li>
                            </ul>
                            <ul className="textInfoVaccinodrome">
                                <li className="one">District</li>
                                <li className="two">
                                    <Search 
                                        title = "Sélectionner une distrcit"
                                        typeInput = "text"
                                        placeholderInput = "Saisissez votre recherche ici"
                                        options  = {this.setListeDistrictToListReactSelect(this.state.district)}
                                        hasNextPage = {this.getDistrictHasNextPageOrNot(this.state.district)}
                                        onchange = {(e)=>{this.handleChangeOptionListeDistrict(e)}}
                                        onClickNext = {(e)=>this.onClickNextDistrict(this.state.district)}
                                        onClickSearch = {(e)=>this.onClickSearchDistrict(e)}
                                        onClickActualize = {()=>this.onClickActualizeDistrict()}
                                    />
                                </li>
                            </ul>
                            <ul className="textInfoVaccinodrome">
                                <li className="one">Commune</li>
                                <li className="two">
                                    <Search 
                                        title = "Sélectionner un commune"
                                        typeInput = "text"
                                        placeholderInput = "Saisissez votre recherche ici"
                                        options  = {this.setListeCommuneToListReactSelect(this.state.commune)}
                                        hasNextPage = {this.getCommuneHasNextPageOrNot(this.state.commune)}
                                        onchange = {(e)=>{this.handleChangeOptionListeCommune(e)}}
                                        onClickNext = {(e)=>this.onClickNextCommune(this.state.commune)}
                                        onClickSearch = {(e)=>this.onClickSearchCommune(e)}
                                        onClickActualize = {()=>this.onClickActualizeCommune()}
                                    />
                                </li>
                            </ul>
                            <ul className="textInfoVaccinodrome">
                                <li className="one">Arrondissement</li>
                                <li className="two">
                                    <Search 
                                        title = "Sélectionner un arrondissement"
                                        typeInput = "text"
                                        placeholderInput = "Saisissez votre recherche ici"
                                        options  = {this.setListeArrondissementToListReactSelect(this.state.arrondissement)}
                                        hasNextPage = {this.getArrondissementHasNextPageOrNot(this.state.arrondissement)}
                                        onchange = {(e)=>{this.handleChangeOptionListeArrondissement(e)}}
                                        onClickNext = {(e)=>this.onClickNextArrondissement(this.state.arrondissement)}
                                        onClickSearch = {(e)=>this.onClickSearchArrondissement(e)}
                                        onClickActualize = {()=>this.onClickActualizeArrondissement()}
                                    />
                                </li>
                            </ul>
                            <ul className="textInfoVaccinodrome">
                                <li className="one">Fokontany</li>
                                <li className="two">
                                    <Search 
                                        title = "Sélectionner un fokontany"
                                        typeInput = "text"
                                        placeholderInput = "Saisissez votre recherche ici"
                                        options  = {this.setListeFokontanyToListReactSelect(this.state.fokontany)}
                                        hasNextPage = {this.getFokontanyHasNextPageOrNot(this.state.fokontany)}
                                        onchange = {(e)=>{this.handleChangeOptionListeFokontany(e)}}
                                        onClickNext = {(e)=>this.onClickNextFokontany(this.state.fokontany)}
                                        onClickSearch = {(e)=>this.onClickSearchFokontany(e)}
                                        onClickActualize = {()=>this.onClickActualizeFokontany()}
                                    />
                                </li>
                            </ul>
                            <div className="resultLocalisationPV">
                                {this.getVerificationIfNotNullInfo('Region ',regionInscription)}
                                {this.getVerificationIfNotNullInfo('District',districtInscription)}
                                {this.getVerificationIfNotNullInfo('Commune ',communeInscription)}
                                {this.getVerificationIfNotNullInfo('Arrondissement ',arrondissementInscription)}
                                {this.getVerificationIfNotNullInfo('Fokontany ',fokontanyInscription)}
                            </div>
                            <ul className="textInfoVaccinodrome">
                                <li className="one">Photo du vaccinodrome</li>
                                <li className="two"><input type="file" accept="image/png, image/jpeg" onChange={(e)=>this.handleImageVaccinodrome(e)} name="photo" className="inputModificationPV" /></li>
                            </ul>
                            <button className="btn-success form-control" onClick={()=>this.modificationInfoVaccinodrome(vaccinodrome)}>Modifier les informations</button>
                        </div>
                    </div>
                </>
            )
        }else{
            return (
                <>
                    <div className="errorLoadingProfileVaccinodrome">Une erreur s'est produite s'il vous plaît réessayer.</div>
                </>
            )
        }
    }
    //data html edit horaire vaccinodrome
    getDataHtmlEditHoraireVaccinodrome(horaireVaccinodrome,jourSemaine,listeJours){
        if(horaireVaccinodrome.length === 7){
            return (
                <>
                    <div className="divHoraireProfileVaccindrome">
                        <ul className="miniMenuRetourPV">
                            <li className="li1" onClick={()=>this.setState({stepper : 1})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                            <li className="li2">Modification des horaires d'ouverture</li>
                            <li className="li3"></li>
                        </ul>
                        <div className="textHoraireVaccindormePV">Jour d'ouverture du vaccindorme</div>
                        <div className="table-responsive">
                            <table className="table tableHoraireVaccinodromePV">
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
                        <div className="">
                            <ul className="textInfoVaccinodrome">
                                <li className="one">Jour de la semaine</li>
                                <li className="two">
                                    <select name="jour_de_la_semaine" className="selectJourSemainePV" onChange={(e)=>this.handleSelectJourDeLaSemaine(e)}>
                                        <option value={-1}>Jour de la semaine</option>
                                        {
                                            (utile.getAllSemaineWithIndice()).map((data,i)=>{
                                                return <option value={data.indice} key={i} disabled={this.getVerificationSiJourSemaineEstDejaDansListJour(data.indice)}>{""+data.label}</option>
                                            })
                                        }
                                    </select>
                                </li>
                            </ul>
                        </div>
                        <div hidden={jourSemaine.indice<0}>
                            <div className="row rowhoraireLoginVaccinodrome">
                                <div className="col-md-12 col-sm-12 col-xs-12 litletitlehoraireLoginVaccinodrome"><b className="titleUpperCase">{jourSemaine.label} </b> matin</div>
                                <div className="col-md-5 col-sm-5 col-xs-12">
                                    <select name="jour_de_la_semaine" className="selectHoraireVaccinodrome" onChange={(e)=>this.handleHeureDOuverture(e,jourSemaine.indice,false,false)}>
                                        <option value="">Debut</option>
                                        {
                                            (utile.createTableauNumber(1,12)).map((data,i)=>{
                                                return <option value={data} key={i}>{utile.completChiffre(data)}h</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="col-md-2 col-sm-2 col-xs-12 ahoraireVaccinodrome"> à </div>
                                <div className="col-md-5 col-sm-5 col-xs-12">
                                    <select name="jour_de_la_semaine" className="selectHoraireVaccinodrome" onChange={(e)=>this.handleHeureDOuverture(e,jourSemaine.indice,false,true)}>
                                        <option value="">Fin</option>
                                        {
                                            (utile.createTableauNumber(1,12)).map((data,i)=>{
                                                return <option value={data} key={i}>{utile.completChiffre(data)}h</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="col-md-12 col-sm-12 col-xs-12 litletitlehoraireLoginVaccinodrome"><b className="titleUpperCase">{jourSemaine.label} </b> après midi</div>
                                <div className="col-md-5 col-sm-5 col-xs-12">
                                    <select name="jour_de_la_semaine" className="selectHoraireVaccinodrome" onChange={(e)=>this.handleHeureDOuverture(e,jourSemaine.indice,true,false)}>
                                        <option value="">Debut</option>
                                        {
                                            (utile.createTableauNumber(12,24)).map((data,i)=>{
                                                return <option value={data} key={i}>{utile.completChiffre(data)}h</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="col-md-2 col-sm-2 col-xs-12 ahoraireVaccinodrome"> à </div>
                                <div className="col-md-5 col-sm-5 col-xs-12">
                                    <select name="jour_de_la_semaine" className="selectHoraireVaccinodrome" onChange={(e)=>this.handleHeureDOuverture(e,jourSemaine.indice,true,true)}>
                                        <option value="">Fin</option>
                                        {
                                            (utile.createTableauNumber(12,24)).map((data,i)=>{
                                                return <option value={data} key={i}>{utile.completChiffre(data)}h</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="col-md-12 col-sm-12 col-xs-12"><button onClick={()=>this.addHoraireInListHoraireVaccinodrome()} className="btn-primary form-control btnAddJourInListJourPv">Ajouter</button></div>
                            </div>
                        </div>
                        <div className="toutMesHoraireLoginVaccinodrome" hidden={listeJours.length<=0}>
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Jour de la semaine</th>
                                            <th>Matin</th>
                                            <th>Midi</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            (listeJours).map((data,i)=>{
                                                return (
                                                    <tr key={i}>
                                                        <td>{utile.getAllSemaine()[data.indice]}</td>
                                                        <td>{data.matinDebut}h à {data.matinFin}h</td>
                                                        <td>{data.midiDebut}h à {data.midiFin}h</td>
                                                        <td><button className="btn-danger form-control" onClick={()=>this.deleteHoraireVaccinodrome(i)}><FontAwesomeIcon icon={faTrashAlt} /></button></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            
                        </div>
                        <button className="btn-success form-control btnAddJourInListJourPv" onClick={()=>this.editHoraireVaccinodrome()}>Enregistrer</button>
                    </div>
                </>
            )
        }else{
            return (
                <>
                    <div className="errorLoadingProfileVaccinodrome">Une erreur s'est produite s'il vous plaît réessayer.</div>
                </>
            )
        }
    }
    // modification horaire vaccinodrome
    editHoraireVaccinodrome=()=>{
        let vaccinodrome = this.state.vaccinodrome;
        if(vaccinodrome!==undefined && vaccinodrome!==null){
            let listeJours = this.state.listeJours;let size = listeJours.length;let data = [];
            for(let i = 0; i < size; i++){
                data.push({
                    idhorairevaccinodrome : 0,
                    idvaccinodrome : vaccinodrome.idVaccinodrome,
                    jour : listeJours[i].indice ,
                    matinDebut : listeJours[i].matinDebut ,
                    matinFin : listeJours[i].matinFin ,
                    midiDebut : listeJours[i].midiDebut ,
                    midiFin : listeJours[i].midiFin ,
                    status : 1 ,
                })
            }
            let dataFinal = {
                idVaccinodrome : vaccinodrome.idVaccinodrome,
                horaire : data
            }
            fetchPost('vaccinodrome/update-horaire-vaccinodrome',dataFinal).then(response=>{
                if(response!==null && response!==undefined){
                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true},()=>{
                        this.getHoraireVaccinodromeById();
                    });
                }
            })
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes.",etatsmsmodal : true});
        }
    }
    // handle edit horaire vaccinodrome
    handleEditVaccinodrome=(horaire)=>{
        let size = horaire.length;
        if(size===7){
            console.log("horaireVaccinodrome : ",horaire);let list = [];
            for(let i=0; i<size; i++){
                if(horaire[i].status>0){
                    list.push({indice : horaire[i].jour, matinDebut : horaire[i].matinDebut,matinFin : horaire[i].matinFin,midiDebut : horaire[i].midiDebut,midiFin : horaire[i].midiFin});
                }
            }
            this.setState({listeJours: list,stepper : 3});
        }
    }
    //supprimer une horaire dans la liste des horaires du vaccinodrome
    deleteHoraireVaccinodrome=(indice)=>{
        let liste = this.state.listeJours; let size = liste.length;
        if(indice>=0 && indice<size){
            liste.splice(indice,1);
            this.setState({listeJours:liste});
        }
    }
    //handle select jour de la semaine
    handleSelectJourDeLaSemaine=(e)=>{
        let valeur = utile.parseStringToIntV2(""+e.target.value);
        let jourSemaine = {label : '', indice : -1};
        let jour = this.state.jour;
        if(valeur>=0){
            const semaine = utile.getAllSemaine();
            jourSemaine.label = semaine[valeur];jourSemaine.indice = valeur;
            jour.indicejour= valeur;
        }else{jour.indicejour= -1;}
        this.setState({jourSemaine: jourSemaine,jour : jour});
    }
    // ajouter une nouvelle heure d'ouverture par rapport au jour selectionné 
    addHoraireInListHoraireVaccinodrome=()=>{
        let list = this.state.listeJours;let size = list.length;
        let jour = this.state.jour;
        if(jour.indicejour>=0 && jour.indicejour<7){
            if(jour.heureMatinDebut>0 && jour.heureMatinFin>0 && jour.heureMatinDebut<jour.heureMatinFin && jour.heureMidiDebut>0 && jour.heureMidiFin>0 
                && jour.heureMidiDebut<jour.heureMidiFin){
                let test = false;
                for (let i = 0; i < size; i++) {
                    if(list[i].indice===jour.indicejour){test=true; break;}
                }
                if(!test){
                    list.push({indice : jour.indicejour, matinDebut : jour.heureMatinDebut,matinFin : jour.heureMatinFin,midiDebut : jour.heureMidiDebut,midiFin : jour.heureMidiFin});
                    this.setState({listeJours: list});
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Cette information existe déjà dans la liste des horaires du vaccinodrome",etatsmsmodal : true});
                }
                
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "L'heure de debut doit-être inferieur à 'heure fin",etatsmsmodal : true});
            }
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Il y a une erreur d'information",etatsmsmodal : true});
        }
    }
    // verification si le jour afficher dans le select jour de la semaine existe déjà dans la listeJours
    getVerificationSiJourSemaineEstDejaDansListJour(indice){
        if(indice>=0){
            let listeJours = this.state.listeJours;let size = listeJours.length;
            for (let i = 0; i < size; i++) {
                if(listeJours[i].indice===indice){ return true;}
            }
        }
        return false;
    }
    //handle heure d'ouverture vaccinodrome (matinOuMidi => matin : false, midi : true ) (debutOuFin => debut ; false , fin : true)
    handleHeureDOuverture=(e,indiceJourSemaine,matinOuMidi,debutOuFin)=>{
        let indice = utile.parseStringToIntV2(""+indiceJourSemaine);
        let valeur =utile.parseStringToIntV2(e.target.value);
        if(indice >= 0 && valeur>0){
            let jour = this.state.jour;
            if(jour.indicejour!==indice){jour.indicejour = indice;}

            if(!matinOuMidi){//matin
                if(!debutOuFin){jour.heureMatinDebut = valeur;}//debut
                if(debutOuFin){jour.heureMatinFin = valeur;}//fin
            }
            if(matinOuMidi){//midi
                if(!debutOuFin){jour.heureMidiDebut = valeur;}//debut
                if(debutOuFin){jour.heureMidiFin = valeur;}//fin
            }
            if(jour.indicejour>=0){
                this.setState({jour : jour})
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Il y a une erreur",etatsmsmodal : true});
            }
            
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Il y a une erreur",etatsmsmodal : true});
        }
    }
    // change image vaccinodrome en base64
    handleImageVaccinodrome=(e)=>{
        let files = e.target.files;
        if(files.length >0){
            let size = files[0].size/1024;
            if(size<=1000){
                if(utile.getVerifiExtensionImage(files[0].name)){
                    this.setState({photoEdit : files[0]})
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
    // data localisation vaccinodrome
    getDataLocalisationVaccinodrome(vaccinodrome,region,district,commune,arrondissement,fokontany) {
        if(region !== undefined && region!==null && district !== undefined && district!==null && commune !== undefined && commune!==null && arrondissement !== undefined && arrondissement!==null 
            && fokontany!==null && fokontany!==null){
                return {
                    region : region.id,
                    district : district.id,
                    commune : commune.id,
                    arrondissement : arrondissement.id,
                    fokontany : fokontany.id
                }
        }else{
            return {
                region : vaccinodrome.idRegion,
                district : vaccinodrome.idDistrict,
                commune : vaccinodrome.idCommune,
                arrondissement : vaccinodrome.idArrindissement,
                fokontany : vaccinodrome.idFokontany
            }
        }
    }
    getLibellerLocalisationVaccinodrome(vaccinodrome,region,district,commune,arrondissement,fokontany) {
        if(region !== undefined && region!==null && district !== undefined && district!==null && commune !== undefined && commune!==null && arrondissement !== undefined && arrondissement!==null 
            && fokontany!==null && fokontany!==null){
                return "Région : "+region.libeller+" /// District : "+district.libeller+" /// Commune : "+commune.libeller+" /// Arrondissement : "+arrondissement.libeller+" /// Fokontany : "+fokontany.libeller;
        }else{
            return vaccinodrome.localisation;
        }
    }
    // modification information vaccinodrome
    modificationInfoVaccinodrome=(vaccinodrome)=>{ 
        let nom = this.state.nomEdit;let email = this.state.emailEdit;let telephone = this.state.telephoneEdit;let adresse = this.state.adresseEdit;
        let description = this.state.descriptionEdit;let region = this.state.regionInscription;let district = this.state.districtInscription;
        let commune = this.state.communeInscription;let arrondissement = this.state.arrondissementInscription;let fokontany = this.state.fokontanyInscription;
        let photo = this.state.photoEdit;
        if(!utile.getVerificationChampsText(nom)){ nom = vaccinodrome.nomCentre;}
        if(!utile.getVerificationChampsText(email)){ email = vaccinodrome.email;}
        if(!utile.getVerificationChampsText(telephone)){ telephone = vaccinodrome.telephone;}
        if(!utile.getVerificationChampsText(adresse)){ adresse = vaccinodrome.adresse;}
        if(!utile.getVerificationChampsText(description)){ description = vaccinodrome.descriptions;}
        let localisation = this.getDataLocalisationVaccinodrome(vaccinodrome,region,district,commune,arrondissement,fokontany);
        if(photo!==undefined && photo!==null){
            const dataPhoto = new FormData() 
            dataPhoto.append('photo', photo)
            axios.post(confignode+"photo", dataPhoto).then(res => { 
                if(res.data!==null && res.data!==undefined){
                    let imageUrl = res.data.image;
                    if(imageUrl!==null && imageUrl!==undefined && imageUrl!==''){
                        let dataFinal = {
                            idVaccinodrome : vaccinodrome.idVaccinodrome,
                            idRegion : localisation.region,
                            idDistrict : localisation.district,
                            idCommune : localisation.commune,
                            idArrindissement : localisation.arrondissement,
                            idFokontany : localisation.fokontany,
                            localisation : this.getLibellerLocalisationVaccinodrome(vaccinodrome,region,district,commune,arrondissement,fokontany),
                            nomCentre : nom,
                            email : email,
                            telephone : telephone,
                            adresse : adresse,
                            descriptions : description,
                            urlPhoto : imageUrl,
                            motDePasse : vaccinodrome.motDePasse,
                            status : 1
                        }
                        fetchPost('vaccinodrome/update-vaccinodrome',dataFinal).then(response=>{
                            if(response!==null && response!==undefined){
                                this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true},()=>{
                                    this.getVaccinodromeById();
                                });
                            }
                        })
                    }else{
                        this.setState({headersmsmodal: "Message",bodysmsmodal: "L'insertion de l'image a echoué.",etatsmsmodal : true});
                    }
                }
            })
        }else{
            let dataFinal = {
                idVaccinodrome : vaccinodrome.idVaccinodrome,
                idRegion : localisation.region,
                idDistrict : localisation.district,
                idCommune : localisation.commune,
                idArrindissement : localisation.arrondissement,
                idFokontany : localisation.fokontany,
                localisation : this.getLibellerLocalisationVaccinodrome(vaccinodrome,region,district,commune,arrondissement,fokontany),
                nomCentre : nom,
                email : email,
                telephone : telephone,
                adresse : adresse,
                descriptions : description,
                urlPhoto : vaccinodrome.urlPhoto,
                motDePasse : vaccinodrome.motDePasse,
                status : 1
            }
            fetchPost('vaccinodrome/update-vaccinodrome',dataFinal).then(response=>{
                if(response!==null && response!==undefined){
                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true},()=>{
                        this.getVaccinodromeById();
                    });
                }
            })
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
                <div className="principaleProfileVaccinodrome">
                    {
                        (this.state.stepper===2)?this.getDataHtmlEditInfoVaccinodrome(this.state.vaccinodrome,this.state.regionInscription,this.state.districtInscription,this.state.communeInscription,this.state.arrondissementInscription,this.state.fokontanyInscription):
                        (this.state.stepper===3)?this.getDataHtmlEditHoraireVaccinodrome(this.state.horaireVaccinodrome,this.state.jourSemaine,this.state.listeJours)
                        :this.getDataHtmlVaccinodrome(this.state.vaccinodrome,this.state.horaireVaccinodrome)
                    }
                </div>
            </>
        )
    }
}
export default ProfileVaccinodrome;