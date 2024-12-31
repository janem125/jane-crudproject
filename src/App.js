import "./App.css"
import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';

//<text field></> call onChange, update state variable
const UserDetails = ({id}) =>{
    console.log("in UserDetails component: " + id);
    //const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [org, setOrg] = useState(null);
    const [address, setAddress] = useState(null);
    const [city, setCity] = useState(null);
    const [locstate, setLocState] = useState(null);
    const [country, setCountry] = useState(null);
    const [postal, setPostal] = useState(null);

    let userDetails = [
        {username: {username}},
        {email: {email}},
        {organization: {org}},
        {address: {address}},
        {city: {city}},
        {state: {locstate}},
        {country: {country}},
        {postalcode: {postal}},
    ];

    useEffect(() => {
        const fetchUserDetails = async() => {
            setIsLoading(true);
            setError(null);

            try{
                const response = await fetch("http://127.0.0.1:5000/userDetails/" + String(id));
                //something similar to await fetch to do post
                //console.log(response);
                if (!response.ok){
                    throw new Error("failed to fetch details");
                }
                const resp = await response.json();
                const data = JSON.parse(JSON.stringify(resp));
                //console.log(data);
                setUsername(data[0].username);
                setEmail(data[0].email);
                setOrg(data[0].organization);
                setAddress(data[0].address);
                setCity(data[0].city);
                setLocState(data[0].state);
                setCountry(data[0].country);
                setPostal(data[0].postalcode);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchUserDetails();
        }
    }, [id]);

    const handleSubmit = async(event) => {
        event.preventDefault();
        const settings = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id,
                username,
                email,
                org,
                address,
                city,
                locstate,
                country,
                postal,
            }),
        };
        try{
            const fetchResponse = await fetch('http://127.0.0.1:5000/saveUserDetails/', settings);
            const data = await fetchResponse.json();
            return data;
        } catch (e){
            return e;
        }
    }

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!id) return null;

    if (email){
        if (id){
            //console.log(id);
            //console.log(userDetails);
            console.log("email: " + email);
            //console.log(userDetails[0].password);
            //state variables: email, organization, etc, initialize, fill in, will be changed as well
            return(
            <div>
                <form method="post" action="/post" onSubmit={handleSubmit}>
                    <div class="inline_grid"><p></p></div>
                    <div class="inline_grid"><TextField id="email" label="Email:" defaultValue={email} onChange={(e)=>setEmail(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="org" label="Organization:" defaultValue={org} onChange={(e)=>setOrg(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="address" label="Address:" defaultValue={address} onChange={(e)=>setAddress(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="city" label="City:" defaultValue={city} onChange={(e)=>setCity(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="locstate" label="State:" defaultValue={locstate} onChange={(e)=>setLocState(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="country" label="Country:" defaultValue={country} onChange={(e)=>setCountry(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="postal" label="Postalcode:" defaultValue={postal} onChange={(e)=>setPostal(e.target.value)}/></div>
                    <div class="inline_grid"><input type="submit" className="btn" value="Update"/></div>
                </form>
                </div>
            );
        }
        else {
            return <p></p>;
        }
    }
    else {
        return <p>Click a user to display their details.</p>;
    }
}


const UserData = ({id}) => {
    //console.log("email: " + user.email);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [org, setOrg] = useState(null);
    const [address, setAddress] = useState(null);
    const [city, setCity] = useState(null);
    const [locstate, setLocState] = useState(null);
    const [country, setCountry] = useState(null);
    const [postal, setPostal] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async() => {
            setIsLoading(true);
            setError(null);

            try{
                const response = await fetch("http://127.0.0.1:5000/userDetails/" + String(id));
                //something similar to await fetch to do post
                //console.log(response);
                if (!response.ok){
                    throw new Error("failed to fetch details");
                }
                const resp = await response.json();
                const data = JSON.parse(JSON.stringify(resp));
                //console.log(data);
                setUsername(data[0].username);
                setEmail(data[0].email);
                setOrg(data[0].organization);
                setAddress(data[0].address);
                setCity(data[0].city);
                setLocState(data[0].state);
                setCountry(data[0].country);
                setPostal(data[0].postalcode);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchUserDetails();
        }
    }, [id]);


    return (
    <div>

        <div class="inline_grid">{username}</div>
        <div class="inline_grid">{email}</div>
        <div class="inline_grid">{org}</div>
        <div class="inline_grid">{address}</div>
        <div class="inline_grid">{city}</div>
        <div class="inline_grid">{locstate}</div>
        <div class="inline_grid">{country}</div>
        <div class="inline_grid">{postal}</div>

    </div>
    );
}


const UserList = ({users}) => {
    const [selectedUserId, setSelectedUserId] = useState(false);
    const [rowData, setRowData] = useState(users);
    const [editData, setEditData] = useState({});

    const handleUserClick = (id) => {
        if (selectedUserId && selectedUserId === id){
            setSelectedUserId(null);
        }
        else{
            setSelectedUserId(id);
        }
        console.log(selectedUserId);
        console.log(id);
    };

    const getRows = () => {
        return rowData.map((user) => {

            return(
            <div>
                <div class="row_grid">{selectedUserId===user.id && <UserDetails id={selectedUserId}/>}</div>
                <div class="row_grid">{!(selectedUserId === user.id) && <UserData id={user.id}/>}</div>
                <div class="inline_grid" onClick={() => {handleUserClick(user.id);}}>Edit {user.username} data</div>
            </div>
            );

        });
    }
//<div class="inline_grid" onClick={() => {handleUserClick(user.id);}}><button >Edit {user.username} data</button></div>
    //.id or .username?
    return(
        <div>

            <div class="inline_grid">Username:</div>
            <div class="inline_grid">Email:</div>
            <div class="inline_grid">Organization:</div>
            <div class="inline_grid">Address:</div>
            <div class="inline_grid">City:</div>
            <div class="inline_grid">State:</div>
            <div class="inline_grid">Country:</div>
            <div class="inline_grid">Postal Code:</div>
            <div class="inline_grid">Edit:</div>
        <div>
            {getRows(users)}
        </div>

        </div>
    );

};



//how to tell it that once adduser has been done, have to useeffect again....
//should adduser be here?

//needs to be able to change display if the database is updated
// ^look smth up with this

const App = () => {
    const [users, setUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAdded, setUserAdded] = useState(false);
    const [addUsr, setAddUsr] = useState(false);
    console.log("adduser is " + addUsr);

    useEffect(() => {
        const fetchUsers = async() => {
            try{
                const response = await fetch("http://127.0.0.1:5000/userlist");

                if (!response.ok) {
                    throw new Error('failed to fetch users');
                }
                const data = await response.json();
                console.log(data);
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (userAdded){
            setUserAdded(!userAdded);
            fetchUsers();
        }
        fetchUsers();
    }, []);


    const AddNewUser = () => {
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);

        const [user, setUser] = useState(null);
        const [pass, setPass] = useState(null);
        const [email, setEmail] = useState(null);
        const [org, setOrg] = useState(null);
        const [address, setAddress] = useState(null);
        const [city, setCity] = useState(null);
        const [locstate, setLocState] = useState(null);
        const [country, setCountry] = useState(null);
        const [postal, setPostal] = useState(null);

        let userDetails = [
            {username: {user}},
            {password: {pass}},
            {email: {email}},
            {organization: {org}},
            {address: {address}},
            {city: {city}},
            {state: {locstate}},
            {country: {country}},
            {postalcode: {postal}},
        ];

        //!!!

        const handleSubmit = async(event) => {
            console.log("submit pressed");
            setAddUsr(!addUsr);
            console.log("adduser is " + addUsr);
            event.preventDefault();
            const settings = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user,
                    pass,
                    email,
                    org,
                    address,
                    city,
                    locstate,
                    country,
                    postal,
                }),
            };
            try{
                const fetchResponse = await fetch('http://127.0.0.1:5000/addNewUser/', settings);
                const data = await fetchResponse.json();
                return data;
            } catch (e){
                return e;
            }
        }

        if (isLoading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;

        return(
            <div>
                <form method="post" action="/post" onSubmit={handleSubmit}>
                    <div class="inline_grid"><TextField id="user" label="Username:" onChange={(e)=>setUser(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="email" label="Email:" onChange={(e)=>setEmail(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="org" label="Organization:" onChange={(e)=>setOrg(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="address" label="Address:" onChange={(e)=>setAddress(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="city" label="City:" onChange={(e)=>setCity(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="locstate" label="State:" onChange={(e)=>setLocState(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="country" label="Country:" onChange={(e)=>setCountry(e.target.value)}/></div>
                    <div class="inline_grid"><TextField id="postal" label="Postalcode:" onChange={(e)=>setPostal(e.target.value)}/></div>
                    <div class="inline_grid"><input type="submit" className="btn" value="Update"/></div>
                </form>
                </div>
            );
    }


    const AddUser = () => {
        const handleUserClick = () => {
            if (addUsr === true){
                setUserAdded(true);
                console.log("adduser is " + addUsr);
            }
            setAddUsr(!addUsr);
            console.log("adduser is " + addUsr);
            //console.log("add user button pressed");
        }

        return(
        <div>
            <button onClick={handleUserClick} type="button">Add User</button>
            {addUsr && <AddNewUser />}
        </div>
        );
    }


    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
        <AddUser />
        <UserList users={users}/>
        </div>
    );
};

export default App;