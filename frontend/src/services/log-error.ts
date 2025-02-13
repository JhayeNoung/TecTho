// error-handle.ts
export const logUserError = (error: any, setAlert: React.Dispatch<React.SetStateAction<string>>) => {
    switch (error.status) {
        case 404:
            if (error.response.data.includes("No user found with this email.")) {
                setAlert("No user found with this email.");
            } else {
                setAlert("The requested resource was not found. status code: 404");
            }
            break;
        case 401:
        case 400:
        case 403:
            setAlert(error.response.data);
            break;
        case 500:
            setAlert(error.message);
            break;
        default:
            window.alert("An unexpected error occurred");
    }
};

export const logActionError = (error: any) => {
    switch (error.status) {
        case 400:
            if (error.response.data.message === "jwt malformed") {
                window.alert("Please log in first.");
            }
            else if (error.response.data.message === "jwt expired") {
                window.alert("Please refresh.");
            }
            else {
                window.alert(error.response.data.message);
            }
            break;
        case 404:
            window.alert(error.response.data.message);
            break;
        case 401:
        case 403:
            window.alert(error.response.data.message);
            break;
        case 500:
            window.alert(error.message);
            break;
        default:
            window.alert("An unexpected error occurred");
    }
};


export const logError = (error: any, setAlert: React.Dispatch<React.SetStateAction<string>>) => {
    switch (error.status) {
        case 400:
            if (error.response.data.message === "jwt malformed") {
                setAlert("Please log in first.");
            }
            else if (error.response.data.message === "jwt expired") {
                setAlert("Please refresh.");
            }
            else {
                setAlert(error.response.data.message);
            }
            break;
        case 401:
        case 403:
        case 404:
            setAlert(error.response.data.message);
            break;
        case 500:
            setAlert(error.message);
            break;
        default:
            window.alert("An unexpected error occurred");
    }
};