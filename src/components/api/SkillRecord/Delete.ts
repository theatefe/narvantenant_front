import axios from 'axios';

const DeleteSkillRecord = async (token: string, body) => {  const config = {
  headers: {
    jtoken: token,
  },
};
  try {
    const { data, status } = await axios.delete(
      `${process.env.REACT_APP_HOST}user/skillRecord`,
      {
        ...config,
        data: body,
      },
    );

    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default DeleteSkillRecord;
