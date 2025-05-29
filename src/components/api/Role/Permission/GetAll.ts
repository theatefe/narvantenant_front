import axios from 'axios';

const GetAllPermission = async (token: string) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.get(
      `${process.env.REACT_APP_HOST}user/role/permission/allRoutes`,
      config,
    );
    return { data, status };
  } catch (error) {
    return { data: (error as any).request, status: (error as any).request.status };
  }
};

export default GetAllPermission;
