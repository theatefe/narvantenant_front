import axios from 'axios';

const UpdatePasswordApi = async (
  token,
  oldPassword: string,
  newPassword: string,
) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.put(
      `${process.env.REACT_APP_HOST}admin/updatePassword`,
      {
        oldPassword,
        newPassword,
      },
      config,
    );
    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default UpdatePasswordApi;
