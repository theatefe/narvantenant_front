import axios from 'axios';

const GetClassEnrollment = async (token: string, id: number) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.get(
      `${process.env.REACT_APP_HOST}user/classEnrollment/find/${id}`,
      config,
    );

    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default GetClassEnrollment;
