import axios from 'axios';

const GetAllClass = async (token: string) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.get(
      `${process.env.REACT_APP_HOST}user/class`,
      config,
    );
    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default GetAllClass;
