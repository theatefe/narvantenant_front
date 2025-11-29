import axios from 'axios';

const GetAllSkillRecordByStudentId = async (token: string, studentId: number) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.get(
      `${process.env.REACT_APP_HOST}user/skillRecord/student/${studentId}`,
      config,
    );
    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default GetAllSkillRecordByStudentId;
