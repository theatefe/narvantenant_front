import { useSelector } from 'react-redux';
import Layout from '../layout/user/public';
import Redirect from '../helpers/Redirect';

// redux setters
import { RootState } from '../redux/reducers';

const ProtectuserRoute = () => {
  const { auth } = useSelector((state: RootState) => state.userAuth);
  if (auth.isAuthenticated) {
    return <Layout />;
  } else {
    return <Redirect route="/login" />;
  }
};
export default ProtectuserRoute;
