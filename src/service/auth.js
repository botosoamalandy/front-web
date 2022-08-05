import { utile } from './utile';
import jwt_decode from "jwt-decode";

function getVerifString(valeur){
    if(valeur !== null && valeur !== undefined){
        return true;
    }
    return false;
}
function getVerifToken(token) {
    if(token !== null && token !== undefined && token !== "null" && token !== ""){
        let utilisateur = jwt_decode(token);
        if(getVerifString(utilisateur.iss) && getVerifString(utilisateur.codeutilisateur) && getVerifString(utilisateur.nom) && getVerifString(utilisateur.email) 
            && getVerifString(utilisateur.expiration)){
            return true;
        }
    }
    return false;
}
function getDataUtilisateurByToken(token) {
    if(token !== null && token !== undefined && token !== "null"){
        try {
            let utilisateur = jwt_decode(token);
            let verifiToken = getVerifToken(token)
            if(verifiToken){
                return {
                    id: utilisateur.iss,
                    codeutilisateur: utilisateur.codeutilisateur,
                    nom: utilisateur.nom,
                    email: utilisateur.email,
                    expiration: utilisateur.expiration,
                };
            }
        } catch (error) {
            return null;
        }
    }
    return null;
}
function getDataUtilisateurToken() {
    let token  = getToken();
    return getDataUtilisateurByToken(token);
}
function authentificationUtilisateur(token) {
    localStorage.clear();
    localStorage.setItem('token',token);
}
function deconnection() {
    localStorage.clear();
}
function getToken() {
    let token = localStorage.getItem('token');
    if (token !== null && token !== undefined && token !== '') { return token; }
    else{ deconnection(); return null; }
}
function getAuthentication() {
    let token = getToken();
    if(token !== null && token !== undefined){
        let utilisateur = getDataUtilisateurByToken(token);
        if(utilisateur!==null && utilisateur !== undefined){
            let exp = utile.parseStringToInt(utilisateur.expiration);let now = (new Date()).getTime();
            if(exp>now){
                return { utilisateur : utilisateur,etat : true }
            }else{
                deconnection();
            }
        }
    }
    return { utilisateur : null,etat : false }
}
export const auth = {
    getVerifToken,
    getDataUtilisateurByToken,
    authentificationUtilisateur,
    deconnection,
    getToken,
    getAuthentication,
    getDataUtilisateurToken
};