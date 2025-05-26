import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { setIsLoading } from '../redux/reducers/page';


function P404() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(setIsLoading(false));

    }, []);
    return (
        <div className=" w-screen container">
            <div className="errorTitle">خطای </div>
            <div className="glitch h-min" data-text="404">404</div>
            <div className="message h-min">صفحه مورد نظر شما یافت نشد! </div>
            <button className='errorBtn' onClick={() => navigate('/')}>
                بازگشت به صفحه اصلی
            </button>
        </div>
    );
}

export default P404;