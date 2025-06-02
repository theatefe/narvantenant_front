import axios from 'axios';

const LogOut = async (token) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.get(
      `${process.env.REACT_APP_HOST}user/logOut`,
      config,
    );
    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default LogOut;
