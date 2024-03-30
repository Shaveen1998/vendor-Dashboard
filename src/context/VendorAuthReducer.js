const VendorAuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN": {
            return{
                currentVendor: action.payload,
            };
        }
        case "LOGOUT": {
            return{
                currentVendor: null,
            };
        }
        default:
            return state;
    }
};

export default VendorAuthReducer;