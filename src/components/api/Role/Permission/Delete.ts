import axios from 'axios';

const DeletePermission = async (token: string, body) => {
  const config = {
    headers: {
      jtoken: token,
    },
    data: body,
  };
  try {
    const { data, status } = await axios.delete(
      `${process.env.REACT_APP_HOST}user/role/permission`,
      config,
    );

    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default DeletePermission;
