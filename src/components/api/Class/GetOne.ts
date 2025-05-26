import axios from 'axios';

const GetClass = async (token: string, id: number) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.get(
      `${process.env.REACT_APP_HOST}user/class/${id}`,
      config,
    );

    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default GetClass;
