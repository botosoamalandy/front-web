import React, {Component} from 'react';
import './LoginPatient.css';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchGet, fetchGetUrl, fetchPost } from '../../service/requeteHttp';
import { utile } from '../../service/utile';
import Pagination from '../pagination/Pagination';
import { confignode } from '../../urlConf';
import Search from '../search/Search';
import { ProgressBar} from 'react-bootstrap';
import verificationMotDePasseEnPourcentage from '../../service/motDePasse';
import Loading from '../loading/Loading';
import axios from 'axios';
import AlertMessage from '../alert-message/AlertMessage';
import { codeAuth } from '../../service/codeAuth';
import { auth } from '../../service/auth';

class LoginPatient extends Component{
    constructor(props){ 
        super();
        this.state = {
            //--laoding
            activeloader : false,
            //---modal        
            headersmsmodal : "",
            bodysmsmodal : '',
            etatsmsmodal : false,
            //step content 
            stepContent : 1,
            //--------------------------inscription--------------------//
            //stepper inscription patient 
            stepperInscription : 1,
            //stepper maladie
            stepperMaladie : false,
            //data step 1
            dataListVaccinView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },// data : [] = > {docs, page},
            dataSearchListVaccinView : {libeller : '', colone : '',etat : false},
            //data avertissement maladie
            dataAvertissementMaladie : null,
            dataListMaladie : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },
            //data step 2
            dataListVaccinCentreView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },// data : [] = > {docs, page},
            dataSearchListVaccinCentreView : {libeller : '', colone : '',etat : false},
            //data filtre search by localistion
            regionInscription : null,
            districtInscription : null,
            communeInscription : null,
            arrondissementInscription : null,
            fokontanyInscription : null,
            libellerSearch : '',
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
            //show search or filter search
            showSearch : false,
            etatsearch : false,
            //data inscription patient 
            nominscription : '',
            naissanceinscription : '',
            sexeinscription : 1,
            emailinscription : '',
            telephoneinscription : '',
            adresseinscription : '',
            mdpinscription : '',
            mdpconfirmerinscription : '',
            photoinscription : null,
            percentageMdp : 0,
            //data vaccin selectionner inscription patient
            dataVaccinInscriptionPatient : null,
            dataVaccinodromeInscriptionPatient : null,
            //--------------------------login--------------------//
            emailLogin : '',
            mdpLogin : '',
            //--------------------------Mot de passe oublié--------------------//
            nomMdpOublie : '',
            emailMdpOublie : '',
            telephoneMdpOublie : '',
            mdpMdpOublie : '',
            confirmationMdpOublie : '',
            percentageMdpOublie : '',
            // initialisation data inscription
            initInscription : false
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
    selectionnerUnVaccin=(dataVaccin)=>{
        this.setState({dataVaccinInscriptionPatient : dataVaccin},()=>{
            this.getDataVaccinCentreView(0);
            this.getDataMaladie(0,this.state.dataVaccinInscriptionPatient.idVaccin);
            this.getAvertissementMaladie(this.state.dataVaccinInscriptionPatient.idVaccin);
            this.setState({stepperInscription : 2});
        })
    }
    selectionUneVaccinodrome=(data)=>{
        this.setState({dataVaccinodromeInscriptionPatient : data,stepperInscription : 3})
    }
    // inscription patient 
    inscriptionPatient=()=>{ 
        let nom = this.state.nominscription;let naissance = this.state.naissanceinscription;let sexe =utile.parseStringToInt(''+this.state.sexeinscription);let email = this.state.emailinscription;
        let telephone = this.state.telephoneinscription;let adresse = this.state.adresseinscription;let mdp = this.state.mdpinscription;let confirmer = this.state.mdpconfirmerinscription;
        let photo = this.state.photoinscription;let vaccin = this.state.dataVaccinInscriptionPatient;let vaccinodrome = this.state.dataVaccinodromeInscriptionPatient;
        let percentageMdp = this.state.percentageMdp;
        if(utile.getVerificationChampsText(nom) && utile.getVerificationChampsText(naissance) && sexe>=1 && sexe<=2 && utile.getVerificationChampsText(email) 
        && utile.getVerificationChampsText(telephone) && utile.getVerificationChampsText(adresse) && utile.getVerificationChampsText(mdp) && utile.getVerificationChampsText(confirmer) 
        && photo!==undefined && photo!==null && vaccin!==undefined && vaccin!==null && vaccinodrome!==null && vaccinodrome!==undefined){
            let dateNaissance = new Date(""+naissance); let age = (new Date()).getFullYear() - dateNaissance.getFullYear();
            if(mdp === confirmer && percentageMdp ===100 && age > 0){
                let ageMini = vaccinodrome.ageMinimum;
                if(age>=ageMini){
                    const dataPhoto = new FormData() 
                    dataPhoto.append('photo', photo)
                    axios.post(confignode+"photo", dataPhoto).then(res => { 
                        if(res.data!==null && res.data!==undefined){
                            let imageUrl = res.data.image;
                            if(imageUrl!==null && imageUrl!==undefined && imageUrl!==''){
                                let dataPatient = {
                                    utilisateur : {
                                        idutilisateur : 0,
                                        idtypeutilisateur : codeAuth.patient,
                                        nom : nom,
                                        sexe : sexe,
                                        naissance : naissance,
                                        email : email,
                                        telephone : telephone,
                                        mot_de_passe : mdp,
                                        urlPhoto : imageUrl,
                                        date_ajout : naissance,
                                        status : 1
                                    },
                                    infoVaccinUser : {
                                        idInfoVaccinUser : 0,
                                        idUtilisateur : 0,
                                        idVaccinCentre : vaccinodrome.idVaccinCentre,
                                        idVaccinodrome : vaccinodrome.idVaccinodrome,
                                        idVaccin : vaccinodrome.idVaccin,
                                        status : 1
                                    }
                                }
                                fetchPost('utilisateur/inscription-patient',dataPatient).then(response=>{
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
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "L'age minimum pour ce vaccin est de "+age+" ans.",etatsmsmodal : true});
                }
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Il y a une information incorrecte ou votre mot de passe n'est pas valide.",etatsmsmodal : true});
            }
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes, merci de compléter tous les champs.",etatsmsmodal : true});
        }
    }
    // get data html avertissement maladie 
    getDataHtmlAvertissementMaladie(dataAvertissementMaladie) {
        if(dataAvertissementMaladie!==undefined && dataAvertissementMaladie!==null){
            if(dataAvertissementMaladie.status === 200){
                return (
                    <>
                        <div className="descriptionInscriptionPatient">
                            <div className="des">Pour complétér les informations, veuillez sélectionner le centre de vaccination qui vous convient le mieux</div>
                            <div className=""><b><span className="spantmp">Attention</span>, les maladies suivantes ne sont pas compatibles avec le vaccin :</b> {dataAvertissementMaladie.message} 
                            <span className="sondescriptionInscriptionPatient" onClick={()=>this.setState({stepperMaladie : true})}>Voir en détail</span></div>
                        </div>
                    </>
                )
            }
        }
        return (
            <>
                <div className="descriptionInscriptionPatient">
                    <div className="">Pour complétér les informations, veuillez sélectionner le centre de vaccination qui vous convient le mieux</div>
                </div>
            </>
        )
    }
    // data html etape 1 inscription
    getDataHtmlInscriptionEtape1(dataListVaccinView) {
        return (
            <>
                <div>
                    <div className="miniTitleInscriptionPatient">Afin de poursuivre l'inscription, veuillez sélectionner le vaccin qui vous convient</div>
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
            </>
        )
    }
    // data html etape 2 inscription
    getDataHtmlInscriptionEtape2(dataAvertissementMaladie,showSearch,regions,district,commune,arrondissement,fokontany,regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription,libellerSearch,dataListVaccinCentreView){
        return (
            <>
                <div className="">
                    {this.getDataHtmlAvertissementMaladie(dataAvertissementMaladie)}
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
                                        <div className="row rowlistVaccinodromeLoginPatient" onClick={()=>this.selectionUneVaccinodrome(data)}>
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
                    <div className="form-check" style={{marginTop: '52px',marginLeft: '5%'}}>
                        <label className="label-agree-term"><span><span></span></span>Pour vous connecter sur votre compte, <a href="#login" className="term-service" onClick={() =>this.setState({stepContent : 1})}>cliquez ici.</a></label>
                    </div>
                </div>
            </>
        )
    }
    // data html etape 3 inscription
    getDataHtmlInscriptionEtape3(nominscription,emailinscription,telephoneinscription,adresseinscription,mdpinscription,mdpconfirmerinscription,percentageMdp){
        return (
            <>
                <div className="miniTitleInscriptionPatient">Pour vous inscrire, veuillez fournir les renseignements ci-dessous</div>
                <div className="containerLoginPatient">
                    <div>
                        <div className="form-group-1 champsLoginPatient">
                            <input type="text" className="champsRegister" defaultValue={nominscription} onChange={(e)=>{this.setState({nominscription : e.target.value}); }} placeholder="Nom du patient" />
                            <input type="date" className="champsRegister" onChange={(e)=>{this.setState({naissanceinscription : e.target.value})}} />
                            <select className="champsRegisterLoginPatient" onChange={(e)=>{this.setState({sexeinscription : e.target.value})}}>
                                <option value={1}>Sexe</option>
                                <option value={1}>Homme</option>
                                <option value={2}>Femme</option>
                            </select>
                            <input type="email" className="champsRegister" defaultValue={emailinscription} onChange={(e)=>{this.setState({emailinscription : e.target.value})}} placeholder="Adresse email" />
                            <input type="text" className="champsRegister" defaultValue={telephoneinscription} onChange={(e)=>{this.setState({telephoneinscription : e.target.value})}} name="telephone" id="telephone" placeholder="Numéro de téléphone" />
                            <input type="text" className="champsRegister" defaultValue={adresseinscription} onChange={(e)=>{this.setState({adresseinscription : e.target.value})}} name="adresse" id="telephone" placeholder="Adresse" />
                            <input type="password" className="champsRegister" defaultValue={mdpinscription} onChange={(e)=>{this.setState({mdpinscription : e.target.value,percentageMdp : verificationMotDePasseEnPourcentage(e.target.value)})}} placeholder="Mot de passe" />
                            <div className="input-group mdpgourpLoginPatient">
                                <div className="progressBarSonOfChildLoggin"><ProgressBar variant={this.getColorPourcentage(percentageMdp)} now={percentageMdp} /></div>
                                <div className="mdptextLoginPatient">Le mot de passe doit contenir un nombre, une majuscule, une minuscule, un caractère spécial(#,*,%,!...) et au moins 8 caractères.</div>
                            </div>
                            <input type="password" className="champsRegister" defaultValue={mdpconfirmerinscription} onChange={(e)=>{this.setState({mdpconfirmerinscription : e.target.value})}} placeholder="Confirmation mot de passe" />
                            <input type="file" className="champsRegister"  accept="image/png, image/jpeg" onChange={(e)=>this.changeImageToBase64(e)} name="photo"/>
                            <div className="form-check" style={{marginTop: '32px'}}>
                                <label className="label-agree-term"><span><span></span></span>Pour vous connecter sur votre compte, <a href="#login" className="term-service"  onClick={() =>this.setState({stepContent : 1})}>cliquez ici.</a></label>
                            </div>
                            <div className=""><button className="form-control btn-success" onClick={()=>this.inscriptionPatient()} >Enregistrer</button></div>
                        </div>
                    </div>
                </div>
            </>
        )
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
        console.log('data : ',data);
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
    //verification info select localisation si null ou pas
    getVerificationIfNotNullInfo(text,data){
        if(data!==null && data!==undefined){
            if(data.libeller!==undefined && data.libeller !== null && data.libeller !=='' && data.libeller !==' '){ 
                return <div className="text_value_localisation_inscriptionVaccinodromev2"><span  className="sontext_value_localisation_inscriptionVaccinodrome">{text}</span> : {data.libeller}</div>
            }
        }
        return '';
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
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
    // change image patient
    changeImageToBase64=(e)=>{
        let files = e.target.files;
        if(files.length >0){
            let size = files[0].size/1024;
            if(size<=1000){
                if(this.getVerifiExtensionImage(files[0].name)){
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
    //pagination liste maladie
    setPageInPaginationMaladie=(e)=>{
        let newpage = utile.parseStringToInt(e)-1;
        if(newpage>=0){   
            this.getDataMaladie(newpage,this.state.dataVaccinInscriptionPatient.idVaccin);
        }
    }
    createDataHtmlPaginationMaladie(pageTotal,page){
        if(pageTotal>0  && page>=0){
            return  <Pagination totalPages={pageTotal} page={page} setPage={(e)=> this.setPageInPaginationMaladie(e)} />
        }
        return <div></div>
    }
    //set stepper inscription
    changeStepperInscription=()=>{ 
        let stepper = this.state.stepperInscription;
        if(stepper>1){
            this.setState({stepperInscription : stepper-1});
        }
    }
    //connexion patient 
    connexionPatient=()=>{
        let emailLogin = this.state.emailLogin;let mdpLogin = this.state.mdpLogin;
        if(utile.getVerificationChampsText(emailLogin) && utile.getVerificationChampsText(mdpLogin)){
            const data ={telephone : emailLogin, mot_de_passe : mdpLogin , status : codeAuth.patient};
            this.setState({activeloader : true});
            fetchPost('utilisateur/login-utilisateur',data).then(response=>{
                this.setState({activeloader : false});
                if(response!==null && response!==undefined){
                    if(response.status === 200){
                        let verification = auth.getVerifToken(response.token);
                        if(verification){ 
                            let utilisateur = auth.getDataUtilisateurByToken(response.token);
                            console.log('utilisateur : ',utilisateur)
                            if(utilisateur.codeutilisateur===codeAuth.patient){
                                auth.authentificationUtilisateur(response.token);
                                window.location.replace('/profile-patient');
                            }
                        }else{
                            this.setState({headersmsmodal: "Message",bodysmsmodal: 'Veuillez vous identifier à nouveau car vos données sont incomplètes',etatsmsmodal : true});
                        }
                    }else{
                        this.setState({headersmsmodal: "Message",bodysmsmodal: ''+response.message,etatsmsmodal : true});
                    }
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: 'Le serveur ne marche pas',etatsmsmodal : true});
                }
                
            });
        }
    }
    //mot de passe oublie patient
    motDePasseOubliePatient=()=>{
        let nomMdpOublie = this.state.nomMdpOublie;let emailMdpOublie = this.state.emailMdpOublie;let telephoneMdpOublie = this.state.telephoneMdpOublie;
        let mdpMdpOublie = this.state.mdpMdpOublie;let confirmationMdpOublie = this.state.confirmationMdpOublie;let percentageMdpOublie = this.state.percentageMdpOublie;
        if(utile.getVerificationChampsText(nomMdpOublie) && utile.getVerificationChampsText(emailMdpOublie) && utile.getVerificationChampsText(telephoneMdpOublie) 
        && utile.getVerificationChampsText(mdpMdpOublie) && utile.getVerificationChampsText(confirmationMdpOublie) && percentageMdpOublie===100 && mdpMdpOublie ===confirmationMdpOublie){
            this.setState({activeloader : true});
            let data ={
                idutilisateur : 0,
                idtypeutilisateur : codeAuth.patient,
                nom : nomMdpOublie,
                sexe : 0,
                email : emailMdpOublie,
                telephone : telephoneMdpOublie,
                mot_de_passe : mdpMdpOublie,
                urlPhoto : '',
                status : 1
            }
            fetchPost('utilisateur/mot-de-passe-oublie',data).then(response=>{
                this.setState({activeloader : false});
                if(response!== undefined && response!==null){
                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true});
                }
            })
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Il y a des champs vides",etatsmsmodal : true});
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
    //data html inscription
    getDataHtmlInscription(stepperMaladie,dataListMaladie,stepperInscription,dataListVaccinView,dataAvertissementMaladie,showSearch,regions,district,commune,
        arrondissement,fokontany,regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription,libellerSearch,
        dataListVaccinCentreView,nominscription,emailinscription,telephoneinscription,adresseinscription,mdpinscription,mdpconfirmerinscription,percentageMdp){
        return (
            <>
                <div className="mainLoginPatient">
                    <div className="containerLoginPatient">
                        <div hidden={stepperMaladie}>
                            <div className="menusonHeaderAndTitleInscriptionPatient">
                                <ul className="ul">
                                    <li className="li1" onClick={()=>this.changeStepperInscription()}><FontAwesomeIcon icon={faArrowLeft} /></li>
                                    <li className="li2">INSCRIPTION PATIENT</li>
                                    <li className="li3"></li>
                                </ul>
                            </div>
                            {
                                (stepperInscription===1)?this.getDataHtmlInscriptionEtape1(dataListVaccinView):
                                (stepperInscription===2)?this.getDataHtmlInscriptionEtape2(dataAvertissementMaladie,showSearch,regions,district,commune,arrondissement,fokontany,
                                    regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription,libellerSearch,dataListVaccinCentreView):
                                (stepperInscription===3)?this.getDataHtmlInscriptionEtape3(nominscription,emailinscription,telephoneinscription,adresseinscription,mdpinscription,
                                    mdpconfirmerinscription,percentageMdp):
                                <div></div>
                            }
                        </div>
                        <div  hidden={!stepperMaladie}>
                            <div className="menusonHeaderAndTitleInscriptionPatient">
                                <ul className="ul">
                                    <li className="li1" onClick={()=>this.setState({stepperMaladie : false})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                                    <li className="li2">Maladies non compatibles avec le vaccin</li>
                                    <li className="li3"></li>
                                </ul>
                            </div>
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
                                                (this.getDataMaladieInState(dataListMaladie)).map((data,i)=>{
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
                                {this.createDataHtmlPaginationMaladie(dataListMaladie.totalpage,dataListMaladie.page)}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    // initialisation 
    getIntialisationDataInscription(){
        let init = this.state.initInscription;
        if(!init){
            this.setState({initInscription : true,stepContent : 2},()=>{ 
                this.getDataVaccinView(0);
            })
        }else{
            this.setState({stepContent : 2});
        }
    }
    //data html login
    getDataHtmlLogin(){
        return (
            <>
                <div className="mainLoginVaccinodrome">
                    <div className="containerLoginVaccinodrome">
                        <div className="appointment-form" id="appointment-form">
                            <h2 className="title_register">Connexion PATIENT</h2>
                            <div className="smsloginVaccinodrome"></div>
                            <div className="form-group-1">
                                <input type="email" className="champsRegister" onChange={(e)=>{this.setState({emailLogin : e.target.value})}} placeholder="Numéro de téléphone" />
                                <input type="password" className="champsRegister" onChange={(e)=>{this.setState({mdpLogin : e.target.value})}}  placeholder="Mot de passe" />
                            </div>
                            <div className="inscoroubliLoginVaccinodrome">
                                <ul className="ul_inscoroubliLoginVaccinodrome">
                                    <li className="li1_ul_inscoroubliLoginVaccinodrome" onClick={() =>this.getIntialisationDataInscription()}>Inscription</li>
                                    <li className="li2_ul_inscoroubliLoginVaccinodrome" onClick={() =>this.setState({stepContent : 3})}>Mot de passe oublie</li>
                                </ul>
                            </div>
                            <div className="form-submit"><input type="button" onClick={() =>this.connexionPatient()} className="submit" value="LOGIN" /></div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    //data html mot de passe oublie 
    getDataHtmlMotDePasseOublie(){
        return (
            <>
                <div className="mainLoginVaccinodrome">
                    <div className="containerLoginVaccinodrome">
                        <div className="appointment-form" id="appointment-form">
                            <h2 className="title_register">Mot de passe oublie PATIENT</h2>
                            <div className="smsloginVaccinodrome">Veuillez remplir les champs ci-dessous pour récupérer votre compte.</div>
                            <div className="form-group-1">
                                <input type="email" className="champsRegister" onChange={(e)=>{this.setState({nomMdpOublie : e.target.value})}} placeholder="Nom du patient" />
                                <input type="email" className="champsRegister" onChange={(e)=>{this.setState({emailMdpOublie : e.target.value})}} placeholder="Adresse email" />
                                <input type="text" style={{marginBottom: "60px"}} className="champsRegister" onChange={(e)=>{this.setState({telephoneMdpOublie : e.target.value})}} placeholder="Numéro de téléphone" />
                                <input type="password" className="champsRegister NprogressBarSonOfChildLoggin" defaultValue={this.state.mdpMdpOublie} onChange={(e)=>{this.setState({mdpMdpOublie : e.target.value,percentageMdpOublie : verificationMotDePasseEnPourcentage(e.target.value)})}} placeholder="Nouveau mot de passe" />
                                <div className="input-group mdpgourpLoginPatient" style={{marginTop : "5px"}}>
                                    <div className="progressBarSonOfChildLoggin"><ProgressBar variant={this.getColorPourcentage(this.state.percentageMdpOublie)} now={this.state.percentageMdpOublie} /></div>
                                    <div className="mdptextLoginPatient">Le mot de passe doit contenir un nombre, une majuscule, une minuscule, un caractère spécial(#,*,%,!...) et au moins 8 caractères.</div>
                                </div>
                                <input type="password" className="champsRegister" onChange={(e)=>{this.setState({confirmationMdpOublie : e.target.value})}} name="confirmation" id="confirmation" placeholder="Confirmation mot de passe" />
                            </div>
                            <div className="form-check">
                                <label className="label-agree-term"><span><span></span></span>Pour vous connecter sur votre compte, <a href="#login" className="term-service"onClick={()=>this.setState({stepContent : 1})}>cliquez ici.</a></label>
                            </div>
                            <div className="form-submit"><input type="button" onClick={()=>this.motDePasseOubliePatient()} className="submit" value="Enregistrer" /></div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    //navigation dans les steppers
    getNavigationInStepper(stepContent,stepperMaladie,dataListMaladie,stepperInscription,dataListVaccinView,dataAvertissementMaladie,showSearch,regions,district,commune,
        arrondissement,fokontany,regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription,libellerSearch,
        dataListVaccinCentreView,nominscription,emailinscription,telephoneinscription,adresseinscription,mdpinscription,mdpconfirmerinscription,percentageMdp){
        if(stepContent === 2){ 
            return this.getDataHtmlInscription(stepperMaladie,dataListMaladie,stepperInscription,dataListVaccinView,dataAvertissementMaladie,showSearch,regions,district,commune,
                arrondissement,fokontany,regionInscription,districtInscription,communeInscription,arrondissementInscription,fokontanyInscription,libellerSearch,
                dataListVaccinCentreView,nominscription,emailinscription,telephoneinscription,adresseinscription,mdpinscription,mdpconfirmerinscription,percentageMdp)
        }else if (stepContent === 3){
            return this.getDataHtmlMotDePasseOublie();
        }else{
            return this.getDataHtmlLogin();
        }
    }
    render(){
        return ( 
            <> 
                {this.getDataHtmlLoading(this.state.activeloader)}
                {this.getAffichageModal(this.state.etatsmsmodal)}
                {this.getNavigationInStepper(this.state.stepContent,this.state.stepperMaladie,this.state.dataListMaladie,this.state.stepperInscription,this.state.dataListVaccinView,
                this.state.dataAvertissementMaladie,this.state.showSearch,this.state.regions,this.state.district,this.state.commune,this.state.arrondissement,this.state.fokontany,
                this.state.regionInscription,this.state.districtInscription,this.state.communeInscription,this.state.arrondissementInscription,this.state.fokontanyInscription,
                this.state.libellerSearch,this.state.dataListVaccinCentreView,this.state.nominscription,this.state.emailinscription,this.state.telephoneinscription,
                this.state.adresseinscription,this.state.mdpinscription,this.state.mdpconfirmerinscription,this.state.percentageMdp)}
            </>
        )
    }
}
export default LoginPatient;