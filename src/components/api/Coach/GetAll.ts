import axios from 'axios';

const GetAllCoach = async (token: string) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.get(
      `${process.env.REACT_APP_HOST}user/coach`,
      config,
    );
    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default GetAllCoach;
