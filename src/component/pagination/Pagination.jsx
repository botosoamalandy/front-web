import React, {Component} from 'react';
import './Pagination.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { utile } from '../../service/utile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

class Pagination extends Component{
    constructor(props){
        super();
        this.state = {
            totalPages : 1,
            page : 1,
        }
    }
    createDataHtmlPrev(totalPages,page){
      if(page > 1 && totalPages > 1){
        return <li className="btn_preview_pagination" onClick={()=>this.buttonPrev(totalPages,page)}><FontAwesomeIcon  icon={faArrowLeft}/></li>
      }
      return <li></li>
    }
    createDataHtmlNext(totalPages,page){
      if(page < totalPages  && totalPages > 2){
        return  <li className="btn_next_pagination" onClick={()=>this.buttoNext(totalPages,page)}><FontAwesomeIcon  icon={faArrowRight}/></li>
      }
      return <li></li>
    }
    buttonPrev(totalPages,page){
      if((page-1)>=1 && (page-1)<totalPages){ this.setState({page : (page-1)}) }
    }
    buttoNext(totalPages,page){
      if((page+1)<=totalPages && (page+1)>0){ this.setState({page : (page+1)}) }
    }
    getLeplusPetitDansunTab(tab){
      let valeur = 0; let size = tab.length;
      for(let i = 0; i < size; i++){
        if(i===0){valeur= tab[i];}
        if(tab[i]<=valeur){valeur=tab[i];}
      }      
      return valeur;
    }
    getTableauNombrePagination(totalPages,page){
      let tabTmp = [];
      if(page===1){tabTmp.push(page+2);}
      if(page>=2){tabTmp.push(page-1);}
      if(page< totalPages){tabTmp.push(page+1);}
      if(page=== totalPages){tabTmp.push(page-2);}
      tabTmp.push(page);
      tabTmp.sort(function(a,b){return a - b;});
      let plusBas = this.getLeplusPetitDansunTab(tabTmp);let newtab = [];
      if(plusBas>=2){newtab.push({etat : true , value : 1});}
      if(plusBas>2){newtab.push({etat : false , value : 0})}
      let max = 0;let newsiza= tabTmp.length;
      for(let i = 0; i < newsiza ; i++){
        if(tabTmp[i]>=max){max = tabTmp[i]}
        newtab.push({etat : true , value : tabTmp[i]});
      }
      if(max<totalPages-1){newtab.push({etat : false , value : 0})}
      if(max===totalPages-1){newtab.push({etat : true , value : totalPages})}
      return newtab;
    }
    setPageIntState=(valeur)=>{
      this.setState({page : valeur},()=>{
        this.props.setPage(this.state.page);
      });
    }
    createDataHtmlNombre(totalPages,page){
      if(totalPages >=1 && totalPages <= 5){
        let tab = utile.createTableauNumber(1,totalPages);
        return (
          <>
            {
              tab.map((data,i)=>{
                if(page === i){
                  return <li className="btn_number_pagination active" onClick={()=>this.setPageIntState(data)} key={i}>{data}</li>
                }else{
                  return <li className="btn_number_pagination" onClick={()=>this.setPageIntState(data)} key={i}>{data}</li>
                }
              })
            }
          </>
        )
      }else if(totalPages > 5){
        let tab = this.getTableauNombrePagination(totalPages,page);
        return (
          <>
            {
              tab.map((data,i)=>{ 
                if(data.etat){
                  return <li className={(data.value===page)?("btn_number_pagination active"):("btn_number_pagination")} onClick={()=>this.setPageIntState(data.value)} key={i}>{data.value}</li>
                }else{
                  return <li className={(data.value===page)?("btn_number_pagination active"):("btn_number_pagination")} key={i}>...</li>
                }
              })
            }
          </>
        );
      }else{
        return <li></li>
      }
    }
    componentDidMount() {
       if(this.props.totalPages!==null && this.props.totalPages!==undefined && this.props.page!==null && this.props.page!==undefined){
         if(this.props.totalPages > 0 && this.props.page > 0 && this.props.totalPages>this.props.page){
           this.setState({totalPages : this.props.totalPages , page : this.props.page});
         }
       }
    }
    componentWillReceiveProps(nextProps) {
      if(this.state.totalPages!==nextProps.totalPages){
        this.setState({totalPages : nextProps.totalPages , page : nextProps.page});
      }
      this.forceUpdate();
    }
    
    
    
    render(){
        return (
            <div className="principale_pagination">
                <ul>
                  {this.createDataHtmlPrev(this.state.totalPages,this.state.page)}
                  {this.createDataHtmlNombre(this.state.totalPages,this.state.page)}
                  {this.createDataHtmlNext(this.state.totalPages,this.state.page)}
                </ul>
            </div>
        )
    }
}
export default Pagination;