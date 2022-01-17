import React, { useState } from "react";
import styled from 'styled-components'

export function ProfileModal ({ user, showModal, handleClose }) {
  const [data, setData] = useState({
    ...user
})

  const handleInputChange = (event) => {
      setData({
          ...user,
          [event.target.name] : event.target.value
      })
  }

  function toggleFormElements(bDisabled) { 
    var inputs = document.getElementsByTagName("input"); 
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = !bDisabled;
    }
  }

  function cancelEditButton(){
    document.getElementById("myForm").reset();
    var inputs = document.getElementsByTagName("input"); 
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }
  }

  function sendData(){
    document.getElementById("myForm").submit()
  }

  return(
    <>
      {
        showModal &&
          <Overlay>
            <ModalContainer>
              <ModalHeader>
                  <h3>Perfil</h3>
              </ModalHeader>
              <CloseModal onClick={handleClose}>
                X
              </CloseModal>
              <InfoContainer>
                <form className='form' id="myForm" action="/#/">
                  <div className="row">
                    <label>
                      Nombre de usuario:  
                    </label>
                    <input disabled={true} type='text' defaultValue={user.username} onChange={handleInputChange} name='username'/>
                  </div>
                  <div className="row">
                    <label>
                      Nombre:  
                    </label>
                    <input disabled={true} type='text' defaultValue={user.firstname} onChange={handleInputChange} name='firstname'/>
                  </div>
                  <div className="row">
                    <label>
                      Apellido:  
                    </label>
                    <input disabled={true} type='text' defaultValue={user.lastname} onChange={handleInputChange} name='lastname'/>
                  </div>
                  <div className="row">
                    <label>
                      Telefono:  
                    </label>
                    <input disabled={true} type='tel' defaultValue={user.info.phone} onChange={handleInputChange} name='phone'/>
                  </div>
                  <div className="row">
                    <label>
                      Correo Electronico:  
                    </label>
                    <input disabled={true} type='email' defaultValue={user.email} onChange={handleInputChange} name='address'/>
                  </div>
                  <div className="row">
                    <label>
                      Contraseña:  
                    </label>
                    <input disabled={true} type='password' defaultValue={user.password} onChange={handleInputChange} name='password'/>
                  </div>
                  <div className="row">
                    <label>
                      Confirmar Contraseña:  
                    </label>
                    <input disabled={true} type='password' defaultValue={user.password_confirm} onChange={handleInputChange} name='password_confirm'/>
                  </div>
                  <ButtonsContainer>
                    <button type='submit' onClick={sendData}>Aceptar</button>
                  </ButtonsContainer>
              </form>
              <button className="editButton" onClick={toggleFormElements}>Editar</button>
              <button className="cancelEditButton" onClick={cancelEditButton}>Cancelar</button>
            </InfoContainer>
          </ModalContainer>
        </Overlay>
      }
    </>
  );
}



const Overlay = styled.div`
width: 100vw;
height: 100vh;
position: fixed;
top: 0;
left: 0;
display: flex;
align-items: center;
overflow-y: auto;
justify-content: center;
z-index: 100000 !important;
`

const ModalContainer = styled.div`
width: 500px;
min-height: 100px;
background: #fff;
position: relative;
border-radius: 5px;
box-shadow: rgba(100,100,111,0.2) 0px 7px 29px 0px;
padding: 20px;
overflow-y: auto;
`

const ModalHeader = styled.div`
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 10px;
padding-bottom: 10px;
border-bottom: 1px solid #E8E8E8;
`

const CloseModal = styled.button`
position: absolute;
top: 15px;
right: 15px;
width: 30px;
height: 30px;
border: none;
background: none;
cursor: pointed;
trasition: .3s ease all;
border-radius: 5px;
color: #1766DC;
&:hover{
  background: #f2f2f2;
}
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;  
`;

const InfoContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	label {
		padding: 12px 12px 12px 0;
    display: inline-block;
    float: left;
    width: 25%;
    margin-top: 6px;
	}
	input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
    float: left;
    width: 75%;
    margin-top: 6px;
	}

  .row:after {
  content: "";
  display: table;
  clear: both;
}
`;