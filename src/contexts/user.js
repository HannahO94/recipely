import  { createContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import "./spinner.css"

export const UserContext = createContext()
export const UserContextProvider = (props) => {

    const [user, setUser] = useState(null)
    const [recipe, setRecipe] = useState(null)
    const [pending, setPending] = useState(true)

    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        setUser(user)
        setPending(false)
      })
      
    }, [])

    if (pending) {
      return   (
       <div className="spinner-wrapper">
        <div className="spinner">
          <div></div>
          <div></div>
        </div>
      </div>
      )
    }
  //Defines context that is provided in the userContextProvider
    return (
        <UserContext.Provider value={{ user: [user, setUser] , recipe: [recipe, setRecipe]}}>
            {props.children}
        </UserContext.Provider>
    )
}