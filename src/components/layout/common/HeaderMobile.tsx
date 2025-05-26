import logo from '../../../assets/image/logo.svg';

const HeaderMobile = () => {
  return (
    <div className="row sticky-top header pt-2 pb-2">
      <div className="col-3 text-right my-auto">
        <img src={logo} className="rounded-circle" width={52} alt="logo" />
      </div>
      <div className="col-6 text-right my-auto"></div>
      <div className="col-3 text-left">
      </div>
    </div>
  );
};
export default HeaderMobile;
