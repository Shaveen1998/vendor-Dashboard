import { createContext, useEffect, useReducer } from "react"; 
import VendorAuthReducer from "./VendorAuthReducer";

const INITIAL_STATE = {
    currentVendor: JSON.parse(localStorage.getItem("vendor")) || null,
}

export const VendorAuthContext = createContext(INITIAL_STATE);

export const VendorAuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(VendorAuthReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem("vendor",JSON.stringify(state.currentVendor))
    },[state.currentVendor])

    return (
        <VendorAuthContext.Provider value={{currentVendor: state.currentVendor, dispatch}}>
            {children}
        </VendorAuthContext.Provider>
    );
};