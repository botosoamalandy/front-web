function verificationSize(password){//verification si MDP contient 8 caractére
    if(password.length<8){
        return 0;
    }
    return 20;
}
function verificationChiffre(password){// si il y a un chiffre
    if(password.search(/[0123456789]/) === -1){
        return 0;
    }
    return 20;
}
function verificationMinuscule(password){
    if(password.search(/[a-z]/) === -1){
        return 0;
    }
    return 20;
}
function verificationMajsuscule(password){
    if(password.search(/[A-Z]/) === -1){
        return 0;
    }
    return 20;
}
function verificationCaractereSpeciale(password){
    if(password.search(/[[~!@#|"$%;^'\\[=&(:?`/<>.,)£ù*§\]]/) === -1){
        return 0;
    }
    return 20;
}
export function verificationMotDePasseEnPourcentage(valeur){
    let size = verificationSize(valeur);
    let chiffre = verificationChiffre(valeur);
    let minuscule = verificationMinuscule(valeur);
    let majuscule = verificationMajsuscule(valeur);
    let special = verificationCaractereSpeciale(valeur);
    return size + chiffre + minuscule + majuscule + special;
}
export default verificationMotDePasseEnPourcentage ;