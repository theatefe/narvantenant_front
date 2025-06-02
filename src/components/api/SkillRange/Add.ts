import axios from 'axios';

const AddSkillRange = async (token, body) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.post(
      `${process.env.REACT_APP_HOST}user/skillRange`,
      body,
      config,
    );

    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default AddSkillRange;
