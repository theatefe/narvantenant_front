import axios from 'axios';

const ChangeStatusAttendance = async (token: string, body) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.patch(
      `${process.env.REACT_APP_HOST}user/attendance`,
      body,
      config,
    );

    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default ChangeStatusAttendance;
