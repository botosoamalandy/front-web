import React, {Component} from 'react';
import './Search.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSyncAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

class Search extends Component{
    constructor(props){
        super();
        this.state = {
            defaultext : '',
            title : '',
            typeInput : 'text',
            placeholderInput : '',
            options : [],
            textsearch : '',
            show : false,
            etatNext : false,
            inputReset : false,
            addDelete : false,

            //new data
            hasNextPage : false,
        }
    }
    openMyDropDown=()=>{
        this.setState({show : !this.state.show});
    }
    onClickOption=(data)=>{
        if(data!== undefined && data!==null){
            if(data.label !== undefined && data.label !== null && data.value !== undefined && data.value !== null){
                this.setState({title: data.label});
                this.props.onchange(data);
            }
        }
    }
    deleteOption=(data)=>{
        if(data!== undefined && data!==null){
            if(data.label !== undefined && data.label !== null && data.value !== undefined && data.value !== null){
                this.props.ondelete(data);
            }
        }
    }
    onClickNext=(hasNextPage)=>{
        if(hasNextPage){
            this.props.onClickNext();
        }
    }
    onClickSearch=()=>{
        this.setState({inputReset : true})        
        let text = this.state.textsearch;
        if(text !== undefined && text!==null && text !== "" && text !== " "){
            this.props.onClickSearch(text);
        }
    }
    onClickActualize=()=>{
        this.setState({textsearch : ''})
        this.props.onClickActualize();
    }
    getOption(options,addDelete){
        return (
            <>
                {
                    (options.length > 0)?options.map((data,i)=>{
                        if(data.value !== undefined && data.value !== null && data.label !== undefined && data.label !== null){
                            if(addDelete){
                                return <div className="sonddropdow" key={i}>
                                    <div className="row sonddropdow_row_adddelete">
                                        <div className="col-md-9 col-sm-9 col-xs-12 sonddropdow_row_adddelete_col" onClick={()=>this.onClickOption(data)}>{data.label}</div>
                                        <div className="col-md-3 col-sm-3 col-xs-12 sonddropdow_row_adddelete_col" style={{textAlign:'right',paddingRight:'1%'}}><button className="icon_delete_in_table_arcticle_acceuille" onClick={()=>this.deleteOption(data)}><FontAwesomeIcon  icon={faTrashAlt}/></button></div>
                                    </div>
                                </div>
                            }else{
                                return <div className="sonddropdow" onClick={()=>this.onClickOption(data)} key={i}>{data.label}</div>
                            }
                        }else{
                            return <div key={i}></div>
                        }
                    }):<div></div>
                }
            </>
        )
    }
    handeInputSearch=(e)=>{
        if(this.state.inputReset){
            //e.target.value = "";
            this.setState({inputReset : false,textsearch : ''});
        }else{
            let valeur = e.target.value;
            if(valeur !== '' && valeur != null && valeur !== ' ' && valeur !== ''){
                this.setState({inputReset : false,textsearch : valeur});
            }else{
                //e.target.value = "";
                this.setState({inputReset : false,textsearch : ''});
            }
        }
    }
    componentDidMount() { 
        if(this.props.title !== undefined && this.props.title !== null){this.setState({title:this.props.title})}
        if(this.props.addDelete !== undefined && this.props.addDelete !== null){this.setState({addDelete:this.props.addDelete})}
        if(this.props.typeInput !== undefined && this.props.typeInput !== null){this.setState({typeInput:this.props.typeInput})}
        if(this.props.placeholderInput !== undefined && this.props.placeholderInput !== null){this.setState({placeholderInput:this.props.placeholderInput})}
        if(this.props.options !== undefined && this.props.options !== null){ this.setState({options:this.props.options})}

        //new data
        if(this.props.hasNextPage !== undefined && this.props.hasNextPage !== null){this.setState({hasNextPage:this.props.hasNextPage})}
    }
    getButtonTitle(title){
        let size = title.length;
        if(size>40 && size<=60){
            return <button onClick={() => this.openMyDropDown()} className="principale_search_btn_faire_une_select" style={{fontSize: '12px'}}>{this.state.title}</button>
        }else if(size>60){
            return <button onClick={() => this.openMyDropDown()} className="principale_search_btn_faire_une_select" style={{fontSize: '9px'}}>{this.state.title}</button>
        }
        return <button onClick={() => this.openMyDropDown()} className="principale_search_btn_faire_une_select">{this.state.title}</button>
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.options !== undefined && nextProps.options !==null){this.setState({options : nextProps.options}); }
        if(nextProps.hasNextPage !== undefined && nextProps.hasNextPage !== null){ this.setState({ hasNextPage: nextProps.hasNextPage }) }
        this.forceUpdate();
    }
    
    render(){
        return (
            <div className="principale_search">
                <div className="principale_search_dropdown">
                    {this.getButtonTitle(this.state.title)}
                    <div id="myDropdown" hidden={!this.state.show} className="principale_search_btn_faire_une_select_dropdown">
                        <ul className="champs_search_dropdown_page_search">
                            <li className="li_1"><input type={this.state.typeInput} onFocus={(e)=>{if(this.state.inputReset){e.target.value = ""; this.setState({inputReset: false})}}} placeholder={this.state.placeholderInput} onChange={(e) =>this.handeInputSearch(e) } className="principale_search_btn_faire_une_select_input_search" /></li>
                            <li className="li_2"><button onClick={()=>this.onClickSearch()}><FontAwesomeIcon icon={faSearch} /></button></li>
                            <li className="li_3"><button onClick={()=>this.onClickActualize()}><FontAwesomeIcon icon={faSyncAlt} /></button></li>
                        </ul>
                        {this.getOption(this.state.options,this.state.addDelete)}
                        <div className="btn_next_in_page_search" hidden={!this.state.hasNextPage}><button onClick={()=>this.onClickNext(this.state.hasNextPage)}>Suivant</button></div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Search;