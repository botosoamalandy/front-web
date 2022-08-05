import React, {Component} from 'react';
import Search from '../../search/Search';
import './Vaccin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faRefresh, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { utile } from '../../../service/utile';
import Loading from '../../loading/Loading';
import AlertMessage from '../../alert-message/AlertMessage';
import Pagination from '../../pagination/Pagination';
import { fetchGet, fetchPost } from '../../../service/requeteHttp';
import axios from 'axios';
import { confignode } from '../../../urlConf';
import { auth } from '../../../service/auth';

class Vaccin extends Component{
    constructor(props){ 
        super();
        this.state = {
            //laoding
            activeloader : false,
            //modal        
            headersmsmodal : "",
            bodysmsmodal : '',
            etatsmsmodal : false,
            //stepper
            stepper : 2,
            //maladie
            nomMaladie : '',
            descriptionMaladie : '',
            //data maladie
            listMaladie : null,
            libellerMaladie : '',
            //data add vaccin 
            maladieInsertionVaccin : null,
            listMaladieVaccin : [],
            nomVaccin : '',
            descriptionVaccin : '',
            imageVaccin : null,
            //data maladie
            listeVaccin : null,
            libellerVaccin : '',
            //data add vaccinCentre 
            vaccinInsertionVaccinCentre : null,
            nbrDoseVaccinCentre : '',
            ageVaccinCentre : '',
            quantiteVaccinCentre : '',
            descriptionVaccinCentre : '',
            // display list maladie
            dataListMaladie : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },// data : [] = > {docs, page},
            dataSearchListMaladie : {libeller : '', colone : '',etat : false},
            etatAddNewMaladie : false,
            // display list vaccinview
            dataListVaccinView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },// data : [] = > {docs, page},
            dataSearchListVaccinView : {libeller : '', colone : '',etat : false},
            etatAddNewVaccinView : false,
            // display list vaccincentreview
            dataListVaccinCentreView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },// data : [] = > {docs, page},
            dataSearchListVaccinCentreView : {libeller : '', colone : '',etat : false},
            etatAddNewVaccinCentreView : 1,
            //edit vaccincentre
            dataEditVaccinCentre : null,
            nbrDoseVaccinCentreM: '',
            ageVaccinCentreM : '',
            quantiteVaccinCentreM:'',
        }
    }
    componentDidMount() {
        this.getMaladie(0,false);
        this.getDataMaladie(0);
        this.getDataVaccinView(0);
        this.getDataVaccinCentreView(0);
    }
    
    //html ajouter une nouvelle maladie
    getDataHtmlInsertionMaladie(){
        return (
            <div className="form champsInsertionVaccinCentre">
                <div>
                    <ul className="champsInsertionVaccinCentretmpUl">
                        <li className="li1" onClick={()=>this.setState({etatAddNewMaladie : false})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                        <li className="li2">AJOUTER UNE MALADIE</li>
                    </ul>
                </div>
                <div className="son_champsInsertionVaccinCentre">
                    <div className="formItem_champsInsertionVaccinCentre">
                        <input onChange={(e)=>this.setState({nomMaladie : e.target.value})} type="text" placeholder=" "/>
                        <label>Maladie</label>
                    </div>
                </div>
                <div className="son_champsInsertionVaccinCentre">
                    <div className="formItem_champsInsertionVaccinCentre">
                        <textarea onChange={(e)=>this.setState({descriptionMaladie : e.target.value})} rows="4" ></textarea>
                        <label>Description de la maladie</label>
                    </div>
                </div>
                <div className="son_champsInsertionVaccinCentre"><button className="btn_son_champsInsertionVaccinCentre" onClick={()=>this.insertionMaladie()}>Enregistrer</button></div>
            </div>
        )
    }
    //html ajouter une nouvelle vaccin
    getDataHtmlInsertionVaccin(listMaladieVaccin){
        return (
            <div className="form champsInsertionVaccinCentre">
                <div>
                    <ul className="champsInsertionVaccinCentretmpUl">
                        <li className="li1" onClick={()=>this.setState({etatAddNewVaccinView : false})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                        <li className="li2">AJOUT VACCIN</li>
                    </ul>
                </div>
                <div className="son_champsInsertionVaccinCentre">
                    <div className="formItem_champsInsertionVaccinCentre">
                        <input onChange={(e)=>this.setState({nomVaccin : e.target.value})} type="text" placeholder=" "/>
                        <label>Nom du vaccin</label>
                    </div>
                </div>
                <div className="son_champsInsertionVaccinCentre">
                    <div className="formItem_champsInsertionVaccinCentre">
                        <textarea onChange={(e)=>this.setState({descriptionVaccin : e.target.value})} rows="4" ></textarea>
                        <label>Description du vaccin </label>
                    </div>
                </div>
                <div className="son_champsInsertionVaccinCentre">
                    <div className="formItem_champsInsertionVaccinCentre">
                        <input type="file" accept="image/png, image/jpeg" onChange={(e)=>this.changeImageVaccin(e)} name="photo" />
                        <label>Image du vaccin</label>
                    </div>
                </div>
                <div className="oldul_listVaccinSelectVaccin">
                    <ul className="ul_listVaccinSelectVaccin">
                        <li className="li1_ul_listVaccinSelectVaccin">
                            <Search 
                                title = "Sélectionner une maladie"
                                typeInput = "text"
                                placeholderInput = "Saisissez votre recherche ici"
                                options  = {this.setListeMaladieToListReactSelect(this.state.listMaladie)}
                                hasNextPage = {this.getMaladieHasNextPageOrNot(this.state.listMaladie)}
                                onchange = {(e)=>{this.handleChangeOptionListeMaladie(e)}}
                                onClickNext = {(e)=>this.onClickNextMaladie(this.state.listMaladie)}
                                onClickSearch = {(e)=>this.onClickSearchMaladie(e)}
                                onClickActualize = {()=>this.onClickActualizeMaladie()}
                            />
                        </li>
                        <li className="li2_ul_listVaccinSelectVaccin"><button className="button_li2_ul_listVaccinSelectVaccin" onClick={()=>this.ajouterMaladieDansVaccin()}>Ajouter</button></li>
                    </ul>
                </div>
                <div className="toutLesMaladieIncompatibleAuVaccin" hidden={listMaladieVaccin.length<=0}>
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>Maladie</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (listMaladieVaccin).map((data,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td className="toutLesMaladieIncompatibleAuVaccinTd">{data.maladie}</td>
                                                <td className="toutLesMaladieIncompatibleAuVaccinTd">{data.descriptions}</td>
                                                <td><button className="btn-danger form-control" onClick={()=>this.deletedescriptions(i)}><FontAwesomeIcon icon={faTrashAlt} /></button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    
                </div>
                <div className="son_champsInsertionVaccinCentre"><button className="btn_son_champsInsertionVaccinCentre" onClick={()=>this.insertionVaccin()}>Enregistrer</button></div>
            </div>
        )
    }
    //html ajouter une nouvelle vaccin dans centre de vaccination
    getDataHtmlInsertionVaccinInVaccinodrome(listeVaccin){
        return (
            <div className="form champsInsertionVaccinCentre">
                <div>
                    <ul className="champsInsertionVaccinCentretmpUl">
                        <li className="li1" onClick={()=>this.setState({etatAddNewVaccinCentreView : 1})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                        <li className="li2" style={{fontSize: '18px'}}>AJOUTEZ UN VACCIN AU VACCINODROME</li>
                    </ul>
                </div>
                <div className="son_champsInsertionVaccinCentre">
                    <Search 
                        title = "Sélectionner une vaccin"
                        typeInput = "text"
                        placeholderInput = "Saisissez votre recherche ici"
                        options  = {this.setListeVaccinToListReactSelect(listeVaccin)}
                        hasNextPage = {this.getVaccinHasNextPageOrNot(listeVaccin)}
                        onchange = {(e)=>{this.handleChangeOptionListeVaccin(e)}}
                        onClickNext = {(e)=>this.onClickNextVaccin(listeVaccin)}
                        onClickSearch = {(e)=>this.onClickSearchVaccin(e)}
                        onClickActualize = {()=>this.onClickActualizeVaccin()}
                    />
                </div>
                <div className="son_champsInsertionVaccinCentre">
                    <div className="formItem_champsInsertionVaccinCentre">
                        <input type="text"  onChange={(e)=>this.setState({nbrDoseVaccinCentre : e.target.value})} placeholder=" "/>
                        <label>Nombre de dose ( ex : 2 )</label>
                    </div>
                </div>
                <div className="son_champsInsertionVaccinCentre">
                    <div className="formItem_champsInsertionVaccinCentre">
                        <input type="text"  onChange={(e)=>this.setState({ageVaccinCentre : e.target.value})} placeholder="Age minimum (ex : 2 ans)"/>
                        <label htmlFor="username">Age minimum  ( ex : 2ans )</label>
                    </div>
                </div>
                <div className="son_champsInsertionVaccinCentre">
                    <div className="formItem_champsInsertionVaccinCentre">
                        <input type="text"  onChange={(e)=>this.setState({quantiteVaccinCentre : e.target.value})} placeholder="Quantite"/>
                        <label htmlFor="username">Quantité</label>
                    </div>
                </div>
                <div className="son_champsInsertionVaccinCentre">
                    <div className="formItem_champsInsertionVaccinCentre">
                        <textarea onChange={(e)=>this.setState({descriptionVaccinCentre : e.target.value})} rows="4" ></textarea>
                        <label>Description</label>
                    </div>
                </div>
                <div className="son_champsInsertionVaccinCentre"><button className="btn_son_champsInsertionVaccinCentre" onClick={()=>this.EnregistrerVaccinCentre()}>Enregistrer</button></div>
            </div>
        )
    }
    //html modification une nouvelle vaccin dans centre de vaccination
    getDataHtmlEditVaccinInVaccinodrome(data){
        if(data!==null && data!==undefined){
            return (
                <div className="form champsInsertionVaccinCentre">
                    <div>
                        <ul className="champsInsertionVaccinCentretmpUl">
                            <li className="li1" onClick={()=>this.setState({etatAddNewVaccinCentreView : 1})}><FontAwesomeIcon icon={faArrowLeft} /></li>
                            <li className="li2" style={{fontSize: '18px'}}>MODIFICATION VACCIN DANS LE VACCINODROME</li>
                        </ul>
                    </div>
                    <div className="son_champsInsertionVaccinCentre">
                        <div className="nomvaccinInText">Nom du vaccin : <span>{data.nomVaccin}</span></div>
                    </div>
                    <div className="son_champsInsertionVaccinCentre">
                        <div className="formItem_champsInsertionVaccinCentre">
                            <input type="text" defaultValue={data.nombreDose} onChange={(e)=>this.setState({nbrDoseVaccinCentreM : e.target.value})} placeholder=" "/>
                            <label>Nombre de dose ( ex : 2 )</label>
                        </div>
                    </div>
                    <div className="son_champsInsertionVaccinCentre">
                        <div className="formItem_champsInsertionVaccinCentre">
                            <input type="text" defaultValue={data.ageMinimum} onChange={(e)=>this.setState({ageVaccinCentreM : e.target.value})} placeholder="Age minimum (ex : 2 ans)"/>
                            <label htmlFor="username">Age minimum  ( ex : 2ans )</label>
                        </div>
                    </div>
                    <div className="son_champsInsertionVaccinCentre">
                        <div className="formItem_champsInsertionVaccinCentre">
                            <input type="text" defaultValue={data.quantite}  onChange={(e)=>this.setState({quantiteVaccinCentreM : e.target.value})} placeholder="Quantite"/>
                            <label htmlFor="username">Quantité</label>
                        </div>
                    </div>
                    <div className="son_champsInsertionVaccinCentre"><button className="btn_son_champsInsertionVaccinCentreM" onClick={()=>this.EnregistrerModificationVaccinCentre()}>Enregistrer</button></div>
                </div>
            )
        }return <div></div>
    }
    //data html de tous les maladies
    getDataHtmlTousLesMaladie(dataListMaladie,etatAddNewMaladie){
        return (
            <>
                <h1 className="title_table_list_vaccin_vaccinodrome">Liste de toutes les maladies</h1>
                <div className="listVaccinVaccinodrome" hidden={etatAddNewMaladie}>
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered tableListVaccinVaccinodrome">
                            <thead>
                                <tr>
                                    <th>Nom de la maladie</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                                <tr>
                                    <th colSpan={2}>
                                        <ul className="tableListVaccinVaccinodrome_search">
                                            <li className="li1"><input type="text" onChange={(e)=>this.setState({dataSearchListMaladie : {libeller : e.target.value, colone : '',etat : true}})} className="tableListVaccinVaccinodromeinputSearch" placeholder="Nom de la maladie"/></li>
                                            <li className="li2"><button className="libtn" onClick={()=>this.setState({dataListMaladie : {data : [],page : 0, libeller : '', colone : '',totalpage : 0}},()=>this.getDataMaladie(0))}><FontAwesomeIcon icon={faSearch} /></button></li>
                                            <li className="li3">
                                                <button className="libtn" onClick={()=>this.setState({dataListMaladie : {data : [],page : 0, libeller : '', colone : '',totalpage : 0},dataSearchListMaladie : {libeller : '', colone : '',etat : false}},()=>this.getDataMaladie(0))}>
                                                    <FontAwesomeIcon icon={faRefresh} />
                                                </button>
                                            </li>
                                        </ul>
                                    </th>
                                    <th colSpan={1}><button className="tableListVaccinVaccinodromeButtonAdd" onClick={()=>this.setState({etatAddNewMaladie : true})}>Ajouter</button></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (this.getDataMaladieInState(dataListMaladie)).map((data,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td className="tableBodyListVaccinVaccinodromeTd1">{data.maladie}</td>
                                                <td className="tableBodyListVaccinVaccinodromeTd2">{data.descriptions}</td>
                                                <td><button className="tableBodyListVaccinVaccinodromeTd3Btn btn-danger" onClick={()=>this.supprimerMaladie(data.idMaladie)}>Supprimer</button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    {this.createDataHtmlPaginationMaladie(dataListMaladie.totalpage,dataListMaladie.page)}
                </div>
                <div hidden={!etatAddNewMaladie}>{this.getDataHtmlInsertionMaladie()}</div>
            </>
        )
    }
    //data html de tous les vaccins
    getDataHtmlTousLesVaccins(etatAddNewVaccinView,listMaladieVaccin,dataListVaccinView){
        return (
            <>
                <h1 className="title_table_list_vaccin_vaccinodrome" hidden={etatAddNewVaccinView}>Liste de tous les vaccins</h1>
                <div className="listVaccinVaccinodrome" hidden={etatAddNewVaccinView}>
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered tableListVaccinVaccinodrome">
                            <thead>
                                <tr>
                                    <th>Nom vaccin</th>
                                    <th>Cormobidité</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                                <tr>
                                    <th colSpan={3}>
                                        <ul className="tableListVaccinVaccinodrome_search">
                                            <li className="li1"><input type="text" onChange={(e)=>this.setState({dataSearchListVaccinView : {libeller : e.target.value, colone : '',etat : true}})} className="tableListVaccinVaccinodromeinputSearch" placeholder="Nom du vaccin"/></li>
                                            <li className="li2"><button className="libtn" onClick={()=>this.setState({dataListVaccinView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0}},()=>this.getDataVaccinView(0))}><FontAwesomeIcon icon={faSearch} /></button></li>
                                            <li className="li3">
                                                <button className="libtn" onClick={()=>this.setState({dataListVaccinView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0},dataSearchListVaccinView : {libeller : '', colone : '',etat : false}},()=>this.getDataVaccinView(0))}>
                                                    <FontAwesomeIcon icon={faRefresh} />
                                                </button>
                                            </li>
                                        </ul>
                                    </th>
                                    <th colSpan={1}><button className="tableListVaccinVaccinodromeButtonAdd" onClick={()=>this.setState({etatAddNewVaccinView : true})} >Ajouter</button></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (this.getDataVaccinViewInState(dataListVaccinView)).map((data,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td className="tableBodyListVaccinVaccinodromeTd1">{data.nomVaccin}</td>
                                                <td className="tableBodyListVaccinVaccinodromeTd2">{data.maladie}</td>
                                                <td className="tableBodyListVaccinVaccinodromeTd2">{data.descriptions}</td>
                                                <td><button className="tableBodyListVaccinVaccinodromeTd3Btn btn-danger" onClick={()=>this.supprimerVaccin(data.idVaccin)}>Supprimer</button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    {this.createDataHtmlPaginationVaccinView(dataListVaccinView.totalpage,dataListVaccinView.page)}
                </div>
                <div hidden={!etatAddNewVaccinView}>{this.getDataHtmlInsertionVaccin(listMaladieVaccin)}</div>
            </>
        )
    }
    //data html tous les vaccins dans le centre de vaccination
    getDataHtmlTousVaccinsInVaccinodrome(etatAddNewVaccinCentreView,listeVaccin,dataListVaccinCentreView,dataEditVaccinCentre){
        return (
            <>
                <h1 className="title_table_list_vaccin_vaccinodrome" hidden={etatAddNewVaccinCentreView!==1}>Liste de tous les vaccins dans le vaccinodrome</h1>
                <div className="listVaccinVaccinodrome" hidden={etatAddNewVaccinCentreView!==1}>
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered tableListVaccinVaccinodrome">
                            <thead>
                                <tr>
                                    <th colSpan={4}>
                                        <ul className="tableListVaccinVaccinodrome_search">
                                            <li className="li1"><input type="text" onChange={(e)=>this.setState({dataSearchListVaccinCentreView : {libeller : e.target.value, colone : '',etat : true}})} className="tableListVaccinVaccinodromeinputSearch" placeholder="Nom de la maladie"/></li>
                                            <li className="li2"><button className="libtn" onClick={()=>this.setState({dataListVaccinCentreView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0}},()=>this.getDataVaccinCentreView(0))}><FontAwesomeIcon icon={faSearch} /></button></li>
                                            <li className="li3">
                                                <button className="libtn" onClick={()=>this.setState({dataListVaccinCentreView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0},dataSearchListVaccinCentreView : {libeller : '', colone : '',etat : false}},()=>this.getDataVaccinCentreView(0))}>
                                                    <FontAwesomeIcon icon={faRefresh} />
                                                </button>
                                            </li>
                                        </ul>
                                    </th>
                                    <th colSpan={1}><button className="tableListVaccinVaccinodromeButtonAdd" onClick={()=>this.setState({etatAddNewVaccinCentreView : 2})}>Ajouter</button></th>
                                </tr>
                                <tr>
                                    <th>Nom du vaccin</th>
                                    <th>Quantité</th>
                                    <th>Nombre de dose</th>
                                    <th>Age minimum</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (this.getDataVaccinCentreViewInState(dataListVaccinCentreView)).map((data,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td className="tableBodyListVaccinVaccinodromeTd1">{data.nomVaccin}</td>
                                                <td className="tableBodyListVaccinVaccinodromeTd1 textAlignRight">{data.quantite}</td>
                                                <td className="tableBodyListVaccinVaccinodromeTd1 textAlignRight">{data.nombreDose}</td>
                                                <td className="tableBodyListVaccinVaccinodromeTd1 textAlignRight">{data.ageMinimum}</td>
                                                <td>
                                                    <ul className="btnInColumnAction">
                                                        <li className="li1"><button className="tableBodyListVaccinVaccinodromeTd3Btn btn-warning" onClick={()=>this.setState({dataEditVaccinCentre : data,etatAddNewVaccinCentreView : 3})}><FontAwesomeIcon icon={faEdit} /></button></li>
                                                        <li className="li2"><button className="tableBodyListVaccinVaccinodromeTd3Btn btn-danger" onClick={()=>this.supprimerVaccinCentre(data.idVaccinCentre)}><FontAwesomeIcon icon={faTrashAlt} /></button></li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    {this.createDataHtmlPaginationVaccinCentreView(dataListVaccinCentreView.totalpage,dataListVaccinCentreView.page)}
                </div>
                <div hidden={etatAddNewVaccinCentreView!==2}>{this.getDataHtmlInsertionVaccinInVaccinodrome(listeVaccin)}</div>
                <div hidden={etatAddNewVaccinCentreView!==3}>{this.getDataHtmlEditVaccinInVaccinodrome(dataEditVaccinCentre)}</div>
            </>
        )
    }
    //bouton insertion maladie
    insertionMaladie=()=>{
        let nomMaladie = this.state.nomMaladie;let descriptionMaladie = this.state.descriptionMaladie;
        if(utile.getVerificationChampsText(nomMaladie) && utile.getVerificationChampsText(descriptionMaladie)){
            const data ={
                idMaladie : 0,
                maladie : nomMaladie,
                descriptions : descriptionMaladie,
                status : 1
            };
            this.setState({activeloader : true});
            fetchPost('maladie/insertion-maladie',data).then(response=>{
                this.setState({activeloader : false});
                if(response!==null && response!==undefined){
                    this.setState({headersmsmodal: "Message",bodysmsmodal: ''+response.message,etatsmsmodal : true});
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: 'Le serveur ne marche pas',etatsmsmodal : true});
                }
                
            });
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: 'Le serveur ne marche pas',etatsmsmodal : true});
        }
    }
    //data maladie Search
    getMaladie(page,addData){
        let libeller = this.state.libellerMaladie;let url ="maladie/";
        if(utile.getVerificationChampsText(libeller)){url=url+"search/10/"+page+"/"+libeller;}else{url=url+"list/10/"+page;}
        fetchGet(url).then(response=>{ 
            if(response !== undefined && response!==null){
                if(addData){
                    if(response!==undefined && response!==null){
                        let allData = response;let data = response.docs;let dataState = this.state.listMaladie;
                        if(dataState!==undefined && dataState!==null){
                            let docs = dataState.docs;
                            if(docs!==undefined && docs!==null){
                                let size = data.length;
                                for(let i = 0; i < size; i++){
                                    docs.push(data[i]);
                                }
                                data = [];data = docs;
                            }
                        }
                        allData.docs = data;
                        this.setState({listMaladie : allData});
                    }
                }else{
                    this.setState({listMaladie: response});
                }
            }
        });
    }
    getMaladieHasNextPageOrNot(docs){
        if(docs!==undefined && docs!==null){ let hasNext = docs.hasNextPage; if(hasNext!==undefined && hasNext!==null){return hasNext;} }
        return false;
    }
    setListeMaladieToListReactSelect(docs){
        let data = [];
        if(docs!==undefined && docs!==null){
            let dataDocs = docs.docs;
            let size = dataDocs.length;
            for (let i = 0; i < size; i++) {
                let lb = (<div><div>{dataDocs[i].maladie}</div></div>);
                data.push({value : dataDocs[i],label : lb});
            }
            return data;
        }
        return data;
    }
    handleChangeOptionListeMaladie=(selectedOption)=>{
        if(selectedOption !== undefined && selectedOption!==null){
            this.setState({maladieInsertionVaccin : selectedOption.value});
        }
    }
    onClickNextMaladie=(docs)=>{
        if(docs!==undefined && docs!==null){ 
            if(docs.hasNextPage!==undefined && docs.hasNextPage!==null && docs.nextPage!==undefined && docs.nextPage!==null){
                if(docs.hasNextPage===true  && docs.nextPage>0){
                    this.getMaladie(docs.nextPage,true);
                }
            } 
        }
    }
    onClickActualizeMaladie=()=>{
        this.setState({libellerMaladie : ''},()=>{ this.getMaladie(0,false); });
    }
    onClickSearchMaladie=(data)=>{
        if(utile.getVerificationChampsText(data)){ this.setState({libellerMaladie : data},()=>{ this.getMaladie(0,false); }) }
        else{this.onClickActualizeMaladie();}
    }
    //data vaccin Search
    getVaccin(page,addData){
        let libeller = this.state.libellerVaccin;let url ="vaccin/";
        if(utile.getVerificationChampsText(libeller)){url=url+"search/10/"+page+"/"+libeller;}else{url=url+"list/10/"+page;}
        fetchGet(url).then(response=>{ 
            if(response !== undefined && response!==null){
                if(addData){
                    if(response!==undefined && response!==null){
                        let allData = response;let data = response.docs;let dataState = this.state.listeVaccin;
                        if(dataState!==undefined && dataState!==null){
                            let docs = dataState.docs;
                            if(docs!==undefined && docs!==null){
                                let size = data.length;
                                for(let i = 0; i < size; i++){
                                    docs.push(data[i]);
                                }
                                data = [];data = docs;
                            }
                        }
                        allData.docs = data;
                        this.setState({listeVaccin : allData});
                    }
                }else{
                    this.setState({listeVaccin: response});
                }
            }
        });
    }
    getVaccinHasNextPageOrNot(docs){
        if(docs!==undefined && docs!==null){ let hasNext = docs.hasNextPage; if(hasNext!==undefined && hasNext!==null){return hasNext;} }
        return false;
    }
    setListeVaccinToListReactSelect(docs){
        let data = [];
        if(docs!==undefined && docs!==null){
            let dataDocs = docs.docs;
            let size = dataDocs.length;
            for (let i = 0; i < size; i++) {
                let lb = (<div><div>{dataDocs[i].nomVaccin}</div></div>);
                data.push({value : dataDocs[i],label : lb});
            }
            return data;
        }
        return data;
    }
    handleChangeOptionListeVaccin=(selectedOption)=>{
        if(selectedOption !== undefined && selectedOption!==null){
            this.setState({vaccinInsertionVaccinCentre : selectedOption.value});
        }
    }
    onClickNextVaccin=(docs)=>{
        if(docs!==undefined && docs!==null){ 
            if(docs.hasNextPage!==undefined && docs.hasNextPage!==null && docs.nextPage!==undefined && docs.nextPage!==null){
                if(docs.hasNextPage===true  && docs.nextPage>0){
                    this.getVaccin(docs.nextPage,true);
                }
            } 
        }
    }
    onClickActualizeVaccin=()=>{
        this.setState({libellerVaccin : ''},()=>{ this.getVaccin(0,false); });
    }
    onClickSearchVaccin=(data)=>{
        if(utile.getVerificationChampsText(data)){ this.setState({libellerVaccin : data},()=>{ this.getVaccin(0,false); }) }
        else{this.onClickActualizeVaccin();}
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
    getDataMaladie(page){
        if(!this.getVerificationDataPageMaladie(page)){
            let dataSearchListMaladie = this.state.dataSearchListMaladie;
            let url = "maladie/";let libeller =  dataSearchListMaladie.libeller;
            if(dataSearchListMaladie.etat && utile.getVerificationChampsText(libeller)){url=url+"search/10/"+page+"/"+libeller;}else{url=url+"list/10/"+page;}
            this.setState({activeloader : true});
            fetchGet(url).then(response=>{ 
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
            this.getDataMaladie(newpage);
        }
    }
    createDataHtmlPaginationMaladie(pageTotal,page){
        if(pageTotal>0  && page>=0){
            return  <Pagination totalPages={pageTotal} page={page} setPage={(e)=> this.setPageInPaginationMaladie(e)} />
        }
        return <div></div>
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
    getDataVaccinCentreView(page){
        let vaccinodrome = auth.getDataUtilisateurToken();

        if(!this.getVerificationDataPageVaccinCentreView(page) && vaccinodrome!==undefined && vaccinodrome!==null){
            let idvaccinodrome = vaccinodrome.id;
            if(idvaccinodrome!==undefined && idvaccinodrome!==null && idvaccinodrome>0){
                let dataSearchListVaccinCentreView = this.state.dataSearchListVaccinCentreView;
                let url = "vaccincentre/";let libeller =  dataSearchListVaccinCentreView.libeller;
                if(dataSearchListVaccinCentreView.etat && utile.getVerificationChampsText(libeller)){url=url+"search/"+idvaccinodrome+"/10/"+page+"/"+libeller;}else{url=url+"list/"+idvaccinodrome+"/10/"+page;}
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
    // verification de l'extension de l'image
    getVerifiExtensionImage(filename){
        let namesplit = filename.split('.');let size = namesplit.length;
        if(size>0){
            let ext = namesplit[size-1];
            if(ext==='png' || ext==='jpg' || ext==='jpeg'){
                return true;
            }
        }
        return false;
    }
    //handle image vaccin
    changeImageVaccin=(e)=>{
        let files = e.target.files;
        if(files.length >0){
            let size = files[0].size/1024;
            if(size<=1000){
                if(this.getVerifiExtensionImage(files[0].name)){
                    this.setState({imageVaccin : files[0]})
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
    // ajouter une maladie qui n'est pas compatible au vaccin (cormobidité)
    ajouterMaladieDansVaccin=()=>{
        let data= this.state.maladieInsertionVaccin;
        if(data!==null && data!==undefined){
            let cormobidite = this.state.listMaladieVaccin;let size = cormobidite.length;let test = false;
            for(let i=0;i<size;i++){if(cormobidite[i].idMaladie === data.idMaladie){test = true; break;} }
            if(!test){ 
                cormobidite.push(data);
                this.setState({listMaladieVaccin : cormobidite})
            }
        }
    }
    // supprimer une maladie qui n'est pas compatible au vaccin (cormobidité)
    deletedescriptions=(i)=>{
        let liste = this.state.listMaladieVaccin;let size = liste.length;
        if(i>=0 && i<size){
            liste.splice(i,1);
            this.setState({listMaladieVaccin : liste})
        }
    }
    //function supprimer maladie
    supprimerMaladie(idmaladie){
        if(idmaladie!==undefined && idmaladie!==null){
            if(window.confirm("Etez vous sûr ?")){
                    fetchGet('maladie/delete-maladie/'+idmaladie).then(response=>{
                        if(response!==null && response!==undefined){
                            this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,dataListMaladie : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, }},() => {
                                this.getDataMaladie(0);
                            });
                        }
                    })
            }
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes.",etatsmsmodal : true});
        }
    }
    //ajouter un nouvel vaccin 
    insertionVaccin=()=>{
        let listMaladieVaccin = this.state.listMaladieVaccin;let nomVaccin = this.state.nomVaccin;let descriptionVaccin = this.state.descriptionVaccin;
        let imageVaccin = this.state.imageVaccin;
        if(listMaladieVaccin.length>0 && utile.getVerificationChampsText(nomVaccin) && imageVaccin!==null && imageVaccin!==undefined){
            if(!utile.getVerificationChampsText(descriptionVaccin)){descriptionVaccin = '';}
            const dataPhoto = new FormData() 
            dataPhoto.append('photo', imageVaccin)
            axios.post(confignode+"photo", dataPhoto).then(res => { 
                if(res.data!==null && res.data!==undefined){
                    let imageUrl = res.data.image;
                    if(imageUrl!==null && imageUrl!==undefined && imageUrl!==''){
                        const data = {
                            vaccin : {
                                idVaccin : 0,
                                nomVaccin : nomVaccin,
                                urlPhoto : ''+imageUrl,
                                descriptions : descriptionVaccin,
                                status : 1
                            },
                            maladies : listMaladieVaccin
                        }
                        fetchPost('vaccin/insertion-vaccin',data).then(response=>{
                            if(response!==null && response!==undefined){
                                this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,
                                dataListVaccinView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },
                                dataSearchListVaccinView : {libeller : '', colone : '',etat : false}},()=>{
                                    this.getDataVaccinView(0)
                                });
                            }
                        })
                    }else{
                        this.setState({headersmsmodal: "Message",bodysmsmodal: "Il y a une erreur au niveau de l'image du vaccin",etatsmsmodal : true});
                    }
                }else{
                    this.setState({headersmsmodal: "Message",bodysmsmodal: "Le serveur ne marche pas .",etatsmsmodal : true});
                }
            });
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes, merci de compléter tous les champs.",etatsmsmodal : true});
        }
    }
    //function supprimer vaccin 
    supprimerVaccin(idVaccin){
        if(idVaccin!==undefined && idVaccin!==null){
            if(window.confirm("Etez vous sûr ?")){
                    fetchGet('vaccin/delete-vaccin/'+idVaccin).then(response=>{
                        if(response!==null && response!==undefined){
                            this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,dataListVaccinView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0}},() => {
                                this.getDataVaccinView(0);
                            });
                        }
                    })
            }
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes.",etatsmsmodal : true});
        }
    }
    //ajouter une nouvelle vaccinCentre
    EnregistrerVaccinCentre=()=>{
        let vaccin = this.state.vaccinInsertionVaccinCentre;let nbrDose = utile.parseStringToInt(''+this.state.nbrDoseVaccinCentre); 
        let age = utile.parseStringToInt(''+this.state.ageVaccinCentre);let quantite = utile.parseStringToFloat(''+this.state.quantiteVaccinCentre); 
        let description = this.state.descriptionVaccinCentre;
        if(vaccin!== undefined && vaccin!==null && nbrDose > 0 && age > 0  && quantite >= 0){
            if(!utile.getVerificationChampsText(description)){description = '';}
            let vaccinodrome = auth.getDataUtilisateurToken();
            if(vaccinodrome!==null && vaccinodrome!==undefined){
                const data = {
                    idVaccincentre : 0,
                    idVaccinodrome : vaccinodrome.id,
                    idVaccin: vaccin.idVaccin,
                    quantite : quantite,
                    nombreDose : nbrDose,
                    ageMinimum : age,
                    descriptions : description,
                    status : 1
                };
                fetchPost('vaccincentre/insertion-vaccin-centrevaccination',data).then(response=>{
                    if(response!==null && response!==undefined){
                        this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,dataListVaccinCentreView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, }},() => {
                            this.getDataVaccinCentreView(0);
                        });
                    }
                })
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Vous devez vous reconnecter car votre session est terminé",etatsmsmodal : true});
            }
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes, merci de compléter tous les champs.",etatsmsmodal : true});
        }
    }
    //function modification vaccin centre
    EnregistrerModificationVaccinCentre(){
        let dataEditVaccinCentre = this.state.dataEditVaccinCentre;
        if(dataEditVaccinCentre!==undefined && dataEditVaccinCentre!==null){
            let nbrDose = utile.parseStringToInt(this.state.nbrDoseVaccinCentreM);let age = utile.parseStringToInt(this.state.ageVaccinCentreM);
            let qt = utile.parseStringToFloat(this.state.quantiteVaccinCentreM);
            if(nbrDose>0 && nbrDose!==dataEditVaccinCentre.nombreDose && ''+nbrDose!=="NaN"){nbrDose=nbrDose+0;}else{nbrDose=dataEditVaccinCentre.nombreDose;}
            if(age>0 && age!==dataEditVaccinCentre.ageMinimum && ''+age!=="NaN"){age=age+0;}else{age=dataEditVaccinCentre.ageMinimum;}
            if(qt>=0 && qt!==dataEditVaccinCentre.quantite && ''+qt!=="NaN"){qt=qt+0;}else{qt=dataEditVaccinCentre.quantite;}
            const data = {
                idVaccincentre : dataEditVaccinCentre.idVaccinCentre,
                idVaccinodrome : dataEditVaccinCentre.idVaccinodrome,
                idVaccin: dataEditVaccinCentre.idVaccin,
                quantite : qt,
                nombreDose : nbrDose,
                ageMinimum : age,
                descriptions : '',
                status : dataEditVaccinCentre.status
            };
            fetchPost('vaccincentre/edit-vaccin-centrevaccination',data).then(response=>{
                if(response!==null && response!==undefined){
                    this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,dataListVaccinCentreView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, }},() => {
                        this.getDataVaccinCentreView(0);
                    });
                }
            })
        }else{
            this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes, merci de compléter tous les champs.",etatsmsmodal : true});
        }
    }
    //function supprimer vaccin centre
    supprimerVaccinCentre(idVaccinCentre){
        if(window.confirm("Etez vous sûr ?")){
            if(idVaccinCentre!==undefined && idVaccinCentre!==null){
                fetchGet('vaccincentre/delete-vaccincentre/'+idVaccinCentre).then(response=>{
                    if(response!==null && response!==undefined){
                        this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,dataListVaccinCentreView : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, }},() => {
                            this.getDataVaccinCentreView(0);
                        });
                    }
                })
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes.",etatsmsmodal : true});
            }
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
                <div className="containerVaccinInVaccinodrome">
                    <div className="menu_temporaire_dans_un_page">
                        <ul className="ul">
                            <li className="li_1" onClick={()=>this.setState({stepper : 1})}><button className={(this.state.stepper===1)?"btn_click":"btn_liste"}>Vaccin</button></li>
                            <li className="li_2" onClick={()=>this.setState({stepper : 2})}><button className={(this.state.stepper===2)?"btn_click":"btn_liste"}>Vaccin dans le Vaccinodrome</button></li>
                            <li className="li_3" onClick={()=>this.setState({stepper : 3})}><button className={(this.state.stepper===3)?"btn_click":"btn_liste"}>Maladie</button></li>
                        </ul>
                    </div>
                    {
                        (this.state.stepper===2)?this.getDataHtmlTousVaccinsInVaccinodrome(this.state.etatAddNewVaccinCentreView,this.state.listeVaccin,this.state.dataListVaccinCentreView,this.state.dataEditVaccinCentre):
                        (this.state.stepper===1)?this.getDataHtmlTousLesVaccins(this.state.etatAddNewVaccinView,this.state.listMaladieVaccin,this.state.dataListVaccinView):
                        this.getDataHtmlTousLesMaladie(this.state.dataListMaladie,this.state.etatAddNewMaladie)
                        
                    }
                </div>
            </>
        )
    }
}
export default Vaccin;