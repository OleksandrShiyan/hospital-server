let users = [
    {id: 1, login: 'Admin', password: 'Admin', phone: "101", roleId:1, fullname: "Oleksandr", specializationId: 1  },
    {id: 2, login: 'Predlomat', password: 'Predlomat', phone: "102", roleId:2, fullname: "Sanek", specializationId: 1  },
    {id: 3, login: 'Kent', password: 'Kent', phone: "102", roleId:2, fullname: "Kent", specializationId: 2  },
    {id: 4, login: 'Doctor', password: 'Doctor', phone: "102", roleId:2, fullname: "Mikola", specializationId: 3  },
    {id: 5, login: 'Assistant', password: 'Assistant', phone: "103", roleId:3, fullname: "Vasyan", specializationId: 3  },
    {id: 6, login: 'Fraer', password: 'Assistant', phone: "105", roleId:3, fullname: "Kebab", specializationId: 3  },
    {id: 7, login: 'Bugyt', password: 'Assistant', phone: "106", roleId:3, fullname: "Polina", specializationId: 3  },
    {id: 8, login: 'Receptionist', password: 'Receptionist', phone: "104",  roleId:4, fullname: "Gleb", specializationId: 4 },
    {id: 9, login: 'BigData', password: 'Receptionist', phone: "107",  roleId:4, fullname: "Ivan", specializationId: 4 },
    {id: 10, login: 'Prikolist', password: 'Receptionist', phone: "108",  roleId:2, fullname: "Kefir", specializationId: 4 },
]

const roles =[
    {id:1,name:"Admin"},
    {id:2,name:"Doctor"},
    {id:3,name:"Assistant"},
    {id:4,name:"Receptionist"}]

const specializations =[
    {id:1,name:"Cardiologists"},
    {id:2,name:"Endocrinologists"},
    {id:3,name:"Dermatologists"},
    {id:4,name:"Allergists"}]

let rooms = Array.apply(null, {length: 20}).map((_, index) => ({
    id: index,
    name: index + "b",
    timeStatus: "",
    statusId: -1,
    assignedDoctorId: Math.floor((Math.random() + 0.5) * 3)
}));
let colors = ["rgba(238, 88, 151, 0.19)", "rgba(134, 232, 238, 0.19)", "rgba(250, 112, 12, 0.19)", "rgba(228, 133, 243, 0.19)", "rgba(196, 230, 233, 0.19)", "rgba(120, 242, 117, 0.19)"];

let alerts = Array.apply(null, {length: 25}).map((_, index) => ({
    id: index + 1,
    name: `Doctor in ${index + 1}`,
    color: colors[Math.floor(Math.random() * 6)],
    textColor: "blue"
}));

//create profile
const entityAddId = (entity, arr) => {
    const id = arr[arr.length - 1].id + 1;
    return {...entity, id}
}


const resolvers = {
    Query: {

        //User
        getUser: (_, {id}) => {
            return users.find(user => user.id === +id)
        },
        getUserByLogin: (_, {login, password}) => {
          return users.find(user => user.login === login && user.password === password)
        },
        getDoctors: () => {
            let role = roles.find(role => role.name === "Doctor")
            return users.filter(user => +user.roleId === +role.id)
        },
        getAssistants: () => {
            let role = roles.find(role => role.name === "Assistant")
            return users.filter(user => +user.roleId === +role.id)
        },
        getReceptionists: () => {
            let role = roles.find(role => role.name === "Receptionist")
            return users.filter(user => +user.roleId === +role.id)
        },

        //Room
        getAllRooms: () => {
            return rooms
        },


        // Alert
        getAllAlerts: () => {
            return alerts;
        }

    },
    Mutation: {
//s
        // User
        createUser: (_, {user}) => {
            const newUser = entityAddId(user, users)
            users.push(newUser);
            return newUser
        },
        updateUser: (_, {id, user}) => {
            users = users.map(u => +u.id === +id? {...u,...user} : u)
            return user
        },
        deleteUser: (_, {id}) => {
            const index = users.findIndex(user => +user.id === +id)
            const deletedUser = users.find( user => +user.id === + id)
            users.splice(index, 1);
            return deletedUser;
        },

        // Room
        changeRoomStatus: (_, {roomId, statusId}) => {
            rooms = rooms.map(room => +room.id === +roomId? {...room, statusId: statusId} : room)
            let role = roles.find(role => role.name === "Doctor")
            return users.filter(user => +user.roleId === +role.id)
        },
        reserveRooms: (_, {userId, roomsId}) => {
            rooms = rooms.map(room => +room.assignedDoctorId === +userId ? ({...room, assignedDoctorId: 0 }) : room)
            roomsId.forEach(roomId => {
                rooms = rooms.map(room => +room.id === +roomId.id ? {...room, assignedDoctorId: userId} : room)
            });
            return rooms
        },
        updateRoom: (_, {roomId, roomName}) => {
            rooms = rooms.map(room => +room.id === +roomId ? {...room, name: roomName} : room)
            return rooms.find(room => +room.id === +roomId)
        },
        deleteRoom: (_, {roomId}) => {
            const index = rooms.findIndex(room => +room.id === +roomId)
            const deletedRoom = rooms.find( room => +room.id === + roomId)
            rooms.splice(index, 1);
            return rooms;
        },

        // Alert
        createAlert: (_, {alert}) => {
            const newAlert = entityAddId(alert, alerts)
            alerts.push(newAlert)
            return newAlert
        },
        updateAlert: (_, {id, alert}) => {
            console.log("Id: " + id + "Alert" + alert)
            alerts = alerts.map(a => +a.id === +id ? {...a, ...alert} : a)
            console.log('Alert', alert)
            return {...alert, id};
        }

    },
    User:{
        role:(user)=>{
            return roles.find(role => role.id === +user.roleId)
        },
        specialization: (user) => {
            return specializations.find(spec => spec.id === +user.specializationId)
        },
        rooms: (user) => {
            return rooms.filter(room => +room.assignedDoctorId === user.id)
        }
    },
    Room: {
        assignedDoctor: (room) => {
            const doctor = users.find(user => +user.id === +room.assignedDoctorId)
            return doctor?.fullname || ''
        },
        status: (room) => {
            const status = alerts.find(alert => +alert.id === +room.statusId)
            return status || ''
        }
    }
}

module.exports = resolvers;