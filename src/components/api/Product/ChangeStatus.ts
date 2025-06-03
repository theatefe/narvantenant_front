import axios from 'axios';

const ChangeStatusUnit = async (token: string, unitId: number) => {
  const body = {};
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.patch(
      `${process.env.REACT_APP_HOST}unituser/unit/${unitId}`,
      body,
      config,
    );

    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default ChangeStatusUnit;
