function getAllMois() {
    return ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
}

function getAllMoisBreviation(indice) {
    const month = ["JANV", "FEVR", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOUT", "SEPT", "OCT", "NOV", "DEC"];
    return month[indice];
}

function getAllMoisBreviationV2() {
    return ["JANV", "FEVR", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOUT", "SEPT", "OCT", "NOV", "DEC"];
}

function getNamesMois(indice) {
    const data = getAllMois();
    return data[indice];
}

function getAllSemaine() {
    const semaine = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    return semaine;
}
function getAllSemaineWithIndice() {
    const semaine = []; semaine.push({label : 'dimanche',indice : 0});semaine.push({label : 'lundi',indice : 1});semaine.push({label : 'mardi',indice : 2});
    semaine.push({label : 'mercredi',indice : 3});semaine.push({label : 'jeudi',indice : 4});semaine.push({label : 'vendredi',indice : 5});semaine.push({label : 'samedi',indice : 6});
    return semaine;
}

function getWeekAbrev(jour) {
    const week = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
    return week[jour];
}

function getMonthAbrev(indice) {
    const months = ["jan.", "fév.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "dec."];
    return months[indice];
}

function getAllLitleSemaine() {
    return ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
}

function getNamesSemaine(indice) {
    const data = getAllSemaine();
    return data[indice];
}

function createTableauNumber(start, end) {
    const data = [];
    for (let i = start; i <= end; i++) {
        data.push(i);
    }
    return data;
}

function createTableauNumberSelect(start, end) {
    const data = [];
    for (let i = end; i >= start; i--) {
        data.push({ value: i, label: i });
    }
    return data;
}

function parseStringToFloat(valeur) {
    try {
        if ('' + valeur !== '') {
            return parseFloat('' + valeur);
        }
        return 0;
    } catch (error) {
        return 0;
    }
}

function parseStringToInt(valeur) {
    try {
        if ('' + valeur !== '') {
            return parseInt('' + valeur);
        }
        return 0;
    } catch (error) {
        return 0;
    }
}

function parseStringToIntV2(valeur) {
    try {
        if ('' + valeur !== '') {
            return parseInt('' + valeur);
        }
        return -1;
    } catch (error) {
        return -1;
    }
}

function completChiffre(chiffre) {
    let tmp = parseStringToInt('' + chiffre);
    if (tmp < 10) {
        return '0' + tmp;
    }
    return '' + tmp;
}

function getDateCompletAuJourdui() {
    const dates = new Date();
    return "" +getNamesSemaine(dates.getDay()) + ", " + dates.getDate() + " " + getNamesMois(dates.getMonth()) + " " + dates.getFullYear();
}
function getDateComplet(dateString) {
    if (dateString === null || dateString === undefined || dateString === "null") { return ""; }
    const dates = new Date(dateString);
    return "" +getNamesSemaine(dates.getDay()) + ", " + dates.getDate() + " " + getNamesMois(dates.getMonth()) + " " + dates.getFullYear();
}
function getDateFormatNormal(dateString) {
    if (dateString === null || dateString === undefined || dateString === "null") { return ""; }
    const dates = new Date(dateString);
    return "" +dates.getFullYear() + "-" +completChiffre(dates.getMonth()+1)+ "-"+ completChiffre(dates.getDate());
}

function getDateCompletAvecHeure(dateString) { ///aff
    if (dateString === null || dateString === undefined || dateString === "null") { return ""; }
    const dates = new Date(dateString);
    return "" +getNamesSemaine(dates.getDay()) + ", " + completChiffre(dates.getDate()) + " " + getNamesMois(dates.getMonth()) + " " + dates.getFullYear() + " à " + dates.getHours() + "h " + dates.getMinutes() + "mn " + dates.getSeconds() + "s";
}

function getDateNormal(dateString) {
    if (dateString === null || dateString === undefined || dateString === "null")
        return "";
    const dates = new Date(dateString);
    return completChiffre(dates.getDate()) + " " + getNamesMois(dates.getMonth()) + " " + dates.getFullYear();
}

function getDateCompletAbrev(dateString) {
    if (dateString === null || dateString === undefined || dateString === "null")
        return "";
    const dates = new Date(dateString);
    return "" + getNamesSemaine(dates.getDay()) + ", " + dates.getDate() + " " + getAllMoisBreviation(dates.getMonth()) + " " + dates.getFullYear();
}

function getDateCompletWithHoureAndMinute(dateString) {
    if (dateString === null || dateString === undefined || dateString === "null")
        return "";
    const dates = new Date(dateString);
    return "" + getNamesSemaine(dates.getDay()) + ", <br/> " + dates.getDate() + " " + getNamesMois(dates.getMonth()) + " " + dates.getFullYear() + " à " + completChiffre(dates.getHours()) + 'h' + completChiffre(dates.getMinutes());
}
function getDateCompletWithHoureAndMinuteV2(dateString) {
    if (dateString === null || dateString === undefined || dateString === "null")
        return "";
    const dates = new Date(dateString);
    return "" + getNamesSemaine(dates.getDay()) + ", " + dates.getDate() + " " + getNamesMois(dates.getMonth()) + " " + dates.getFullYear() + " à " + completChiffre(dates.getHours()) + 'h' + completChiffre(dates.getMinutes());
}
function getDateInput(dateString) {
    if (dateString === null || dateString === undefined || dateString === "null"){
        return "";
    }
    const dates = new Date(dateString)
    return  dates.getFullYear()+"-"+completChiffre(dates.getMonth())+"-"+completChiffre(dates.getDate());;
}

function getNewDateDotted(dateString) {
    if (dateString === null || dateString === undefined || dateString === "null"){
        return "";
    }
    const dates = new Date(dateString)
    return  completChiffre(dates.getDate())+"."+completChiffre(dates.getMonth())+"."+dates.getFullYear();
}

function getNbJoursMois(mois, annee) {
    var lgMois = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((annee % 4 === 0 && annee % 100 !== 0) || annee % 400 === 0) lgMois[1] += 1;
    return lgMois[mois - 1]; // 0 < mois <11
}

function getEndMonth(month, year) {
    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 4 === 0) months[1] += 1;
    return months[month]; // 0 < mois <11
}

function getConfirme(text) {
    if (window.confirm('' + text)) { return true; }
    return false;
}

function createSemaineEmploieDuTemps() {
    const semaine = getAllSemaine();
    const data = [];
    for (let i = 0; i < semaine.length; i++) {
        data.push({
            names: semaine[i],
            activation: false,
            jour: i,
            topStart: null,
            topStop: null,
            bottomStart: null,
            bottomStop: null,
        })
    }
    return data; // 0 < mois <11
};

function formatDate(date) {
    if (date === null || date === undefined || date === "null")
        return "";
    return autocompleteZero(date.getDate(), 2) + '/' + autocompleteZero(date.getMonth() + 1, 2) + '/' + date.getFullYear();
}

function formatDateText(date) {
    if (date === null || date === undefined || date === "null")
        return "";
    return autocompleteZero(date.getDate(), 2) + ' ' + getNamesMois(date.getMonth()) + ' ' + date.getFullYear();
}

function formatDateTextWithTime(date) {
    if (date === null || date === undefined || date === "null")
        return "";
    return autocompleteZero(date.getDate(), 2) + ' ' + getNamesMois(date.getMonth()) + ' ' + date.getFullYear() + ' à ' + date.getHours() + ':' + date.getMinutes();
}

function autocompleteZero(number, totalLength) {
    var result = '' + number;
    for (let i = 0; i < (totalLength - result.length); i++) {
        result = '0' + result;
    }
    return result;
}

function isEqualJourDate(dateA, dateB) {
    const date1 = new Date(dateA);
    const date2 = new Date(dateB);
    return (date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear())
}

function dateToHour(date) {
    const dateRes = new Date(date);
    return autocompleteZero(dateRes.getHours(), 2) + ":" + autocompleteZero(dateRes.getMinutes(), 2) + ":00";
}

function getVerificationChampsText(valeur) {
    if (valeur !== null && valeur !== undefined && valeur !== '') { return true; }
    return false;
}

function rectificationDeuxChiffreApresVirgule(valeur) {
    let tmp = ("" + valeur).split(".");
    let size = tmp.length;
    if (size > 1) {
        let newTmp = "" + tmp[1];
        let size2 = newTmp.length;
        if (size2 > 2) {
            return "" + tmp[0] + "." + newTmp.charAt(0) + "" + newTmp.charAt(1)
        } else {
            return valeur;
        }
    }
    return valeur;
}

function rectificationChiffre(valeur) {
    if(''+valeur!=='NaN'){
        let tmp = "" + rectificationDeuxChiffreApresVirgule(valeur);
        let size = tmp.length;
        if (size > 3) {
            let valFinal = "";
            let count = 0;
            for (let i = size - 1; i >= 0; i--) {
                let rep = "" + tmp.charAt(i);
                if (rep === ".") {
                    valFinal = rep + "" + valFinal;
                    count = 0;
                } else {
                    if (count === 3) { valFinal = rep + " " + valFinal;
                        count = 1; } else { valFinal = rep + "" + valFinal;
                        count++ }
                }
            }
            return valFinal;
        } else {
            return tmp;
        }
    }else{
        return "0";
    }
    
}

function countPage(count, max) {
    try {
        let counts = parseFloat(count) / parseFloat(max);
        let page = 0;
        if (counts > 0) {
            let tmp = (parseInt(counts)) + 0.09;
            if (counts > tmp) {
                page = (parseInt(counts)) + 1;
            } else {
                page = (parseInt(counts));
            }
        }
        return page;
    } catch (error) {
        return 0;
    }
}    
function getVerifiExtensionImage(filename) {
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
export const utile = {
    getAllMois,
    getNamesMois,
    getAllSemaine,
    getNamesSemaine,
    getDateCompletAuJourdui,
    getDateComplet,
    getNbJoursMois,
    getAllMoisBreviation,
    createTableauNumber,
    getAllLitleSemaine,
    parseStringToInt,
    createSemaineEmploieDuTemps,
    getConfirme,
    createTableauNumberSelect,
    parseStringToIntV2,
    getAllMoisBreviationV2,
    getDateCompletAbrev,
    getDateCompletWithHoureAndMinute,
    formatDate,
    formatDateText,
    formatDateTextWithTime,
    autocompleteZero,
    getWeekAbrev,
    getMonthAbrev,
    getEndMonth,
    isEqualJourDate,
    completChiffre,
    getDateNormal,
    dateToHour,
    getVerificationChampsText,
    rectificationDeuxChiffreApresVirgule,
    rectificationChiffre,
    countPage,
    parseStringToFloat,
    getDateCompletAvecHeure,
    getDateCompletWithHoureAndMinuteV2,
    getDateInput,
    getNewDateDotted,
    getAllSemaineWithIndice,
    getDateFormatNormal,
    getVerifiExtensionImage
};