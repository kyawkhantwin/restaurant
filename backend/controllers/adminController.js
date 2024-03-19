const Admin = require('../models/adminModel.js')
const jwt = require('jsonwebtoken')
const { A_SECRET ,U_SECRET} = require('../src/config.js')

const createToken = (userData, userType) => {
    const secretKey = userType === 'user' ? U_SECRET : A_SECRET;
    return jwt.sign({ _id: userData._id, userType }, secretKey, { expiresIn: '3d' });
};

const loginAdmin = async(request,response) =>{
    const {email,password} = request.body

    try{
        const admin = await Admin.login(email,password);

        const token  = createToken(admin._id,'admin')

        return response.status(201).json({
            message : "Successful Login",
            token
        })
    }catch(error){
        console.log(error.message)
      return response.status(400).json({ message: error.message });
    }
}

const registerAdmin = async (request,response) =>{
    const {name,email,password} = request.body;

    try{
      
        const admin = await Admin.register(name,email,password)

        const token = createToken(admin._id,admin)

        return response.status(201).json({message: "Admin Created Successfully", data : admin , token})

    }catch(error){
        return response.status(400).json({message: "Register Fail",error : error.message})

    }
}

module.exports = {registerAdmin,loginAdmin}