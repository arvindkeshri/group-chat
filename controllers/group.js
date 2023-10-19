const Message = require('../models/message');
const User = require('../models/user');
const Group = require('../models/group');
const Usergroup = require('../models/usergroup');

const createGroup = async (req, res)=>{
    const groupname = req.body.groupname;
    const adminId = req.body.userId;
    try{
        const newGroup = await Group.create({groupname: groupname, adminId: adminId, userId: adminId})
    
        const groupId = newGroup.id;
        console.log("groupId", groupId);
        const somedata = await Usergroup.create({groupId: groupId, userId: adminId, isGroupAdmin: true })  
        console.log(">>>>>.",somedata)
        res.status(200).json({success: true, message: "Group created successfully",newGroup:{groupname: groupname, groupId: groupId}})  
    }catch(err){
        res.status(500).json({message: "Error creating group", error:err})

    }
}

const fetchGroup = async(req, res)=>{
    console.log("userId>>>>>>>>>", req.params.id)
    try{
        response = await Usergroup.findAll({
            where:{userId: req.params.id},
            //  include: [{model: Group, as: 'group', attributes: ['groupname']}]
        })
        console.log(response);
        
        const groups = await Promise.all(response.map(async(res)=>{
            const group = await Group.findByPk(res.groupId);
            return group;
        }));
        console.log(groups);
        res.status(200).json(groups);
    }catch(err){
        res.status(500).json(err)
    }
}

const fetchGroupUsers = async (req, res)=>{
    try{
        //const users = await User.findAll({where:{groupId: groupId}})
        // res.status(200).json(users)
    }catch(err){
        console.log(err)
    }
    
}






module.exports = {
    createGroup,
    fetchGroup,
    fetchGroupUsers,
}