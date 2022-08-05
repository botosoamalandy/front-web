import React, {Component} from 'react';
import './LoginVaccinodrome.css';
import { utile } from '../../service/utile';
import AlertMessage from '../alert-message/AlertMessage';
import { ProgressBar} from 'react-bootstrap';
import ReactTooltip from 'react-tooltip'; 
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchGetUrl, fetchPost } from '../../service/requeteHttp';
import Loading from '../loading/Loading';
import axios from 'axios';
import { confignode } from '../../urlConf';
import Search from '../search/Search';
import verificationMotDePasseEnPourcentage from '../../service/motDePasse';
import { codeAuth } from '../../service/codeAuth';
import { auth } from '../../service/auth';

class LoginVaccinodrome extends Component{
    constructor(props){ 
        super();
        this.state = {
            //--laoding
            activeloader : false,
            //---modal        
            headersmsmodal : "",
            bodysmsmodal : '',
            etatsmsmodal : false,
            //-stepper login ou inscription
            stepContent : 1,
            //---Login
            emailLogin : '',
            mdpLogin : '',
            //---data inscription vaccinodrome
            //stepper inscription
            stepper : 1,
            //step 1
            nominscription : '',
            emailinscription : '',
            telephoneinscription : '',
            adresseinscription : '',
            descriptioninscription : '',
            photoinscription :null,
            //step 2
            mdpinscription : '',
            confirmationinscription : '',
            percentageMdp : 0,
            //step 3
            regionInscription : null,
            districtInscription : null,
            communeInscription : null,
            arrondissementInscription : null,
            fokontanyInscription : null,
            //step 4
            jourSemaine : {label : '', indice : -1},
            jour : { indicejour : -1, heureMatinDebut : 0,heureMatinFin : 0,heureMidiDebut : 0,heureMidiFin : 0},
            listeJours : [], // indice : 0, matinDebut : 0,matinFin : 0,midiDebut : 0,midiFin : 0,
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
            //---Mot de passe oublie
            nomMdpOublie : '',
            emailMdpOublie : '',
            telephoneMdpOublie : '',
            mdpMdpOublie : '',
            confirmationMdpOublie : '',
            percentageMdpOublie : 0,
        }
    }
    componentDidMount() {
        if(this.props.stepContent!==null && this.props.stepContent!==undefined) {
            if(this.props.stepContent>=1 && this.props.stepContent<=3){
                this.setState({stepContent : this.props.stepContent});
            }
       }
       this.getRegion(1,false);
    }
    // verification de l'extension de l'image
    getVerifiExtensionImage(filename){
        let namesplit = filename.split('.');let size = namesplit.length;
        if(size>0){
            let ext = namesplit[size-1];
            console.log('extension : ',ext);
            if(ext==='png' || ext==='jpg' || ext==='jpeg'){
                return true;
            }
        }
        return false;
    }
    // change image vaccinodrome en base64
    changeImageToBase64=(e)=>{
        let files = e.target.files;
        if(files.length >0){
            let size = files[0].size/1024;
            if(size<=1000){
                if(this.getVerifiExtensionImage(files[0].name)){
                    console.log('image : ',files[0])
                    this.setState({photoinscription : files[0]})
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
    getVerificationIfNotNullInfo(text,data){
        if(data!==null && data!==undefined){
            if(data.libeller!==undefined && data.libeller !== null && data.libeller !=='' && data.libeller !==' '){ 
                return <div className="text_value_localisation_inscriptionVaccinodrome"><span  className="sontext_value_localisation_inscriptionVaccinodrome">{text}</span> : {data.libeller}</div>
            }
        }
        return '';
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
    //information générale de l'inscription vaccinodrome (step 1)
    getDataHtmlForStepOneInscription(){
        return (
            <>
                <div className="form-group-1">
                    <input type="text" className="champsRegister" defaultValue={this.state.nominscription} onChange={(e)=>{this.setState({nominscription : e.target.value},()=>{console.log('nom : ',this.state.nominscription)}); }} name="Nom" id="Nom" placeholder="Nom du centre de vaccination" />
                    <input type="email" className="champsRegister" defaultValue={this.state.emailinscription} onChange={(e)=>{this.setState({emailinscription : e.target.value})}} placeholder="Adresse email" />
                    <input type="text" className="champsRegister" defaultValue={this.state.telephoneinscription} onChange={(e)=>{this.setState({telephoneinscription : e.target.value})}} name="telephone" id="telephone" placeholder="Numéro de téléphone" />
                    <input type="text" className="champsRegister" defaultValue={this.state.adresseinscription} onChange={(e)=>{this.setState({adresseinscription : e.target.value})}} name="adresse" id="telephone" placeholder="Adresse" />
                    <textarea rows="2" className="champsRegister" defaultValue={this.state.descriptioninscription} onChange={(e)=>{this.setState({descriptioninscription : e.target.value})}} name="description" id="description" placeholder="Description du centre de vaccination" ></textarea>
                    <input type="file" className="champsRegister"  accept="image/png, image/jpeg" onChange={(e)=>this.changeImageToBase64(e)} name="photo"/>
                </div>
            </>
        )
    }
    //securite compte vaccinodrome (step 2)
    getDataHtmlForStepDeuxInscription(){
        return (
            <>
            <div className="form-group-1">
                <div data-tip data-for="registerTip" className="BprogressBarSonOfChildLoggin">
                    <input type="password" className="champsRegister NprogressBarSonOfChildLoggin" defaultValue={this.state.mdpinscription} onChange={(e)=>{this.setState({mdpinscription : e.target.value,percentageMdp : verificationMotDePasseEnPourcentage(e.target.value)})}} name="mdpinscription" id="mdpinscription" placeholder="Mot de passe" />
                    <div className="input-group">
                        <span className="progressBarSonOfChildLoggin"><ProgressBar variant={this.getColorPourcentage(this.state.percentageMdp)} now={this.state.percentageMdp} /></span>
                    </div>
                    <ReactTooltip id="registerTip" place="top" effect="solid">Le mot de passe doit contenir un nombre, une majuscule, une minuscule, un caractère spécial(#,*,%,!...) 
                     et au moins 8 caractères.</ReactTooltip>
                </div>
                <input type="password" defaultValue={this.state.confirmationinscription} className="champsRegister" onChange={(e)=>{this.setState({confirmationinscription : e.target.value})}}  placeholder="Confirmation mot de passe" />
            </div>
            </>
        )
    }
    //Localisation de l'inscription vaccinodrome (step 3)
    getDataHtmlForStepTwoInscription(regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription){
        return (
            <>
                <div className="form-group-1">
                    <div className="select_search_LoginVaccinodrome">
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
                    </div>
                    <div className="select_search_LoginVaccinodrome">
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
                    </div>
                    <div className="select_search_LoginVaccinodrome">
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
                    </div>
                    <div className="select_search_LoginVaccinodrome">
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
                    </div>
                    <div className="select_search_LoginVaccinodrome">
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
                    </div>
                    <div>
                        {this.getVerificationIfNotNullInfo('Region ',regionInscription)}
                        {this.getVerificationIfNotNullInfo('District',districtInscription)}
                        {this.getVerificationIfNotNullInfo('Commune ',communeInscription)}
                        {this.getVerificationIfNotNullInfo('Arrondissement ',arrondissementInscription)}
                        {this.getVerificationIfNotNullInfo('Fokontany ',fokontanyInscription)}
                    </div>
                </div>
            </>
        )
    }
    //ajout heure d'ouverture du vaccinodrome (step 4)
    getDataHtmlForStepThreeInscription(jourSemaine,listeJours){
        return (
            <>
                <div className="form-group-1">
                    <div className="last_step champsRegister">
                        <select name="jour_de_la_semaine" className="course_type extraCssHoraire" onChange={(e)=>this.handleSelectJourDeLaSemaine(e)}>
                            <option value={-1}>Jour de la semaine</option>
                            {
                                (utile.getAllSemaineWithIndice()).map((data,i)=>{
                                    return <option value={data.indice} key={i} disabled={this.getVerificationSiJourSemaineEstDejaDansListJour(data.indice)}>{""+data.label}</option>
                                })
                            }
                        </select>
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
                                            return <option value={data} key={i}>{utile.completChiffre(data)}h1</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12"><button onClick={()=>this.addHoraireInListHoraireVaccinodrome()} className="btn-success btnAddHoraireVaccinodrome">Ajouter</button></div>
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
                </div>
            </>
        )
    }

    //affichage des pages d'inscription par rapport à son stepper
    getDataHtmlStepper(stepper,jourSemaine,listeJours,regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription){
        if(stepper===4){ return this.getDataHtmlForStepThreeInscription(jourSemaine,listeJours); }
        else if(stepper===3){ return this.getDataHtmlForStepTwoInscription(regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription); }
        else if(stepper===2){ return this.getDataHtmlForStepDeuxInscription() }
        else{ return this.getDataHtmlForStepOneInscription(); }
    }
    
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
    // ajouter une nouvelle heure d'ouverture par rapport au jour selectionné 
    addHoraireInListHoraireVaccinodrome=()=>{
        let list = this.state.listeJours;let size = list.length;
        let jour = this.state.jour;
        if(jour.indicejour>=0 && jour.indicejour<7){
            if(jour.heureMatinDebut>0 && jour.heureMatinFin>0 && jour.heureMatinDebut<jour.heureMatinFin && jour.heureMidiDebut>0 && jour.heureMidiFin>0 
                && jour.heureMidiDebut<jour.heureMidiFin){
                let test = false;
                for (let i = 0; i < size; i++) {
                    if(list[i].indice===jour.indicejour){test=true; console.log('jourliste : ',list[i]); break;}
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
    //supprimer une horaire dans la liste des horaires du vaccinodrome
    deleteHoraireVaccinodrome=(indice)=>{
        let liste = this.state.listeJours; let size = liste.length;
        if(indice>=0 && indice<size){
            liste.splice(indice,1);
            this.setState({listeJours:liste});
        }
    }
    // stepper Suivant ou Precedent (etatStepper => precedent : false, Suivant : true)
    setStepper=(etatStepper)=>{
        let stepper = this.state.stepper;
        if(!etatStepper){ if(stepper>1){stepper = stepper - 1;}else{stepper = 1;} }//precedent
        else{ if(stepper<4){stepper = stepper + 1;}else{stepper = 4;} }//suivant
        this.setState({stepper:stepper});
    }
    //verification spet 1
    getVerificationStep1(nominscription,emailinscription,telephoneinscription,adresseinscription,descriptioninscription,photoinscription){
        if(utile.getVerificationChampsText(nominscription) && utile.getVerificationChampsText(emailinscription) && utile.getVerificationChampsText(telephoneinscription)
        && utile.getVerificationChampsText(adresseinscription) && utile.getVerificationChampsText(descriptioninscription) && photoinscription!==null && photoinscription!==undefined){
            return true;
        }
        return false;
    }
    //verification spet 2
    getVerificationStep2(mdpinscription,confirmationinscription,percentageMdp){
        if(utile.getVerificationChampsText(mdpinscription) && utile.getVerificationChampsText(confirmationinscription) && mdpinscription===confirmationinscription && percentageMdp ===100){
            return true;
        }
        return false;
    }
    //verification spet 3
    getVerificationStep3(regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription){
        if( regionInscription!==null && regionInscription!==undefined && districtInscription!==null && districtInscription!==undefined && communeInscription!==null 
            && communeInscription!==undefined && arrondissementInscription!==null && arrondissementInscription!==undefined && fokontanyInscription!==null 
            && fokontanyInscription!==undefined){
                if(fokontanyInscription.id!==undefined && fokontanyInscription.id !== null && fokontanyInscription.id !==''){
                    return true;
                }
            return false;
        }
        return false;
    }
    //creation object horaire vaccinodrome
    getCreationObjectHoraireVaccinodrome(listeJours){// listeJours : indice : 0, matinDebut : 0,matinFin : 0,midiDebut : 0,midiFin : 0
        let size = listeJours.length;let data = [];
        for(let i = 0; i < size; i++){
            data.push({
                idhorairevaccinodrome : 0,
                idvaccinodrome : 0,
                jour : listeJours[i].indice ,
                matinDebut : listeJours[i].matinDebut ,
                matinFin : listeJours[i].matinFin ,
                midiDebut : listeJours[i].midiDebut ,
                midiFin : listeJours[i].midiFin ,
                status : 1 ,
            })
        }
        return data;
    }
    //inscriptionVaccinodrome
    inscriptionVaccinodrome=()=>{
        //step 1
        let nominscription = this.state.nominscription;let emailinscription = this.state.emailinscription;let telephoneinscription = this.state.telephoneinscription;
        let adresseinscription = this.state.adresseinscription;let descriptioninscription = this.state.descriptioninscription;let photoinscription = this.state.photoinscription;
        let step1 = this.getVerificationStep1(nominscription,emailinscription,telephoneinscription,adresseinscription,descriptioninscription,photoinscription);
        //step 2 
        let mdpinscription = this.state.mdpinscription;let confirmationinscription = this.state.confirmationinscription;let percentageMdp = this.state.percentageMdp;
        let step2 = this.getVerificationStep2(mdpinscription,confirmationinscription,percentageMdp);
        //stpe 3
        let regionInscription = this.state.regionInscription;let districtInscription = this.state.districtInscription;let communeInscription = this.state.communeInscription;
        let arrondissementInscription = this.state.arrondissementInscription;let fokontanyInscription = this.state.fokontanyInscription;
        let step3 = this.getVerificationStep3(regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription);
        //step 4
        let listeJours = this.state.listeJours; 

        if(step1){
            if(step2){
                if(step3){
                    if(listeJours.length>0){
                        const dataPhoto = new FormData() 
                        dataPhoto.append('photo', photoinscription)
                        axios.post(confignode+"photo", dataPhoto).then(res => { 
                            if(res.data!==null && res.data!==undefined){
                                let imageUrl = res.data.image;
                                if(imageUrl!==null && imageUrl!==undefined && imageUrl!==''){
                                    let data = {
                                        vaccinodrome : {
                                            idVaccinodrome : 0,
                                            idRegion : regionInscription.id,
                                            idDistrict : districtInscription.id,
                                            idCommune : communeInscription.id,
                                            idArrindissement : arrondissementInscription.id,
                                            idFokontany : fokontanyInscription.id,
                                            localisation : "Région "+regionInscription.libeller+" dans le district "+districtInscription.libeller+" situé dans la "+communeInscription.libeller+" et fokontany "+fokontanyInscription.libeller,
                                            nomCentre : nominscription,
                                            email : emailinscription,
                                            telephone : telephoneinscription,
                                            adresse : adresseinscription,
                                            descriptions : descriptioninscription,
                                            urlPhoto : ''+imageUrl,
                                            motDePasse : mdpinscription,
                                            status : 1,
                                        },
                                        horaireVaccinodromes : this.getCreationObjectHoraireVaccinodrome(listeJours)
                                    }
                                    fetchPost('vaccinodrome/inscription-vaccinodrome',data).then(response=>{
                                        if(response!==null && response!==undefined){
                                            this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true});
                                        }
                                    })
                                }
                            }
                        })
                    }else{
                        this.setState({headersmsmodal: "Message",bodysmsmodal: "Vous devez ajouter les horaires d'ouverture et de fermeture du centre de vaccination à l'étape 4.",etatsmsmodal : true});
                    }
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Vous devez sélectionner une région, district, commune, arrondissement, fokontany dans la troisième étape.",etatsmsmodal : true});
                }
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Il y a des champs vides ou votre mot de passe ne répond pas à la description donnée dans la deuxième étape.",etatsmsmodal : true});
            }
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Une erreur ou des champs sont vides à la première étape de l'inscription vaccinodrome.",etatsmsmodal : true});
        }
    }
    //page inscription
    getDataHtmlInscription(stepper,jourSemaine,listeJours,regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription){
        return (
            <>
                <div className="appointment-form" id="appointment-form">
                    <h2 className="title_register">Inscription VACCINODROME</h2>
                    <div className="smsloginVaccinodrome" hidden={stepper!==1}>Veuillez fournir les informations ci-dessous afin que les patients puissent vous identifier.</div>
                    <div className="smsloginVaccinodrome" hidden={stepper!==2}>Afin d'assurer la protection de votre compte, veuillez créer un mot de passe.</div>
                    <div className="smsloginVaccinodrome" hidden={stepper!==3}>Afin de vous trouver facilement, veuillez remplir les champs ci-dessous.</div>
                    <div className="smsloginVaccinodrome" hidden={stepper!==4}>Veuillez indiquer les horaires d'ouverture et de fermeture chaque jour du centre de vaccination.</div>
                    {this.getDataHtmlStepper(stepper,jourSemaine,listeJours,regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription)}
                    <div className="form-check">
                        <label className="label-agree-term"><span><span></span></span>Pour vous connecter sur votre compte, <a href="#login" className="term-service"onClick={()=>this.setState({stepContent : 1})}>cliquez ici.</a></label>
                    </div>
                    <div className="form-submit">
                        <div className="row">
                            <div className="col-md-6 col-sm-6 col-xs-12"><input disabled={stepper<=1} onClick={()=>this.setStepper(false)} type="button" className="submit" value="Precedent" /></div>
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <input hidden={stepper>=4} onClick={()=>this.setStepper(true)} type="button" className="submit" value="Suivant" />
                                <input hidden={stepper<4} type="button" onClick={()=>this.inscriptionVaccinodrome()} className="inscriptionVaccinodrome" value="S'inscrir" />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    //connexion compte vaccinodrome
    connexionVaccinodrome=()=>{
        let emailLogin = this.state.emailLogin;let mdpLogin = this.state.mdpLogin;
        if(utile.getVerificationChampsText(emailLogin) && utile.getVerificationChampsText(mdpLogin)){
            this.setState({activeloader : true});
            let data = {email : emailLogin,mdp : mdpLogin, status : codeAuth.vaccinodrome}
            fetchPost('vaccinodrome/login-vaccinodrome',data).then(response=>{
                this.setState({activeloader : false});
                if(response!==null && response!==undefined){
                    if(response.status===200){
                        console.log('token : ',response.token)
                        let verification = auth.getVerifToken(response.token);
                        if(verification){ 
                            let data = auth.getDataUtilisateurByToken(response.token);
                            console.log('data vaccinodrome : ',data)
                            if(data.codeutilisateur===codeAuth.vaccinodrome){
                                //console.log('codeutilisateur : ',utilisateur.codeutilisateur)
                                auth.authentificationUtilisateur(response.token);
                                window.location.replace('/profile-vaccinodrome');
                                //this.setState({redirect: {url : '/profil-administrateur', etat : true}});
                            }
                        }else{
                            this.setState({headersmsmodal: "Message",bodysmsmodal: 'Veuillez vous identifier à nouveau car vos données sont incomplètes',etatsmsmodal : true});
                        }
                    }else{
                        this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true});
                    }
                }
            })
        }
    } 
    //page login
    getDataHtmlLogin(){
        return (
            <>
                <div className="appointment-form" id="appointment-form">
                    <h2 className="title_register">Connexion VACCINODROME</h2>
                    <div className="smsloginVaccinodrome"></div>
                    <div className="form-group-1">
                        <input type="email" className="champsRegister" onChange={(e)=>{this.setState({emailLogin : e.target.value})}} name="email" id="email" placeholder="Adresse email" />
                        <input type="password" className="champsRegister" onChange={(e)=>{this.setState({mdpLogin : e.target.value})}} name="mot_de_passe" id="mot_de_passe" placeholder="Mot de passe" />
                    </div>
                    <div className="inscoroubliLoginVaccinodrome">
                        <ul className="ul_inscoroubliLoginVaccinodrome">
                            <li className="li1_ul_inscoroubliLoginVaccinodrome" onClick={()=>this.setState({stepContent : 2})}>Inscription</li>
                            <li className="li2_ul_inscoroubliLoginVaccinodrome" onClick={()=>this.setState({stepContent : 3})}>Mot de passe oublie</li>
                        </ul>
                    </div>
                    <div className="form-submit"><input type="button" onClick={()=>this.connexionVaccinodrome()} className="submit" value="LOGIN" /></div>
                </div>
            </>
        )
    }
    //change mot de passe car l'utilisateur a oublié le mot de passe
    motDePasseOublieVaccinodrome=()=>{
        let nomMdpOublie = this.state.nomMdpOublie;let emailMdpOublie = this.state.emailMdpOublie;let telephoneMdpOublie = this.state.telephoneMdpOublie;
        let mdpMdpOublie = this.state.mdpMdpOublie;let confirmationMdpOublie = this.state.confirmationMdpOublie;let percentageMdpOublie = this.state.percentageMdpOublie;
        if(utile.getVerificationChampsText(nomMdpOublie) && utile.getVerificationChampsText(emailMdpOublie) && utile.getVerificationChampsText(telephoneMdpOublie) 
        && utile.getVerificationChampsText(mdpMdpOublie) && utile.getVerificationChampsText(confirmationMdpOublie) && percentageMdpOublie===100 && mdpMdpOublie ===confirmationMdpOublie){
            this.setState({activeloader : true});
            let data ={
                idVaccinodrome : 0,
                idFokontany : '',
                nomCentre : nomMdpOublie,
                email : emailMdpOublie,
                telephone : telephoneMdpOublie,
                adresse : '',
                descriptions : '',
                urlPhoto : '',
                motDePasse : mdpMdpOublie,
                status : 1,
            }
            fetchPost('vaccinodrome/mot-de-passe-oublie',data).then(response=>{
                this.setState({activeloader : false});
                if(response!== undefined && response!==null){
                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true});
                }
            })
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Il y a des champs vides",etatsmsmodal : true});
        }
    }
    //page Mot de passe oublie
    getDataHtmlMotDePasseOublie(){ // 
        return (
            <>
                <div className="appointment-form" id="appointment-form">
                    <h2 className="title_register">Mot de passe oublie VACCINODROME</h2>
                    <div className="smsloginVaccinodrome">Veuillez remplir les champs ci-dessous pour récupérer votre compte.</div>
                    <div className="form-group-1">
                        <input type="email" className="champsRegister" onChange={(e)=>{this.setState({nomMdpOublie : e.target.value})}} name="nom" id="nom" placeholder="Nom du centre de vaccination" />
                        <input type="email" className="champsRegister" onChange={(e)=>{this.setState({emailMdpOublie : e.target.value})}} name="email" id="email" placeholder="Adresse email" />
                        <input type="text" style={{marginBottom: "60px"}} className="champsRegister" onChange={(e)=>{this.setState({telephoneMdpOublie : e.target.value})}} name="telephone" id="telephone" placeholder="Numéro de téléphone" />
                        <div data-tip data-for="registerTip2" className="BprogressBarSonOfChildLoggin">
                            <input type="password" className="champsRegister NprogressBarSonOfChildLoggin" defaultValue={this.state.mdpMdpOublie} onChange={(e)=>{this.setState({mdpMdpOublie : e.target.value,percentageMdpOublie : verificationMotDePasseEnPourcentage(e.target.value)})}} name="mdpinscription" id="mdpinscription" placeholder="Nouveau mot de passe" />
                            <div className="input-group">
                                <span className="progressBarSonOfChildLoggin"><ProgressBar variant={this.getColorPourcentage(this.state.percentageMdpOublie)} now={this.state.percentageMdpOublie} /></span>
                            </div>
                            <ReactTooltip id="registerTip2" delayShow={1000} delayHide = {1000}  onMouseLeave={() => { ReactTooltip.hide(); }} place="top" effect="solid">Le mot de passe doit contenir un nombre, une majuscule, une minuscule, un caractère spécial(#,*,%,!...) 
                            et au moins 8 caractères.</ReactTooltip>
                        </div>
                        <input type="password" className="champsRegister" onChange={(e)=>{this.setState({confirmationMdpOublie : e.target.value})}} name="confirmation" id="confirmation" placeholder="Confirmation mot de passe" />
                    </div>
                    <div className="form-check">
                        <label className="label-agree-term"><span><span></span></span>Pour vous connecter sur votre compte, <a href="#login" className="term-service"onClick={()=>this.setState({stepContent : 1})}>cliquez ici.</a></label>
                    </div>
                    <div className="form-submit"><input type="button" onClick={()=>this.motDePasseOublieVaccinodrome()} className="submit" value="Enregistrer" /></div>
                </div>
            </>
        )
    }
    //navigation page login/inscription
    getPageLoginOrInscription(stepContent,stepper,jourSemaine,listeJours,regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription){
        if(stepContent===3){return this.getDataHtmlMotDePasseOublie(); }
        if(stepContent===2){return this.getDataHtmlInscription(stepper,jourSemaine,listeJours,regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription); }
        else{return this.getDataHtmlLogin(); }
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
                <div className="mainLoginVaccinodrome">
                    <div className="containerLoginVaccinodrome">
                        {this.getPageLoginOrInscription(this.state.stepContent,this.state.stepper,this.state.jourSemaine,this.state.listeJours,this.state.regionInscription,
                            this.state.districtInscription,this.state.communeInscription,this.state.arrondissementInscription,this.state.fokontanyInscription)}
                    </div>
                </div>
            </>
        )
    }
}
export default LoginVaccinodrome;