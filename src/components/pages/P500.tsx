import React from 'react';

function P500() {
    return (
        <div className=" w-screen container">
            <div className="errorTitle">خطای </div>
            <div className="glitch h-min" data-text="500">500</div>
            <div className="message h-min">مشکلی پیش آمده است! <br /> درحال رفع آن هستیم </div>
            <button className='errorBtn'>
                بازگشت به صفحه اصلی
            </button>
        </div>
    );
}

export default P500;