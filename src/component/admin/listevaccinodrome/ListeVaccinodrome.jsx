import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import { fetchGet } from '../../../service/requeteHttp';
import { utile } from '../../../service/utile';
import AlertMessage from '../../alert-message/AlertMessage';
import Loading from '../../loading/Loading';
import Pagination from '../../pagination/Pagination';
import './ListeVaccinodrome.css';

class ListeVaccinodrome extends Component{
    constructor(props){ 
        super();
        this.state = {
            //laoding
            activeloader : false,
            //modal        
            headersmsmodal : "",
            bodysmsmodal : '',
            etatsmsmodal : false,
            // liste vaccinodrome
            listVaccinodrome : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, },// data : [] = > {docs, page},
            dataSearchListVaccinodrome : {libeller : '', colone : '',etat : false},
            listVaccinodromeStatus : 22,
        }
    } 
    componentDidMount() {
       this.getListeVaccinodrome(0);
    }
       
    // list vaccinodrome to display list
    getVerificationDataPage(page){
        let data = this.state.listVaccinodrome.data;let size =  data.length;
        if(size > 0){
            for (let i = 0; i < size; i++) {
                if(data.page === page){
                    this.setState({listVaccinodrome : {data : this.state.listVaccinodrome.data,page : page, libeller : this.state.listVaccinodrome.libeller, colone : this.state.listVaccinodrome.colone}});
                    return true;
                }
            }
            return false;
        }
        return false;
    }
    getListeVaccinodrome(page){
        if(!this.getVerificationDataPage(page)){
            let dataSearchListVaccinodrome = this.state.dataSearchListVaccinodrome;
            let listVaccinodromeStatus = this.state.listVaccinodromeStatus;
            let url = "vaccinodrome/";let libeller =  dataSearchListVaccinodrome.libeller;
            if(dataSearchListVaccinodrome.etat && utile.getVerificationChampsText(libeller)){url=url+"list-search/10/"+page+"/"+listVaccinodromeStatus+"/"+libeller;}else{url=url+"list/10/"+page+"/"+listVaccinodromeStatus;}
            this.setState({activeloader : true});
            fetchGet(url).then(response=>{ 
                this.setState({activeloader : false});
                if(response !== undefined && response!==null){
                    let listVaccinodrome = this.state.listVaccinodrome;let tmp= listVaccinodrome.data;let size = tmp.length;let test = false;
                    for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
                    if(!test){ tmp.push({docs : response.docs,page : response.page}); }
                    this.setState({listVaccinodrome : {data : tmp,page : response.page, libeller : listVaccinodrome.libeller, colone : listVaccinodrome.colone,totalpage : response.totalPages}});
                }
            });
        }
    }
    getDataVaccinodromeInState(listVaccinodrome){
        let data = listVaccinodrome.data;let page = listVaccinodrome.page;let size = data.length;
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
    setPageInPaginationVaccinodrome=(e)=>{
        let newpage = utile.parseStringToInt(e)-1;
        if(newpage>=0){   
            this.getListeVaccinodrome(newpage);
        }
    }
    createDataHtmlPaginationVaccinodrome(pageTotal,page){
        if(pageTotal>0  && page>=0){
            return  <Pagination totalPages={pageTotal} page={page} setPage={(e)=> this.setPageInPaginationVaccinodrome(e)} />
        }
        return <div></div>
    }
    // handle select etat utilisateur
    handleSelectEtatVaccinodrome=(value)=>{
        this.setState({listVaccinodromeStatus : value,listVaccinodrome : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, }},()=>{
            this.getListeVaccinodrome(0);
        })
    }
    // bloquer vaccinodrome
    bloquerVaccinodrome=(idVaccinodrome)=>{
        if(window.confirm("êtes-vous certain de vouloir bloquer ce compte ?")){
            if(idVaccinodrome!==undefined && idVaccinodrome!==null){
                this.setState({activeloader : true});
                fetchGet("vaccinodrome/bloquer-vaccinodrome/"+idVaccinodrome).then(response=>{ 
                    this.setState({activeloader : false});
                    if(response !== undefined && response!==null){
                        this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,dataSearchListVaccinodrome : {libeller : '', colone : '',etat : false},listVaccinodrome : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, }},()=>{
                            this.getListeVaccinodrome(0);
                        });
                    }
                });
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes.",etatsmsmodal : true});
            }
        }
    }
    // restaurer vaccinodrome blouqué
    restaurerVaccinodrome=(idVaccinodrome)=>{
        if(window.confirm("Voulez-vous vraiment rétablir l'accès à ce compte?")){
            if(idVaccinodrome!==undefined && idVaccinodrome!==null){
                this.setState({activeloader : true});
                fetchGet("vaccinodrome/restaurer-vaccinodrome/"+idVaccinodrome).then(response=>{ 
                    this.setState({activeloader : false});
                    if(response !== undefined && response!==null){
                        this.setState({headersmsmodal: "Message",bodysmsmodal: ""+response.message,etatsmsmodal : true,dataSearchListVaccinodrome : {libeller : '', colone : '',etat : false},listVaccinodrome : {data : [],page : 0, libeller : '', colone : '',totalpage : 0, }},()=>{
                            this.getListeVaccinodrome(0);
                        });
                    }
                });
            }else{
                this.setState({headersmsmodal: "Message",bodysmsmodal: "Les informations sont incomplètes.",etatsmsmodal : true});
            }
        }
    }
    //data html de tous les vaccinodromes
    getDataHtmlTousLesVaccinodrome(listVaccinodrome){
        return (
            <>
                <div className="containerListeUtilisateur">
                    <h1 className="title_table_list_utilisateurLU">Liste de tous les vaccinodromes</h1>
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered tableRdvPatient">
                            <thead>
                                <tr className="trSearchRdvPatient">
                                    <th colSpan={4}><input type="text" className="inputListeUtilisateurLU" onChange={(e)=>this.setState({dataSearchListVaccinodrome : {libeller : e.target.value, colone : '',etat : true}})} placeholder="Nom de l'utilisateur"/></th>
                                    <th colSpan={1}>
                                        <select className="inputListeUtilisateurLU" onChange={(e)=>this.handleSelectEtatVaccinodrome(utile.parseStringToInt(""+e.target.value))}>
                                            <option value={1}>Etat vaccinodrome</option>
                                            <option value={22}>toutes les vaccinodrome</option>
                                            <option value={1}>Vaccinodrome normal</option>
                                            <option value={11}>Vaccinodrome bloqué</option>
                                        </select>    
                                    </th>
                                    <th colSpan={1}><button className="btnSearchListeUtilisateurLU" onClick={()=>this.setState({listVaccinodrome : {data : [],page : 0, libeller : '', colone : '',totalpage : 0}},()=>this.getListeVaccinodrome(0))}><FontAwesomeIcon icon={faSearch} /></button></th>
                                    <th colSpan={1}><button className="btnRefreshListeUtilisateurLU" onClick={()=>this.setState({dataSearchListVaccinodrome : {libeller : '', colone : '',etat : false},listVaccinodrome : {data : [],page : 0, libeller : '', colone : '',totalpage : 0}},()=>this.getListeVaccinodrome(0))}><FontAwesomeIcon icon={faRefresh} /></button></th>
                                </tr>
                                <tr className="tr2SearchRdvPatientTmp">
                                    <th colSpan={7}></th>
                                </tr>
                                <tr>
                                    <th>Nom</th>
                                    <th>email</th>
                                    <th className="textAlignCenter">Téléphone</th>
                                    <th>Adresse</th>
                                    <th>Descriptions</th>
                                    <th>Etat</th>
                                    <th className="textAlignCenter">Actions</th>
                                </tr>
                            </thead>
                            <tbody> 
                                {
                                    (this.getDataVaccinodromeInState(listVaccinodrome)).map((data,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td className="textAlignLeft">{data.nomCentre}</td>
                                                <td className="textAlignLeft">{data.email}</td>
                                                <td className="textAlignCenter">{data.telephone}</td>
                                                <td className="textAlignLeft">{data.adresse}</td>
                                                <td className="textAlignLeft">{data.descriptions}</td>
                                                <td className="textAlignLeft">{(data.status)?"normal":"bloqué"} {data.status}</td>
                                                <td className="textAlignCenter">
                                                    {
                                                        (data.status===11)?<button className="btn-primary" onClick={()=>this.restaurerVaccinodrome(data.idVaccinodrome)}>Restaurer</button>
                                                        :<button className="btn-danger" onClick={()=>this.bloquerVaccinodrome(data.idVaccinodrome)}>Bloquer</button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    {this.createDataHtmlPaginationVaccinodrome(listVaccinodrome.totalpage,listVaccinodrome.page)}
                </div>
            </>
        )
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
                <div className="principaleListeVaccinodrome">
                    {this.getDataHtmlTousLesVaccinodrome(this.state.listVaccinodrome)}
                </div>
            </>
        )
    }
}
export default ListeVaccinodrome;