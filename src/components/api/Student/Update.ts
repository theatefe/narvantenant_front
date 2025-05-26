import axios from 'axios';

const UpdateStudent = async (token, body) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.put(
      `${process.env.REACT_APP_HOST}user/student`,
      body,
      config,
    );

    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default UpdateStudent;
