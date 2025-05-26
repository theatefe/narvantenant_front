import axios from 'axios';

const GetAllClassEnrollment = async (token: string, classId: number) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.get(
      `${process.env.REACT_APP_HOST}user/classEnrollment/${classId}`,
      config,
    );
    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default GetAllClassEnrollment;
