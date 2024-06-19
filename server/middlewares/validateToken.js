import jwt from "jsonwebtoken"
//cualquiera registrado
export const authRequired = (req,res,next) => {
    const {token} = req.cookies
    if (!token) {
        return res.status(401).json({messge: "No Autorizado"})
    }
    
    jwt.verify(token,"secret123",(err,user)=>{
        if (err){ return res.status(401).json({messge: "No Autorizado token no valido"})}
        console.log(user.role)
        next() 
    })    
    
} 
//solo admin
export const authAdminRequired = (req,res,next) => {
    const {token} = req.cookies
    if (!token) {
        return res.status(401).json({messge: "No Autorizado"})
    }
    
    jwt.verify(token,"secret123",(err,user)=>{
        if (err){ return res.status(401).json({messge: "No Autorizado token no valido"})}
        console.log(user.role)
        console.log(user.role === 'Administrativo')
        if(user.role === 'Administrativo'){
        next() 
        }else {
        return res.status(401).json({messge: "No Autorizado no posee el rol correspondiente"})}
    })    
    
} 
//solo medicos/personal estudios
export const authMedPersRequired = (req,res,next) => {
    const {token} = req.cookies
    if (!token) {
        return res.status(401).json({messge: "No Autorizado"})
    }
    
    jwt.verify(token,"secret123",(err,user)=>{
        if (err){ return res.status(401).json({messge: "No Autorizado token no valido"})}
        if(user.role === 'MedicoPersonal'){
            next()
        }else{
        return res.status(401).json({messge: "No Autorizado no posee el rol correspondiente"})
        }
    })    
    
} 