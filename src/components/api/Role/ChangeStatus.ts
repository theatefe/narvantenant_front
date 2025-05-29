import axios from 'axios';

const ChangeStatusRole = async (token: string, roleId: number) => {
  const body = {};
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.patch(
      `${process.env.REACT_APP_HOST}user/role/${roleId}`,
      body,
      config,
    );

    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default ChangeStatusRole;
